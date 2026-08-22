# AuraLearn

![AuraLearn Banner](https://img.shields.io/badge/AuraLearn-AI_Learning_Platform-6B4EFF?style=for-the-badge&logo=react)

AuraLearn is a sleek, modern, and AI-driven educational platform designed to make learning engaging and interactive. Built with a strong focus on high-fidelity UI/UX, seamless micro-interactions, and a gamified progression system, AuraLearn pairs students with their learning co-pilot, Professor Paw, to explore tailored study modules.

## ✨ Key Features

* **🤖 AI-Powered Modules:** Access to Video Lessons, Study Buddy, and AI Tasks tailored for dynamic learning.
* **🎮 Gamification System:** Real-time tracking of user points (Coins) and daily learning Streaks.
* **📱 Unified Navigation Architecture:** A highly responsive SideBar for desktop and a slide-in Mobile Drawer. Both utilize smart Accordion (single-open) logic to maintain a clean interface.
* **🔐 Dynamic Authentication Flow:** A seamless, single-page Auth experience (Login/Signup) powered by Framer Motion for smooth sliding transitions without page reloads.
* **⚙️ Modular Settings Dashboard:** A clean, organized settings page for Profile Details and Account Security with tailored read-only states and interaction feedback.
* **✨ Smooth Micro-Interactions:** Custom hooks for scroll-to-hide navbars, isolated Framer Motion wrappers, and satisfying click feedbacks.

## 🛠️ Tech Stack

This project is meticulously built utilizing modern frontend technologies and follows the **Atomic Design Methodology** to ensure maintainability, reusability, and maximum performance:

* **Framework:** [Next.js](https://nextjs.org/) (App Router)
* **Library:** [React](https://react.dev/)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Animation:** [Framer Motion](https://www.framer.com/motion/)
* **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
* **Icons:** [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

Follow these steps to run AuraLearn locally on your machine.

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your system.

### Installation
1. **Clone the repository:**
   ```
   git clone https://github.com/Central-Computer-Improvement/The-Hack-2026-6-FE.git
2. Change Directory:
   ```
   cd auralearn
3. Install dependencies:
   ```
    npm install
4. Run the development server:
   ```
    npm run dev
5. Open the app:
Navigate to http://localhost:3000 in your browser to see the result.

## 📂 Project Structure

```
ai-learning-platform
├─ public
│  ├─ assets
│  │  ├─ images
│  │  │  ├─ parents.webp
│  │  │  ├─ prof-paw.webp
│  │  │  ├─ README.md
│  │  │  └─ student.webp
│  │  └─ README.md
│  └─ README.md
├─ README.md
├─ src
│  ├─ app
│  │  ├─ (dashboard)
│  │  │  ├─ courses
│  │  │  │  ├─ new
│  │  │  │  │  └─ page.tsx
│  │  │  │  └─ page.tsx
│  │  │  ├─ dashboard
│  │  │  │  ├─ progress
│  │  │  │  │  ├─ page.tsx
│  │  │  │  │  └─ README.md
│  │  │  │  ├─ README.md
│  │  │  │  └─ rewards
│  │  │  │     ├─ page.tsx
│  │  │  │     └─ README.md
│  │  │  ├─ forgotPW
│  │  │  ├─ help
│  │  │  ├─ helpCenter
│  │  │  │  ├─ page.tsx
│  │  │  │  └─ README.md
│  │  │  ├─ layout.tsx
│  │  │  ├─ learning
│  │  │  │  ├─ AiTask
│  │  │  │  │  ├─ page.tsx
│  │  │  │  │  └─ README.md
│  │  │  │  ├─ courses
│  │  │  │  │  ├─ page.tsx
│  │  │  │  │  └─ [courseId]
│  │  │  │  │     └─ page.tsx
│  │  │  │  ├─ README.md
│  │  │  │  ├─ study-budy
│  │  │  │  │  ├─ page.tsx
│  │  │  │  │  └─ README.md
│  │  │  │  ├─ studyBuddy
│  │  │  │  ├─ videoLearning
│  │  │  │  │  ├─ page.tsx
│  │  │  │  │  └─ README.md
│  │  │  │  └─ videoLessons
│  │  │  ├─ library
│  │  │  │  ├─ page.tsx
│  │  │  │  └─ README.md
│  │  │  ├─ memory
│  │  │  │  └─ page.tsx
│  │  │  ├─ README.md
│  │  │  ├─ roadmap
│  │  │  │  ├─ page.tsx
│  │  │  │  └─ README.md
│  │  │  ├─ settings
│  │  │  │  ├─ page.tsx
│  │  │  │  └─ README.md
│  │  │  └─ start-quiz
│  │  │     ├─ page.tsx
│  │  │     ├─ result
│  │  │     │  └─ page.tsx
│  │  │     ├─ review
│  │  │     │  └─ page.tsx
│  │  │     └─ session
│  │  │        └─ page.tsx
│  │  ├─ favicon.ico
│  │  ├─ globals.css
│  │  ├─ layout.tsx
│  │  ├─ levelCheck
│  │  │  ├─ level_1
│  │  │  │  ├─ page.tsx
│  │  │  │  └─ README.md
│  │  │  └─ README.md
│  │  ├─ page.tsx
│  │  ├─ README.md
│  │  └─ roleSelection
│  │     ├─ page.tsx
│  │     └─ README.md
│  ├─ components
│  │  ├─ atoms
│  │  │  ├─ ButtonPill.tsx
│  │  │  ├─ framer
│  │  │  │  ├─ AnimatePresence.tsx
│  │  │  │  ├─ FadeIn.tsx
│  │  │  │  ├─ motion.tsx
│  │  │  │  └─ README.md
│  │  │  ├─ IconButton.tsx
│  │  │  ├─ Logo.tsx
│  │  │  ├─ progressLevelCheck.tsx
│  │  │  ├─ PulseDot.tsx
│  │  │  ├─ README.md
│  │  │  ├─ StatsIndicator.tsx
│  │  │  └─ Typography.tsx
│  │  ├─ molecules
│  │  │  ├─ CardWrapper.tsx
│  │  │  ├─ ChatBubble.tsx
│  │  │  ├─ ChatInput.tsx
│  │  │  ├─ FaqAccordionItem.tsx
│  │  │  ├─ HelpTopicCard.tsx
│  │  │  ├─ keyTakeAwayPoin.tsx
│  │  │  ├─ levelCard.tsx
│  │  │  ├─ MarkdownRenderer.tsx
│  │  │  ├─ ProfileIdentity.tsx
│  │  │  ├─ QuizAction.tsx
│  │  │  ├─ QuizChoiceOption.tsx
│  │  │  ├─ quizInfoStats.tsx
│  │  │  ├─ QuizOption.tsx
│  │  │  ├─ QuizProgressHeader.tsx
│  │  │  ├─ QuizResultStat.tsx
│  │  │  ├─ QuizReviewOption.tsx
│  │  │  ├─ QuizScoreRing.tsx
│  │  │  ├─ README.md
│  │  │  ├─ ReadOnlyInput.tsx
│  │  │  ├─ RewardCard.tsx
│  │  │  ├─ roleCard.tsx
│  │  │  ├─ SearchInput.tsx
│  │  │  ├─ SelectionCard.tsx
│  │  │  └─ UploadDropzone.tsx
│  │  ├─ organisms
│  │  │  ├─ ActiveMiniQuiz.tsx
│  │  │  ├─ AIVideo.tsx
│  │  │  ├─ ContactSupportBanner.tsx
│  │  │  ├─ FaqAccordion.tsx
│  │  │  ├─ HelpTopicGrid.tsx
│  │  │  ├─ lessonSideBar.tsx
│  │  │  ├─ MaterialUploader.tsx
│  │  │  ├─ NavBar.tsx
│  │  │  ├─ QuizQuestionPanel.tsx
│  │  │  ├─ QuizResultCard.tsx
│  │  │  ├─ QuizReviewQuestionCard.tsx
│  │  │  ├─ quizStartCard.tsx
│  │  │  ├─ README.md
│  │  │  ├─ RewardRoom.tsx
│  │  │  ├─ SideBar.tsx
│  │  │  ├─ TaskSplitter.tsx
│  │  │  └─ YourProgress.tsx
│  │  ├─ README.md
│  │  ├─ templates
│  │  │  ├─ HelpCenterTemplate.tsx
│  │  │  ├─ QuizResultTemplate.tsx
│  │  │  ├─ QuizReviewTemplate.tsx
│  │  │  ├─ QuizSessionTemplate.tsx
│  │  │  ├─ quizStartTamplate.tsx
│  │  │  └─ README.md
│  │  └─ ui
│  │     ├─ avatar.tsx
│  │     ├─ badge.tsx
│  │     ├─ button.tsx
│  │     ├─ card.tsx
│  │     ├─ checkbox.tsx
│  │     ├─ dialog.tsx
│  │     ├─ input.tsx
│  │     ├─ progress.tsx
│  │     ├─ README.md
│  │     ├─ select.tsx
│  │     ├─ separator.tsx
│  │     ├─ sheet.tsx
│  │     ├─ tabs.tsx
│  │     └─ textarea.tsx
│  ├─ constants
│  │  ├─ helpCenterMock.ts
│  │  ├─ mockData.ts
│  │  ├─ quizSessionMock.ts
│  │  ├─ quizStartMock.ts
│  │  └─ README.md
│  ├─ hooks
│  │  ├─ README.md
│  │  ├─ useBasicWebSocket.ts
│  │  ├─ useChatWebSocket.ts
│  │  ├─ useMediaQuery.ts
│  │  ├─ useNavbarScroll.ts
│  │  ├─ usePasswordVisibility.ts
│  │  ├─ useQuizAttempt.ts
│  │  └─ useQuizTimer.ts
│  ├─ lib
│  │  ├─ api.ts
│  │  ├─ formatter.ts
│  │  ├─ quizAttemptStorage.ts
│  │  ├─ README.md
│  │  └─ utils.ts
│  ├─ README.md
│  ├─ store
│  │  ├─ README.md
│  │  ├─ useAuthStore.ts
│  │  ├─ useProgressStore.ts
│  │  └─ useUIStore.ts
│  └─ types
│     ├─ help-center.ts
│     ├─ index.ts
│     ├─ quiz start.ts
│     └─ README.md
├─ tailwind.config.ts
├─ tsconfig.json
└─ workflow-git.md

```
