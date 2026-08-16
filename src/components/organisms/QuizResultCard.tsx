// file: src/components/organisms/QuizResultCard.tsx
"use client";

import * as React from "react";
import { ArrowLeft, RotateCcw, Eye, Check, X, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heading, Text } from "@/components/atoms/Typography";
import { QuizScoreRing } from "@/components/molecules/QuizScoreRing";
import { QuizResultStat } from "@/components/molecules/QuizResultStat";

export interface QuizResultCardProps {
  attemptCurrent: number;
  attemptMax: number;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  message: string;
  onBackToProgress?: () => void;
  onRetakeQuiz?: () => void;
  onReviewAnswers?: () => void;
  className?: string;
}

export function QuizResultCard({
  attemptCurrent,
  attemptMax,
  totalQuestions,
  correctCount,
  incorrectCount,
  unansweredCount,
  message,
  onBackToProgress,
  onRetakeQuiz,
  onReviewAnswers,
  className,
}: QuizResultCardProps) {
  const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  return (
    <Card className={cn("w-full max-w-[520px] rounded-[28px] p-8 text-center shadow-lg sm:p-10", className)}>
      {/* Attempt Badge */}
      <Badge
        variant="secondary"
        className="mx-auto mb-6 w-fit border-transparent bg-slate-100 px-3.5 py-1.5 text-slate-600 hover:bg-slate-100"
      >
        <Text as="span" variant="small" className="font-bold text-slate-600">
          Attempt {attemptCurrent} of {attemptMax}
        </Text>
      </Badge>

      {/* Title */}
      <Heading level={1} variant="headline-large" className="mb-8 text-indigo-dark">
        Quiz Completed!
      </Heading>

      {/* Score Ring */}
      <div className="mb-8 flex justify-center">
        <QuizScoreRing percentage={percentage} correctCount={correctCount} totalCount={totalQuestions} />
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-3 gap-3">
        <QuizResultStat icon={Check} count={correctCount} label="Correct" variant="correct" />
        <QuizResultStat icon={X} count={incorrectCount} label="Incorrect" variant="incorrect" />
        <QuizResultStat icon={HelpCircle} count={unansweredCount} label="Unanswered" variant="unanswered" />
      </div>

      {/* Message */}
      <Text variant="muted" className="mx-auto mb-8 max-w-[360px] leading-relaxed">
        {message}
      </Text>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
        <button
          type="button"
          onClick={onBackToProgress}
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-indigo-base"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
          Back to Progress
        </button>
        <button
          type="button"
          onClick={onRetakeQuiz}
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-indigo-base"
        >
          <RotateCcw className="h-4 w-4" strokeWidth={2.5} />
          Retake Quiz
        </button>
        <button
          type="button"
          onClick={onReviewAnswers}
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-indigo-base"
        >
          <Eye className="h-4 w-4" strokeWidth={2.5} />
          Review Answers
        </button>
      </div>
    </Card>
  );
}
