"use client";

import { Circle, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Text } from "@/components/atoms/Typography"; 

interface QuizOptionProps {
  text: string;
  variant?: "default" | "correct" | "wrong";
  onClick?: () => void;
}

export default function QuizOption({ 
  text, 
  variant = "default", 
  onClick 
}: QuizOptionProps) {
  
  const baseStyles = "flex w-full cursor-pointer items-center gap-4 rounded-[16px] border-2 p-4 transition-all duration-200 active:scale-[0.98]";

  const variantStyles = {
    default: "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50",
    correct: "border-teal-500 bg-teal-50/50 text-teal-900",
    wrong: "border-red-500 bg-red-50/50 text-red-900",
  };

  return (
    <div 
      onClick={onClick} 
      className={cn(baseStyles, variantStyles[variant])}
    >
      {/* Icon Variant */}
      {variant === "default" && (
        <Circle className="h-5 w-5 text-slate-300" strokeWidth={2.5} />
      )}
      {variant === "correct" && (
        <CheckCircle2 className="h-5 w-5 fill-teal-500 text-white" />
      )}
      {variant === "wrong" && (
        <XCircle className="h-5 w-5 fill-red-500 text-white" />
      )}
      
      {/* Option */}
      <Text 
        as="span" 
        className="text-[15px] font-semibold text-inherit"
      >
        {text}
      </Text>
    </div>
  );
}