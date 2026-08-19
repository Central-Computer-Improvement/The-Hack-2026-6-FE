# AuraLearn Backend API Documentation

Dokumentasi lengkap seluruh REST API Endpoint dan WebSocket Proxy untuk platform **AuraLearn Backend**.

Base URL: `http://localhost:5000` (atau `process.env.PORT`)  
WebSocket Base URL: `ws://localhost:5000`

---

## 📋 Daftar Isi Endpoint Group

1. [Autentikasi (`/api/auth`)](#1-autentikasi-apiauth)
2. [Manajemen Pengguna (`/api/users`)](#2-manajemen-pengguna-apiusers)
3. [Kursus / Courses (`/api/courses`)](#3-kursus--courses-apicourses)
4. [Modul / Modules (`/api/modules`)](#4-modul--modules-apimodules)
5. [Video Materi (`/api/videos`)](#5-video-materi-apivideos)
6. [Kuis & Evaluasi AI (`/api/quizzes`)](#6-kuis--evaluasi-ai-apiquizzes)
7. [Progres Belajar (`/api/progress`)](#7-progres-belajar-apiprogress)
8. [AI STEM Roadmap Generator (`/api/roadmap`)](#8-ai-stem-roadmap-generator-apiroadmap)
9. [Knowledge Base & RAG (`/api/knowledge`)](#9-knowledge-base--rag-apiknowledge)
10. [Pengaturan Model & 3-Layer Memory (`/api/ai`)](#10-pengaturan-model--3-layer-memory-apiai)
11. [WebSocket Real-Time Chat Proxy (`/api/chat/ws`)](#11-websocket-real-time-chat-proxy-apichatws)

---

## 1. Autentikasi (`/api/auth`)

### `POST /api/auth/google`
Verifikasi Google OAuth ID Token (`id_token`). Jika user belum terdaftar, akun student baru otomatis dibuat.

- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "id_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6..."
  }
  ```
- **Response Success (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3d0b1a",
        "name": "Budi Belajar",
        "email": "budi@auralearn.com",
        "role": "student",
        "google_id": "112233445566778899",
        "coins": 100,
        "streak": 5,
        "photo_url": "https://lh3.googleusercontent.com/a/example"
      },
      "message": "Google Login berhasil"
    }
  }
  ```

---

## 2. Manajemen Pengguna (`/api/users`)

### `POST /api/users`
Registrasi / buat pengguna baru (Password di-hash menggunakan Bcrypt).

- **Request Body**:
  ```json
  {
    "name": "Budi Belajar",
    "email": "budi@auralearn.com",
    "password": "PasswordAman123",
    "role": "student"
  }
  ```
- **Response Success (201 Created)**:
  ```json
  {
    "success": true,
    "data": {
      "id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3d0b1a",
      "name": "Budi Belajar",
      "email": "budi@auralearn.com",
      "role": "student",
      "coins": 0,
      "streak": 0,
      "photo_url": null,
      "created_at": "2026-08-18T04:00:00.000Z"
    }
  }
  ```

### `GET /api/users`
Ambil daftar seluruh pengguna.

- **Response Success (200 OK)**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3d0b1a",
        "name": "Budi Belajar",
        "email": "budi@auralearn.com",
        "role": "student",
        "coins": 10,
        "streak": 1
      }
    ]
  }
  ```

### `GET /api/users/:id`
Ambil detail satu pengguna berdasarkan UUID.

- **Response Success (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3d0b1a",
      "name": "Budi Belajar",
      "email": "budi@auralearn.com",
      "role": "student",
      "coins": 10,
      "streak": 1
    }
  }
  ```

### `PUT /api/users/:id`
Update informasi pengguna (nama, coins, streak, photo_url, password).

- **Request Body**:
  ```json
  {
    "name": "Budi Belajar Updated",
    "coins": 50,
    "streak": 3
  }
  ```
- **Response Success (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3d0b1a",
      "name": "Budi Belajar Updated",
      "coins": 50,
      "streak": 3
    }
  }
  ```

### `DELETE /api/users/:id`
Hapus pengguna berdasarkan UUID.

- **Response Success (200 OK)**:
  ```json
  {
    "success": true,
    "message": "User berhasil dihapus"
  }
  ```

---

## 3. Kursus / Courses (`/api/courses`)

### `POST /api/courses`
Buat kursus baru.

- **Request Body**:
  ```json
  {
    "title": "Algoritma dan Struktur Data",
    "description": "Kursus fundamental algoritma sorting, searching, dan struktur data untuk pemula."
  }
  ```
- **Response Success (201 Created)**:
  ```json
  {
    "success": true,
    "data": {
      "id": "1f5a3e79-c9e6-46ce-965b-4adfa8c38bdd",
      "title": "Algoritma dan Struktur Data",
      "description": "Kursus fundamental algoritma sorting, searching, dan struktur data untuk pemula.",
      "created_at": "2026-08-18T04:00:00.000Z"
    }
  }
  ```

### `GET /api/courses`
Ambil daftar semua kursus.

### `GET /api/courses/:id`
Ambil detail kursus berdasarkan UUID.

### `PUT /api/courses/:id`
Update judul atau deskripsi kursus.

### `DELETE /api/courses/:id`
Hapus kursus. (*Secara otomatis menghapus seluruh modul, video, dan kuis di dalamnya melalui database cascade*).

### `POST /api/courses/:id/reset`
Reset sesi percakapan & trace memori AI untuk kursus ini di DeepTutor.

- **Response Success (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "status": "success",
      "message": "Cleared all session messages and trace context for course_1f5a3e79-c9e6-46ce-965b-4adfa8c38bdd"
    }
  }
  ```

---

## 4. Modul / Modules (`/api/modules`)

### `POST /api/modules`
Buat modul materi di bawah kursus tertentu.

- **Request Body**:
  ```json
  {
    "course_id": "1f5a3e79-c9e6-46ce-965b-4adfa8c38bdd",
    "title": "Sorting Algorithms",
    "order_index": 1
  }
  ```
- **Response Success (201 Created)**:
  ```json
  {
    "success": true,
    "data": {
      "id": "863cac6a-51f0-4d19-88ff-ccb3ca2ffabc",
      "course_id": "1f5a3e79-c9e6-46ce-965b-4adfa8c38bdd",
      "title": "Sorting Algorithms",
      "order_index": 1
    }
  }
  ```

### `GET /api/modules`
Ambil semua modul. Mendukung opsional query filter: `GET /api/modules?course_id=UUID`.

### `GET /api/modules/:id`
Ambil detail modul berdasarkan UUID.

### `PUT /api/modules/:id`
Update judul, urutan (`order_index`), atau `course_id` modul.

### `DELETE /api/modules/:id`
Hapus modul.

### `POST /api/modules/:id/complete` (atau `POST /api/modules/complete`)
Tandai modul sebagai selesai (milestone). Mengirimkan laporan pembelajaran ke DeepTutor L1 Chat Trace (dengan judul kursus & modul yang otomatis dicari dari DB).

- **Request Body**:
  ```json
  {
    "user_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3d0b1a",
    "module_title": "Sorting Algorithms",
    "learned_concepts": [
      { "title": "Bubble Sort", "description": "O(n^2) simple comparison sort." },
      { "title": "Merge Sort", "description": "O(n log n) divide and conquer algorithm." }
    ],
    "misconceptions": [
      "Merge Sort always uses O(n log n) auxiliary space"
    ],
    "essay_feedback": "Student demonstrated solid understanding of time complexity trade-offs."
  }
  ```
- **Response Success (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "status": "success",
      "message": "Logged L1 chat trace for module completion: Sorting Algorithms"
    },
    "progress": {
      "status": "completed",
      "completed_at": "2026-08-18T04:00:00.000Z"
    }
  }
  ```

---

## 5. Video Materi (`/api/videos`)

### `POST /api/videos`
Buat materi video di bawah modul.

- **Request Body**:
  ```json
  {
    "module_id": "863cac6a-51f0-4d19-88ff-ccb3ca2ffabc",
    "title": "Pengenalan Cost Function J(w,b)",
    "video_url": "https://www.youtube.com/watch?v=example123",
    "order_index": 1,
    "kb_concepts": [
      {
        "title": "Cost Function J(w,b)",
        "description": "Measures mean squared error between model predictions and actual target values."
      }
    ]
  }
  ```

### `GET /api/videos`
Ambil semua video. Mendukung opsional query filter: `GET /api/videos?module_id=UUID`.

### `GET /api/videos/:id`
Ambil detail video berdasarkan UUID.

### `PUT /api/videos/:id`
Update informasi video.

### `DELETE /api/videos/:id`
Hapus video.

### `POST /api/videos/:id/track` (atau `POST /api/videos/track`)
Pencatatan tontonan video siswa. Otomatis mencatat konsep materi ke memori L1 DeepTutor dan memperbarui status progress siswa menjadi `in_progress`.

- **Request Body**:
  ```json
  {
    "user_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3d0b1a",
    "course_id": "1f5a3e79-c9e6-46ce-965b-4adfa8c38bdd"
  }
  ```
- **Response Success (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "video_id": "d0331b26-63f9-4a78-8271-198698e7e75c",
      "course_id": "1f5a3e79-c9e6-46ce-965b-4adfa8c38bdd",
      "module_id": "863cac6a-51f0-4d19-88ff-ccb3ca2ffabc",
      "ai_trace": { "status": "success" },
      "progress": { "status": "in_progress" }
    }
  }
  ```

---

## 6. Kuis & Evaluasi AI (`/api/quizzes`)

### `POST /api/quizzes` (Format MCQ)
Buat kuis Pilihan Ganda (MCQ).

- **Request Body**:
  ```json
  {
    "module_id": "863cac6a-51f0-4d19-88ff-ccb3ca2ffabc",
    "question": "Apa kompleksitas waktu Binary Search?",
    "question_type": "mcq",
    "options": ["A) O(n)", "B) O(log n)", "C) O(n^2)", "D) O(1)"],
    "expected_answer": "B) O(log n)",
    "misconceptions": {
      "A": "Linear search, bukan binary search.",
      "C": "Ini kompleksitas Bubble Sort.",
      "D": "Konstan hanya untuk akses array langsung."
    }
  }
  ```

### `POST /api/quizzes` (Format Esai)
Buat kuis Esai Singkat dengan rubric penilaian AI.

- **Request Body**:
  ```json
  {
    "module_id": "863cac6a-51f0-4d19-88ff-ccb3ca2ffabc",
    "question": "Jelaskan mengapa squared error digunakan dalam cost function!",
    "question_type": "essay",
    "expected_answer": "Squaring ensures negative errors cannot cancel positive ones during optimization.",
    "rubric": "Must explain why squared error prevents cancellation of negative and positive differences."
  }
  ```

### `GET /api/quizzes`
Ambil semua kuis. Mendukung filter: `GET /api/quizzes?module_id=UUID`.

### `GET /api/quizzes/:id`
Ambil detail kuis berdasarkan UUID.

### `PUT /api/quizzes/:id`
Update data kuis.

### `DELETE /api/quizzes/:id`
Hapus kuis.

### `POST /api/quizzes/:id/evaluate` (atau `POST /api/quizzes/evaluate`)
Evaluasi jawaban kuis oleh AI (MCQ via deterministic check & misconception mapping, Esai via LLM rubric judge). Memperbarui progress siswa & menambahkan **+10 Coins** jika benar.

- **Request Body (Minimal)**:
  ```json
  {
    "user_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3d0b1a",
    "student_answer": "B) O(log n)"
  }
  ```
- **Response Success (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "quiz_id": "4bcf4bad-e13a-4e34-a268-bb761ca112fc",
      "course_id": "1f5a3e79-c9e6-46ce-965b-4adfa8c38bdd",
      "module_id": "863cac6a-51f0-4d19-88ff-ccb3ca2ffabc",
      "evaluation": {
        "status": "success",
        "correct": true,
        "score": 1.0,
        "feedback": "Correct! Spot on.",
        "misconception": null
      },
      "progress": {
        "status": "completed",
        "score": 1.0
      }
    }
  }
  ```

---

## 7. Progres Belajar (`/api/progress`)

### `POST /api/progress`
Catat progress belajar pengguna secara manual.

- **Request Body**:
  ```json
  {
    "user_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3d0b1a",
    "course_id": "1f5a3e79-c9e6-46ce-965b-4adfa8c38bdd",
    "module_id": "863cac6a-51f0-4d19-88ff-ccb3ca2ffabc",
    "status": "in_progress",
    "score": null
  }
  ```

### `GET /api/progress`
Filter data progress pengguna: `GET /api/progress?user_id=UUID&course_id=UUID&module_id=UUID`.

### `GET /api/progress/:id`
Ambil satu record progress berdasarkan ID.

### `PUT /api/progress/:id`
Update status (`not_started`, `in_progress`, `completed`), skor, atau tanggal selesai (`completed_at`).

### `DELETE /api/progress/:id`
Hapus data progress.

---

## 8. AI STEM Roadmap Generator (`/api/roadmap`)

### `POST /api/roadmap/generate`
Generate kurikulum timeline pembelajaran STEM adaptif (6-10 langkah) menggunakan LLM. Jika `user_id` diberikan, roadmap otomatis disimpan ke dalam tabel database `user_roadmaps`.

- **Request Body**:
  ```json
  {
    "topic": "Machine Learning and Neural Networks for Beginners",
    "user_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3d0b1a"
  }
  ```
- **Response Success (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "topic": "Machine Learning and Neural Networks for Beginners",
      "title": "Machine Learning and Neural Networks Roadmap",
      "summary": "A structured step-by-step learning guide covering fundamentals to deep learning.",
      "roadmap": [
        {
          "step": 1,
          "title": "Linear Algebra and Matrix Operations",
          "description": "Master vectors, matrices, matrix multiplication, and dot products.",
          "estimated_hours": 8
        }
      ],
      "saved_roadmap": {
        "id": "e4a71b29-389d-482f-bfa1-9238e9182301",
        "user_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3d0b1a",
        "topic": "Machine Learning and Neural Networks for Beginners",
        "title": "Machine Learning and Neural Networks Roadmap",
        "summary": "A structured step-by-step learning guide covering fundamentals to deep learning.",
        "steps_json": [
          {
            "step": 1,
            "title": "Linear Algebra and Matrix Operations",
            "description": "Master vectors, matrices, matrix multiplication, and dot products.",
            "estimated_hours": 8
          }
        ],
        "created_at": "2026-08-18T05:53:00.000Z"
      }
    }
  }
  ```

### `GET /api/roadmap/user/:userId`
Ambil seluruh daftar roadmap pembelajaran yang tersimpan untuk pengguna tertentu berdasarkan `userId`.

- **Response Success (200 OK)**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "e4a71b29-389d-482f-bfa1-9238e9182301",
        "user_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3d0b1a",
        "topic": "Machine Learning and Neural Networks for Beginners",
        "title": "Machine Learning and Neural Networks Roadmap",
        "summary": "A structured step-by-step learning guide covering fundamentals to deep learning.",
        "steps_json": [
          {
            "step": 1,
            "title": "Linear Algebra and Matrix Operations",
            "description": "Master vectors, matrices, matrix multiplication, and dot products.",
            "estimated_hours": 8
          }
        ],
        "created_at": "2026-08-18T05:53:00.000Z"
      }
    ]
  }
  ```

---

## 9. Knowledge Base & RAG (`/api/knowledge`)

### `GET /api/knowledge`
Ambil daftar Knowledge Base (RAG vector store) yang aktif di DeepTutor.

### `POST /api/knowledge`
Buat Knowledge Base baru (mendukung upload tunggal maupun **multi-file PDF/DOCX/TXT** awal).

- **Request Format**: `multipart/form-data`
- **Form Fields**:
  - `name` (string, required): Nama Knowledge Base (contoh: `algoritma_dasar`)
  - `file` atau `files` (binary, optional): 1 atau beberapa dokumen PDF, DOCX, atau TXT (max 10MB per file)
  - `rag_provider` (string, optional): Mesin RAG (default: `"llamaindex"`)

- **Contoh JavaScript Frontend (Single / Multi-PDF Upload)**:
  ```javascript
  const formData = new FormData();
  formData.append("name", "algoritma_dasar");
  formData.append("rag_provider", "llamaindex"); // Optional (default: llamaindex)

  // Upload 1 atau banyak file PDF sekaligus
  Array.from(fileInput.files).forEach((file) => {
    formData.append("files", file);
  });

  const res = await fetch("http://localhost:5000/api/knowledge", {
    method: "POST",
    body: formData,
  });
  ```

- **Response Success (201 Created)**:
  ```json
  {
    "success": true,
    "data": {
      "message": "Knowledge base 'algoritma_dasar' created. Processing 2 files in background.",
      "name": "algoritma_dasar",
      "files": ["buku1.pdf", "buku2.pdf"],
      "task_id": "kb_init_20260818_102400_abc12345"
    }
  }
  ```

### `DELETE /api/knowledge/:kb_name`
Hapus Knowledge Base dari vector store.

### `POST /api/knowledge/:kb_name/documents/upload`
Upload dokumen tambahan (1 atau **banyak file PDF, DOCX, TXT** sekaligus) ke Knowledge Base yang sudah ada.

- **Request Format**: `multipart/form-data`
- **Form Fields**:
  - `file` atau `files` (binary, required): 1 atau beberapa dokumen PDF, DOCX, atau TXT (max 10MB per file)

- **Contoh JavaScript Frontend (Multi-PDF Upload)**:
  ```javascript
  const formData = new FormData();
  Array.from(pdfFileInput.files).forEach((file) => {
    formData.append("files", file);
  });

  const res = await fetch("http://localhost:5000/api/knowledge/algoritma_dasar/documents/upload", {
    method: "POST",
    body: formData,
  });
  ```

- **Response Success (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "message": "Uploaded 2 files. Processing in background.",
      "files": ["bab3.pdf", "bab4.pdf"],
      "task_id": "kb_upload_20260818_102405_def67890"
    }
  }
  ```

---

## 10. Pengaturan Model & 3-Layer Memory (`/api/ai`)

### `GET /api/ai/catalog`
Ambil katalog konfigurasi model LLM, Embedding, & Search yang terdaftar di DeepTutor.

### `PUT /api/ai/catalog`
Update konfigurasi model catalog.

### `DELETE /api/ai/sessions/all/clear`
Hapus seluruh riwayat percakapan sesi chat yang aktif di DeepTutor (mengosongkan daftar entitas pada tab **Snapshot** di dashboard memory).

- **Response Success (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "deleted": true,
      "count": 4
    }
  }
  ```

### `DELETE /api/ai/sessions/:id`
Hapus sesi chat tertentu berdasarkan `session_id`.

### `GET /api/ai/memory/runs/:id`
Ambil metadata dan status proses konsolidasi memori (misal: `queued`, `running`, `completed`, `failed`).

- **Response Success (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "id": "c6b08ec4a9dc4b83a9152eca685c5397",
      "layer": "L2",
      "key": "quiz",
      "mode": "update",
      "status": "completed",
      "event_count": 5
    }
  }
  ```

