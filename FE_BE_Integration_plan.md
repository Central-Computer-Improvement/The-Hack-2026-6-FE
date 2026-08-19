# Frontend to AuraLearn Backend API Integration Plan (Revised)

This document has been updated based on your feedback. It details the exact technical approach for integrating the frontend pages with the **AuraLearn Backend API**.

---

## 💡 Explanations & Answers to Your Questions

### Q1: What is Phase 1 (Core Authentication & Profile Management)?
Simply put, Phase 1 is about **identifying who is using the app**:
1. When a user opens the app or logs in (via Google or Email/Password), we send their credentials to `POST /api/auth/google` or `POST /api/users`.
2. The backend responds with the user's profile info (`name`, `email`, `role`, `coins`, `streak`, `avatar`).
3. We store this user profile in Zustand (`useAuthStore`) so every page in the app knows who is currently logged in, displays their name & coins at the top, and keeps them logged in even if they refresh the page.

### Q2: Why is `/api/courses/:id/reset` listed in Phase 4 (AI Study Buddy)?
The AI Study Buddy (powered by DeepTutor) remembers past conversation messages.
- The `POST /api/courses/:id/reset` endpoint is used for a **"Clear Chat" / "New Conversation" button**. When clicked, it instructs the AI backend to wipe the memory trace of that chat session so the user can start a fresh conversation topic without previous messages interfering.

### Q3: Why add a Knowledge Base (KB) Selector in Phase 4?
Adding a **Knowledge Base Selector** (dropdown menu) in the Study Buddy sidebar allows students to pick which uploaded document/subject (e.g. *"Biologi Kelas 9"*, *"Fisika Dasar"*) the AI should draw its answers from using RAG (Retrieval-Augmented Generation).
- Fetched dynamically from `GET /api/knowledge`.

### Q4: Why were `/api/videos` and `/api/videos/:id/track` in Phase 5?
In the backend API doc, video tracking was designed to log when a student watches a video lesson so the AI remembers concepts the student watched.
- **Adjustment**: Per your feedback, we will **skip video tracking** for now and focus purely on **Document/PDF/PPT Uploads** to Knowledge Bases via `POST /api/knowledge/:kb_name/upload`.

### Q5: How will Phase 6 (Quiz Session & AI Evaluation) work?
Even if quizzes were originally intended to attach to course modules, we can make the Quiz page fully interactive using the AI Evaluation endpoint:
1. When a student selects or starts a quiz on `/start-quiz`, questions are loaded into the quiz state.
2. For each question (Multiple Choice or Short Essay), when the student clicks "Submit Answer", the frontend calls `POST /api/quizzes/:id/evaluate` with `{ user_id, student_answer }`.
3. The backend AI evaluates the answer and returns:
   - `correct`: boolean (`true`/`false`)
   - `score`: `1.0` or partial score
   - `feedback`: Helpful explanation text
   - `misconception`: Detailed explanation if the student selected a common wrong answer
4. The frontend triggers immediate animations (confetti on correct answer, pop-up feedback, **+10 coins** added to user profile), and renders the detailed breakdown on `/start-quiz/result` and `/start-quiz/review`.

---

## 🎯 Revised Phased Integration Roadmap

