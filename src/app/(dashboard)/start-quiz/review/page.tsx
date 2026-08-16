// file: src/app/(dashboard)/start-quiz/review/page.tsx
"use client";

import { useRouter } from "next/navigation";
import QuizReviewTemplate from "@/components/templates/QuizReviewTemplate";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/atoms/Typography";
import { useQuizAttempt } from "@/hooks/useQuizAttempt";

export default function QuizReviewPage() {
  const router = useRouter();
  const attempt = useQuizAttempt();

  if (!attempt) {
    return (
      <main className="flex min-h-[calc(100vh-8rem)] w-full flex-col items-center justify-center gap-4 px-4 text-center">
        <Text variant="muted">Belum ada hasil quiz untuk direview.</Text>
        <Button onClick={() => router.push("/start-quiz")} className="font-bold">
          Mulai Quiz
        </Button>
      </main>
    );
  }

  return (
    <QuizReviewTemplate
      questions={attempt.questions}
      answers={attempt.answers}
      onBack={() => router.push("/start-quiz/result")}
    />
  );
}