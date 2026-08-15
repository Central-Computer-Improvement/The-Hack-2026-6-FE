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
    // Validasi nilai Tag tetap dibatasi ke h1-h6
    const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

    // Pakai React.createElement, BUKAN <Component /> di JSX.
    // Kalau sebuah variabel bertipe ElementType dipakai langsung sebagai
    // tag JSX (<Component />), TypeScript mencoba resolve
    // JSX.LibraryManagedAttributes untuk SEMUA kemungkinan elemen
    // (termasuk elemen SVG seperti <symbol>), yang memicu error
    // "onCopy incompatible" (TS2322) dan "union type too complex" (TS2590).
    // React.createElement menghindari resolusi union tersebut.
    return React.createElement(
      Tag,
      {
        ref,
        className: cn(headingVariants({ variant, className })),
        ...props,
      }
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
    // Sama seperti Heading: pakai createElement, bukan <Component /> di JSX,
    // supaya TypeScript tidak mencoba resolve union props dari semua
    // kemungkinan elemen JSX (HTML + SVG).
    return React.createElement(
      Tag,
      {
        ref,
        className: cn(textVariants({ variant, className })),
        ...props,
      }
    );
  }
);
Text.displayName = "Text";
