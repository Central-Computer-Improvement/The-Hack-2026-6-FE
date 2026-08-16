// file: src/hooks/useQuizAttempt.ts
"use client";

import { useSyncExternalStore } from "react";
import {
  getQuizAttemptServerSnapshot,
  getQuizAttemptSnapshot,
  subscribeQuizAttempt,
  QuizAttemptData,
} from "@/lib/quizAttemptStorage";

/**
 * Baca attempt quiz terakhir dari sessionStorage lewat useSyncExternalStore.
 * Dipakai di /start-quiz/result dan /start-quiz/review supaya tidak perlu
 * useEffect + setState manual saat mount (yang kena warning ESLint
 * react-hooks/set-state-in-effect).
 */
export function useQuizAttempt(): QuizAttemptData | null {
  return useSyncExternalStore(subscribeQuizAttempt, getQuizAttemptSnapshot, getQuizAttemptServerSnapshot);
}
