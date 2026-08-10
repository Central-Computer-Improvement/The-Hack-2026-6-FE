
// file : src/components/atoms/StatsIndicator.tsx
import * as React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export interface StatIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: LucideIcon;
  /*Nilai statistik yang ingin ditampilkan (contoh: 1240, "7 Days"). */
  value: string | number;
  iconClassName?: string;
}

export const StatIndicator = React.forwardRef<HTMLDivElement, StatIndicatorProps>(
  ({ className, icon: Icon, value, iconClassName, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full bg-amber-soft px-3 py-1 text-sm font-bold text-amber-dark shadow-sm transition-transform hover:scale-105 cursor-default",
          className
        )}
        {...props}
      >
        <Icon className={cn("h-4 w-4 shrink-0 fill-amber-base", iconClassName)} />
        <span className="font-sans tracking-tight">{value}</span>
      </div>
    );
  }
);
StatIndicator.displayName = "StatIndicator";