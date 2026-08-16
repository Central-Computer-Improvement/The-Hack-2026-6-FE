// file: src/app/(dashboard)/start-quiz/result/page.tsx
"use client";

import { useRouter } from "next/navigation";
import QuizResultTemplate from "@/components/templates/QuizResultTemplate";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/atoms/Typography";
import { MOCK_QUIZ_START } from "@/constants/quizStartMock";
import { useQuizAttempt } from "@/hooks/useQuizAttempt";

function getResultMessage(percentage: number) {
  if (percentage >= 90) return "Luar biasa! Kamu benar-benar menguasai materi ini.";
  if (percentage >= 70) return "Great job! Keep practicing to improve your understanding.";
  if (percentage >= 50) return "Lumayan! Masih ada beberapa bagian yang perlu dipelajari ulang.";
  return "Jangan menyerah, yuk pelajari lagi materinya bareng Study Buddy.";
}

export default function QuizResultPage() {
  const router = useRouter();
  const attempt = useQuizAttempt();

  if (!attempt) {
    return (
      <main className="flex min-h-[calc(100vh-8rem)] w-full flex-col items-center justify-center gap-4 px-4 text-center">
        <Text variant="muted">Belum ada hasil quiz untuk ditampilkan.</Text>
        <Button onClick={() => router.push("/start-quiz")} className="font-bold">
          Mulai Quiz
        </Button>
      </main>
    );
  }

  const { questions, answers } = attempt;

  const correctCount = answers.reduce<number>(
    (total, answerIndex, questionIndex) =>
      answerIndex !== null && answerIndex === questions[questionIndex].correctAnswerIndex
        ? total + 1
        : total,
    0
  );
  const unansweredCount = questions.length - answers.filter((a) => a !== null && a !== undefined).length;
  const incorrectCount = questions.length - correctCount - unansweredCount;
  const percentage = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;

  return (
    <QuizResultTemplate
      attemptCurrent={MOCK_QUIZ_START.attemptCurrent}
      attemptMax={MOCK_QUIZ_START.attemptMax}
      totalQuestions={questions.length}
      correctCount={correctCount}
      incorrectCount={incorrectCount}
      unansweredCount={unansweredCount}
      message={getResultMessage(percentage)}
      onBackToProgress={() => router.push("/dashboard/progress")}
      onRetakeQuiz={() => router.push("/start-quiz/session")}
      onReviewAnswers={() => router.push("/start-quiz/review")}
    />
  );
}