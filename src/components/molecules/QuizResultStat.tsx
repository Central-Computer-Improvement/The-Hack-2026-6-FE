// file: src/components/molecules/QuizResultStat.tsx
import * as React from "react";
import { cn } from "@/lib/utils";
import { Text } from "@/components/atoms/Typography";
import { LucideIcon } from "lucide-react";

export type QuizResultStatVariant = "correct" | "incorrect" | "unanswered";

export interface QuizResultStatProps {
  icon: LucideIcon;
  count: number;
  label: string;
  variant: QuizResultStatVariant;
  className?: string;
}

const VARIANT_STYLES: Record<QuizResultStatVariant, { border: string; iconBg: string }> = {
  correct: { border: "border-green-400", iconBg: "bg-green-500" },
  incorrect: { border: "border-red-400", iconBg: "bg-red-500" },
  unanswered: { border: "border-slate-300", iconBg: "bg-slate-400" },
};

export function QuizResultStat({ icon: Icon, count, label, variant, className }: QuizResultStatProps) {
  const styles = VARIANT_STYLES[variant];

  return (
    <div
      className={cn(
        "flex flex-1 flex-col items-center gap-2 rounded-2xl border-2 bg-card px-3 py-5",
        styles.border,
        className
      )}
    >
      <div className={cn("flex h-7 w-7 items-center justify-center rounded-full text-white shadow-sm", styles.iconBg)}>
        <Icon className="h-4 w-4" strokeWidth={3} />
      </div>
      <Text as="span" className="text-2xl font-extrabold leading-none text-primary">
        {count}
      </Text>
      <Text as="span" variant="small">
        {label}
      </Text>
    </div>
  );
}
