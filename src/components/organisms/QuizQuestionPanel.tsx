// file: src/components/organisms/QuizQuestionPanel.tsx
"use client";

import * as React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/atoms/Typography";
import { QuizProgressHeader } from "@/components/molecules/QuizProgressHeader";
import { QuizChoiceOption } from "@/components/molecules/QuizChoiceOption";

const LETTERS = ["A", "B", "C", "D", "E", "F"];

export interface QuizQuestionPanelProps {
  questionNumber: number;
  totalQuestions: number;
  question: string;
  options: string[];
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  onSubmit: () => void;
  remainingSeconds: number;
  isSubmitting?: boolean;
  className?: string;
}

export function QuizQuestionPanel({
  questionNumber,
  totalQuestions,
  question,
  options,
  selectedIndex,
  onSelect,
  onSubmit,
  remainingSeconds,
  isSubmitting = false,
  className,
}: QuizQuestionPanelProps) {
  const isLastQuestion = questionNumber >= totalQuestions;

  return (
    <div className={cn("w-full max-w-[760px]", className)}>
      <QuizProgressHeader
        questionNumber={questionNumber}
        totalQuestions={totalQuestions}
        remainingSeconds={remainingSeconds}
      />

      <Heading level={2} variant="h4" className="mb-8">
        {question}
      </Heading>

      <div className="mb-10 flex flex-col gap-5">
        {options.map((optionText, index) => (
          <QuizChoiceOption
            key={index}
            letter={LETTERS[index] ?? String(index + 1)}
            text={optionText}
            status={selectedIndex === index ? "selected" : "default"}
            disabled={isSubmitting}
            onClick={() => onSelect(index)}
          />
        ))}
      </div>

      <div className="flex justify-end">
        <Button
          variant="ghost"
          onClick={onSubmit}
          disabled={selectedIndex === null || isSubmitting}
          className="gap-2 px-2 font-bold text-primary hover:bg-transparent hover:text-indigo-base disabled:opacity-40"
        >
          {isSubmitting ? "Submitting..." : isLastQuestion ? "Finish" : "Submit"}
          <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
        </Button>
      </div>
    </div>
  );
}