// file: src/components/molecules/levelCard.tsx
"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface LevelCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBgColor: string;
  isPopular?: boolean;
  isSelected?: boolean;
  onClick: () => void;
}

export default function LevelCard({
  title,
  description,
  icon,
  iconBgColor,
  isPopular,
  isSelected,
  onClick,
}: LevelCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center p-8 text-center bg-card rounded-[24px] border transition-all duration-300 w-full md:w-[270px] cursor-pointer select-none",
        "hover:shadow-xl hover:-translate-y-1.5 active:scale-[0.98]",
        isSelected
          ? "border-indigo-500 ring-4 ring-indigo-50 shadow-lg"
          : "border-border hover:border-indigo-200 shadow-sm"
      )}
    >
      {isPopular && (
        <div className="absolute top-4 right-4">
          <Badge className="bg-indigo-50 text-indigo-600 border-none font-bold px-2.5 py-0.5 text-[11px] hover:bg-indigo-100 shadow-none">
            Popular
          </Badge>
        </div>
      )}

      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-sm transition-transform group-hover:scale-110"
        style={{ backgroundColor: iconBgColor }}
      >
        {icon}
      </div>

      <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </button>
  );
}