### `POST /api/ai/memory/runs/:id/cancel`
Batalkan proses konsolidasi memori yang sedang berjalan (`running` / `queued`).

- **Response Success (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "run_id": "c6b08ec4a9dc4b83a9152eca685c5397",
      "cancelled": true
    }
  }
  ```

### `GET /api/ai/memory/runs/:id/events`
Stream real-time progress event konsolidasi memori via **Server-Sent Events (SSE)**.

- **Query Params**: `since` (integer, default: 0 - cursor sequence event)
- **Response Header**: `Content-Type: text/event-stream`
- **Contoh Format Data SSE**:
  ```text
  data: {"seq": 0, "stage": "run_started", "run_id": "c6b0...", "mode": "update"}

  data: {"seq": 1, "stage": "trace_loaded", "surface": "quiz", "total": 2, "new": 2}

  data: {"seq": 2, "stage": "chunked", "chunks": 2, "budget": 10}
  ```

### `POST /api/ai/memory/consolidate`
Trigger konsolidasi memori 3-Layer di DeepTutor backend.

- **Request Body**:
  ```json
  {
    "layer": "l2",
    "key": "quiz"
  }
  ```
  *(Opsi `layer`: `"l2"` atau `"l3"`. Opsi `key`: `"chat"`, `"quiz"`, `"recent"`, `"profile"`)*

### `GET /api/ai/memory/:layer/:key`
Inspeksi isi dokumen memori AI (`l2/chat`, `l2/quiz`, `l3/recent`, `l3/profile`).

- **Contoh**: `GET /api/ai/memory/l2/quiz`
- **Response Success (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "layer": "l2",
      "key": "quiz",
      "content": "# Quiz Misconception Profile

- Student confuses space complexity of Merge Sort..."
    }
  }
  ```

