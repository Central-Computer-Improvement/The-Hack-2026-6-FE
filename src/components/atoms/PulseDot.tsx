import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const pulseDotVariants = cva(
  "rounded-full",
  {
    variants: {
      color: {
        green: "bg-green-500", 
        indigo: "bg-indigo-base", 
        amber: "bg-amber-base", 
      },
    },
    defaultVariants: {
      color: "green",
    },
  }
);

export interface PulseDotProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "color">,
    VariantProps<typeof pulseDotVariants> {}

export const PulseDot = React.forwardRef<HTMLSpanElement, PulseDotProps>(
  ({ className, color, ...props }, ref) => {
    return (
      // Kontainer utama 
      <span 
        ref={ref} 
        className={cn("relative flex h-3 w-3 shrink-0", className)} 
        {...props}
      >
        {/* Lingkaran luar (ping) */}
        <span
          className={cn(
            "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
            pulseDotVariants({ color })
          )}
        />
        {/* Lingkaran dalam (main dot) */}
        <span
          className={cn(
            "relative inline-flex h-3 w-3 rounded-full",
            pulseDotVariants({ color })
          )}
        />
      </span>
    );
  }
);
PulseDot.displayName = "PulseDot";