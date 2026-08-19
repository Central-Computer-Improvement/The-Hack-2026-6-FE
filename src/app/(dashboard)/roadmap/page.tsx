"use client";

import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check, Lock, Rocket, Star, Cloud, Sparkles, Loader2, Clock } from "lucide-react";
import { Heading, Text } from "@/components/atoms/Typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { roadmapApi } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import { cn } from "@/lib/utils";

const getStorageKey = (uid?: string) => {
  return uid ? `auralearn_active_roadmap_${uid}` : "auralearn_active_roadmap_guest";
};

// Fallback initial nodes if AI generator hasn't been run yet
const DEFAULT_NODES = [
  { id: 11, title: "Level 11: Master Challenge", description: "Tunjukkan penguasaan penuh materimu!", prerequisite_context: "Menghubungkan seluruh konsep matematika dan aplikasi praktis.", status: "locked", x: 160, y: 60, estimated_hours: "10 hours" },
  { id: 10, title: "Level 10: Persamaan Kuadrat", description: "Akar persamaan dan faktorisasi kuadrat.", prerequisite_context: "Faktorisasi suku aljabar dan rumus kuadratik abc.", status: "locked", x: 240, y: 170, estimated_hours: "8 hours" },
  { id: 9,  title: "Level 9: Fungsi Linear", description: "Gradien garis lurus dan grafik kartesius.", prerequisite_context: "Sistem koordinat kartesius dan gradien garis (m).", status: "locked", x: 260, y: 290, estimated_hours: "6 hours" },
  { id: 8,  title: "Level 8: SPLDV Lanjutan", description: "Metode eliminasi dan substitusi SPLDV.", prerequisite_context: "SPLDV dasar dan penyelesaian dua variabel linear.", status: "locked", x: 200, y: 410, estimated_hours: "6 hours" },
  { id: 7,  title: "Level 7: Garis & Sudut", description: "Konsep sudut berseberangan dan sehadap.", prerequisite_context: "Geometri dasar dan sudut berpelurus/berpenyiku.", status: "locked", x: 120, y: 530, estimated_hours: "5 hours" },
  { id: 6,  title: "Level 6: Kuis Aljabar AI", description: "Uji kemampuan aljabar dasar dengan AI.", prerequisite_context: "Operasi aljabar suku sejenis dan perkalian konstanta.", status: "current", label: "Current Mission", x: 60, y: 650, estimated_hours: "4 hours" },
  { id: 5,  title: "Level 5: Substitusi Variabel", description: "Menghitung nilai ekspresi aljabar.", prerequisite_context: "Konsep variabel pengganti nilai bilangan.", status: "completed", x: 120, y: 770, estimated_hours: "4 hours" },
  { id: 4,  title: "Level 4: Operasi Penjumlahan", description: "Penjumlahan suku-suku sejenis.", prerequisite_context: "Pengelompokan suku sejenis dan variabel yang sama.", status: "completed", x: 200, y: 890, estimated_hours: "3 hours" },
  { id: 3,  title: "Level 3: Variabel X & Y", description: "Mengenal variabel dan konstanta.", prerequisite_context: "Definisi variabel, koefisien, dan konstanta.", status: "completed", x: 260, y: 1010, estimated_hours: "3 hours" },
  { id: 2,  title: "Level 2: Pengenalan Angka", description: "Bilangan bulat dan operasi dasar.", prerequisite_context: "Sifat operasi hitung bilangan bulat.", status: "completed", x: 200, y: 1130, estimated_hours: "2 hours" },
  { id: 1,  title: "Level 1: Misi Awal", description: "Selamat datang di perjalanan belajarmu!", prerequisite_context: "Pengenalan kurikulum dan target capaian belajar.", status: "completed", x: 160, y: 1250, estimated_hours: "1 hour" },
];