### `POST /api/ai/memory/:layer/:key/reset`
Reset / bersihkan dokumen memori tertentu.

- **Contoh**: `POST /api/ai/memory/l2/quiz/reset`

### `GET /api/ai/memory/trace/:surface`
Inspeksi daftar event telemetri L1 yang belum dikonsolidasi untuk surface tertentu (`quiz`, `chat`, `video`).

- **Query Params**: `limit` (default: 50), `offset` (default: 0)
- **Contoh**: `GET /api/ai/memory/trace/quiz`
- **Response Success (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "surface": "quiz",
      "items": [
        {
          "id": "evt_01J...",
          "event_type": "essay_eval",
          "session_id": "course_bc9136e6-3cc9-4ec3-b057-495369c7a002",
          "created_at": "2026-08-18T05:09:37Z"
        }
      ]
    }
  }
  ```

### `DELETE /api/ai/memory/snapshot/:surface/changes`
Hapus riwayat log perubahan workspace snapshot (daftar entitas dengan tanda `+` dan `-` pada dashboard memory) untuk surface tertentu (`chat`, `quiz`, `kb`).

- **Contoh**: `DELETE /api/ai/memory/snapshot/chat/changes`
- **Response Success (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "surface": "chat",
      "cleared": true
    }
  }
  ```

