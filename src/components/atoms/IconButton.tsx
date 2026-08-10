// file : src/components/atoms/IconButton.tsx
import * as React from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export interface IconButtonProps extends ButtonProps {
  icon: LucideIcon;
  iconSize?: number;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, icon: Icon, iconSize = 24, variant = "default", ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant={variant}
        size="icon"
        className={cn(
          "shrink-0 rounded-full", // shrink-0 biar tombol ga gepeng kalau di flexbox yang sempit
          className
        )}
        {...props}
      >
        <Icon size={iconSize} />
      </Button>
    );
  }
);
IconButton.displayName = "IconButton";