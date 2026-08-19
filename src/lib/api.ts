/**
 * Centralized REST API Client for AuraLearn Backend
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: any;
}

export async function apiFetch<T = any>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = endpoint.startsWith("http") ? endpoint : `${BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  const json: ApiResponse<T> = await response.json();

  if (!response.ok || json.success === false) {
    throw new Error(json.message || `API error (${response.status})`);
  }

  return json.data !== undefined ? json.data : (json as unknown as T);
}

// User API helpers
export const userApi = {
  getUsers: () => apiFetch("/users"),
  getUserById: (id: string) => apiFetch(`/users/${id}`),
  createUser: (userData: { name: string; email: string; password: string; role?: string }) =>
    apiFetch("/users", {
      method: "POST",
      body: JSON.stringify(userData),
    }),
  updateUser: (id: string, userData: Record<string, any>) =>
    apiFetch(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    }),
  deleteUser: (id: string) =>
    apiFetch(`/users/${id}`, {
      method: "DELETE",
    }),
};

// Progress API helpers
export interface UserCourseProgress {
  id?: number;
  user_id: string;
  course_id: string;
  module_id: string;
  status: "not_started" | "in_progress" | "completed";
  score?: number;
  completed_at?: string;
}

export const progressApi = {
  getProgress: (params?: { user_id?: string; course_id?: string; module_id?: string }) => {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return apiFetch<UserCourseProgress[]>(`/progress${query ? `?${query}` : ""}`);
  },
  recordProgress: (data: { user_id: string; course_id: string; module_id: string; status: string; score?: number }) =>
    apiFetch("/progress", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// Roadmap API helpers
export interface RoadmapStep {
  step: number;
  title: string;
  description: string;
  estimated_hours?: number;
}

export interface SavedRoadmapRecord {
  id: string;
  user_id: string;
  topic: string;
  title: string;
  summary: string;
  steps_json: RoadmapStep[];
  created_at: string;
}

export interface RoadmapData {
  topic: string;
  title: string;
  summary: string;
  roadmap: RoadmapStep[];
  saved_roadmap?: SavedRoadmapRecord;
}

export const roadmapApi = {
  generateRoadmap: (topic: string, user_id?: string) =>
    apiFetch<RoadmapData>("/roadmap/generate", {
      method: "POST",
      body: JSON.stringify({ topic, user_id }),
    }),
  getUserRoadmaps: (userId: string) =>
    apiFetch<SavedRoadmapRecord[]>(`/roadmap/user/${userId}`),
};

// Knowledge Base API helpers
export interface KnowledgeBaseItem {
  id?: string;
  name?: string;
  kb_name?: string;
  description?: string;
  rag_provider?: string;
  doc_count?: number;
  statistics?: {
    raw_documents?: number;
    rag_provider?: string;
    status?: string;
    index_versions?: Array<{
      version?: string;
      model?: string;
      doc_count?: number;
      [key: string]: any;
    }>;
    [key: string]: any;
  };
  metadata?: {
    name?: string;
    description?: string;
    last_updated?: string;
    embedding_model?: string;
    last_indexed_count?: number;
    [key: string]: any;
  };
  status?: string;
  created_at?: string;
  [key: string]: any;
}

export const knowledgeApi = {
  getKnowledgeBases: () => apiFetch<KnowledgeBaseItem[]>("/knowledge"),
  createKnowledgeBase: async (
    kb_name: string,
    files?: File[] | File,
    rag_provider: string = "llamaindex"
  ) => {
    const formData = new FormData();
    formData.append("name", kb_name);
    formData.append("rag_provider", rag_provider);

    if (files) {
      const fileList = Array.isArray(files) ? files : [files];
      fileList.forEach((file) => {
        formData.append("files", file);
      });
    }

    const response = await fetch(`${BASE_URL}/knowledge`, {
      method: "POST",
      body: formData,
    });
    const json = await response.json();
    if (!response.ok || json.success === false) {
      throw new Error(json.message || `Failed to create Knowledge Base (${response.status})`);
    }
    return json.data !== undefined ? json.data : json;
  },
  uploadMaterial: async (kb_name: string, files: File[] | File) => {
    const formData = new FormData();
    const fileList = Array.isArray(files) ? files : [files];
    fileList.forEach((file) => {
      formData.append("files", file);
    });

    const url = `${BASE_URL}/knowledge/${encodeURIComponent(kb_name)}/documents/upload`;
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });
    const json = await response.json();
    if (!response.ok || json.success === false) {
      throw new Error(json.message || `Upload failed (${response.status})`);
    }
    return json.data !== undefined ? json.data : json;
  },
  deleteKnowledgeBase: (kb_name: string) =>
    apiFetch(`/knowledge/${encodeURIComponent(kb_name)}`, {
      method: "DELETE",
    }),
};

// Courses API helpers
export interface CourseItem {
  id?: string;
  title: string;
  description?: string;
  created_at?: string;
}

export const courseApi = {
  getCourses: () => apiFetch<CourseItem[]>("/courses"),
  getCourseById: (id: string) => apiFetch<CourseItem>(`/courses/${id}`),
  createCourse: (data: { title: string; description?: string }) =>
    apiFetch<CourseItem>("/courses", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  deleteCourse: (id: string) =>
    apiFetch(`/courses/${id}`, {
      method: "DELETE",
    }),
};

// Modules API helpers
export interface ModuleItem {
  id?: string;
  course_id: string;
  title: string;
  order_index: number;
  created_at?: string;
}

export const moduleApi = {
  getModules: (courseId?: string) =>
    apiFetch<ModuleItem[]>(`/modules${courseId ? `?course_id=${courseId}` : ""}`),
  getModuleById: (id: string) => apiFetch<ModuleItem>(`/modules/${id}`),
  createModule: (data: { course_id: string; title: string; order_index: number }) =>
    apiFetch<ModuleItem>("/modules", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  deleteModule: (id: string) =>
    apiFetch(`/modules/${id}`, {
      method: "DELETE",
    }),
  completeModule: (
    id: string,
    payload: {
      user_id?: string;
      module_title?: string;
      learned_concepts?: VideoConceptItem[];
      misconceptions?: string[];
      essay_feedback?: string;
    }
  ) =>
    apiFetch<{ status: string; message: string }>(`/modules/${id}/complete`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};

// Videos API helpers
export interface VideoConceptItem {
  title: string;
  description: string;
}

export interface VideoItem {
  id?: string;
  module_id: string;
  title: string;
  video_url: string;
  order_index: number;
  kb_concepts?: VideoConceptItem[];
  created_at?: string;
}

export const videoApi = {
  getVideos: (moduleId?: string) =>
    apiFetch<VideoItem[]>(`/videos${moduleId ? `?module_id=${moduleId}` : ""}`),
  getVideoById: (id: string) => apiFetch<VideoItem>(`/videos/${id}`),
  createVideo: (data: {
    module_id: string;
    title: string;
    video_url: string;
    order_index: number;
    kb_concepts?: VideoConceptItem[];
  }) =>
    apiFetch<VideoItem>("/videos", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  deleteVideo: (id: string) =>
    apiFetch(`/videos/${id}`, {
      method: "DELETE",
    }),
  trackVideo: (
    id: string,
    payload: {
      user_id?: string;
      course_id?: string;
    }
  ) =>
    apiFetch<{ success: boolean; data: any }>(`/videos/${id}/track`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};

// Quizzes API helpers
export interface QuizItem {
  id?: string;
  module_id: string;
  question: string;
  question_type: "mcq" | "essay" | string;
  options?: string[] | string;
  expected_answer: string;
  rubric?: string;
  misconceptions?: Record<string, string> | string;
  created_at?: string;
}

export interface QuizEvaluationResponse {
  quiz_id: string;
  course_id?: string;
  module_id?: string;
  evaluation: {
    status?: string;
    correct: boolean;
    score: number;
    feedback: string;
    misconception?: string | null;
  };
  progress?: {
    id?: number;
    status: string;
    score: number;
  };
}

export const quizApi = {
  getQuizzes: (params?: { module_id?: string }) =>
    apiFetch<QuizItem[]>(`/quizzes${params?.module_id ? `?module_id=${params.module_id}` : ""}`),
  getQuizById: (id: string) => apiFetch<QuizItem>(`/quizzes/${id}`),
  createQuiz: (data: {
    module_id: string;
    question: string;
    question_type: "mcq" | "essay" | string;
    options?: string[];
    expected_answer: string;
    rubric?: string;
    misconceptions?: Record<string, string>;
  }) =>
    apiFetch<QuizItem>("/quizzes", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  deleteQuiz: (id: string) =>
    apiFetch(`/quizzes/${id}`, {
      method: "DELETE",
    }),
  evaluateQuiz: (
    id: string,
    payload: {
      user_id: string;
      student_answer: string;
      course_id?: string;
    }
  ) =>
    apiFetch<QuizEvaluationResponse>(`/quizzes/${id}/evaluate`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};

// AI Memory & Catalog API helpers
export interface MemoryContentData {
  layer: string;
  key: string;
  content: string;
  doc_id?: string;
  updated_at?: string;
}

export interface ConsolidateMemoryResponse {
  id?: string;
  layer: string;
  key: string;
  mode?: string;
  status: string;
  started_at?: string;
  error?: string | null;
}

export interface MemoryRunEvent {
  seq?: number;
  stage: string;
  run_id?: string;
  mode?: string;
  surface?: string;
  total?: number;
  new?: number;
  chunks?: number;
  budget?: number;
  model?: string;
  error?: string;
  message?: string;
  [key: string]: any;
}

export const memoryApi = {
  getMemory: (layer: "L2" | "L3" | string, key: string) =>
    apiFetch<MemoryContentData>(`/ai/memory/${layer}/${key}`),
  consolidateMemory: (data: {
    layer: string;
    key: string;
    mode?: string;
    budget?: number;
    llm_selection?: string;
  }) =>
    apiFetch<ConsolidateMemoryResponse>("/ai/memory/consolidate", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getRunStatus: (runId: string) =>
    apiFetch<{ id: string; layer: string; key: string; status: string }>(`/ai/memory/runs/${encodeURIComponent(runId)}`),
  streamRunEvents: (
    runId: string,
    onEvent: (event: MemoryRunEvent) => void,
    onError?: (err: any) => void,
    onComplete?: () => void
  ) => {
    const url = `${BASE_URL}/ai/memory/runs/${encodeURIComponent(runId)}/events`;
    const eventSource = new EventSource(url);

    eventSource.onmessage = (e) => {
      try {
        const data: MemoryRunEvent = JSON.parse(e.data);
        onEvent(data);
        if (data.stage === "run_completed" || data.stage === "run_failed") {
          eventSource.close();
          onComplete?.();
        }
      } catch (err) {
        console.warn("Error parsing SSE event data:", err, e.data);
      }
    };

    eventSource.onerror = (err) => {
      eventSource.close();
      onError?.(err);
    };

    return () => {
      eventSource.close();
    };
  },
  resetMemory: (layer: "L2" | "L3" | string, key: string) =>
    apiFetch<{ layer: string; key: string; reset: boolean }>(`/ai/memory/${layer}/${key}/reset`, {
      method: "POST",
    }),
  clearAllSessions: () =>
    apiFetch<{ deleted: boolean; count: number }>("/ai/sessions/all/clear", {
      method: "DELETE",
    }),
  deleteSession: (sessionId: string) =>
    apiFetch<{ deleted: boolean; session_id: string }>(`/ai/sessions/${encodeURIComponent(sessionId)}`, {
      method: "DELETE",
    }),
  getCatalog: () =>
    apiFetch<any>("/ai/catalog", {
      cache: "no-store",
      headers: { "Cache-Control": "no-cache" },
    }),
};