export default function RoadmapPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthStore();
  const router = useRouter();

  // States
  const [topicInput, setTopicInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [roadmapInfo, setRoadmapInfo] = useState<{ title: string; summary: string } | null>(null);
  const [nodes, setNodes] = useState<any[]>(DEFAULT_NODES);
  
  // Selected Node for Dialog Modal
  const [selectedNode, setSelectedNode] = useState<any | null>(null);

  // Drag to scroll states
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startY, setStartY] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  // Helper to format raw steps into node canvas coordinates
  const formatStepsToNodes = (steps: any[]) => {
    return steps.map((step: any, idx: number) => {
      const stepId = parseInt(step.id || step.step || (idx + 1), 10) || (idx + 1);
      const x = Math.round(160 + Math.sin(idx * 0.9) * 90);
      const y = 80 + idx * 130;
      const status = idx === 0 ? "current" : "locked";

      return {
        id: stepId,
        title: `Level ${stepId}: ${step.title}`,
        rawTitle: step.title,
        description: step.description || step.prerequisite_context || "Materi kuis dan modul pembelajaran AI.",
        prerequisite_context: step.prerequisite_context || step.prerequisite || "",
        estimated_hours: step.duration || (step.estimated_hours ? `${step.estimated_hours} hours` : "3 days"),
        status,
        label: idx === 0 ? "Current Mission" : undefined,
        x,
        y,
      };
    }).slice().reverse();
  };

  // Load persistent roadmap strictly for active user
  useEffect(() => {
    const activeUid = user?.id;
    const storageKey = getStorageKey(activeUid);

    let hasLocal = false;
    if (typeof window !== "undefined") {
      try {
        const savedLocal = localStorage.getItem(storageKey);
        if (savedLocal) {
          const parsed = JSON.parse(savedLocal);
          if (parsed.nodes && parsed.nodes.length > 0) {
            setNodes(parsed.nodes);
            if (parsed.info) setRoadmapInfo(parsed.info);
            hasLocal = true;
          }
        }
      } catch (e) {
        console.warn("Failed to load local roadmap cache:", e);
      }
    }

    if (!hasLocal) {
      setNodes(DEFAULT_NODES);
      setRoadmapInfo(null);
    }

    const loadSavedUserRoadmap = async () => {
      if (!activeUid) return;
      try {
        const savedRoadmaps = await roadmapApi.getUserRoadmaps(activeUid);
        if (Array.isArray(savedRoadmaps) && savedRoadmaps.length > 0) {
          const latest = savedRoadmaps[0];
          const steps = typeof latest.steps_json === "string" ? JSON.parse(latest.steps_json) : latest.steps_json;

          if (Array.isArray(steps) && steps.length > 0) {
            const formattedNodes = formatStepsToNodes(steps);
            const info = {
              title: latest.title || latest.topic,
              summary: latest.summary || `AI Generated Roadmap for ${latest.topic}`,
            };
            setRoadmapInfo(info);
            setNodes(formattedNodes);

            if (typeof window !== "undefined") {
              localStorage.setItem(storageKey, JSON.stringify({ info, nodes: formattedNodes }));
            }
          }
        } else if (!hasLocal) {
          setNodes(DEFAULT_NODES);
          setRoadmapInfo(null);
        }
      } catch (err) {
        console.warn("Could not load saved user roadmap from DB:", err);
      }
    };

    loadSavedUserRoadmap();
  }, [user?.id]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 420;
    }
  }, []);

  // Generate AI Roadmap Handler
  const handleGenerateRoadmap = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicInput.trim() || isLoading) return;

    setIsLoading(true);
    setErrorMsg("");

    try {
      const responseData: any = await roadmapApi.generateRoadmap(topicInput.trim(), user?.id);

      const payload = responseData?.data || responseData;
      const rawSteps =
        Array.isArray(payload?.roadmap) ? payload.roadmap :
        Array.isArray(payload?.data?.roadmap) ? payload.data.roadmap :
        Array.isArray(payload?.saved_roadmap?.steps_json) ? payload.saved_roadmap.steps_json :
        Array.isArray(responseData?.roadmap) ? responseData.roadmap :
        Array.isArray(payload) ? payload : [];

      const mainTitle = payload?.title || payload?.topic || responseData?.title || topicInput.trim();
      const mainSummary = payload?.summary || `Alur belajar AI untuk ${mainTitle}`;

      const info = {
        title: mainTitle,
        summary: mainSummary,
      };

      setRoadmapInfo(info);

      if (rawSteps.length > 0) {
        const formattedNodes = formatStepsToNodes(rawSteps);
        setNodes(formattedNodes);

        if (typeof window !== "undefined") {
          const storageKey = getStorageKey(user?.id);
          localStorage.setItem(
            storageKey,
            JSON.stringify({ info, nodes: formattedNodes })
          );
        }

        if (containerRef.current) {
          containerRef.current.scrollTop = 0;
        }
      }
    } catch (err: any) {
      console.error("Roadmap generation error:", err);
      setErrorMsg(err.message || "Failed to generate AI roadmap. Please check backend connection.");
    } finally {
      setIsLoading(false);
    }
  };

  // Complete a Node and unlock the next one (purely in roadmap state)
  const handleCompleteNode = (nodeId: number) => {
    const updatedNodes = [...nodes];
    const nodeIndex = updatedNodes.findIndex((n) => n.id === nodeId);
    if (nodeIndex === -1) return;

    // Mark current selected node as completed
    updatedNodes[nodeIndex] = {
      ...updatedNodes[nodeIndex],
      status: "completed",
      label: undefined,
    };

    // Unlock next node in sequence (nodeIndex - 1 since nodes array is ordered highest level -> lowest level)
    const nextIndex = nodeIndex - 1;
    if (nextIndex >= 0) {
      updatedNodes[nextIndex] = {
        ...updatedNodes[nextIndex],
        status: "current",
        label: "Current Mission",
      };
    }

    setNodes(updatedNodes);

    // Save updated node state to localStorage scoped by user
    if (typeof window !== "undefined") {
      const storageKey = getStorageKey(user?.id);
      localStorage.setItem(
        storageKey,
        JSON.stringify({ info: roadmapInfo, nodes: updatedNodes })
      );
    }

    setSelectedNode(null);
  };

  // Start Mission -> Redirect to Study Buddy with fresh session & injected prompt
  const handleStartMission = (node: any) => {
    if (!node) return;

    const newSessionId = `unified_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const promptParts = [
      `Bantu saya mempelajari ${node.title}.`,
      node.description ? `Deskripsi: ${node.description}` : null,
      node.prerequisite_context ? `Konteks/Prasyarat: ${node.prerequisite_context}` : null,
    ].filter(Boolean);

    const promptText = promptParts.join("\n\n");

    if (typeof window !== "undefined") {
      sessionStorage.setItem("active_study_buddy_session_id", newSessionId);
    }

    setSelectedNode(null);
    router.push(
      `/learning/study-budy?sessionId=${newSessionId}&prompt=${encodeURIComponent(promptText)}`
    );
  };

  // Generate SVG path string from node coordinates
  const generateSvgPath = () => {
    if (nodes.length === 0) return "";
    let d = `M ${nodes[0].x},${nodes[0].y}`;
    for (let i = 1; i < nodes.length; i++) {
      const prev = nodes[i - 1];
      const curr = nodes[i];
      const cy1 = (prev.y + curr.y) / 2;
      d += ` C ${prev.x},${cy1} ${curr.x},${cy1} ${curr.x},${curr.y}`;
    }
    return d;
  };

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    setIsMouseDown(true);
    setStartY(e.pageY - containerRef.current.offsetTop);
    setScrollTop(containerRef.current.scrollTop);
  };

  const handleMouseLeaveOrUp = () => {
    setIsMouseDown(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isMouseDown || !containerRef.current) return;
    e.preventDefault();
    const y = e.pageY - containerRef.current.offsetTop;
    const walk = (y - startY) * 1.5;
    containerRef.current.scrollTop = scrollTop - walk;
  };

  const canvasHeight = Math.max(1350, nodes.length * 130 + 100);

  return (
    <div className="relative flex h-[85vh] w-full flex-col overflow-hidden rounded-[32px] bg-white shadow-sm border border-slate-100 font-sans">
      
      {/* --- TOP AI GENERATOR INPUT BAR --- */}
      <div className="z-30 border-b border-slate-100 bg-white/95 px-6 py-4 backdrop-blur-md">
        <form onSubmit={handleGenerateRoadmap} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between max-w-5xl mx-auto">
          
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <Heading level={2} variant="headline-medium" className="text-slate-900 text-lg">
                {roadmapInfo?.title || "AI Learning Roadmap"}
              </Heading>
              <Text variant="muted" className="text-xs">
                {roadmapInfo?.summary || "Ketik topik materi untuk buat alur belajar adaptif AI"}
              </Text>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Input
              type="text"
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              placeholder="Contoh: Photosynthesis, Machine Learning..."
              className="h-11 w-full sm:w-[280px] rounded-xl border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-indigo-600 focus-visible:ring-indigo-600/20"
            />
            <Button
              type="submit"
              disabled={isLoading || !topicInput.trim()}
              className="h-11 shrink-0 rounded-xl bg-indigo-600 px-5 text-sm font-bold text-white shadow-md shadow-indigo-600/20 transition-all hover:bg-indigo-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate AI"
              )}
            </Button>
          </div>
        </form>

        {errorMsg && (
          <div className="mt-2 text-center text-xs font-medium text-red-500">
            {errorMsg}
          </div>
        )}
      </div>

      {/* --- CANVAS DRAGGABLE --- */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeaveOrUp}
        onMouseUp={handleMouseLeaveOrUp}
        onMouseMove={handleMouseMove}
        className="relative h-full w-full overflow-y-auto overflow-x-hidden select-none p-8 no-scrollbar cursor-default"
      >
        {/* Latar Belakang Awan & Bintang */}
        <Cloud className="absolute left-10 top-20 h-16 w-16 text-slate-100" strokeWidth={2.5} />
        <Cloud className="absolute right-12 top-[450px] h-20 w-20 text-slate-100" strokeWidth={2.5} />
        <Cloud className="absolute left-8 top-[850px] h-16 w-16 text-slate-100" strokeWidth={2.5} />
        <Cloud className="absolute right-10 top-[1150px] h-20 w-20 text-slate-100" strokeWidth={2.5} />
        <Star className="absolute right-1/3 top-36 h-6 w-6 text-amber-300" strokeWidth={2} />
        <Star className="absolute left-16 top-[600px] h-5 w-5 text-amber-300" strokeWidth={2} />
        <Star className="absolute right-20 top-[980px] h-6 w-6 text-amber-300" strokeWidth={2} />

        {/* --- ROADMAP CANVAS --- */}
        <div
          className="relative mx-auto my-8 w-[320px]"
          style={{ height: `${canvasHeight}px` }}
        >
          {/* 1. SVG DASHED LINE */}
          <svg
            className="absolute inset-0 h-full w-full pointer-events-none z-0"
            viewBox={`0 0 320 ${canvasHeight}`}
            fill="none"
          >
            <path
              d={generateSvgPath()}
              stroke="#CBD5E1"
              strokeWidth="7"
              strokeDasharray="14 14"
              strokeLinecap="round"
            />
          </svg>

          {/* 2. BULATAN MISI */}
          {nodes.map((node) => {
            const isRightSide = node.x > 160;

            return (
              <div
                key={node.id}
                style={{ left: `${node.x}px`, top: `${node.y}px` }}
                className="absolute z-10 -translate-x-1/2 -translate-y-1/2 transition-transform duration-200"
                onClick={() => setSelectedNode(node)}
              >
                {/* Always-visible Title Badge beside Node */}
                <div
                  className={cn(
                    "absolute top-1/2 -translate-y-1/2 whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs shadow-sm border transition-all z-20 pointer-events-none flex flex-col gap-0.5 max-w-[180px] sm:max-w-[220px]",
                    isRightSide ? "right-full mr-3 text-right items-end" : "left-full ml-3 text-left items-start",
                    node.status === "current" && "bg-indigo-600 text-white border-indigo-500 font-bold shadow-indigo-500/20",
                    node.status === "completed" && "bg-white text-slate-800 border-slate-200 font-semibold shadow-slate-100",
                    node.status === "locked" && "bg-slate-50/90 text-slate-500 border-slate-200 font-medium"
                  )}
                >
                  <span className="truncate w-full">{node.title}</span>
                  {node.estimated_hours && (
                    <span
                      className={cn(
                        "text-[10px]",
                        node.status === "current" ? "text-indigo-100" : "text-slate-400"
                      )}
                    >
                      {node.estimated_hours}
                    </span>
                  )}
                </div>

                {/* A. MISI AKTIF (CURRENT MISSION) */}
                {node.status === "current" && (
                  <div className="relative flex flex-col items-center">
                    <Badge className="absolute -top-7 z-20 whitespace-nowrap bg-amber-500 px-3 py-0.5 text-[10px] font-bold text-white shadow-lg border-none animate-bounce">
                      {node.label || "Current Mission"}
                    </Badge>
                    
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-full border-[4px] border-white bg-indigo-600 shadow-[0_10px_25px_rgba(99,102,241,0.5)] transition-transform hover:scale-110 cursor-pointer">
                      <Rocket className="h-7 w-7 text-white" strokeWidth={2.2} />
                      <span className="absolute -z-10 h-full w-full animate-ping rounded-full bg-indigo-400 opacity-40"></span>
                    </div>
                  </div>
                )}

                {/* B. MISI SELESAI (COMPLETED) */}
                {node.status === "completed" && (
                  <div className="flex h-13 w-13 items-center justify-center rounded-full border-4 border-white bg-indigo-600 shadow-md transition-transform hover:scale-110 cursor-pointer">
                    <Check className="h-6 w-6 text-white" strokeWidth={3} />
                  </div>
                )}

                {/* C. MISI TERKUNCI (LOCKED) */}
                {node.status === "locked" && (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-slate-200 shadow-sm transition-transform hover:scale-105 cursor-pointer">
                    <Lock className="h-5 w-5 text-slate-400" strokeWidth={2.5} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* --- NODE DETAIL DIALOG MODAL --- */}
      <Dialog open={!!selectedNode} onOpenChange={() => setSelectedNode(null)}>
        <DialogContent className="sm:max-w-md rounded-3xl p-6 bg-white border border-slate-100 shadow-2xl">
          <DialogHeader className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100 border-none font-bold">
                Step {selectedNode?.id}
              </Badge>
              {selectedNode?.estimated_hours && (
                <div className="flex items-center gap-1 text-xs font-semibold text-slate-500">
                  <Clock className="h-3.5 w-3.5" />
                  {selectedNode.estimated_hours}
                </div>
              )}
            </div>
            <DialogTitle className="text-xl font-extrabold text-slate-900">
              {selectedNode?.title}
            </DialogTitle>
            <DialogDescription className="text-sm leading-relaxed text-slate-600 pt-1">
              {selectedNode?.description || "Ikuti materi kuis dan modul pembelajaran AI untuk menguasai konsep ini."}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 flex flex-wrap justify-end gap-2.5 pt-2">
            <Button
              variant="outline"
              onClick={() => setSelectedNode(null)}
              className="rounded-xl border-slate-200"
            >
              Tutup
            </Button>
            
            {selectedNode?.status !== "completed" && (
              <Button
                onClick={() => handleCompleteNode(selectedNode?.id)}
                className="rounded-xl bg-amber-500 text-white font-bold hover:bg-amber-600 shadow-md shadow-amber-500/20"
              >
                <Check className="mr-1.5 h-4 w-4 stroke-[3]" />
                Selesaikan Misi
              </Button>
            )}

            <Button
              onClick={() => handleStartMission(selectedNode)}
              className="rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 cursor-pointer shadow-md shadow-indigo-600/20"
            >
              <Rocket className="mr-1.5 h-4 w-4" />
              Mulai Misi Belajar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}