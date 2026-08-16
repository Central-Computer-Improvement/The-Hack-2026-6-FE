// file: src/app/(dashboard)/start-quiz/session/page.tsx
"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import QuizSessionTemplate from "@/components/templates/QuizSessionTemplate";
import { useQuizTimer } from "@/hooks/useQuizTimer";
import { MOCK_QUIZ_SESSION } from "@/constants/quizSessionMock";
import { saveQuizAttempt } from "@/lib/quizAttemptStorage";

const SECONDS_PER_QUESTION = 60; // basis rate "1 Min / Qstn" (lihat halaman Start Quiz)

export default function QuizSessionPage() {
  const router = useRouter();
  const questions = MOCK_QUIZ_SESSION.questions;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Array<number | null>>([]);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  // Total waktu untuk SELURUH quiz (bukan per soal) = rate per soal x jumlah soal.
  // Contoh: 1 menit/soal x 20 soal = 20 menit total, dihitung mundur terus-menerus
  // dari soal pertama sampai soal terakhir (tidak reset tiap ganti soal).
  const totalQuizSeconds = SECONDS_PER_QUESTION * questions.length;

  // Simpan attempt lalu pindah ke halaman /start-quiz/result (route terpisah).
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

  // Dipanggil saat siswa klik "Submit"/"Finish" secara manual.
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

  // Dipanggil saat waktu TOTAL quiz habis (bisa terjadi di soal mana pun).
  // Beda dari goToNextOrFinish: ini langsung mengakhiri seluruh quiz,
  // bukan cuma lanjut ke soal berikutnya. Jawaban di soal yang sedang
  // dikerjakan (kalau sudah dipilih) tetap disimpan, sisanya jadi "Unanswered".
  const handleTimeUp = useCallback(() => {
    const nextAnswers = [...answers];
    nextAnswers[currentIndex] = selectedIndex;
    setAnswers(nextAnswers);
    finishQuiz(nextAnswers);
  }, [answers, currentIndex, selectedIndex, finishQuiz]);

  // resetKey dibuat KONSTAN (id sesi quiz, bukan id soal) supaya timer
  // tidak reset tiap kali siswa pindah soal — ini yang membuatnya jadi
  // satu hitungan mundur total untuk seluruh quiz.
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