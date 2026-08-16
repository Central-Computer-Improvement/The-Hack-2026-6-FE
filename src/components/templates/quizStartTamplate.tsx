// file: src/components/templates/QuizStartTemplate.tsx
import * as React from "react";
import FadeIn from "@/components/atoms/framer/FadeIn";
import { QuizStartCard } from "@/components/organisms/quizStartCard";
import { QuizStartInfo } from "@/types/quiz start";

export interface QuizStartTemplateProps {
  data: QuizStartInfo;
  onStart?: () => void;
  isStarting?: boolean;
}

export default function QuizStartTemplate({ data, onStart, isStarting }: QuizStartTemplateProps) {
  return (
    <main className="flex min-h-[calc(100vh-8rem)] w-full items-center justify-center px-4 py-10 sm:px-8">
      <FadeIn direction="up" duration={0.5}>
        <QuizStartCard data={data} onStart={onStart} isStarting={isStarting} />
      </FadeIn>
    </main>
  );
}