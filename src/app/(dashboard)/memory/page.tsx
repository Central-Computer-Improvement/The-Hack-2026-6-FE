"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Heading, Text } from "@/components/atoms/Typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Brain,
  Layers,
  MessageSquare,
  HelpCircle,
  BookOpen,
  Book,
  Clock,
  User,
  RefreshCw,
  RotateCcw,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  FileCode,
  Eye,
  Edit3,
  Cpu,
  Radio,
  Terminal,
  ArrowRight,
  Trash2,
} from "lucide-react";
import {
  memoryApi,
  MemoryContentData,
  ConsolidateMemoryResponse,
  MemoryRunEvent,
} from "@/lib/api";

type MemoryLayer = "L2" | "L3";

interface SurfaceOption {
  key: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const L2_SURFACES: SurfaceOption[] = [
  { key: "chat", name: "Chat", icon: MessageSquare, description: "Ringkasan topik & miskonsepsi percakapan" },
  { key: "quiz", name: "Quiz", icon: HelpCircle, description: "Catatan performa kuis & evaluasi AI" },
  { key: "kb", name: "Knowledge base", icon: BookOpen, description: "Ringkasan RAG dokumen & textbook" },
];

const L3_SURFACES: SurfaceOption[] = [
  { key: "recent", name: "Recent summary", icon: Clock, description: "Ringkasan milestone lintas fitur terbaru" },
  { key: "profile", name: "User profile", icon: User, description: "Model profil & kekuatan belajar jangka panjang" },
];

export default function AIMemoryInspectorPage() {
  const [activeLayer, setActiveLayer] = useState<MemoryLayer>("L2");
  const [activeKey, setActiveKey] = useState<string>("chat");
  const [viewMode, setViewMode] = useState<"rendered" | "lines" | "raw">("rendered");

  // Content & Loading
  const [memoryData, setMemoryData] = useState<MemoryContentData | null>(null);
  const [isLoadingContent, setIsLoadingContent] = useState(false);

  // LLM Workspace State
  const [budget, setBudget] = useState<number | string>(2);
  const [selectedModel, setSelectedModel] = useState<string>("qwen2.5-coder:7b");
  const [availableModels, setAvailableModels] = useState<Array<{ id: string; name: string; model: string; provider?: string }>>([]);
  const [activeBinding, setActiveBinding] = useState<string>("ollama");
  const [isConsolidating, setIsConsolidating] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isClearingSessions, setIsClearingSessions] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const [consolidationResult, setConsolidationResult] = useState<ConsolidateMemoryResponse | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Streaming SSE Events State
  const [activeRunId, setActiveRunId] = useState<string | null>(null);
  const [runEvents, setRunEvents] = useState<MemoryRunEvent[]>([]);
  const sseUnsubscribeRef = useRef<(() => void) | null>(null);

  // Cleanup SSE on unmount
  useEffect(() => {
    return () => {
      if (sseUnsubscribeRef.current) {
        sseUnsubscribeRef.current();
      }
    };
  }, []);

  // Load Catalog Models from GET /api/ai/catalog
  useEffect(() => {
    const loadCatalog = async () => {
      try {
        const res = await memoryApi.getCatalog();
        const catalog = res?.catalog || res?.data?.catalog || res;
        const llmService = catalog?.services?.llm;
        if (llmService?.profiles && Array.isArray(llmService.profiles)) {
          const models: Array<{ id: string; name: string; model: string; provider?: string }> = [];
          llmService.profiles.forEach((p: any) => {
            if (p.binding) setActiveBinding(p.binding);
            if (Array.isArray(p.models)) {
              p.models.forEach((m: any) => {
                models.push({
                  id: m.id || m.name,
                  name: m.name || m.model,
                  model: m.model || m.name,
                  provider: p.binding || p.name,
                });
              });
            }
          });
          if (models.length > 0) {
            setAvailableModels(models);
            setSelectedModel(models[0].model);
          }
        }
      } catch (err) {
        console.warn("Could not fetch AI catalog:", err);
      }
    };
    loadCatalog();
  }, []);

