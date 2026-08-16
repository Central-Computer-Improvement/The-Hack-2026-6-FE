// file: src/constants/quizSessionMock.ts
import { QuizSession } from "@/constants/mockData";

/**
 * Mock soal untuk halaman sesi Quiz (start-quiz/session).
 * Catatan: terpisah dari MOCK_MINI_QUIZ (fitur ActiveMiniQuiz di chat Study Buddy).
 * Jumlah soal = 20, disamakan dengan angka "20 Questions" di halaman Start Quiz.
 */
export const MOCK_QUIZ_SESSION: QuizSession = {
  id: "QUIZ-SESSION-BIO-01",
  title: "Quiz: Photosynthesis Basics",
  totalQuestions: 20,
  questions: [
    {
      id: "QS-001",
      question: "What is the main concept discussed in this lesson?",
      options: [
        "The importance of photosynthesis in plants.",
        "How to calculate the area of a circle.",
        "The historical significance of the Industrial Revolution.",
        "The basic principles of aerodynamics.",
      ],
      correctAnswerIndex: 0,
    },
    {
      id: "QS-002",
      question: "Which part of the plant cell is responsible for photosynthesis?",
      options: ["Nucleus", "Mitochondria", "Chloroplast", "Ribosome"],
      correctAnswerIndex: 2,
    },
    {
      id: "QS-003",
      question: "Which gas do plants absorb from the atmosphere during photosynthesis?",
      options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
      correctAnswerIndex: 1,
    },
    {
      id: "QS-004",
      question: "What are the main products of photosynthesis?",
      options: [
        "Water and Carbon Dioxide",
        "Glucose and Oxygen",
        "Nitrogen and Water",
        "Oxygen and Carbon Dioxide",
      ],
      correctAnswerIndex: 1,
    },
    {
      id: "QS-005",
      question: "What role does sunlight play in photosynthesis?",
      options: [
        "It cools down the leaf surface",
        "It provides the energy source for the reaction",
        "It attracts pollinators",
        "It has no direct role",
      ],
      correctAnswerIndex: 1,
    },
    {
      id: "QS-006",
      question: "Where does photosynthesis mostly take place in a plant?",
      options: ["Roots", "Stem", "Leaves", "Flowers"],
      correctAnswerIndex: 2,
    },
    {
      id: "QS-007",
      question: "What is the green pigment that captures light energy called?",
      options: ["Carotene", "Chlorophyll", "Melanin", "Anthocyanin"],
      correctAnswerIndex: 1,
    },
    {
      id: "QS-008",
      question: "Why is photosynthesis important for other living things?",
      options: [
        "It produces the oxygen many organisms need to breathe",
        "It produces soil nutrients directly",
        "It prevents plant diseases",
        "It controls the weather",
      ],
      correctAnswerIndex: 0,
    },
    {
      id: "QS-009",
      question: "Which structure allows gas exchange to occur on the surface of a leaf?",
      options: ["Xylem", "Phloem", "Stomata", "Cuticle"],
      correctAnswerIndex: 2,
    },
    {
      id: "QS-010",
      question: "What is the simple word equation for photosynthesis?",
      options: [
        "Glucose + Oxygen -> Water + Carbon Dioxide",
        "Water + Carbon Dioxide + Light -> Glucose + Oxygen",
        "Oxygen + Nitrogen -> Glucose",
        "Water + Glucose -> Carbon Dioxide",
      ],
      correctAnswerIndex: 1,
    },
    {
      id: "QS-011",
      question: "Which part of the plant absorbs most of the water used in photosynthesis?",
      options: ["Leaves", "Flowers", "Roots", "Fruit"],
      correctAnswerIndex: 2,
    },
    {
      id: "QS-012",
      question: "What happens to the glucose produced during photosynthesis?",
      options: [
        "It is released into the air",
        "It is used by the plant for energy and growth",
        "It turns directly into oxygen",
        "It is absorbed back by the roots as water",
      ],
      correctAnswerIndex: 1,
    },
    {
      id: "QS-013",
      question: "Why do leaves usually look green?",
      options: [
        "Because they reflect green light due to chlorophyll",
        "Because they absorb green light only",
        "Because of the soil color",
        "Because of carbon dioxide in the air",
      ],
      correctAnswerIndex: 0,
    },
    {
      id: "QS-014",
      question: "What would most likely happen to a plant kept in a completely dark room for a long time?",
      options: [
        "It would grow faster than usual",
        "It would struggle to photosynthesize and eventually weaken",
        "It would produce more oxygen",
        "Nothing would change",
      ],
      correctAnswerIndex: 1,
    },
    {
      id: "QS-015",
      question: "Which of these is NOT needed for photosynthesis to happen?",
      options: ["Sunlight", "Water", "Carbon Dioxide", "Soil nutrients like nitrogen"],
      correctAnswerIndex: 3,
    },
    {
      id: "QS-016",
      question: "What is the process called when plants release water vapor through their leaves?",
      options: ["Respiration", "Transpiration", "Germination", "Pollination"],
      correctAnswerIndex: 1,
    },
    {
      id: "QS-017",
      question: "Which organisms, besides plants, can also perform photosynthesis?",
      options: ["Mushrooms", "Algae", "Bacteria that cause disease", "Insects"],
      correctAnswerIndex: 1,
    },
    {
      id: "QS-018",
      question: "During the day, plants mostly release which gas as a byproduct of photosynthesis?",
      options: ["Carbon Dioxide", "Nitrogen", "Oxygen", "Methane"],
      correctAnswerIndex: 2,
    },
    {
      id: "QS-019",
      question: "How are photosynthesis and respiration related in plants?",
      options: [
        "They are exactly the same process",
        "Photosynthesis makes food and oxygen, while respiration uses them for energy",
        "Respiration only happens in animals, not plants",
        "They cancel each other out and have no real effect",
      ],
      correctAnswerIndex: 1,
    },
    {
      id: "QS-020",
      question: "Why is understanding photosynthesis important for humans?",
      options: [
        "It helps us understand food chains, oxygen supply, and how ecosystems work",
        "It has no real connection to human life",
        "It is only useful for farmers",
        "It only matters for growing flowers",
      ],
      correctAnswerIndex: 0,
    },
  ],
};