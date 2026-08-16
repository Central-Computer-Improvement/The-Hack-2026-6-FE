// file: src/app/(dashboard)/start-quiz/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import QuizStartTemplate from "@/components/templates/quizStartTamplate";
import { MOCK_QUIZ_START } from "@/constants/quizStartMock";

export default function StartQuizPage() {
  const router = useRouter();
  const [isStarting, setIsStarting] = useState(false);

  const handleStart = () => {
    setIsStarting(true);
    // TODO: ganti dengan route halaman soal quiz saat sudah dibuat
    router.push("/start-quiz/session");
  };

  return (
    <QuizStartTemplate
      data={MOCK_QUIZ_START}
      onStart={handleStart}
      isStarting={isStarting}
    />
  );
}