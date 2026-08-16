// file: src/types/quiz-start.ts

/**
 * Data untuk halaman "Start Quiz" (landing sebelum siswa masuk ke sesi soal).
 * Catatan: ini terpisah dari QuizQuestion/QuizSession di constants/mockData.ts,
 * karena itu dipakai untuk fitur ActiveMiniQuiz (mini quiz di dalam chat) yang berbeda.
 */
export interface QuizStartInfo {
  id: string;
  title: string;
  description: string;
  totalQuestions: number;
  questionTypeLabel: string; // contoh: "Multiple choice"
  estimatedTimeLabel: string; // contoh: "1 Min / Qstn"
  estimatedTimeSublabel: string; // contoh: "Estimated time"
  attemptCurrent: number;
  attemptMax: number;
}