### Phase 1: Core Authentication & Profile Management
- **Endpoints**: `POST /api/auth/google`, `POST /api/users`, `GET /api/users/:id`
- **Affected Pages**: [Auth Page (`/`)](file:///c:/Users/bob/Music/The-Hack-2026-6-FE-main/src/app/page.tsx), [Role Selection (`/roleSelection`)](file:///c:/Users/bob/Music/The-Hack-2026-6-FE-main/src/app/roleSelection/page.tsx)
- **Goal**: Connect login/registration to backend, save user state (`id`, `name`, `coins`, `streak`) in `useAuthStore`.

---

### Phase 2: Progress Dashboard & Gamification Rewards
- **Endpoints**: `GET /api/progress`, `GET /api/users/:id`
- **Affected Pages**: [Progress (`/dashboard/progress`)](file:///c:/Users/bob/Music/The-Hack-2026-6-FE-main/src/app/\(dashboard\)/dashboard/progress/page.tsx), [Rewards (`/dashboard/rewards`)](file:///c:/Users/bob/Music/The-Hack-2026-6-FE-main/src/app/\(dashboard\)/dashboard/rewards/page.tsx)
- **Goal**: Replace hardcoded mock profile stats with real user points, streak, and progress metrics.

---

### Phase 3: AI Learning Roadmap Generator
- **Endpoint**: `POST /api/roadmap/generate`
- **Affected Page**: [AI Roadmap (`/roadmap`)](file:///c:/Users/bob/Music/The-Hack-2026-6-FE-main/src/app/\(dashboard\)/roadmap/page.tsx)
- **Goal**:
  1. Add an input form on `/roadmap` for topic entry (e.g. *"Machine Learning for Beginners"*, *"Photosynthesis"*).
  2. Call `POST /api/roadmap/generate` with `{ "topic": inputTopic }`.
  3. Dynamically map the returned array of roadmap steps into the interactive purple node map UI.

---

### Phase 4: AI Study Buddy (WebSocket Streaming + KB Selector)
- **Endpoints**: `ws://localhost:5000/api/chat/ws`, `GET /api/knowledge`, `POST /api/courses/:id/reset`
- **Affected Page**: [AI Study Buddy (`/learning/study-budy`)](file:///c:/Users/bob/Music/The-Hack-2026-6-FE-main/src/app/\(dashboard\)/learning/study-budy/page.tsx)
- **Goal**:
  1. Connect chat input to WebSocket server (`ws://localhost:5000/api/chat/ws`) to render real-time streaming response chunks (`text_delta`).
  2. Add a **Knowledge Base Selector** dropdown so users can pick which uploaded document/KB context to discuss with AI.
  3. Add a **"Clear Chat"** button calling `/api/courses/:id/reset` to reset conversation context.

---

### Phase 5: Knowledge Base & Material Uploader
- **Endpoints**: `GET /api/knowledge`, `POST /api/knowledge`, `POST /api/knowledge/:kb_name/upload`
- **Affected Page**: [Material Library (`/library`)](file:///c:/Users/bob/Music/The-Hack-2026-6-FE-main/src/app/\(dashboard\)/library/page.tsx)
- **Goal**:
  1. Enable file drag & drop (PDF, DOCX, TXT max 10MB) to upload materials to backend Knowledge Base vector store.
  2. Display active Knowledge Bases in the library.

---

### Phase 6: Quiz Session & AI Evaluation Engine
- **Endpoints**: `GET /api/quizzes`, `POST /api/quizzes/:id/evaluate`
- **Affected Pages**:
  - [Quiz Start (`/start-quiz`)](file:///c:/Users/bob/Music/The-Hack-2026-6-FE-main/src/app/\(dashboard\)/start-quiz/page.tsx)
  - [Quiz Session (`/start-quiz/session`)](file:///c:/Users/bob/Music/The-Hack-2026-6-FE-main/src/app/\(dashboard\)/start-quiz/session/page.tsx)
  - [Quiz Result (`/start-quiz/result`)](file:///c:/Users/bob/Music/The-Hack-2026-6-FE-main/src/app/\(dashboard\)/start-quiz/result/page.tsx)
  - [Quiz Review (`/start-quiz/review`)](file:///c:/Users/bob/Music/The-Hack-2026-6-FE-main/src/app/\(dashboard\)/start-quiz/review/page.tsx)
- **Goal**: Send student responses to AI evaluation engine, show instant feedback + misconception guides, award coins, and display result summaries.

---

### Phase 7: AI Task Splitter (Deferred)
- *Ignored for now per user request.*

---

## 🧪 Verification Plan
1. **Build Check**: Validate TypeScript types via `npm run build`.
2. **Interactive UI Verification**: Test roadmap topic generator, WebSocket chat streaming, KB uploader, and AI quiz evaluation in local browser environment.
