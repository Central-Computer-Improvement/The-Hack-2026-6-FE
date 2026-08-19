"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Paperclip,
  Send,
  Loader2,
  Wifi,
  WifiOff,
  Plus,
  BookOpen,
  Database,
  FileText,
  X,
  Image as ImageIcon,
  Cpu,
} from "lucide-react";
import { Heading, Text } from "@/components/atoms/Typography";
import { cn } from "@/lib/utils";
import { useBasicWebSocket, ChatAttachment, LlmSelection } from "@/hooks/useBasicWebSocket";
import { useAuthStore } from "@/store/useAuthStore";
import { MarkdownRenderer } from "@/components/molecules/MarkdownRenderer";
import { knowledgeApi, memoryApi, KnowledgeBaseItem } from "@/lib/api";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  attachments?: ChatAttachment[];
}

interface AvailableLlmOption {
  key: string;
  provider: string;
  model: string;
  base_url: string;
  api_key: string;
  displayName: string;
}

const DEFAULT_LLM_OPTIONS: AvailableLlmOption[] = [
  {
    key: "ollama_qwen",
    provider: "ollama",
    model: "qwen2.5-coder:7b",
    base_url: "http://100.122.136.109:11434/v1",
    api_key: "",
    displayName: "qwen2.5-coder:7b",
  },
  {
    key: "openrouter_free",
    provider: "openrouter",
    model: "openrouter/free",
    base_url: "https://openrouter.ai/api/v1",
    api_key: "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",
    displayName: "openrouter/free",
  },
];

const INITIAL_MESSAGES: Message[] = [
  {
    id: "init_1",
    sender: "ai",
    text: "Halo! Saya Professor Paw, Socratic AI Study Buddy kamu. Ada materi, gambar diagram, atau dokumen PDF yang ingin kamu diskusikan hari ini?",
  },
];

