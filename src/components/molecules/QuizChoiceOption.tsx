// file: src/components/molecules/QuizChoiceOption.tsx
import * as React from "react";
import { cn } from "@/lib/utils";
import { Text } from "@/components/atoms/Typography";

export type QuizChoiceStatus = "default" | "selected" | "correct" | "incorrect";

export interface QuizChoiceOptionProps extends React.HTMLAttributes<HTMLDivElement> {
  letter: string; // "A" | "B" | "C" | "D"
  text: string;
  status?: QuizChoiceStatus;
  disabled?: boolean;
}

export const QuizChoiceOption = React.forwardRef<HTMLDivElement, QuizChoiceOptionProps>(
  ({ className, letter, text, status = "default", disabled = false, onClick, ...props }, ref) => {
    const circleStyles: Record<QuizChoiceStatus, string> = {
      default: "border-slate-300 text-slate-400 bg-transparent",
      selected: "border-indigo-base bg-indigo-base text-white",
      correct: "border-green-500 bg-green-500 text-white",
      incorrect: "border-red-500 bg-red-500 text-white",
    };

    const textStyles: Record<QuizChoiceStatus, string> = {
      default: "text-slate-700",
      selected: "text-indigo-dark font-bold",
      correct: "text-green-700 font-bold",
      incorrect: "text-red-700 font-bold",
    };

    return (
      <div
        ref={ref}
        onClick={disabled ? undefined : onClick}
        className={cn(
          "flex items-center gap-4 rounded-2xl px-3 py-3 transition-colors duration-150",
          disabled ? "cursor-not-allowed" : "cursor-pointer hover:bg-indigo-soft/40",
          className
        )}
        {...props}
      >
        <div
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors duration-150",
            circleStyles[status]
          )}
        >
          {letter}
        </div>

        <Text as="span" variant="body-large" className={cn("transition-colors duration-150", textStyles[status])}>
          {text}
        </Text>
      </div>
    );
  }
);
QuizChoiceOption.displayName = "QuizChoiceOption";