// file : src/components/molecules/QuizOption.tsx
import * as React from "react";
import { cn } from "@/lib/utils";
import { Text } from "@/components/atoms/Typography";
import { Check, X } from "lucide-react";

export interface QuizOptionProps extends React.HTMLAttributes<HTMLDivElement> {
  optionText: string;
  status?: "default" | "selected" | "correct" | "incorrect";
  disabled?: boolean;
}

export const QuizOption = React.forwardRef<HTMLDivElement, QuizOptionProps>(
  ({ className, optionText, status = "default", disabled = false, onClick, ...props }, ref) => {
    
    const containerStyles = {
      default: "border-border bg-card hover:border-indigo-mid hover:bg-indigo-50/50",
      selected: "border-indigo-base bg-indigo-50 ring-1 ring-indigo-base",
      correct: "border-green-500 bg-green-50 ring-1 ring-green-500",
      incorrect: "border-red-500 bg-red-50 ring-1 ring-red-500",
    };

    const radioStyles = {
      default: "border-muted-foreground bg-transparent",
      selected: "border-indigo-base bg-indigo-base",
      correct: "border-green-500 bg-green-500",
      incorrect: "border-red-500 bg-red-500",
    };

    const textStyles = {
      default: "text-primary",
      selected: "text-indigo-950 font-bold",
      correct: "text-green-950 font-bold",
      incorrect: "text-red-950 font-bold",
    };

    return (
      <div
        ref={ref}
        onClick={disabled ? undefined : onClick}
        className={cn(
          "flex w-full items-center justify-between rounded-btn border px-4 py-3 transition-all duration-200",
          containerStyles[status],
          disabled ? "cursor-not-allowed opacity-90" : "cursor-pointer",
          disabled && status === "default" && "opacity-50 hover:border-border hover:bg-card",
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-4">
          
          <div
            className={cn(
              "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-200",
              radioStyles[status]
            )}
          >
            {status === "selected" && <div className="h-2 w-2 rounded-full bg-white" />}
            {status === "correct" && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
            {status === "incorrect" && <X className="h-3 w-3 text-white" strokeWidth={3} />}
          </div>

          <Text variant="body-medium" className={cn("transition-colors duration-200", textStyles[status])}>
            {optionText}
          </Text>
          
        </div>
        
        {status === "correct" && (
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-200">
            <Check className="h-4 w-4 text-green-700" strokeWidth={3} />
          </div>
        )}
        {status === "incorrect" && (
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-200">
            <X className="h-4 w-4 text-red-700" strokeWidth={3} />
          </div>
        )}
      </div>
    );
  }
);
QuizOption.displayName = "QuizOption";