// file: src/components/molecules/QuizInfoStat.tsx
import * as React from "react";
import { cn } from "@/lib/utils";
import { Text } from "@/components/atoms/Typography";
import { LucideIcon } from "lucide-react";

export interface QuizInfoStatProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: LucideIcon;
  label: string;
  sublabel: string;
}

export const QuizInfoStat = React.forwardRef<HTMLDivElement, QuizInfoStatProps>(
  ({ className, icon: Icon, label, sublabel, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center gap-3 rounded-2xl border border-border bg-indigo-soft/40 px-4 py-3.5",
          className
        )}
        {...props}
      >
        {/* Icon wrapper */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-card text-indigo-base shadow-sm">
          <Icon className="h-5 w-5" strokeWidth={2.5} />
        </div>

        {/* Label + Sublabel */}
        <div className="flex flex-col gap-0.5">
          <Text as="span" variant="body-medium" className="font-bold leading-tight text-primary">
            {label}
          </Text>
          <Text as="span" variant="small" className="leading-tight">
            {sublabel}
          </Text>
        </div>
      </div>
    );
  }
);
QuizInfoStat.displayName = "QuizInfoStat";