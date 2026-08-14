// file: src/components/atoms/progressLevelCheck.tsx
"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface LevelProgressProps {
  /** Step aktif saat ini (contoh: 1) */
  currentStep: number;
  /** Total step keseluruhan (contoh: 3) */
  totalSteps: number;
  /** Class styling tambahan (opsional) */
  className?: string;
  /** Menampilkan teks indikator seperti "1/3" di samping bar (default: true) */
  showStepText?: boolean;
}

export default function LevelProgress({
  currentStep = 1,
  totalSteps = 3,
  className = "",
  showStepText = true,
}: LevelProgressProps) {
  // Menghitung persentase fill progres secara presisi
  const percentage = Math.min(
    Math.max(Math.round((currentStep / totalSteps) * 100), 0),
    100
  );

  return (
    <div className={cn("flex items-center w-full gap-3.5", className)}>
      {/* Outer Track Bar (Background ungu muda lembut) */}
      <div className="relative w-full h-3.5 bg-[#EEEDFC] rounded-full overflow-hidden shadow-inner">
        {/* Inner Progress Fill (Warna ungu khas aplikasi + Animasi smooth) */}
        <div
          className="h-full bg-[#5D44D8] rounded-full transition-all duration-500 ease-out shadow-sm"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Teks Indikator Progress "1/3" */}
      {showStepText && (
        <span className="text-sm font-extrabold text-[#5D44D8] whitespace-nowrap tracking-wide select-none">
          {currentStep}/{totalSteps}
        </span>
      )}
    </div>
  );
}