// file: src/components/molecules/QuizReviewOption.tsx
import * as React from "react";
import { cn } from "@/lib/utils";
import { Text } from "@/components/atoms/Typography";

export type QuizReviewOptionStatus = "default" | "correct" | "incorrect";

export interface QuizReviewOptionProps {
  letter: string;
  text: string;
  status?: QuizReviewOptionStatus;
  tag?: "YOUR ANSWER" | "CORRECT ANSWER";
  className?: string;
}

const STATUS_STYLES: Record<
  QuizReviewOptionStatus,
  { box: string; circle: string; text: string; tag: string }
> = {
  default: {
    box: "border-slate-200 bg-card",
    circle: "border-slate-300 bg-card text-slate-400",
    text: "text-slate-500",
    tag: "text-slate-400",
  },
  correct: {
    box: "border-green-300 bg-green-50",
    circle: "border-green-500 bg-green-500 text-white",
    text: "font-bold text-green-800",
    tag: "text-green-600",
  },
  incorrect: {
    box: "border-red-300 bg-red-50",
    circle: "border-red-500 bg-red-500 text-white",
    text: "font-bold text-red-800",
    tag: "text-red-600",
  },
};

export function QuizReviewOption({
  letter,
  text,
  status = "default",
  tag,
  className,
}: QuizReviewOptionProps) {
  const styles = STATUS_STYLES[status];

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 rounded-2xl border-2 px-4 py-3",
        styles.box,
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold",
            styles.circle
          )}
        >
          {letter}
        </div>
        <Text as="span" variant="body-medium" className={styles.text}>
          {text}
        </Text>
      </div>

      {tag && (
        <Text
          as="span"
          variant="small"
          className={cn("shrink-0 font-extrabold uppercase tracking-wide", styles.tag)}
        >
          {tag}
        </Text>
      )}
    </div>
  );
}
