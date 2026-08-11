"use client";

import React, { useRef, useState, useEffect } from "react";
import { Check, Lock, Rocket, Star, Cloud, Hand } from "lucide-react";
import { Heading } from "@/components/atoms/Typography";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// --- DATA 11 MISI DENGAN KOORDINAT PRESISI (X, Y) ---
const ROADMAP_NODES = [
  { id: 11, title: "Level 11: Master Challenge", status: "locked", x: 160, y: 60 },
  { id: 10, title: "Level 10: Persamaan Kuadrat", status: "locked", x: 240, y: 170 },
  { id: 9,  title: "Level 9: Fungsi Linear",     status: "locked", x: 260, y: 290 },
  { id: 8,  title: "Level 8: SPLDV Lanjutan",    status: "locked", x: 200, y: 410 },
  { id: 7,  title: "Level 7: Garis & Sudut",     status: "locked", x: 120, y: 530 },
  { id: 6,  title: "Level 6: Kuis Aljabar AI",   status: "current", label: "Current Mission", x: 60, y: 650 },
  { id: 5,  title: "Level 5: Substitusi Variabel",status: "completed", x: 120, y: 770 },
  { id: 4,  title: "Level 4: Operasi Penjumlahan",status: "completed", x: 200, y: 890 },
  { id: 3,  title: "Level 3: Variabel X & Y",    status: "completed", x: 260, y: 1010 },
  { id: 2,  title: "Level 2: Pengenalan Angka",   status: "completed", x: 200, y: 1130 },
  { id: 1,  title: "Level 1: Misi Awal",         status: "completed", x: 160, y: 1250 },
];

// Path SVG Bezier
const SVG_PATH_D = "M 160,60 C 240,110 260,130 240,170 C 220,210 260,250 260,290 C 260,350 230,370 200,410 C 160,460 130,480 120,530 C 100,590 60,600 60,650 C 60,710 100,730 120,770 C 150,820 180,840 200,890 C 230,940 260,960 260,1010 C 260,1070 220,1090 200,1130 C 180,1180 160,1200 160,1250";

export default function RoadmapPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startY, setStartY] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  // Auto-scroll ke posisi Misi Aktif (Level 6) saat halaman pertama dibuka
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 420;
    }
  }, []);

  // --- LOGIKA DRAG TO SCROLL ---
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
    const walk = (y - startY) * 1.5; // Kecepatan seret mouse
    containerRef.current.scrollTop = scrollTop - walk;
  };

  return (
    <div className="relative flex h-[82vh] w-full flex-col overflow-hidden rounded-[32px] bg-white shadow-sm border border-slate-100">
      
      {/* --- HEADER PETUNJUK --- */}
      <div className="absolute left-8 top-6 z-30 flex items-center gap-3 bg-white/80 p-2 px-4 rounded-2xl backdrop-blur-md border border-slate-100 shadow-sm pointer-events-none">
        <Heading level={2} variant="headline-medium" className="text-indigo-base text-xl">
          AI Roadmap Belajar
        </Heading>
        <Badge variant="secondary" className="gap-1 bg-indigo-50 text-indigo-base">
          <Hand className="h-3.5 w-3.5" /> Klik & Tarik untuk Geser
        </Badge>
      </div>

      {/* --- CANVAS DRAGGABLE --- */}
      {/* Kursor sekarang diubah menjadi cursor-default (panah normal) */}
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

        {/* --- ROADMAP CANVAS (Sistem Koordinat 320px x 1350px) --- */}
        <div className="relative mx-auto my-12 h-[1350px] w-[320px]">
          
          {/* 1. SVG DASHED LINE (Garis Putus-Putus) */}
          <svg
            className="absolute inset-0 h-full w-full pointer-events-none z-0"
            viewBox="0 0 320 1350"
            fill="none"
          >
            <path
              d={SVG_PATH_D}
              stroke="#CBD5E1"
              strokeWidth="7"
              strokeDasharray="14 14"
              strokeLinecap="round"
            />
          </svg>

          {/* 2. BULATAN MISI */}
          {ROADMAP_NODES.map((node) => {
            return (
              <div
                key={node.id}
                style={{ left: `${node.x}px`, top: `${node.y}px` }}
                className="absolute z-10 -translate-x-1/2 -translate-y-1/2 transition-transform duration-200"
              >
                {/* A. MISI AKTIF (CURRENT MISSION) */}
                {node.status === "current" && (
                  <div className="relative flex flex-col items-center">
                    <Badge className="absolute -top-7 z-20 whitespace-nowrap bg-amber-500 px-3.5 py-1 text-xs font-bold text-white shadow-lg border-none animate-bounce">
                      {node.label}
                    </Badge>
                    
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-[5px] border-white bg-indigo-base shadow-[0_10px_25px_rgba(99,102,241,0.5)] transition-transform hover:scale-110 cursor-pointer">
                      <Rocket className="h-9 w-9 text-white" strokeWidth={2.2} />
                      <span className="absolute -z-10 h-full w-full animate-ping rounded-full bg-indigo-400 opacity-40"></span>
                    </div>
                  </div>
                )}

                {/* B. MISI SELESAI (COMPLETED) */}
                {node.status === "completed" && (
                  <div className="group relative flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-indigo-base shadow-md transition-transform hover:scale-110 cursor-pointer">
                    <Check className="h-6 w-6 text-white" strokeWidth={3} />
                    
                    <span className="absolute left-1/2 -top-8 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap rounded-md bg-slate-800 px-2.5 py-1 text-[11px] font-medium text-white shadow-md pointer-events-none z-30">
                      {node.title}
                    </span>
                  </div>
                )}

                {/* C. MISI TERKUNCI (LOCKED) */}
                {node.status === "locked" && (
                  <div className="group relative flex h-13 w-13 items-center justify-center rounded-full border-4 border-white bg-slate-200 shadow-sm transition-transform hover:scale-105 cursor-not-allowed">
                    <Lock className="h-5 w-5 text-slate-400" strokeWidth={2.5} />
                    
                    <span className="absolute left-1/2 -top-8 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap rounded-md bg-slate-700 px-2.5 py-1 text-[11px] font-medium text-white shadow-md pointer-events-none z-30">
                      {node.title}
                    </span>
                  </div>
                )}
              </div>
            );
          })}

        </div>
      </div>
    </div>
  );
}