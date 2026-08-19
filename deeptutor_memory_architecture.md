# DeepTutor Memory, Context, & API/WebSocket Protocol Architecture Specification

This document provides an end-to-end technical explanation of **DeepTutor**'s network communication protocol (REST API & WebSockets), short-term conversational context history, and 3-layer long-term memory engine.

---

## 🌐 1. Network & API Protocol Architecture (REST vs WebSocket)

Communication across the system is split into two distinct protocols:

1. **WebSocket Protocol (`ws://`)**: Handles real-time, interactive Socratic chat streaming between the Client, Express Proxy, and DeepTutor Microservice.
2. **REST HTTP Protocol (`http://`)**: Handles CRUD operations, telemetry event logging (L1 traces), memory inspections, and memory consolidation triggers.

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                     AuraLearn Frontend                                      │
└─────────────────────────────┬─────────────────────────────────┬─────────────────────────────┘
                              │ WebSocket                       │ REST HTTP
                              │ ws://localhost:5000/api/chat/ws │ http://localhost:5000/api/...
                              ▼                                 ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                Node.js Express Backend Proxy                                │
│   - chatProxy.js (WebSocket Upgrade & Upstream Proxy)                                       │
│   - REST Controllers (videoController, quizController, moduleController, aiSettingsController)│
└─────────────────────────────┬─────────────────────────────────┬─────────────────────────────┘
                              │ Upstream WS                     │ Upstream REST HTTP
                              │ ws://127.0.0.1:8001/api/v1/ws  │ http://127.0.0.1:8001/api/v1/...
                              ▼                                 ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                  DeepTutor AI Microservice                                  │
│   - FastAPIRouter (`/api/v1/ws`, `/api/v1/courses/...`, `/api/v1/memory/...`)                │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### 🔌 WebSocket Protocol Flow (Interactive Real-Time Socratic Chat)

The interactive chat relies on a **Bi-Directional WebSocket Connection** proxied transparently by Express.

#### A. Connection Setup & Upgrade
1. **Frontend**: Connects to `ws://localhost:5000/api/chat/ws`.
2. **Express (`chatProxy.js`)**: Listens to HTTP `upgrade` headers on `/api/chat/ws`, opens an upstream WebSocket connection to `ws://127.0.0.1:8001/api/v1/ws` (injecting `DEEPTUTOR_AUTH_TOKEN` if configured), and pipes frames bi-directionally.

#### B. Client Frame Submission (Client → Server)
When the user sends a chat message, the frontend transmits a `start_turn` JSON frame:
```json
{
  "type": "start_turn",
  "session_id": "course_1f5a3e79-c9e6-46ce-965b-4adfa8c38bdd",
  "user_message": "what is the mathematical formula?"
}
```

#### C. Server Event Stream (Server → Client)
DeepTutor processes the message and streams back a series of JSON event frames:

1. **`turn_start`**: Signals AI response generation has begun.
   ```json
   { "type": "turn_start", "turn_id": "turn_998811" }
   ```
2. **`text_delta`** (Repeated): Real-time token character streaming chunks.
   ```json
   { "type": "text_delta", "delta": "The update rule for " }
   { "type": "text_delta", "delta": "Gradient Descent is " }
   { "type": "text_delta", "delta": "\[ \theta := \theta - \alpha \nabla J(\theta) \]" }
   ```
3. **`turn_complete`**: Signals generation is complete.
   ```json
   { "type": "turn_complete", "full_text": "The update rule for Gradient Descent is..." }
   ```

---

### 📡 REST HTTP Protocol Flow (Telemetry & Memory Consolidation)

REST endpoints handle data persistence, telemetry logging, and memory triggers:

#### 1. Telemetry L1 Trace Emitting (Background Telemetry)
When a student completes an activity in AuraLearn, Express controllers execute background REST calls to DeepTutor:
- `POST /api/videos/:id/track` $ightarrow$ `POST /courses/{course_id}/track_video` (Emits `video_watched` trace).
- `POST /api/modules/:id/complete` $ightarrow$ `POST /courses/{course_id}/modules/{module_id}/complete` (Emits `module_completed` trace).
- `POST /api/quizzes/:id/evaluate` $ightarrow$ `POST /courses/{course_id}/quiz/evaluate` (Emits `mcq_correct` / `essay_eval` trace).

#### 2. Memory Consolidation Triggering
When the frontend or background cron triggers consolidation:
- **Request**: `POST http://localhost:5000/api/ai/memory/consolidate` with `{ "layer": "l2", "key": "quiz" }`.
- **Express Proxy**: Forwards request to `POST http://127.0.0.1:8001/api/v1/memory/runs/start`.
- **Response**: `{ "success": true, "data": { "run_id": "run-xyz", "status": "running" } }`.

