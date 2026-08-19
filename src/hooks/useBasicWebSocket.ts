"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:5000/api/chat/ws";

export type WsStatus = "Disconnected" | "Connecting" | "Connected";

export interface ChatAttachment {
  type: "image" | "file";
  filename: string;
  mime_type: string;
  base64: string;
}

export interface LlmSelection {
  provider: string;
  model: string;
  base_url: string;
  api_key: string;
}

export interface WebSocketCallbacks {
  sessionId?: string;
  knowledgeBases?: string[];
  llmSelection?: LlmSelection;
  onSession?: (sessionId: string) => void;
  onChunk?: (chunk: string) => void;
  onComplete?: (fullResponse: string) => void;
  onDone?: () => void;
  onError?: (message: string) => void;
}

export function useBasicWebSocket(options?: WebSocketCallbacks) {
  const [status, setStatus] = useState<WsStatus>("Disconnected");
  const [isStreaming, setIsStreaming] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const optionsRef = useRef(options);
  const fallbackSessionIdRef = useRef<string | null>(null);

  // Keep options ref up to date without reconnecting
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  // Reliable session_id resolver
  const getSessionId = useCallback(() => {
    const passedSid = optionsRef.current?.sessionId;
    if (typeof passedSid === "string" && passedSid.trim().length > 0) {
      return passedSid.trim();
    }
    if (!fallbackSessionIdRef.current) {
      fallbackSessionIdRef.current = `unified_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    }
    return fallbackSessionIdRef.current;
  }, []);

  const connect = useCallback(() => {
    if (
      wsRef.current &&
      (wsRef.current.readyState === WebSocket.OPEN ||
        wsRef.current.readyState === WebSocket.CONNECTING)
    ) {
      return;
    }

    setStatus("Connecting");
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => setStatus("Connected");

    ws.onmessage = (event) => {
      try {
        const frame = JSON.parse(event.data as string);

        switch (frame.type) {
          case "session": {
            const serverSid = frame.session_id || frame.metadata?.session_id;
            if (typeof serverSid === "string" && serverSid.trim()) {
              optionsRef.current?.onSession?.(serverSid.trim());
            }
            break;
          }

          case "stage_start":
          case "progress":
          case "thinking":
          case "tool_call":
            setIsStreaming(true);
            break;

          case "content":
            if (typeof frame.content === "string" && frame.content) {
              setIsStreaming(true);
              optionsRef.current?.onChunk?.(frame.content);
            }
            break;

          case "result":
            if (frame.metadata?.response) {
              optionsRef.current?.onComplete?.(frame.metadata.response);
            }
            break;

          case "done":
            setIsStreaming(false);
            optionsRef.current?.onDone?.();
            break;

          case "error":
            optionsRef.current?.onError?.(
              frame.content || "An error occurred."
            );
            setIsStreaming(false);
            break;
        }
      } catch {
        // Ignore malformed frames
      }
    };

    ws.onerror = () => setStatus("Disconnected");

    ws.onclose = () => {
      setStatus("Disconnected");
      setIsStreaming(false);
      wsRef.current = null;
    };
  }, []);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setStatus("Disconnected");
    setIsStreaming(false);
  }, []);

  // Send user message over the open WebSocket (supports text, attachments, and llm_selection)
  const sendMessage = useCallback(
    (
      content: string,
      attachments?: ChatAttachment[],
      llmSelection?: LlmSelection
    ) => {
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
      const activeSessionId = getSessionId();

      const payload: Record<string, any> = {
        type: "message",
        session_id: activeSessionId,
        capability: "chat",
        content,
      };

      if (Array.isArray(attachments) && attachments.length > 0) {
        payload.attachments = attachments;
      }

      const activeKbs = optionsRef.current?.knowledgeBases;
      if (Array.isArray(activeKbs) && activeKbs.length > 0) {
        payload.knowledge_bases = activeKbs;
      }

      const activeLlm = llmSelection || optionsRef.current?.llmSelection;
      if (activeLlm) {
        payload.llm_selection = activeLlm;
      }

      wsRef.current.send(JSON.stringify(payload));
    },
    [getSessionId]
  );

  // Cleanup on page unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, []);

  return { status, isStreaming, connect, disconnect, sendMessage };
}
