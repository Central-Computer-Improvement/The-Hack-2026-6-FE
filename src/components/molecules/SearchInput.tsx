// file: src/components/molecules/SearchInput.tsx
"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  value: string;
  onChange: (value: string) => void;
  containerClassName?: string;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ value, onChange, placeholder = "Cari...", containerClassName, className, ...props }, ref) => {
    return (
      <div
        className={cn(
          "flex w-full items-center gap-3 rounded-full border border-border bg-card px-5 py-3.5 shadow-sm transition-colors focus-within:border-indigo-base",
          containerClassName
        )}
      >
        <Search className="h-5 w-5 shrink-0 text-muted-foreground" strokeWidth={2.25} />
        <Input
          ref={ref}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "h-auto flex-1 border-0 bg-transparent p-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);
SearchInput.displayName = "SearchInput";