### `DELETE /api/ai/memory/trace/:surface`
Hapus / bersihkan seluruh riwayat file log telemetri L1 untuk surface tertentu (`quiz`, `chat`, `video`).

- **Contoh**: `DELETE /api/ai/memory/trace/quiz`
- **Response Success (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "surface": "quiz",
      "removed_files": 2
    }
  }
  ```

---

## 11. WebSocket Real-Time Chat Proxy (`/api/chat/ws`)

WebSocket Proxy interaktif di mounted path `ws://localhost:5000/api/chat/ws`. Memforward percakapan Socratic AI Tutor secara real-time ke DeepTutor microservice.

### Tipe Pesan Client (`send`):
1. **Memulai Percakapan**:
   ```json
   {
     "type": "start_turn",
     "session_id": "course_1f5a3e79-c9e6-46ce-965b-4adfa8c38bdd",
     "user_message": "Tolong jelaskan cara kerja Quick Sort!"
   }
   ```
2. **Ping / Heartbeat**:
   ```json
   { "type": "ping" }
   ```

### Tipe Pesan Server Stream (`receive`):
- `turn_start`: Sesi turn AI dimulai.
- `text_delta`: Stream karakter / teks jawaban AI.
- `turn_complete`: Jawaban AI selesai.
- `pong`: Heartbeat response.
