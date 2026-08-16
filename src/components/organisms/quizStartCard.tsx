// file: src/components/organisms/QuizStartCard.tsx
"use client";

import * as React from "react";
import { ArrowRight, ListChecks, Timer, Clock3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heading, Text } from "@/components/atoms/Typography";
import { QuizInfoStat } from "@/components/molecules/quizInfoStats";
import { QuizStartInfo } from "@/types/quiz start";

export interface QuizStartCardProps extends React.HTMLAttributes<HTMLDivElement> {
  data: QuizStartInfo;
  onStart?: () => void;
  isStarting?: boolean;
}

export const QuizStartCard = React.forwardRef<HTMLDivElement, QuizStartCardProps>(
  ({ className, data, onStart, isStarting = false, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn(
          "w-full max-w-[440px] rounded-[28px] border-border/60 p-8 text-center shadow-lg sm:p-10",
          className
        )}
        {...props}
      >
        {/* Attempt Badge */}
        <Badge className="mx-auto mb-6 flex w-fit items-center gap-1.5 border-transparent bg-amber-soft px-3.5 py-1.5 text-amber-dark hover:bg-amber-soft">
          <Clock3 className="h-3.5 w-3.5" strokeWidth={2.5} />
          <Text as="span" variant="small" className="font-bold text-amber-dark">
            Attempt {data.attemptCurrent} of {data.attemptMax}
          </Text>
        </Badge>

        {/* Title */}
        <Heading level={1} variant="headline-large" className="mb-3 text-indigo-dark">
          {data.title}
        </Heading>

        {/* Description */}
        <Text variant="muted" className="mx-auto mb-8 max-w-[320px] leading-relaxed">
          {data.description}
        </Text>

        {/* Info Stats */}
        <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <QuizInfoStat
            icon={ListChecks}
            label={`${data.totalQuestions} Questions`}
            sublabel={data.questionTypeLabel}
          />
          <QuizInfoStat
            icon={Timer}
            label={data.estimatedTimeLabel}
            sublabel={data.estimatedTimeSublabel}
          />
        </div>

        {/* CTA */}
        <Button
          size="lg"
          onClick={onStart}
          disabled={isStarting}
          className="w-full px-10 font-bold sm:w-auto"
        >
          {isStarting ? "Starting..." : "Start Quiz"}
          <ArrowRight className="ml-2 h-4 w-4" strokeWidth={2.5} />
        </Button>
      </Card>
    );
  }
);
QuizStartCard.displayName = "QuizStartCard";