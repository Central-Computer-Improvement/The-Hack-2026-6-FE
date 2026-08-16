// file: src/components/molecules/QuizScoreRing.tsx
import * as React from "react";
import { cn } from "@/lib/utils";
import { Text } from "@/components/atoms/Typography";

export interface QuizScoreRingProps {
  percentage: number; // 0-100
  correctCount: number;
  totalCount: number;
  size?: number;
  className?: string;
}

export function QuizScoreRing({
  percentage,
  correctCount,
  totalCount,
  size = 180,
  className,
}: QuizScoreRingProps) {
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100);
  const offset = circumference - (clampedPercentage / 100) * circumference;

  return (
    <div
      className={cn("relative flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className="fill-none stroke-indigo-soft"
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className="fill-none stroke-indigo-base transition-[stroke-dashoffset] duration-700 ease-out"
          style={{ strokeDasharray: circumference, strokeDashoffset: offset }}
        />
      </svg>

      <div className="absolute flex flex-col items-center">
        <Text as="span" className="text-3xl font-extrabold tracking-tight text-primary">
          {clampedPercentage}%
        </Text>
        <Text as="span" variant="small">
          {correctCount} / {totalCount}
        </Text>
      </div>
    </div>
  );
}
