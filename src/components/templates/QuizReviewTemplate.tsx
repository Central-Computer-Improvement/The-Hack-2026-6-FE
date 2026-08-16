// file: src/components/templates/QuizReviewTemplate.tsx
import * as React from "react";
import { ArrowLeft } from "lucide-react";
import { Heading, Text } from "@/components/atoms/Typography";
import { QuizReviewQuestionCard } from "@/components/organisms/QuizReviewQuestionCard";
import { QuizQuestion } from "@/constants/mockData";

export interface QuizReviewTemplateProps {
  questions: QuizQuestion[];
  answers: Array<number | null>;
  onBack?: () => void;
}

export default function QuizReviewTemplate({ questions, answers, onBack }: QuizReviewTemplateProps) {
  return (
    <main className="w-full px-4 py-10 sm:px-8">
      <div className="mx-auto flex max-w-[820px] flex-col gap-8">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Heading level={1} variant="headline-large">
              Review Answers
            </Heading>
            <Text variant="muted" className="mt-1">
              Let&apos;s see how you did on the latest quiz!
            </Text>
          </div>

          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-bold text-indigo-base transition-colors hover:text-indigo-dark"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
            Back to Result
          </button>
        </div>

        {/* Question List */}
        <div className="flex flex-col gap-6">
          {questions.map((q, index) => (
            <QuizReviewQuestionCard
              key={q.id}
              questionNumber={index + 1}
              question={q.question}
              options={q.options}
              correctAnswerIndex={q.correctAnswerIndex}
              userAnswerIndex={answers[index] ?? null}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