  // Load active memory document (L2 / L3)
  const fetchMemory = async (layer: MemoryLayer, key: string) => {
    setIsLoadingContent(true);
    setStatusMsg(null);

    try {
      const data = await memoryApi.getMemory(layer, key);
      setMemoryData(data);
    } catch (err: any) {
      console.warn(`Could not load memory for ${layer}/${key}:`, err);
      setMemoryData({ layer, key, content: "" });
    } finally {
      setIsLoadingContent(false);
    }
  };

  useEffect(() => {
    fetchMemory(activeLayer, activeKey);
  }, [activeLayer, activeKey]);

  // Handle Layer switch
  const handleSwitchLayer = (layer: MemoryLayer) => {
    setActiveLayer(layer);
    if (layer === "L2") {
      setActiveKey("chat");
      setBudget(2);
    } else {
      setActiveKey("recent");
      setBudget(1);
    }
  };

  // Trigger Memory Consolidation with Live SSE Event Streaming (GET /api/ai/memory/runs/:id/events)
  const handleConsolidate = async () => {
    if (isConsolidating) return;
    setIsConsolidating(true);
    setStatusMsg(null);
    setRunEvents([]);
    setActiveRunId(null);

    if (sseUnsubscribeRef.current) {
      sseUnsubscribeRef.current();
      sseUnsubscribeRef.current = null;
    }

    const defaultBudget = activeLayer === "L2" ? 2 : 1;
    const finalBudget = budget !== "" && Number(budget) >= 1 ? Number(budget) : defaultBudget;

    try {
      const res = await memoryApi.consolidateMemory({
        layer: activeLayer,
        key: activeKey,
        budget: finalBudget,
        llm_selection: selectedModel,
      });

      setConsolidationResult(res);
      const runId = res?.id;

      if (runId) {
        setActiveRunId(runId);

        // Connect to SSE stream: GET /api/ai/memory/runs/:id/events
        const unsubscribe = memoryApi.streamRunEvents(
          runId,
          (event) => {
            setRunEvents((prev) => {
              const exists = prev.some(
                (e) => (e.seq !== undefined && e.seq === event.seq) || (e.stage === event.stage && e.seq === event.seq)
              );
              if (exists) return prev;
              return [...prev, event];
            });

            if (event.stage === "run_completed") {
              setStatusMsg({
                type: "success",
                text: `Memori ${activeLayer}/${activeKey} berhasil dikonsolidasi secara live via SSE!`,
              });
              setIsConsolidating(false);
              fetchMemory(activeLayer, activeKey);
            } else if (event.stage === "run_failed") {
              setStatusMsg({
                type: "error",
                text: event.error || "Proses konsolidasi memori gagal.",
              });
              setIsConsolidating(false);
            }
          },
          (err) => {
            console.warn("SSE event stream completed or closed:", err);
            setIsConsolidating(false);
            fetchMemory(activeLayer, activeKey);
          },
          () => {
            setIsConsolidating(false);
            fetchMemory(activeLayer, activeKey);
          }
        );

        sseUnsubscribeRef.current = unsubscribe;
      } else {
        setStatusMsg({
          type: "success",
          text: `Memori ${activeLayer}/${activeKey} berhasil dikonsolidasi!`,
        });
        setIsConsolidating(false);
        fetchMemory(activeLayer, activeKey);
      }
    } catch (err: any) {
      setStatusMsg({
        type: "error",
        text: err.message || "Gagal mengkonsolidasikan memori.",
      });
      setIsConsolidating(false);
    }
  };

  // Reset L2/L3 Memory Slot (POST /api/ai/memory/:layer/:key/reset)
  const handleResetMemory = async () => {
    if (isResetting) return;
    const confirmReset = window.confirm(
      `Apakah Anda yakin ingin mereset memori ${activeLayer}/${activeKey}? Dokumen ringkasan akan dikosongkan.`
    );
    if (!confirmReset) return;

    setIsResetting(true);
    setStatusMsg(null);

    try {
      await memoryApi.resetMemory(activeLayer, activeKey);
      setStatusMsg({
        type: "success",
        text: `Memori ${activeLayer}/${activeKey} berhasil di-reset!`,
      });
      fetchMemory(activeLayer, activeKey);
    } catch (err: any) {
      setStatusMsg({
        type: "error",
        text: err.message || "Gagal mereset memori.",
      });
    } finally {
      setIsResetting(false);
    }
  };

