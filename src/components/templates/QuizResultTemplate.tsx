// file: src/components/templates/QuizResultTemplate.tsx
import * as React from "react";
import FadeIn from "@/components/atoms/framer/FadeIn";
import { QuizResultCard, QuizResultCardProps } from "@/components/organisms/QuizResultCard";

export type QuizResultTemplateProps = QuizResultCardProps;

export default function QuizResultTemplate(props: QuizResultTemplateProps) {
  return (
    <main className="flex min-h-[calc(100vh-8rem)] w-full items-center justify-center px-4 py-10 sm:px-8">
      <FadeIn direction="up" duration={0.5}>
        <QuizResultCard {...props} />
      </FadeIn>
    </main>
  );
}
