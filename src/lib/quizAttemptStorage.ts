// file: src/lib/quizAttemptStorage.ts
import { QuizQuestion } from "@/constants/mockData";

const STORAGE_KEY = "quiz-last-attempt";

export interface QuizAttemptData {
  quizId: string;
  quizTitle: string;
  questions: QuizQuestion[];
  answers: Array<number | null>;
}

let cachedAttempt: QuizAttemptData | null | undefined;

function readFromSessionStorage(): QuizAttemptData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as QuizAttemptData) : null;
  } catch {
    return null;
  }
}

export function saveQuizAttempt(data: QuizAttemptData) {
  cachedAttempt = data;
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export function loadQuizAttempt(): QuizAttemptData | null {
  if (cachedAttempt === undefined) {
    cachedAttempt = readFromSessionStorage();
  }
  return cachedAttempt;
}

export function subscribeQuizAttempt(): () => void {
  return () => {};
}

export function getQuizAttemptSnapshot(): QuizAttemptData | null {
  return loadQuizAttempt();
}

export function getQuizAttemptServerSnapshot(): QuizAttemptData | null {
  return null;
}