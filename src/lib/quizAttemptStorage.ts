// file: src/lib/quizAttemptStorage.ts
import { QuizQuestion } from "@/constants/mockData";

const STORAGE_KEY = "quiz-last-attempt";

export interface QuizAttemptData {
  quizId: string;
  quizTitle: string;
  questions: QuizQuestion[];
  answers: Array<number | null>;
}

/**
 * Simpan hasil attempt quiz terakhir supaya bisa dibaca lagi di halaman
 * /start-quiz/result dan /start-quiz/review (dua route terpisah).
 * Pakai sessionStorage (bukan state React) karena datanya perlu tetap ada
 * walau user pindah-pindah route.
 *
 * `cachedAttempt` menyimpan reference yang STABIL di memori supaya bisa
 * dikonsumsi lewat useSyncExternalStore (lihat hooks/useQuizAttempt.ts)
 * tanpa perlu setState di dalam useEffect — ini yang bikin ESLint
 * react-hooks/set-state-in-effect tidak lagi trigger, karena pembacaan
 * "sumber data eksternal" memang direkomendasikan lewat API ini, bukan
 * lewat effect + setState manual.
 */
let cachedAttempt: QuizAttemptData | null | undefined; // undefined = belum pernah dibaca dari sessionStorage

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
    // sessionStorage bisa gagal (mis. mode private browsing) — cache di
    // memori (cachedAttempt) tetap dipakai untuk sisa sesi berjalan ini.
  }
}

export function loadQuizAttempt(): QuizAttemptData | null {
  if (cachedAttempt === undefined) {
    cachedAttempt = readFromSessionStorage();
  }
  return cachedAttempt;
}

// ---- Khusus untuk dikonsumsi lewat useSyncExternalStore ----

export function subscribeQuizAttempt(): () => void {
  // Data hanya berubah lewat saveQuizAttempt() sebelum pindah halaman,
  // bukan sambil halaman result/review sedang terbuka, jadi tidak perlu
  // subscribe ke event apa pun — cukup no-op unsubscribe.
  return () => {};
}

export function getQuizAttemptSnapshot(): QuizAttemptData | null {
  return loadQuizAttempt();
}

export function getQuizAttemptServerSnapshot(): QuizAttemptData | null {
  return null; // di server selalu dianggap belum ada attempt
}