  // Clear all active chat sessions (DELETE /api/ai/sessions/all/clear)
  const handleClearAllSessions = async () => {
    if (isClearingSessions) return;
    const confirmClear = window.confirm(
      "Apakah Anda yakin ingin menghapus seluruh riwayat percakapan sesi chat aktif di DeepTutor? Tindakan ini akan mengosongkan daftar entitas sesi pada tab snapshot."
    );
    if (!confirmClear) return;

    setIsClearingSessions(true);
    setStatusMsg(null);

    try {
      const res = await memoryApi.clearAllSessions();
      setStatusMsg({
        type: "success",
        text: `Seluruh riwayat sesi chat berhasil dibersihkan! (${res?.count ?? 0} sesi dihapus)`,
      });
    } catch (err: any) {
      setStatusMsg({
        type: "error",
        text: err.message || "Gagal menghapus riwayat sesi chat.",
      });
    } finally {
      setIsClearingSessions(false);
    }
  };

  const currentSurfaces = activeLayer === "L2" ? L2_SURFACES : L3_SURFACES;
  const currentSurfaceObj = currentSurfaces.find((s) => s.key === activeKey) || currentSurfaces[0];

  // Helper to render formatted Markdown with Footnotes
  const renderFormattedMarkdown = (rawMarkdown: string) => {
    if (!rawMarkdown || !rawMarkdown.trim()) {
      return (
        <div className="py-16 text-center space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 mx-auto">
            <Brain className="w-6 h-6 text-slate-400" />
          </div>
          <p className="font-bold text-slate-700 text-sm">
            Memori {activeLayer} / {activeKey} masih kosong
          </p>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Belum ada ringkasan terkompilasi. Klik tombol <strong>&quot;Update memory&quot;</strong> di panel kanan untuk memicu real-time SSE LLM consolidation engine!
          </p>
        </div>
      );
    }

    // Split content and footnotes
    const lines = rawMarkdown.split("\n");
    const mainLines: string[] = [];
    const footnoteLines: string[] = [];
    let isFootnoteSection = false;

    lines.forEach((line) => {
      if (line.trim().startsWith("[^") || line.trim().startsWith("---") || line.toLowerCase().includes("footnotes")) {
        isFootnoteSection = true;
      }
      if (isFootnoteSection) {
        if (line.trim().startsWith("[^")) footnoteLines.push(line);
      } else {
        mainLines.push(line);
      }
    });

    return (
      <div className="space-y-6 text-slate-800 text-sm leading-relaxed">
        {/* Main Parsed Content */}
        <div className="space-y-3">
          {mainLines.map((line, idx) => {
            const trimmed = line.trim();
            if (!trimmed) return <div key={idx} className="h-1" />;

            // Clean markdown metadata tags e.g. <!--m_...-->
            const cleanLine = trimmed.replace(/<!--.*?-->/g, "").trim();

            if (cleanLine.startsWith("# ")) {
              return (
                <h1 key={idx} className="text-xl font-black text-slate-900 pt-1 pb-1">
                  {cleanLine.replace("# ", "")}
                </h1>
              );
            }
            if (cleanLine.startsWith("## ")) {
              return (
                <h2 key={idx} className="text-base font-bold text-slate-800 pt-3 pb-1 border-b border-slate-100">
                  {cleanLine.replace("## ", "")}
                </h2>
              );
            }
            if (cleanLine.startsWith("- ") || cleanLine.startsWith("* ")) {
              const itemText = cleanLine.slice(2);
              const isMisconception = itemText.toLowerCase().includes("misconception");
              const isMastered = itemText.toLowerCase().includes("mastered");

              return (
                <div key={idx} className="flex items-start gap-2 pl-2">
                  <span className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${isMisconception ? "bg-amber-500" : isMastered ? "bg-emerald-500" : "bg-indigo-500"}`} />
                  <p className="flex-1 text-xs leading-relaxed text-slate-700">
                    {itemText.includes("[^") ? (
                      <>
                        <span>{itemText.split("[^")[0]}</span>
                        <sup className="text-indigo-600 font-bold text-[10px] ml-0.5 cursor-pointer hover:underline">
                          [{itemText.split("[^")[1]?.replace("]", "")}]
                        </sup>
                      </>
                    ) : (
                      itemText
                    )}
                  </p>
                </div>
              );
            }

            return <p key={idx} className="text-xs text-slate-600">{cleanLine}</p>;
          })}
        </div>

        {/* Footnotes Section */}
        {footnoteLines.length > 0 && (
          <div className="pt-6 border-t border-slate-200/80 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              Footnotes & Source Traces
            </span>
            <div className="space-y-1">
              {footnoteLines.map((fn, i) => {
                const match = fn.match(/\[\^(\d+)\]:\s*(.*)/);
                const num = match ? match[1] : String(i + 1);
                const text = match ? match[2] : fn;

                return (
                  <div key={i} className="flex items-center gap-2 text-[11px] text-indigo-700 font-mono">
                    <span className="font-bold text-slate-500">{num}.</span>
                    <span className="underline cursor-pointer hover:text-indigo-900 truncate">
                      {text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Helper for formatting event stage icon and label
  const getStageBadge = (stage: string) => {
    switch (stage) {
      case "run_started":
        return <Badge className="bg-indigo-100 text-indigo-800 border-none font-mono text-[9px]">run_started</Badge>;
      case "trace_loaded":
        return <Badge className="bg-blue-100 text-blue-800 border-none font-mono text-[9px]">trace_loaded</Badge>;
      case "chunked":
        return <Badge className="bg-purple-100 text-purple-800 border-none font-mono text-[9px]">chunked</Badge>;
      case "model_invoked":
        return <Badge className="bg-amber-100 text-amber-800 border-none font-mono text-[9px]">model_invoked</Badge>;
      case "run_completed":
        return <Badge className="bg-emerald-100 text-emerald-800 border-none font-mono text-[9px]">run_completed</Badge>;
      case "run_failed":
        return <Badge className="bg-rose-100 text-rose-800 border-none font-mono text-[9px]">run_failed</Badge>;
      default:
        return <Badge className="bg-slate-100 text-slate-700 border-none font-mono text-[9px]">{stage}</Badge>;
    }
  };

  return (
    <div className="w-full font-sans max-w-7xl mx-auto space-y-6 p-4 md:p-6 pb-16">
      {/* Top Header & Breadcrumb Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-[24px] p-5 px-6 border border-slate-100 shadow-sm">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link href="/courses" className="hover:text-slate-900 transition-colors">
            Memory
          </Link>
          <span>/</span>
          <span className="flex items-center gap-1.5 text-indigo-700 font-bold">
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            {activeLayer} · {activeLayer === "L2" ? "Per-surface summaries" : "Cross-surface knowledge"}
          </span>
          <span>/</span>
          <span className="text-slate-800 font-bold">{currentSurfaceObj.name}</span>
        </div>

        {/* Layer Switcher Pills (L2 / L3) */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl">
          <button
            onClick={() => handleSwitchLayer("L2")}
            className={`px-5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeLayer === "L2"
                ? "bg-white text-indigo-700 shadow-xs ring-1 ring-indigo-500/10"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            L2 (Surfaces)
          </button>
          <button
            onClick={() => handleSwitchLayer("L3")}
            className={`px-5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeLayer === "L3"
                ? "bg-white text-indigo-700 shadow-xs ring-1 ring-indigo-500/10"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            L3 (Global)
          </button>
        </div>
      </div>

      {/* Global Status Banner */}
      {statusMsg && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center justify-between gap-2 animate-in fade-in ${
            statusMsg.type === "success"
              ? "bg-emerald-50 border border-emerald-200 text-emerald-900"
              : "bg-rose-50 border border-rose-200 text-rose-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMsg.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{statusMsg.text}</span>
          </div>
          <button
            onClick={() => setStatusMsg(null)}
            className="text-slate-400 hover:text-slate-600 text-xs px-2 py-0.5 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* 3-Column Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ================= COLUMN 1: SURFACES SIDEBAR (Span 3) ================= */}
        <div className="lg:col-span-3 bg-white rounded-[24px] p-5 border border-slate-100 shadow-sm space-y-4">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              {activeLayer} Slots
            </span>
            <Badge className="bg-indigo-50 text-indigo-700 border-none font-bold text-[10px] px-2 py-0.5">
              {currentSurfaces.length} Slots
            </Badge>
          </div>

          <div className="space-y-1.5">
            {currentSurfaces.map((surface) => {
              const isSelected = activeKey === surface.key;
              const IconComp = surface.icon;

              return (
                <button
                  key={surface.key}
                  onClick={() => setActiveKey(surface.key)}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl text-left text-xs transition-all cursor-pointer ${
                    isSelected
                      ? "bg-indigo-50 text-indigo-900 font-bold border border-indigo-200 shadow-xs"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <IconComp
                      className={`w-4 h-4 shrink-0 ${
                        isSelected ? "text-indigo-600" : "text-slate-400"
                      }`}
                    />
                    <span className="truncate">{surface.name}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100">
            <p className="text-[11px] text-slate-400 leading-relaxed italic">
              {activeLayer === "L2"
                ? "L2 memadatkan ringkasan per surface (chat, quiz, kb, notebook)."
                : "L3 menggabungkan pengetahuan global lintas fitur (recent summary & user profile)."}
            </p>
          </div>
        </div>

        {/* ================= COLUMN 2: MEMORY CONTENT VIEWER (Span 6) ================= */}
        <div className="lg:col-span-6 bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm space-y-5 min-h-[500px]">
          {/* Top Bar: View Mode Switcher */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
              <button
                onClick={() => setViewMode("rendered")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  viewMode === "rendered"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                Rendered
              </button>
              <button
                onClick={() => setViewMode("lines")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  viewMode === "lines"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                # Line numbers
              </button>
              <button
                onClick={() => setViewMode("raw")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  viewMode === "raw"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                Raw
              </button>
            </div>

            <Button
              onClick={() => fetchMemory(activeLayer, activeKey)}
              disabled={isLoadingContent}
              variant="ghost"
              className="h-8 px-2.5 rounded-xl text-slate-500 hover:text-slate-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingContent ? "animate-spin text-indigo-600" : ""}`} />
              Refresh
            </Button>
          </div>

          {/* Viewer Area */}
          <div className="min-h-[360px]">
            {isLoadingContent ? (
              <div className="py-24 flex flex-col items-center justify-center gap-3 text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                <span className="text-xs font-medium">Memuat isi dokumen memori...</span>
              </div>
            ) : viewMode === "rendered" ? (
              renderFormattedMarkdown(memoryData?.content || "")
            ) : viewMode === "lines" ? (
              /* Code / Line Numbers View */
              <div className="font-mono text-xs bg-slate-900 text-slate-100 p-4 rounded-2xl overflow-x-auto max-h-[500px]">
                {memoryData?.content ? (
                  memoryData.content.split("\n").map((l, i) => (
                    <div key={i} className="flex gap-4 hover:bg-slate-800/80 px-1 rounded">
                      <span className="text-slate-500 select-none text-right w-6 shrink-0">{i + 1}</span>
                      <span className="whitespace-pre">{l}</span>
                    </div>
                  ))
                ) : (
                  <span className="text-slate-500 italic">// Empty document</span>
                )}
              </div>
            ) : (
              /* Raw Plain Text View */
              <textarea
                readOnly
                value={memoryData?.content || ""}
                rows={16}
                className="w-full font-mono text-xs p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 outline-none resize-none"
              />
            )}
          </div>
        </div>

        {/* ================= COLUMN 3: LLM WORKSPACE & STREAMING EVENTS PANEL (Span 3) ================= */}
        <div className="lg:col-span-3 bg-white rounded-[24px] p-5 border border-slate-100 shadow-sm space-y-5">
          {/* Header & Actions */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-indigo-600" />
              LLM Workspace
            </span>
            
            <button
              suppressHydrationWarning
              type="button"
              onClick={handleResetMemory}
              disabled={Boolean(isResetting || !memoryData?.content)}
              className="h-7 px-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 text-[11px] font-bold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-slate-400 flex items-center gap-1 transition-all"
            >
              {isResetting ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <>
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </>
              )}
            </button>
          </div>

          {/* Actions: Update Memory Button */}
          <div className="space-y-3">
            <Button
              onClick={handleConsolidate}
              disabled={isConsolidating}
              className="w-full rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-11 text-xs shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              {isConsolidating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Streaming Konsolidasi...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Update memory ({activeLayer}/{activeKey})
                </>
              )}
            </Button>

            {isConsolidating && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-2 text-[11px] text-amber-800 font-semibold animate-pulse">
                <Radio className="w-3.5 h-3.5 animate-spin text-amber-600 shrink-0" />
                <span>Live SSE stream active...</span>
              </div>
            )}
          </div>

          {/* Configuration Inputs */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            {/* Budget */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Memory Budget (Tokens / Lines)
              </label>
              <Input
                type="number"
                min={1}
                max={100}
                value={budget}
                onChange={(e) => {
                  const val = e.target.value;
                  setBudget(val === "" ? "" : Number(val));
                }}
                onBlur={() => {
                  if (budget === "" || Number(budget) < 1) {
                    setBudget(activeLayer === "L2" ? 2 : 1);
                  }
                }}
                placeholder={activeLayer === "L2" ? "2" : "1"}
                className="rounded-xl border-slate-200 text-xs h-9 bg-slate-50 font-bold"
              />
            </div>

            {/* Model Selector */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Model LLM Selection
                </label>
                <Badge className="bg-slate-100 text-slate-600 border-none text-[9px] uppercase font-mono px-1.5 py-0">
                  {activeBinding}
                </Badge>
              </div>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full h-9 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 focus:outline-none"
              >
                {availableModels.length > 0 ? (
                  availableModels.map((m) => (
                    <option key={m.id} value={m.model}>
                      {m.name} ({m.provider})
                    </option>
                  ))
                ) : (
                  <option value="qwen2.5-coder:7b">qwen2.5-coder:7b (ollama)</option>
                )}
              </select>
            </div>
          </div>

          {/* ================= REAL-TIME SSE STREAMING EVENTS LOG ================= */}
          {(runEvents.length > 0 || isConsolidating) && (
            <div className="pt-3 border-t border-slate-100 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-indigo-600" />
                  SSE Live Pipeline ({runEvents.length})
                </span>
                {activeRunId && (
                  <span className="font-mono text-[9px] text-slate-400">
                    {activeRunId.slice(0, 8)}...
                  </span>
                )}
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 text-slate-200 font-mono text-[10px] max-h-48 overflow-y-auto space-y-1.5 shadow-inner">
                {runEvents.map((evt, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-[10px] leading-tight">
                    <span className="text-slate-500 font-bold shrink-0">#{evt.seq ?? idx}</span>
                    <div className="flex-1 space-y-0.5 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {getStageBadge(evt.stage)}
                        {evt.surface && <span className="text-slate-400">[{evt.surface}]</span>}
                        {evt.total !== undefined && <span className="text-indigo-400">total:{evt.total}</span>}
                        {evt.chunks !== undefined && <span className="text-purple-400">chunks:{evt.chunks}</span>}
                      </div>
                      {evt.error && <p className="text-rose-400 font-sans">{evt.error}</p>}
                    </div>
                  </div>
                ))}

                {isConsolidating && (
                  <div className="flex items-center gap-1.5 text-amber-400 pt-1">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Listening to SSE event stream...</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Consolidation Metadata */}
          {consolidationResult && !isConsolidating && (
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-[11px]">
              <span className="font-bold text-slate-700 block uppercase tracking-wider text-[10px]">
                Metadata Run Terakhir
              </span>
              <p className="text-slate-600 font-mono">ID: {consolidationResult.id?.slice(0, 10)}...</p>
              <div className="flex items-center gap-1.5 text-slate-600">
                <strong>Status:</strong>
                <Badge className="bg-emerald-100 text-emerald-800 border-none font-mono text-[9px] px-1.5 py-0">
                  {consolidationResult.status}
                </Badge>
              </div>
            </div>
          )}

          {/* ================= SESSIONS MANAGEMENT SECTION ================= */}
          <div className="pt-4 border-t border-slate-100 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                Chat Sessions
              </span>
              <Badge className="bg-slate-100 text-slate-600 border-none font-mono text-[9px]">
                Snapshot
              </Badge>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Hapus seluruh riwayat percakapan sesi chat aktif di DeepTutor.
            </p>
            <Button
              onClick={handleClearAllSessions}
              disabled={isClearingSessions}
              variant="outline"
              size="sm"
              className="w-full h-9 rounded-xl border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-2xs"
            >
              {isClearingSessions ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-600" />
              ) : (
                <Trash2 className="w-3.5 h-3.5" />
              )}
              Clear All Sessions
            </Button>
          </div>

        </div>

      </div>
    </div>
  );
}
