// file: src/components/molecules/keyTakeAwayPoin.tsx

"use client";

import React from "react";
import { CheckCircle2, PlayCircle } from "lucide-react";
import { Text } from "@/components/atoms/Typography";
import { cn } from "@/lib/utils";

interface KeyTakeawayItemProps {
  timestamp: string;
  title: string;
  description: string;
  isCompleted?: boolean;
  onClickTimestamp?: () => void;
  className?: string;
}

export default function KeyTakeawayItem({
  timestamp,
  title,
  description,
  isCompleted = false,
  onClickTimestamp,
  className,
}: KeyTakeawayItemProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-[16px] border border-slate-100 bg-slate-50/60 p-3.5 transition-all hover:bg-slate-100/80",
        className
      )}
    >
      <div className="mt-0.5 shrink-0">
        {isCompleted ? (
          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
        ) : (
          <div className="h-5 w-5 rounded-full border-2 border-slate-300" />
        )}
      </div>

      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between gap-2">
          <Text variant="body-medium" className="font-extrabold text-slate-800">
            {title}
          </Text>
          <button
            type="button"
            onClick={onClickTimestamp}
            className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-0.5 text-[12px] font-bold text-[#5D44D8] transition-colors hover:bg-indigo-100 active:scale-95"
          >
            <PlayCircle className="h-3.5 w-3.5" />
            {timestamp}
          </button>
        </div>
        <Text variant="small" className="text-slate-500 leading-snug">
          {description}
        </Text>
      </div>
    </div>
  );
}