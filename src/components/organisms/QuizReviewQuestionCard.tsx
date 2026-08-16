// file: src/components/organisms/QuizReviewQuestionCard.tsx
import * as React from "react";
import { CheckCircle2, XCircle, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heading, Text } from "@/components/atoms/Typography";
import { QuizReviewOption, QuizReviewOptionStatus } from "@/components/molecules/QuizReviewOption";

const LETTERS = ["A", "B", "C", "D", "E", "F"];

export interface QuizReviewQuestionCardProps {
  questionNumber: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  userAnswerIndex: number | null;
  className?: string;
}

export function QuizReviewQuestionCard({
  questionNumber,
  question,
  options,
  correctAnswerIndex,
  userAnswerIndex,
  className,
}: QuizReviewQuestionCardProps) {
  const isUnanswered = userAnswerIndex === null || userAnswerIndex === undefined;
  const isCorrect = !isUnanswered && userAnswerIndex === correctAnswerIndex;

  const statusMeta = isUnanswered
    ? { label: "Unanswered", icon: HelpCircle, border: "border-l-slate-300", badge: "bg-slate-100 text-slate-500" }
    : isCorrect
    ? { label: "Correct", icon: CheckCircle2, border: "border-l-green-400", badge: "bg-green-100 text-green-700" }
    : { label: "Incorrect", icon: XCircle, border: "border-l-red-400", badge: "bg-red-100 text-red-700" };

  const StatusIcon = statusMeta.icon;

  return (
    <Card
      className={cn(
        "overflow-hidden rounded-[24px] border-l-4 p-6 shadow-sm sm:p-7",
        statusMeta.border,
        className
      )}
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <Heading level={3} variant="h5">
          Question {questionNumber}
        </Heading>
        <Badge className={cn("shrink-0 gap-1 border-transparent px-3 py-1", statusMeta.badge)}>
          <StatusIcon className="h-3.5 w-3.5" strokeWidth={2.5} />
          <Text as="span" variant="small" className="font-bold">
            {statusMeta.label}
          </Text>
        </Badge>
      </div>

      <Text variant="body-medium" className="mb-5 font-semibold text-primary">
        {question}
      </Text>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {options.map((optionText, index) => {
          const isThisCorrect = index === correctAnswerIndex;
          const isThisUserPick = index === userAnswerIndex;

          let status: QuizReviewOptionStatus = "default";
          let tag: "YOUR ANSWER" | "CORRECT ANSWER" | undefined;

          if (isThisCorrect) {
            status = "correct";
            tag = isThisUserPick ? "YOUR ANSWER" : "CORRECT ANSWER";
          } else if (isThisUserPick) {
            status = "incorrect";
            tag = "YOUR ANSWER";
          }

          return (
            <QuizReviewOption
              key={index}
              letter={LETTERS[index] ?? String(index + 1)}
              text={optionText}
              status={status}
              tag={tag}
            />
          );
        })}
      </div>
    </Card>
  );
}
