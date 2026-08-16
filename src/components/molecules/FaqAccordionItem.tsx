// file: src/components/molecules/FaqAccordionItem.tsx
"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Text } from "@/components/atoms/Typography";
import AnimatePresence from "@/components/atoms/framer/AnimatePresence";
import { MotionDiv } from "@/components/atoms/framer/motion";

export interface FaqAccordionItemProps {
  question: string;
  answer: string | string[];
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

export function FaqAccordionItem({ question, answer, isOpen, onToggle, className }: FaqAccordionItemProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border-2 bg-card shadow-sm transition-colors duration-200",
        isOpen ? "border-indigo-base" : "border-transparent",
        className
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className={cn(
          "flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors duration-200",
          isOpen ? "bg-indigo-base" : "bg-card hover:bg-slate-50"
        )}
      >
        <Text as="span" variant="body-medium" className={cn("font-bold", isOpen ? "text-white" : "text-primary")}>
          {question}
        </Text>
        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 transition-transform duration-200",
            isOpen ? "rotate-180 text-white" : "text-slate-400"
          )}
          strokeWidth={2.5}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <MotionDiv
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-card"
          >
            <div className="px-5 py-5">
              {Array.isArray(answer) ? (
                <ol className="flex flex-col gap-2.5">
                  {answer.map((step, index) => (
                    <li key={index} className="flex gap-2.5">
                      <Text as="span" variant="body-medium" className="font-bold text-indigo-base">
                        {index + 1}.
                      </Text>
                      <Text as="span" variant="muted">
                        {step}
                      </Text>
                    </li>
                  ))}
                </ol>
              ) : (
                <Text variant="muted" className="leading-relaxed">
                  {answer}
                </Text>
              )}
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>
    </div>
  );
}
