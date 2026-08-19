"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:5000/api/chat/ws";

export interface UseChatWebSocketOptions {
  onTokenChunk?: (chunk: string) => void;
  onTurnComplete?: (fullResponse: string) => void;
  onError?: (errorMsg: string) => void;
}

export function useChatWebSocket(options?: UseChatWebSocketOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState("");

  const wsRef = useRef<WebSocket | null>(null);
  const currentAccumulatedText = useRef("");
  const optionsRef = useRef(options);
  const pendingMessageRef = useRef<{ userMessage: string; kbName?: string; sessionId?: string } | null>(null);

  // Keep options ref updated without triggering reconnects
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  // Connect WebSocket
  const connect = useCallback(() => {
    if (
      wsRef.current &&
      (wsRef.current.readyState === WebSocket.OPEN ||
        wsRef.current.readyState === WebSocket.CONNECTING)
    ) {
      return;
    }

    try {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);

        // Flush any message queued before connection opened
        if (pendingMessageRef.current) {
          const { userMessage, kbName, sessionId } = pendingMessageRef.current;
          pendingMessageRef.current = null;
          const payload = {
            type: "start_turn",
            session_id: sessionId || `course_${Date.now()}`,
            user_message: userMessage,
            ...(kbName ? { kb_name: kbName } : {}),
          };
          ws.send(JSON.stringify(payload));
        }
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          // Thinking / stage indicator
          if (data.type === "stage_start" || data.type === "progress") {
            setIsStreaming(true);
          }

          // Real-time streaming content chunk
          if (data.type === "content" && typeof data.content === "string") {
            setIsStreaming(true);
            const chunk = data.content;
            currentAccumulatedText.current += chunk;
            setStreamingText((prev) => prev + chunk);
            optionsRef.current?.onTokenChunk?.(chunk);
          }

          // Turn complete — pass full response back
          if (data.type === "result") {
            const finalResult = data.metadata?.response || currentAccumulatedText.current;
            optionsRef.current?.onTurnComplete?.(finalResult);
          }

          if (data.type === "result" || data.type === "done") {
            setIsStreaming(false);
            setStreamingText("");
            currentAccumulatedText.current = "";
          }

          // Error frame
          if (data.type === "error") {
            const errMsg = data.message || "An error occurred during AI response generation.";
            optionsRef.current?.onError?.(errMsg);
            setIsStreaming(false);
            setStreamingText("");
            currentAccumulatedText.current = "";
          }
        } catch (err) {
          console.error("Error parsing WS message:", err);
        }
      };

      ws.onerror = () => {
        setIsConnected(false);
      };

      ws.onclose = () => {
        setIsConnected(false);
        wsRef.current = null;
      };
    } catch (e) {
      console.error("Failed to connect to WebSocket:", e);
    }
  }, []);

  // Explicit Disconnect / Close method
  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
      setIsConnected(false);
    }
  }, []);

  useEffect(() => {
    connect();
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  // Send turn message — queue if socket not yet open
  const sendMessage = useCallback(
    (userMessage: string, kbName?: string, sessionId?: string) => {
      setIsStreaming(true);
      setStreamingText("");
      currentAccumulatedText.current = "";

      const ws = wsRef.current;
      const targetSessionId = sessionId || `course_${Date.now()}`;

      if (ws && ws.readyState === WebSocket.OPEN) {
        const payload = {
          type: "start_turn",
          session_id: targetSessionId,
          user_message: userMessage,
          ...(kbName ? { kb_name: kbName } : {}),
        };
        ws.send(JSON.stringify(payload));
      } else {
        pendingMessageRef.current = { userMessage, kbName, sessionId: targetSessionId };
        connect();
      }
    },
    [connect]
  );

  return {
    isConnected,
    isStreaming,
    streamingText,
    sendMessage,
    connect,
    disconnect,
  };
}
