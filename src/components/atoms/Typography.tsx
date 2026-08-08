import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// --- VARIAN HEADING ---
const headingVariants = cva(
  "font-sans font-bold text-foreground tracking-tight",
  {
    variants: {
      variant: {
        "display-hero": "text-display-hero", // 48px
        "headline-large": "text-headline-large", // 32px
        "headline-medium": "text-headline-medium", // 24px
        "h4": "text-xl font-bold", // 20px 
        "h5": "text-lg font-bold", // 18px 
        "h6": "text-base font-bold", // 16px 
      },
    },
    defaultVariants: {
      variant: "headline-medium",
    },
  }
);

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  level?: 1 | 2 | 3 | 4 | 5 | 6; 
}

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, variant, level = 2, ...props }, ref) => {
    const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    return (
      <Tag
        ref={ref}
        className={cn(headingVariants({ variant, className }))}
        {...props}
      />
    );
  }
);
Heading.displayName = "Heading";

// --- VARIAN PARAGRAPH / TEXT ---
const textVariants = cva(
  "font-sans",
  {
    variants: {
      variant: {
        "body-large": "text-body-large text-foreground", // 18px
        "body-medium": "text-body-medium text-foreground", // 16px
        "label-bold": "text-label-bold text-foreground uppercase tracking-wider", // 14px
        "muted": "text-body-medium text-muted-foreground", // 16px 
        "small": "text-sm text-muted-foreground", // 14px abu-abu
      },
    },
    defaultVariants: {
      variant: "body-medium",
    },
  }
);

export interface TextProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof textVariants> {
  as?: React.ElementType; // render <span>, <p>, atau <div>
}

export const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ className, variant, as: Tag = "p", ...props }, ref) => {
    return (
      <Tag
        ref={ref}
        className={cn(textVariants({ variant, className }))}
        {...props}
      />
    );
  }
);
Text.displayName = "Text";