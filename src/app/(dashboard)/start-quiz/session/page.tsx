// file: src/app/(dashboard)/start-quiz/session/page.tsx
"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import QuizSessionTemplate from "@/components/templates/QuizSessionTemplate";
import { useQuizTimer } from "@/hooks/useQuizTimer";
import { MOCK_QUIZ_SESSION } from "@/constants/quizSessionMock";
import { saveQuizAttempt } from "@/lib/quizAttemptStorage";

const SECONDS_PER_QUESTION = 60;

export default function QuizSessionPage() {
  const router = useRouter();
  const questions = MOCK_QUIZ_SESSION.questions;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Array<number | null>>([]);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const totalQuizSeconds = SECONDS_PER_QUESTION * questions.length;

  const finishQuiz = useCallback(
    (finalAnswers: Array<number | null>) => {
      saveQuizAttempt({
        quizId: MOCK_QUIZ_SESSION.id,
        quizTitle: MOCK_QUIZ_SESSION.title,
        questions,
        answers: finalAnswers,
      });
      router.push("/start-quiz/result");
    },
    [questions, router]
  );

  const goToNextOrFinish = useCallback(
    (answerIndex: number | null) => {
      const nextAnswers = [...answers];
      nextAnswers[currentIndex] = answerIndex;
      setAnswers(nextAnswers);

      if (isLastQuestion) {
        finishQuiz(nextAnswers);
        return;
      }

      setCurrentIndex((i) => i + 1);
      setSelectedIndex(null);
    },
    [answers, currentIndex, isLastQuestion, finishQuiz]
  );

  const handleTimeUp = useCallback(() => {
    const nextAnswers = [...answers];
    nextAnswers[currentIndex] = selectedIndex;
    setAnswers(nextAnswers);
    finishQuiz(nextAnswers);
  }, [answers, currentIndex, selectedIndex, finishQuiz]);

  const remainingSeconds = useQuizTimer(totalQuizSeconds, handleTimeUp, MOCK_QUIZ_SESSION.id, true);

  const handleSubmit = () => {
    goToNextOrFinish(selectedIndex);
  };

  return (
    <QuizSessionTemplate
      questionNumber={currentIndex + 1}
      totalQuestions={questions.length}
      question={currentQuestion.question}
      options={currentQuestion.options}
      selectedIndex={selectedIndex}
      onSelect={setSelectedIndex}
      onSubmit={handleSubmit}
      remainingSeconds={remainingSeconds}
    />
  );
}