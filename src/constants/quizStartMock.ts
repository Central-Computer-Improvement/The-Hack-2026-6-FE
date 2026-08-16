// file: src/constants/quizStartMock.ts
import { QuizStartInfo } from "@/types/quiz start";

export const MOCK_QUIZ_START: QuizStartInfo = {
  id: "QUIZ-START-BIO-01",
  title: "Start Quiz",
  description:
    "Test your understanding and see how well you have mastered the material.",
  totalQuestions: 20,
  questionTypeLabel: "Multiple choice",
  estimatedTimeLabel: "1 Min / Qstn",
  estimatedTimeSublabel: "Estimated time",
  attemptCurrent: 1,
  attemptMax: 3,
};