function getOrCreateSessionId(urlParam: string | null): string {
  // 1. If valid in URL, use it
  if (urlParam && urlParam.startsWith("unified_")) {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("active_study_buddy_session_id", urlParam);
    }
    return urlParam;
  }
  // 2. If in sessionStorage, use it
  if (typeof window !== "undefined") {
    const stored = sessionStorage.getItem("active_study_buddy_session_id");
    if (stored && stored.startsWith("unified_")) {
      return stored;
    }
  }
  // 3. Otherwise generate fresh
  const freshId = `unified_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  if (typeof window !== "undefined") {
    sessionStorage.setItem("active_study_buddy_session_id", freshId);
  }
  return freshId;
}

function StudyBuddyContent() {
  const { user } = useAuthStore();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const promptParam = searchParams.get("prompt");
  const kbParam = searchParams.get("kb");

  const [inputValue, setInputValue] = useState(promptParam ? promptParam.trim() : "");
  const [mounted, setMounted] = useState(false);
  const [availableKbs, setAvailableKbs] = useState<KnowledgeBaseItem[]>([]);
  const [selectedKb, setSelectedKb] = useState<string>(kbParam || "");

  // LLM Model Selection State (from GET /api/ai/catalog)
  const [availableModels, setAvailableModels] = useState<AvailableLlmOption[]>(DEFAULT_LLM_OPTIONS);
  const [selectedModelKey, setSelectedModelKey] = useState<string>("");

  // Attachments State
  const [pendingAttachments, setPendingAttachments] = useState<ChatAttachment[]>([]);
  const [isConvertingFile, setIsConvertingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch available Knowledge Bases and AI Catalog Models on mount
  useEffect(() => {
    // 1. Load Knowledge Bases
    knowledgeApi
      .getKnowledgeBases()
      .then((kbs) => {
        if (Array.isArray(kbs)) {
          setAvailableKbs(kbs);
        }
      })
      .catch((err) => {
        console.warn("Could not fetch knowledge bases in Study Buddy:", err);
      });

    // 2. Load AI Models from GET /api/ai/catalog
    memoryApi
      .getCatalog()
      .then((res: any) => {
        const catalog = res?.data?.catalog || res?.catalog || res?.data || res;
        const llmService = catalog?.services?.llm;
        const profiles = llmService?.profiles;

        if (Array.isArray(profiles) && profiles.length > 0) {
          const parsed: AvailableLlmOption[] = [];
          let activeKey = "";

          const activeProfileId = llmService?.active_profile_id;
          const activeModelId = llmService?.active_model_id;

          profiles.forEach((profile: any) => {
            const provider = profile.binding || profile.provider || "ollama";
            const baseUrl = profile.base_url || "";
            const apiKey = profile.api_key || "";
            const profileName = profile.name || provider;

            if (Array.isArray(profile.models) && profile.models.length > 0) {
              profile.models.forEach((m: any) => {
                const modelName = m.model || m.name || m.id;
                const modelId = m.id || modelName;
                const key = `${profile.id || provider}__${modelId}`;

                const isProfileMatch = !activeProfileId || profile.id === activeProfileId;
                const isModelMatch = !activeModelId || m.id === activeModelId || modelName === activeModelId;
                if (isProfileMatch && isModelMatch && !activeKey) {
                  activeKey = key;
                }

                parsed.push({
                  key,
                  provider,
                  model: modelName,
                  base_url: baseUrl,
                  api_key: apiKey,
                  displayName: `${modelName} (${profileName})`,
                });
              });
            } else {
              const key = `${profile.id || provider}__default`;
              if (profile.id === activeProfileId && !activeKey) {
                activeKey = key;
              }
              parsed.push({
                key,
                provider,
                model: "default",
                base_url: baseUrl,
                api_key: apiKey,
                displayName: `${profileName} (${provider})`,
              });
            }
          });

          if (parsed.length > 0) {
            setAvailableModels(parsed);
            const defaultKey = activeKey || parsed[0].key;
            setSelectedModelKey((prev) => {
              return parsed.some((p) => p.key === prev) ? prev : defaultKey;
            });
          }
        }
      })
      .catch((err) => {
        console.warn("Could not load AI catalog in Study Buddy:", err);
      });
  }, []);

  // Compute active LLM selection object
  const activeLlmOption =
    availableModels.find((m) => m.key === selectedModelKey) ||
    availableModels[0] ||
    DEFAULT_LLM_OPTIONS[0];

  const currentLlmSelection: LlmSelection = {
    provider: activeLlmOption.provider,
    model: activeLlmOption.model,
    base_url: activeLlmOption.base_url,
    api_key: activeLlmOption.api_key,
  };

  // Update selectedKb if URL query param arrives
  useEffect(() => {
    if (kbParam) {
      setSelectedKb(kbParam);
    }
  }, [kbParam]);

  // Auto-fill input if prompt parameter arrives via navigation
  useEffect(() => {
    if (promptParam && promptParam.trim()) {
      setInputValue(promptParam.trim());
    }
  }, [promptParam]);

  // Synchronously resolve session ID
  const urlSessionParam = searchParams.get("sessionId");
  const [activeSessionId, setActiveSessionId] = useState<string>(() =>
    getOrCreateSessionId(urlSessionParam)
  );

  // Synchronize URL query parameter with active session ID
  useEffect(() => {
    setMounted(true);
    const resolvedId = getOrCreateSessionId(urlSessionParam);
    if (resolvedId !== activeSessionId) {
      setActiveSessionId(resolvedId);
    }
    if (urlSessionParam !== resolvedId) {
      const kbQuery = selectedKb ? `&kb=${encodeURIComponent(selectedKb)}` : "";
      router.replace(`/learning/study-budy?sessionId=${resolvedId}${kbQuery}`);
    }
  }, [urlSessionParam, activeSessionId, selectedKb, router]);

  // Tracks which AI bubble is currently being streamed into
  const activeAiMsgId = useRef<string | null>(null);

  // WebSocket hook with active sessionId, selected KB, LLM selection + server adoption callback
  const { status, isStreaming, connect, disconnect, sendMessage } =
    useBasicWebSocket({
      sessionId: activeSessionId,
      knowledgeBases: selectedKb ? [selectedKb] : [],
      llmSelection: currentLlmSelection,
      onSession: (serverSid) => {
        if (serverSid && serverSid !== activeSessionId) {
          setActiveSessionId(serverSid);
          if (typeof window !== "undefined") {
            sessionStorage.setItem("active_study_buddy_session_id", serverSid);
          }
          const kbQuery = selectedKb ? `&kb=${encodeURIComponent(selectedKb)}` : "";
          router.replace(`/learning/study-budy?sessionId=${serverSid}${kbQuery}`);
        }
      },

      onChunk: (chunk) => {
        if (!activeAiMsgId.current) return;
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === activeAiMsgId.current
              ? { ...msg, text: msg.text + chunk }
              : msg
          )
        );
      },

      onComplete: (fullResponse) => {
        if (!activeAiMsgId.current) return;
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === activeAiMsgId.current
              ? { ...msg, text: fullResponse }
              : msg
          )
        );
        activeAiMsgId.current = null;
      },

      onDone: () => {
        activeAiMsgId.current = null;
      },

      onError: (errorMsg) => {
        if (!activeAiMsgId.current) return;
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === activeAiMsgId.current
              ? { ...msg, text: `⚠️ Error: ${errorMsg}` }
              : msg
          )
        );
        activeAiMsgId.current = null;
      },
    });

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle file selection and base64 conversion
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsConvertingFile(true);
    const converted: ChatAttachment[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const isImage = file.type.startsWith("image/");

      try {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const res = reader.result as string;
            const pureBase64 = res.includes(",") ? res.split(",")[1] : res;
            resolve(pureBase64);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        converted.push({
          type: isImage ? "image" : "file",
          filename: file.name,
          mime_type: file.type || (isImage ? "image/png" : "application/pdf"),
          base64,
        });
      } catch (err) {
        console.warn("Could not read file:", file.name, err);
      }
    }

    setPendingAttachments((prev) => [...prev, ...converted]);
    setIsConvertingFile(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemovePendingAttachment = (index: number) => {
    setPendingAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSendMessage = () => {
    if (
      (!inputValue.trim() && pendingAttachments.length === 0) ||
      isStreaming ||
      status !== "Connected"
    )
      return;

    const userText = inputValue.trim();
    const currentAttachments = [...pendingAttachments];
    const userMsgId = `user_${Date.now()}`;
    const aiMsgId = `ai_${Date.now() + 1}`;

    activeAiMsgId.current = aiMsgId;

    setMessages((prev) => [
      ...prev,
      {
        id: userMsgId,
        sender: "user",
        text: userText,
        attachments: currentAttachments.length > 0 ? currentAttachments : undefined,
      },
      { id: aiMsgId, sender: "ai", text: "" },
    ]);

    setInputValue("");
    setPendingAttachments([]);
    sendMessage(
      userText,
      currentAttachments.length > 0 ? currentAttachments : undefined,
      currentLlmSelection
    );
  };

  const handleNewChat = () => {
    const newId = `unified_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    if (typeof window !== "undefined") {
      sessionStorage.setItem("active_study_buddy_session_id", newId);
    }
    setActiveSessionId(newId);
    setMessages(INITIAL_MESSAGES);
    setPendingAttachments([]);
    const kbQuery = selectedKb ? `&kb=${encodeURIComponent(selectedKb)}` : "";
    router.replace(`/learning/study-budy?sessionId=${newId}${kbQuery}`);
  };

  const isConnected = mounted && status === "Connected";
  const isInputDisabled = !mounted || isStreaming || status !== "Connected";

  return (
    <div className="w-full h-[calc(100vh-8.5rem)] bg-white rounded-[24px] shadow-sm border border-slate-100 flex flex-col overflow-hidden font-sans">
      {/* Hidden File Input for Images & PDFs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf,application/pdf"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 px-6 border-b border-slate-100 bg-white z-10 shrink-0 gap-3">
        <div className="flex items-center gap-4">
          <img
            src="/assets/images/prof-paw.webp"
            className="w-12 h-12 rounded-full border border-slate-100 bg-indigo-50 object-cover"
            alt="Professor Paw"
          />
          <div>
            <Heading level={3} variant="h5" className="text-slate-800 text-lg font-extrabold">
              Professor Paw
            </Heading>
            <Text variant="muted" className="text-xs">
              Socratic AI STEM Tutor
            </Text>
          </div>
        </div>

        {/* Header Actions: Knowledge Base Selector + New Chat + Status Badge + Connect/Disconnect */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Knowledge Base Selector Dropdown */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <BookOpen className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <select
              value={selectedKb}
              onChange={(e) => setSelectedKb(e.target.value)}
              className="bg-transparent font-medium text-slate-700 outline-none text-xs cursor-pointer max-w-[130px] sm:max-w-[180px] truncate"
            >
              <option value="">General STEM Tutor</option>
              {availableKbs.map((kb) => {
                const key = kb.name || kb.kb_name || "";
                return (
                  <option key={key} value={key}>
                    📚 {key}
                  </option>
                );
              })}
            </select>
          </div>

          <button
            onClick={handleNewChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-all border border-slate-200 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            New Chat
          </button>

          <div
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border",
              isConnected && "bg-emerald-50 text-emerald-700 border-emerald-200",
              status === "Connecting" && "bg-amber-50 text-amber-700 border-amber-200",
              !isConnected && status !== "Connecting" && "bg-red-50 text-red-600 border-red-200"
            )}
          >
            <span
              className={cn(
                "w-2 h-2 rounded-full",
                isConnected && "bg-emerald-500 animate-pulse",
                status === "Connecting" && "bg-amber-400 animate-pulse",
                !isConnected && status !== "Connecting" && "bg-red-400"
              )}
            />
            {mounted ? status : "Disconnected"}
          </div>

          {status !== "Connected" ? (
            <button
              onClick={connect}
              disabled={status === "Connecting"}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Wifi className="w-3.5 h-3.5" />
              Connect
            </button>
          ) : (
            <button
              onClick={disconnect}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-red-50 hover:text-red-600 transition-all border border-slate-200 cursor-pointer"
            >
              <WifiOff className="w-3.5 h-3.5" />
              Disconnect
            </button>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 bg-[#F8F9FD]/50">
        <div className="flex justify-center mb-2">
          <span className="px-4 py-1 bg-slate-100 text-slate-500 text-[11px] font-bold rounded-full uppercase tracking-wider flex items-center gap-1.5">
            {selectedKb ? (
              <>
                <Database className="w-3 h-3 text-indigo-600" />
                Active KB: {selectedKb}
              </>
            ) : (
              "Today • General STEM Mode"
            )}
          </span>
        </div>

        {messages.map((msg) => {
          const isAI = msg.sender === "ai";
          const isActiveStreaming = msg.id === activeAiMsgId.current;

          return (
            <div
              key={msg.id}
              className={cn("flex w-full", isAI ? "justify-start" : "justify-end")}
            >
              <div className={cn("flex gap-3 max-w-[85%]", isAI ? "flex-row" : "flex-row-reverse")}>
                {/* Avatar */}
                {isAI ? (
                  <img
                    src="/assets/images/prof-paw.webp"
                    alt="Professor Paw"
                    className="w-8 h-8 rounded-full border border-slate-200 bg-white shrink-0 object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full border border-slate-200 bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {mounted && user?.name ? user.name[0].toUpperCase() : "U"}
                  </div>
                )}

                {/* Bubble */}
                <div
                  className={cn(
                    "flex flex-col p-5 sm:p-6 px-6 sm:px-7 shadow-sm text-[15px] sm:text-[15.5px] leading-relaxed",
                    isAI
                      ? "bg-[#6C5CE7] text-white rounded-[26px] rounded-tl-sm"
                      : "bg-white text-slate-700 border border-slate-100 rounded-[26px] rounded-tr-sm"
                  )}
                >
                  {/* User Attachments Rendering */}
                  {!isAI && msg.attachments && msg.attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2.5">
                      {msg.attachments.map((att, idx) => (
                        <div key={idx} className="flex flex-col gap-1">
                          {att.type === "image" ? (
                            <img
                              src={`data:${att.mime_type};base64,${att.base64}`}
                              alt={att.filename}
                              className="max-w-[240px] max-h-[160px] rounded-xl object-cover border border-slate-200 shadow-xs"
                            />
                          ) : (
                            <div className="flex items-center gap-2 p-2 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800">
                              <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                              <span className="truncate max-w-[160px] font-semibold">{att.filename}</span>
                              <span className="text-[10px] uppercase font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">PDF</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {isAI && isActiveStreaming && !msg.text ? (
                    <div className="flex items-center gap-2 text-white/90 text-sm font-medium py-0.5">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Thinking...</span>
                    </div>
                  ) : isAI ? (
                    <>
                      <MarkdownRenderer content={msg.text} inverted />
                      {isActiveStreaming && (
                        <span className="inline-block w-[2px] h-[1em] ml-0.5 bg-white/80 animate-pulse align-middle" />
                      )}
                    </>
                  ) : (
                    <span className="whitespace-pre-wrap">{msg.text}</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 px-6 bg-white border-t border-slate-100 shrink-0">
        {!isConnected && (
          <p className="text-center text-xs text-slate-400 mb-2">
            Click <span className="font-bold text-indigo-600">Connect</span> above to start chatting.
          </p>
        )}

        {/* Selected Pending Attachments Preview Tray */}
        {pendingAttachments.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-2.5 max-w-4xl mx-auto">
            {pendingAttachments.map((att, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 p-1.5 pl-2.5 pr-2 rounded-2xl bg-indigo-50 border border-indigo-200 text-xs font-semibold text-indigo-900 animate-in fade-in"
              >
                {att.type === "image" ? (
                  <img
                    src={`data:${att.mime_type};base64,${att.base64}`}
                    alt={att.filename}
                    className="w-6 h-6 rounded-lg object-cover border border-indigo-300"
                  />
                ) : (
                  <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                )}
                <span className="truncate max-w-[140px] font-mono text-[11px]">{att.filename}</span>
                <button
                  type="button"
                  onClick={() => handleRemovePendingAttachment(idx)}
                  className="text-slate-400 hover:text-rose-600 p-0.5 rounded-full hover:bg-white transition-colors cursor-pointer"
                  title="Hapus lampiran"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Text Input Container */}
        <div
          className={cn(
            "flex items-center gap-2.5 bg-[#F8F9FD] border rounded-full p-2 pl-4 pr-2 transition-all max-w-4xl mx-auto",
            isConnected
              ? "border-slate-200 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-50"
              : "border-slate-100 opacity-50"
          )}
        >
          {/* Attachment Paperclip Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isInputDisabled || isConvertingFile}
            className="text-slate-400 hover:text-indigo-600 transition-colors shrink-0 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed p-1 rounded-full hover:bg-slate-200/60"
            title="Lampirkan Gambar atau Dokumen PDF"
          >
            {isConvertingFile ? (
              <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
            ) : (
              <Paperclip className="w-5 h-5" />
            )}
          </button>

          <input
            type="text"
            suppressHydrationWarning
            placeholder={
              !isConnected
                ? "Connect to start chatting..."
                : selectedKb
                ? `Ask Professor Paw about ${selectedKb}...`
                : pendingAttachments.length > 0
                ? "Tambahkan pesan untuk lampiran ini (opsional)..."
                : "Bertanya ke Professor Paw atau lampirkan gambar/PDF..."
            }
            value={inputValue}
            disabled={isInputDisabled}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1 bg-transparent outline-none text-slate-700 text-sm placeholder:text-slate-400 disabled:cursor-not-allowed"
          />

          {/* Model Selector Dropdown replacing the mic button */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100/90 border border-slate-200/80 text-xs font-semibold text-slate-700 shrink-0 hover:bg-slate-200/70 transition-all">
            <Cpu className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <select
              value={selectedModelKey || availableModels[0]?.key || ""}
              onChange={(e) => setSelectedModelKey(e.target.value)}
              disabled={isStreaming}
              className="bg-transparent text-[11px] font-bold text-slate-700 outline-none cursor-pointer max-w-[100px] sm:max-w-[150px] truncate"
              title="Pilih Model AI (llm_selection)"
            >
              {availableModels.map((m) => (
                <option key={m.key} value={m.key}>
                  {m.displayName}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSendMessage}
            suppressHydrationWarning
            disabled={isInputDisabled || (!inputValue.trim() && pendingAttachments.length === 0)}
            className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center hover:bg-amber-600 transition-transform active:scale-95 shrink-0 shadow-md shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isStreaming ? (
              <Loader2 className="w-[18px] h-[18px] text-white animate-spin" />
            ) : (
              <Send className="w-[18px] h-[18px] text-white -ml-0.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function StudyBuddyPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full h-[calc(100vh-8.5rem)] bg-white rounded-[24px] flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
        </div>
      }
    >
      <StudyBuddyContent />
    </Suspense>
  );
}