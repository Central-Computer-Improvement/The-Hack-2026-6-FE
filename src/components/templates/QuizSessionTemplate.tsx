// file: src/components/templates/QuizSessionTemplate.tsx
import * as React from "react";
import { QuizQuestionPanel, QuizQuestionPanelProps } from "@/components/organisms/QuizQuestionPanel";

export type QuizSessionTemplateProps = QuizQuestionPanelProps;

export default function QuizSessionTemplate(props: QuizSessionTemplateProps) {
  return (
    <main className="min-h-[calc(100vh-8rem)] w-full px-4 py-10 sm:px-8">
      <QuizQuestionPanel {...props} />
    </main>
  );
}
