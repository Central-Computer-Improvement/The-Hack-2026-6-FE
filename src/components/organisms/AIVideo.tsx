// file: src/components/organisms/AIVideo.tsx

"use client";

import React, { useState } from "react";
import { Sparkles, Copy, Check, MessageSquare, BookOpen, ListOrdered } from "lucide-react";
import { Heading, Text } from "@/components/atoms/Typography";
import { PulseDot } from "@/components/atoms/PulseDot";
import { cn } from "@/lib/utils";

interface AiVideoSummaryProps {
  summaryText: string;
  keyPoints: string[];
  keywords: string[];
  className?: string;
}

export default function AiVideoSummary({
  summaryText,
  keyPoints,
  keywords,
  className,
}: AiVideoSummaryProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"summary" | "keypoints">("summary");

  const handleCopy = () => {
    navigator.clipboard.writeText(`${summaryText}\n\nPoin Utama:\n${keyPoints.map((p, i) => `${i + 1}. ${p}`).join("\n")}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "rounded-[24px] border border-slate-200/80 bg-white p-6 shadow-sm transition-all",
        className
      )}
    >
      {/* Header Ringkasan AI */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#5D44D8] to-[#895CF7] text-white shadow-md shadow-[#5D44D8]/20">
            <Sparkles className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Heading level={3} variant="h6" className="text-slate-900">
                Ringkasan AI Video
              </Heading>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-bold text-[#5D44D8]">
                <PulseDot color="indigo" className="h-2 w-2" />
                Auto Generated
              </span>
            </div>
            <Text variant="small" className="text-slate-400">
              Dirangkum secara otomatis oleh AI Assistant
            </Text>
          </div>
        </div>

        {/* Tombol Salin */}
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 active:scale-95 transition-all"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-emerald-600" />
              <span className="text-emerald-600">Tersalin!</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 text-slate-500" />
              <span>Salin Ringkasan</span>
            </>
          )}
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 pt-4 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("summary")}
          className={cn(
            "flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all",
            activeTab === "summary"
              ? "bg-[#5D44D8] text-white shadow-sm"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
          )}
        >
          <BookOpen className="h-4 w-4" />
          Ringkasan Materi
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("keypoints")}
          className={cn(
            "flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all",
            activeTab === "keypoints"
              ? "bg-[#5D44D8] text-white shadow-sm"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
          )}
        >
          <ListOrdered className="h-4 w-4" />
          Poin Kunci ({keyPoints.length})
        </button>
      </div>

      {/* Isi Ringkasan */}
      <div className="mt-3 space-y-4">
        {activeTab === "summary" ? (
          <Text variant="body-medium" className="text-slate-600 leading-relaxed">
            {summaryText}
          </Text>
        ) : (
          <ul className="space-y-2.5">
            {keyPoints.map((point, index) => (
              <li key={index} className="flex items-start gap-3 text-slate-700 text-sm">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-[11px] font-extrabold text-[#5D44D8]">
                  {index + 1}
                </span>
                <span className="mt-0.5 leading-normal">{point}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Tag Kata Kunci */}
        {keywords && keywords.length > 0 && (
          <div className="pt-2 border-t border-slate-100">
            <Text variant="small" className="font-bold text-slate-400 uppercase tracking-wider mb-2">
              Kata Kunci Utama:
            </Text>
            <div className="flex flex-wrap gap-1.5">
              {keywords.map((kw, i) => (
                <span
                  key={i}
                  className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600"
                >
                  #{kw}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* CTA ke AI Study Buddy */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl bg-gradient-to-r from-indigo-50/80 to-purple-50/80 p-4 border border-indigo-100/60">
          <div className="flex items-center gap-3">
            <MessageSquare className="h-5 w-5 text-[#5D44D8] shrink-0" />
            <Text variant="small" className="font-bold text-slate-700">
              Belum paham bagian tertentu? Tanyakan langsung ke AI Study Buddy!
            </Text>
          </div>
          <a
            href="/learning/study-budy"
            className="shrink-0 text-center rounded-xl bg-[#5D44D8] px-4 py-2 text-xs font-bold text-white shadow-md shadow-[#5D44D8]/20 hover:bg-indigo-700 active:scale-95 transition-all"
          >
            Tanya AI
          </a>
        </div>
      </div>
    </div>
  );
}
