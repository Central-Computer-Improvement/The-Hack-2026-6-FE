import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// VARIANT HEADING
const headingVariants = cva(
  "font-sans text-slate-900 tracking-tight",
  {
    variants: {
      variant: {
        "display-hero": "text-5xl font-extrabold md:text-6xl", 
        "headline-large": "text-3xl font-bold md:text-4xl",    
        "headline-medium": "text-2xl font-bold md:text-3xl",  
        "h4": "text-xl font-bold",                             
        "h5": "text-lg font-bold",                             
        "h6": "text-base font-bold",                           
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
    const Tag = `h${level}` as React.ElementType;
    
    return (
      <Tag
        ref={ref as React.Ref<HTMLHeadingElement>} // Memaksa TS menerima dinamis ref
        className={cn(headingVariants({ variant, className }))}
        {...props}
      />
    );
  }
);
Heading.displayName = "Heading";

// VARIAN PARAGRAPH / TEXT
const textVariants = cva(
  "font-sans",
  {
    variants: {
      variant: {
        "body-large": "text-lg text-slate-900",                       
        "body-medium": "text-base text-slate-900",                   
        "label-bold": "text-sm font-bold text-slate-900 uppercase tracking-wider", 
        "muted": "text-base text-slate-500",                          
        "small": "text-sm text-slate-500",                            
      },
    },
    defaultVariants: {
      variant: "body-medium",
    },
  }
);

export interface TextProps
  extends React.HTMLAttributes<HTMLElement>, 
    VariantProps<typeof textVariants> {
  as?: React.ElementType; 
}

export const Text = React.forwardRef<HTMLElement, TextProps>(
  ({ className, variant, as: Tag = "p", ...props }, ref) => {
    return (
      <Tag
        ref={ref as React.Ref<HTMLElement>} 
        className={cn(textVariants({ variant, className }))}
        {...props}
      />
    );
  }
);
Text.displayName = "Text";