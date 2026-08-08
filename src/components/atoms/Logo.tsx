import * as React from "react";
import { Bot } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  showText?: boolean;
}

export const Logo = React.forwardRef<HTMLDivElement, LogoProps>(
  ({ className, showText = true, ...props }, ref) => {
    return (
      <div 
        ref={ref}
        className={cn("flex items-center gap-2", className)} 
        {...props}
      >
        {/* Ikon Logo */}
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-base">
          <Bot className="h-5 w-5 text-white" />
        </div>
        
        {/* Teks Logo */}
        {showText && (
          <span className="font-sans text-lg font-bold tracking-tight text-primary">
            AI Learning
          </span>
        )}
      </div>
    );
  }
);
Logo.displayName = "Logo";