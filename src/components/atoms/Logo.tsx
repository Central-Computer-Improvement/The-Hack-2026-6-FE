import * as React from "react";
import { Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { Heading, Text } from "@/components/atoms/Typography";


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
          <Heading level={1} variant="display-hero">
            AI Learning
          </Heading>
        )}
      </div>
    );
  }
);
Logo.displayName = "Logo";