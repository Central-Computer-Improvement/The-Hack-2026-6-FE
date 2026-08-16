// file: src/components/molecules/QuizProgressHeader.tsx
import * as React from "react";
import { Clock3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Text } from "@/components/atoms/Typography";
import { StatIndicator } from "@/components/atoms/StatsIndicator";
import LevelProgress from "@/components/atoms/progressLevelCheck";

export interface QuizProgressHeaderProps {
  questionNumber: number;
  totalQuestions: number;
  remainingSeconds: number;
  className?: string;
}

function formatTime(totalSeconds: number) {
  const safeSeconds = Math.max(totalSeconds, 0);
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

export function QuizProgressHeader({
  questionNumber,
  totalQuestions,
  remainingSeconds,
  className,
}: QuizProgressHeaderProps) {
  const isUrgent = remainingSeconds <= 10;

  return (
    <div className={cn("mb-8 flex flex-col gap-3", className)}>
      <div className="flex items-center justify-between gap-4">
        <Text variant="muted" className="font-semibold">
          Question {questionNumber} of {totalQuestions}
        </Text>

        <StatIndicator
          icon={Clock3}
          value={formatTime(remainingSeconds)}
          className={cn(
            "bg-amber-base text-white shadow-sm",
            isUrgent && "animate-pulse bg-red-500"
          )}
          iconClassName="fill-white text-white"
        />
      </div>

      <LevelProgress
        currentStep={questionNumber}
        totalSteps={totalQuestions}
        showStepText={false}
      />
    </div>
  );
}