---

## 🏗️ 2. Short-Term Session Context (In-Session Memory)

### Purpose
Allows the AI to infer implicit references, pronouns, and context from previous messages within the active chat session (e.g., inferring that *"what is the mathematical formula"* refers to *Gradient Descent* asked in the previous turn).

### Implementation & File Paths
- **Session Persistence**: `deeptutor/agents/chat/session_manager.py`
  - Stores every turn (role, content, timestamp) in SQLite DB (`data/user/workspace/chat/chat/sessions.json` or SQLite store).
- **History Retrieval**: `deeptutor/agents/chat/chat_agent.py`
  - `get_session_history(session_id)`: Fetches past messages for the given `session_id`.
  - `truncate_history()`: Truncates history to stay within `max_history_tokens` context limit.
- **Message Injection**: Appended directly to the OpenAI-style message list array:
  ```json
  [
    { "role": "user", "content": "Teach me gradient descent in python" },
    { "role": "assistant", "content": "Here is how gradient descent works in Python..." },
    { "role": "user", "content": "what is the mathematical formula?" }
  ]
  ```

---

## 🏛️ 3. Long-Term 3-Layer Memory System (Cross-Session Memory)

### Purpose
Maintains persistent student knowledge, preferences, and misconceptions across **ALL** past, present, and future chat sessions.

### Layer Hierarchy
1. **L1 (Traces)**: Raw real-time telemetry log events emitted when users watch videos, complete module milestones, or submit quiz answers.
2. **L2 (Summaries)**: Consolidated feature-level Markdown summaries:
   - `L2/chat.md`: Socratic chat conversation summaries.
   - `L2/quiz.md`: Student misconception and error patterns.
3. **L3 (Student Profile)**: Consolidated global student profile:
   - `L3/recent.md`: 7-day activity digest.
   - `L3/profile.md`: Long-term mastery profile, background, and preferred learning styles.

### Code Implementation & Injection Path
- **Turn Runtime Trigger**: `deeptutor/services/session/turn_runtime.py` (Line 1351):
  ```python
  memory_store = get_memory_store()
  memory_context = memory_store.read_l3_concat()
  ```
- **L3 File Reader**: `deeptutor/services/memory/store.py`:
  ```python
  def read_l3_concat(self) -> str:
      # Reads L3/profile.md and L3/recent.md and concatenates into unified string
  ```
- **System Prompt Assembler**: `deeptutor/agents/chat/prompt_blocks.py`:
  - Injects `memory_context` into the **System Prompt** of **EVERY** chat turn:
  ```json
  {
    "role": "system",
    "content": "You are Professor Paw, a Socratic STEM tutor.

## 👤 Student Long-Term Profile
- Mastered Topics: Linear Algebra, Python Basics
- Misconceptions: Confused parameter optimization with dataset sizing.
- Style: Prefers code examples followed by mathematical proofs."
  }
  ```

---

## ⚙️ 4. Asynchronous Memory Consolidation Pipeline

To prevent raw logs from overwhelming context limits, L1 events are consolidated asynchronously into L2 and L3:

```
┌──────────────────┐               ┌──────────────────┐               ┌──────────────────┐
│    L1 Traces     │               │   L2 Summaries   │               │    L3 Profile    │
│  (Raw Event Logs │ ────────────► │ (chat.md &       │ ────────────► │ (profile.md &    │
│   per surface)   │   LLM Worker  │  quiz.md)        │   LLM Worker  │  recent.md)      │
└──────────────────┘               └──────────────────┘               └──────────────────┘
```

- **Trigger API Endpoint**: `POST /api/ai/memory/consolidate` (Express Proxy Port 5000) $ightarrow$ `POST /api/v1/memory/runs/start` (DeepTutor Microservice Port 8001).
- **Consolidator Logic**: `deeptutor/services/memory/consolidator/modes/update.py`
  - Uses an LLM worker to analyze raw L1 events, update `L2/quiz.md`, and refine `L3/profile.md`.

---

## 📊 5. Summary Comparison Matrix

| Feature | WebSocket Real-Time Chat | REST Telemetry & Memory APIs |
|---|---|---|
| **Protocol** | Bi-directional WebSocket (`ws://`) | Synchronous HTTP (`http://`) |
| **Mounted Path** | `ws://localhost:5000/api/chat/ws` | `http://localhost:5000/api/...` |
| **Proxy Implementation** | `services/chatProxy.js` | Express Controllers & `deepTutorService.js` |
| **Data Format** | Real-time JSON Event Frames (`text_delta`) | Standard Request/Response JSON Schemas |
| **Primary Use Cases** | Interactive Socratic Tutoring, Streaming Answers | Video tracking, Quiz grading, Module completion, Memory consolidation |
