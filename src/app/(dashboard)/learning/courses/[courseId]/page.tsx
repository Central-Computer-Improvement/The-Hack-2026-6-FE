"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { Heading, Text } from "@/components/atoms/Typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Layers,
  PlayCircle,
  HelpCircle,
  ArrowLeft,
  Loader2,
  Sparkles,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Check,
  Award,
  Send,
  Bot,
  BrainCircuit,
} from "lucide-react";
import {
  userApi,
  courseApi,
  moduleApi,
  videoApi,
  quizApi,
  progressApi,
  CourseItem,
  ModuleItem,
  VideoItem,
  VideoConceptItem,
  QuizItem,
  QuizEvaluationResponse,
} from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import { useProgressStore } from "@/store/useProgressStore";

interface CoursePlayerProps {
  params: Promise<{ courseId: string }>;
}

type ActiveContent =
  | { type: "video"; data: VideoItem; moduleTitle: string; moduleId: string }
  | { type: "module_quiz"; moduleId: string; moduleTitle: string; quizzes: QuizItem[] }
  | null;

export interface QuizEvaluationDetail {
  status?: string;
  correct: boolean;
  score: number;
  feedback: string;
  misconception?: string | null;
}

export interface ModuleSessionState {
  watchedVideoIds: string[];
  userAnswers: Record<string, string>;
  isQuizSubmitted: boolean;
  evaluations?: Record<string, QuizEvaluationDetail>;
  triggeredMisconceptions: string[];
  essayFeedback: string;
  isCompleted: boolean;
}

export default function DynamicCoursePlayerPage({ params }: CoursePlayerProps) {
  const resolvedParams = use(params);
  const courseId = resolvedParams.courseId;

  const [course, setCourse] = useState<CourseItem | null>(null);
  const [modules, setModules] = useState<ModuleItem[]>([]);
  const [moduleVideos, setModuleVideos] = useState<Record<string, VideoItem[]>>({});
  const [moduleQuizzes, setModuleQuizzes] = useState<Record<string, QuizItem[]>>({});
  const [activeContent, setActiveContent] = useState<ActiveContent>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Module Sessions Map (Keyed by moduleId, backed by localStorage)
  const [moduleSessions, setModuleSessions] = useState<Record<string, ModuleSessionState>>({});
  const [isEvaluatingQuizzes, setIsEvaluatingQuizzes] = useState(false);
  const [isCompletingModule, setIsCompletingModule] = useState(false);
  const [completionSuccessMsg, setCompletionSuccessMsg] = useState<string | null>(null);

  // Current active module ID
  const activeModuleId = activeContent?.moduleId || "";
  const currentSession: ModuleSessionState = (activeModuleId && moduleSessions[activeModuleId]) || {
    watchedVideoIds: [],
    userAnswers: {},
    isQuizSubmitted: false,
    evaluations: {},
    triggeredMisconceptions: [],
    essayFeedback: "",
    isCompleted: false,
  };

  const { user } = useAuthStore();
  const [userId, setUserId] = useState<string>("");

  // Load valid user from Auth store or DB
  useEffect(() => {
    if (user?.id) {
      setUserId(user.id);
      return;
    }
    const initUser = async () => {
      if (typeof window !== "undefined") {
        const savedAuth = localStorage.getItem("auralearn_user");
        if (savedAuth) {
          try {
            const parsed = JSON.parse(savedAuth);
            if (parsed?.id) {
              setUserId(parsed.id);
              return;
            }
          } catch {}
        }
        const stored = localStorage.getItem("user_id") || localStorage.getItem("userId");
        if (stored && stored !== "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3d0b1a") {
          setUserId(stored);
          return;
        }
      }
      try {
        const users: any = await userApi.getUsers();
        if (Array.isArray(users) && users.length > 0) {
          const student = users.find((u: any) => u.role === "student") || users[0];
          if (student?.id) {
            setUserId(student.id);
          }
        }
      } catch (err) {
        console.warn("Could not fetch user list:", err);
      }
    };
    initUser();
  }, [user?.id]);

  // Helper to get actual valid user_id
  const getUserId = () => {
    return user?.id || userId || "";
  };

  // Save session state to localStorage (strictly scoped to active user)
  const saveSession = (modId: string, updated: Partial<ModuleSessionState>) => {
    const currentUid = getUserId();
    setModuleSessions((prev) => {
      const existing = prev[modId] || {
        watchedVideoIds: [],
        userAnswers: {},
        isQuizSubmitted: false,
        evaluations: {},
        triggeredMisconceptions: [],
        essayFeedback: "",
        isCompleted: false,
      };
      const merged = { ...existing, ...updated };
      if (currentUid && typeof window !== "undefined") {
        try {
          localStorage.setItem(`module_session_${currentUid}_${courseId}_${modId}`, JSON.stringify(merged));
        } catch (e) {
          console.warn("Could not save module session to localStorage:", e);
        }
      }
      return { ...prev, [modId]: merged };
    });
  };

  // Load Course and All Modules + Restore Local Sessions for Active User
  useEffect(() => {
    const loadFullCourse = async () => {
      setIsLoading(true);
      const activeUid = getUserId();

      try {
        // 1. Fetch Course details
        const courseData = await courseApi.getCourseById(courseId);
        if (courseData) setCourse(courseData);

        // 2. Fetch Modules
        const mods = await moduleApi.getModules(courseId);
        if (Array.isArray(mods)) {
          setModules(mods);

          // 3. Fetch Videos & Quizzes for each module + restore user sessions
          const vidsMap: Record<string, VideoItem[]> = {};
          const qzsMap: Record<string, QuizItem[]> = {};
          const sessionsMap: Record<string, ModuleSessionState> = {};
          let firstContent: ActiveContent = null;

          await Promise.all(
            mods.map(async (mod) => {
              if (mod.id) {
                // Restore from user-scoped localStorage
                if (activeUid && typeof window !== "undefined") {
                  try {
                    const saved = localStorage.getItem(`module_session_${activeUid}_${courseId}_${mod.id}`);
                    if (saved) sessionsMap[mod.id] = JSON.parse(saved);
                  } catch {}
                }

                try {
                  const vids = await videoApi.getVideos(mod.id);
                  if (Array.isArray(vids)) {
                    vidsMap[mod.id] = vids;
                    if (!firstContent && vids.length > 0) {
                      firstContent = {
                        type: "video",
                        data: vids[0],
                        moduleTitle: mod.title,
                        moduleId: mod.id,
                      };
                    }
                  }
                } catch {
                  vidsMap[mod.id] = [];
                }

                try {
                  const qzs = await quizApi.getQuizzes({ module_id: mod.id });
                  if (Array.isArray(qzs)) {
                    qzsMap[mod.id] = qzs;
                    if (!firstContent && qzs.length > 0) {
                      firstContent = {
                        type: "module_quiz",
                        moduleId: mod.id,
                        moduleTitle: mod.title,
                        quizzes: qzs,
                      };
                    }
                  }
                } catch {
                  qzsMap[mod.id] = [];
                }
              }
            })
          );

          // 4. Hydrate completed modules directly from MySQL /api/progress for this user
          if (activeUid) {
            try {
              const progList = await progressApi.getProgress({ user_id: activeUid, course_id: courseId });
              if (Array.isArray(progList)) {
                progList.forEach((p) => {
                  if (p.module_id && p.status === "completed") {
                    if (!sessionsMap[p.module_id]) {
                      sessionsMap[p.module_id] = {
                        watchedVideoIds: [],
                        userAnswers: {},
                        isQuizSubmitted: true,
                        evaluations: {},
                        triggeredMisconceptions: [],
                        essayFeedback: "",
                        isCompleted: true,
                      };
                    } else {
                      sessionsMap[p.module_id].isCompleted = true;
                      sessionsMap[p.module_id].isQuizSubmitted = true;
                    }
                  }
                });
              }
            } catch (pErr) {
              console.warn("Could not load MySQL course progress:", pErr);
            }
          }

          setModuleVideos(vidsMap);
          setModuleQuizzes(qzsMap);
          setModuleSessions(sessionsMap);
          if (firstContent) setActiveContent(firstContent);
        }
      } catch (err) {
        console.warn("Could not load course player data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadFullCourse();
  }, [courseId, user?.id, userId]);

  // Convert YouTube watch URL to embed URL
  const formatVideoEmbedUrl = (url: string) => {
    if (!url) return "";
    if (url.includes("youtube.com/watch?v=")) {
      return url.replace("watch?v=", "embed/");
    }
    if (url.includes("youtu.be/")) {
      return url.replace("youtu.be/", "www.youtube.com/embed/");
    }
    return url;
  };

  // Switch active content
  const handleSelectContent = (content: ActiveContent) => {
    setActiveContent(content);
    setCompletionSuccessMsg(null);
  };

  // Handle Video Track & Mark as Watched
  const handleTrackVideo = async (videoId: string) => {
    if (!activeModuleId || !videoId) return;

    // Call L1 Video Track API
    try {
      await videoApi.trackVideo(videoId, {
        user_id: getUserId(),
        course_id: courseId,
      });
    } catch (err) {
      console.warn("L1 video tracking warning:", err);
    }

    const currentWatched = currentSession.watchedVideoIds || [];
    if (!currentWatched.includes(videoId)) {
      saveSession(activeModuleId, {
        watchedVideoIds: [...currentWatched, videoId],
      });
    }
  };

  // Handle Quiz Answer Selection
  const handleQuizAnswerChange = (quizId: string, answer: string) => {
    if (currentSession.isQuizSubmitted || isEvaluatingQuizzes || !activeModuleId) return;
    const newAnswers = { ...currentSession.userAnswers, [quizId]: answer };
    saveSession(activeModuleId, { userAnswers: newAnswers });
  };

  // Handle Submit Quiz & Run Real Evaluation API for all questions
  const handleSubmitQuiz = async () => {
    if (!activeModuleId || !activeContent || activeContent.type !== "module_quiz" || isEvaluatingQuizzes) return;

    setIsEvaluatingQuizzes(true);
    setCompletionSuccessMsg(null);

    const evaluationsMap: Record<string, QuizEvaluationDetail> = {};
    const miscs: string[] = [];
    const essayFeedbacks: string[] = [];

    try {
      // Execute evaluate API for each quiz in parallel
      await Promise.all(
        activeContent.quizzes.map(async (quiz) => {
          const qId = quiz.id || "";
          const userAns = currentSession.userAnswers[qId] || "";

          if (!qId || !userAns) return;

          try {
            const res = await quizApi.evaluateQuiz(qId, {
              user_id: getUserId(),
              student_answer: userAns,
              course_id: courseId,
            });

            if (res && res.evaluation) {
              evaluationsMap[qId] = res.evaluation;
              if (res.evaluation.misconception) {
                miscs.push(res.evaluation.misconception);
              }
              if (res.evaluation.feedback) {
                if (quiz.question_type === "essay") {
                  essayFeedbacks.push(res.evaluation.feedback);
                }
              }
            }
          } catch (err: any) {
            console.warn(`Evaluation API call error on quiz ${qId}:`, err);
            // Deterministic local fallback if offline/error
            const isCorrect = userAns === quiz.expected_answer;
            evaluationsMap[qId] = {
              correct: isCorrect,
              score: isCorrect ? 1 : 0,
              feedback: isCorrect ? "Jawaban Anda tepat!" : "Jawaban belum sesuai.",
              misconception: !isCorrect
                ? typeof quiz.misconceptions === "object"
                  ? Object.values(quiz.misconceptions || {})[0]
                  : null
                : null,
            };
          }
        })
      );

      // Save to localStorage & state
      saveSession(activeModuleId, {
        isQuizSubmitted: true,
        evaluations: evaluationsMap,
        triggeredMisconceptions: miscs,
        essayFeedback: essayFeedbacks.join(" | ") || "Semua evaluasi telah diselesaikan.",
      });

      // Synchronize latest coins balance & progress in global stores
      const activeUid = getUserId();
      if (activeUid) {
        useAuthStore.getState().fetchUserProfile(activeUid);
        useProgressStore.getState().fetchUserProgress(activeUid);
      }
    } catch (err: any) {
      console.error("Quiz evaluation batch failed:", err);
    } finally {
      setIsEvaluatingQuizzes(false);
    }
  };

  // Handle Complete Module (POST /api/modules/:id/complete)
  const handleCompleteModule = async () => {
    if (!activeModuleId || isCompletingModule) return;

    setIsCompletingModule(true);
    setCompletionSuccessMsg(null);

    try {
      // 1. Gather all kb_concepts from videos in this module
      const allVids = moduleVideos[activeModuleId] || [];
      const learnedConcepts: VideoConceptItem[] = [];
      allVids.forEach((v) => {
        if (v.kb_concepts && Array.isArray(v.kb_concepts)) {
          learnedConcepts.push(...v.kb_concepts);
        }
      });

      // 2. Gather active module title
      const modObj = modules.find((m) => m.id === activeModuleId);
      const modTitle = modObj?.title || "Modul Pembelajaran";

      // 3. Dispatch POST /api/modules/:id/complete
      const activeUid = getUserId();
      await moduleApi.completeModule(activeModuleId, {
        user_id: activeUid,
        module_title: modTitle,
        learned_concepts: learnedConcepts,
        misconceptions: currentSession.triggeredMisconceptions || [],
        essay_feedback: currentSession.essayFeedback || "Semua kuis modul telah diselesaikan dengan baik.",
      });

      // 4. Update session to completed
      saveSession(activeModuleId, { isCompleted: true });
      setCompletionSuccessMsg(`🎉 Modul "${modTitle}" berhasil diselesaikan! Data pembelajaran & telemetri telah dicatat ke DeepTutor L1.`);

      // 5. Immediately sync auth store & progress store
      if (activeUid) {
        useAuthStore.getState().fetchUserProfile(activeUid);
        useProgressStore.getState().fetchUserProgress(activeUid);
      }
    } catch (err: any) {
      console.error("Failed to complete module:", err);
      alert(err.message || "Gagal menyelesaikan modul.");
    } finally {
      setIsCompletingModule(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <Text variant="muted" className="text-xs font-medium">
          Memuat modul dan konten pembelajaran...
        </Text>
      </div>
    );
  }

  return (
    <div className="w-full font-sans max-w-7xl mx-auto space-y-6 p-4 md:p-6 pb-16">
      {/* Top Navbar */}
      <div className="flex items-center justify-between bg-white rounded-[24px] p-5 px-6 border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/learning/courses"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all shrink-0 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="min-w-0">
            <Heading level={1} variant="h4" className="text-slate-900 text-lg font-bold truncate">
              {course?.title || "Player Pembelajaran"}
            </Heading>
            <Text variant="muted" className="text-xs truncate">
              {course?.description || "Pelajari video dan kuis interaktif"}
            </Text>
          </div>
        </div>

        <Link
          href="/courses"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-all shrink-0 cursor-pointer"
        >
          Kelola Konten Kursus
        </Link>
      </div>

      {/* Completion Banner */}
      {completionSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{completionSuccessMsg}</span>
          </div>
          <Badge className="bg-emerald-600 text-white border-none text-[10px] font-bold shrink-0">
            Selesai ✓
          </Badge>
        </div>
      )}

      {/* Main Grid: Syllabus Sidebar + Dynamic Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Syllabus Sidebar */}
        <div className="lg:col-span-1 bg-white rounded-[24px] p-5 border border-slate-100 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-indigo-600" />
              Silabus ({modules.length} Modul)
            </span>
          </div>

          {modules.length === 0 ? (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 text-center text-xs text-slate-400 italic">
              Belum ada modul di kursus ini.
            </div>
          ) : (
            <div className="space-y-4 max-h-[calc(100vh-14rem)] overflow-y-auto pr-1">
              {modules.map((mod) => {
                const vids = (mod.id && moduleVideos[mod.id]) || [];
                const qzs = (mod.id && moduleQuizzes[mod.id]) || [];
                const session: ModuleSessionState = (mod.id && moduleSessions[mod.id]) || {
                  watchedVideoIds: [],
                  userAnswers: {},
                  isQuizSubmitted: false,
                  evaluations: {},
                  triggeredMisconceptions: [],
                  essayFeedback: "",
                  isCompleted: false,
                };

                const isQuizActive =
                  activeContent?.type === "module_quiz" &&
                  activeContent.moduleId === mod.id;

                return (
                  <div key={mod.id || mod.title} className="space-y-2">
                    {/* Module Title Header */}
                    <div className="flex items-center justify-between px-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold shrink-0 ${
                          session.isCompleted
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-indigo-100 text-indigo-700"
                        }`}>
                          {session.isCompleted ? "✓" : mod.order_index}
                        </span>
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {mod.title}
                        </span>
                      </div>

                      {session.isCompleted && (
                        <Badge className="bg-emerald-100 text-emerald-800 border-none text-[8px] font-bold px-1.5 py-0 shrink-0">
                          Selesai
                        </Badge>
                      )}
                    </div>

                    {/* Module Items (Videos + Grouped Quiz) */}
                    <div className="space-y-1 pl-4 border-l-2 border-slate-100 ml-2.5">
                      {/* Videos */}
                      {vids.map((v) => {
                        const isVideoActive =
                          activeContent?.type === "video" &&
                          activeContent.data.id === v.id;
                        const isWatched = session.watchedVideoIds?.includes(v.id || "");

                        return (
                          <button
                            key={v.id || v.title}
                            onClick={() =>
                              handleSelectContent({
                                type: "video",
                                data: v,
                                moduleTitle: mod.title,
                                moduleId: mod.id!,
                              })
                            }
                            className={`w-full flex items-center gap-2 p-2 rounded-xl text-left text-xs transition-all cursor-pointer ${
                              isVideoActive
                                ? "bg-indigo-50 text-indigo-900 font-bold border border-indigo-200 shadow-xs"
                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                            }`}
                          >
                            <PlayCircle
                              className={`w-3.5 h-3.5 shrink-0 ${
                                isWatched
                                  ? "text-emerald-600"
                                  : isVideoActive
                                  ? "text-indigo-600"
                                  : "text-slate-400"
                              }`}
                            />
                            <span className="truncate">{v.title}</span>
                            {isWatched && (
                              <Check className="w-3 h-3 text-emerald-600 ml-auto shrink-0" />
                            )}
                          </button>
                        );
                      })}

                      {/* Grouped Single Quiz Entry */}
                      {qzs.length > 0 && (
                        <button
                          onClick={() =>
                            handleSelectContent({
                              type: "module_quiz",
                              moduleId: mod.id!,
                              moduleTitle: mod.title,
                              quizzes: qzs,
                            })
                          }
                          className={`w-full flex items-center gap-2 p-2 rounded-xl text-left text-xs transition-all cursor-pointer ${
                            isQuizActive
                              ? "bg-amber-50 text-amber-900 font-bold border border-amber-200 shadow-xs"
                              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                          }`}
                        >
                          <HelpCircle
                            className={`w-3.5 h-3.5 shrink-0 ${
                              session.isQuizSubmitted
                                ? "text-emerald-600"
                                : isQuizActive
                                ? "text-amber-600"
                                : "text-amber-500"
                            }`}
                          />
                          <span className="truncate font-semibold">
                            Kuis Evaluasi Modul
                          </span>
                          <Badge className="ml-auto text-[9px] px-1.5 py-0 bg-amber-100 text-amber-800 border-none font-bold shrink-0">
                            {qzs.length} Soal
                          </Badge>
                        </button>
                      )}

                      {vids.length === 0 && qzs.length === 0 && (
                        <p className="text-[10px] text-slate-400 italic py-1">
                          Belum ada materi
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Content Viewer */}
        <div className="lg:col-span-2 space-y-6">
          {!activeContent ? (
            <div className="bg-white rounded-[24px] p-12 border border-slate-100 shadow-sm text-center space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 mx-auto">
                <BookOpen className="w-6 h-6" />
              </div>
              <Heading level={2} variant="h5" className="text-slate-800 font-bold text-base">
                Pilih Materi Pembelajaran
              </Heading>
              <Text variant="muted" className="text-xs max-w-sm mx-auto">
                Pilih video atau kuis dari silabus di sebelah kiri untuk memulai pembelajaran.
              </Text>
            </div>
          ) : activeContent.type === "video" ? (
            /* =================== VIDEO VIEWER =================== */
            <div className="space-y-6">
              {/* Video Player Card */}
              <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-indigo-50 text-indigo-700 border-indigo-100 text-[10px] font-bold">
                        {activeContent.moduleTitle}
                      </Badge>
                      <Badge className="bg-slate-100 text-slate-600 border-none text-[10px] font-bold uppercase">
                        Video #{activeContent.data.order_index}
                      </Badge>
                    </div>
                    <Heading level={2} variant="h4" className="text-slate-900 text-lg font-bold">
                      {activeContent.data.title}
                    </Heading>
                  </div>

                  {/* Mark Watched / Track Video Button */}
                  {activeContent.data.id && (
                    <Button
                      onClick={() => handleTrackVideo(activeContent.data.id!)}
                      variant={
                        currentSession.watchedVideoIds?.includes(activeContent.data.id)
                          ? "outline"
                          : "default"
                      }
                      className={`rounded-xl text-xs font-bold h-9 px-4 flex items-center gap-2 shrink-0 cursor-pointer ${
                        currentSession.watchedVideoIds?.includes(activeContent.data.id)
                          ? "border-emerald-300 text-emerald-700 bg-emerald-50/60"
                          : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {currentSession.watchedVideoIds?.includes(activeContent.data.id)
                        ? "Sudah Ditonton"
                        : "Tandai Selesai Nonton"}
                    </Button>
                  )}
                </div>

                {/* Video Frame */}
                <div className="relative overflow-hidden rounded-[20px] bg-slate-950 shadow-md aspect-video w-full flex items-center justify-center">
                  <iframe
                    src={formatVideoEmbedUrl(activeContent.data.video_url)}
                    title={activeContent.data.title}
                    className="h-full w-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>

              {/* Concept Tags Card */}
              {activeContent.data.kb_concepts && activeContent.data.kb_concepts.length > 0 && (
                <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    Konsep Utama Materi (DeepTutor Telemetry Concepts)
                  </span>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    {activeContent.data.kb_concepts.map((c, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-1"
                      >
                        <p className="font-bold text-xs text-indigo-900">{c.title}</p>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          {c.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* =================== GROUPED MODULE QUIZ VIEWER =================== */
            <div className="bg-white rounded-[24px] p-6 md:p-8 border border-slate-100 shadow-sm space-y-8">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-5 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-amber-50 text-amber-800 border-amber-200 text-[10px] font-bold">
                      {activeContent.moduleTitle}
                    </Badge>
                    <Badge className="bg-indigo-50 text-indigo-700 border-indigo-100 text-[10px] font-bold">
                      {activeContent.quizzes.length} Soal Evaluasi
                    </Badge>
                    {currentSession.isCompleted && (
                      <Badge className="bg-emerald-100 text-emerald-800 border-none text-[10px] font-bold">
                        Modul Selesai ✓
                      </Badge>
                    )}
                  </div>
                  <Heading level={2} variant="h4" className="text-slate-900 text-lg font-bold">
                    Kuis Evaluasi Modul
                  </Heading>
                  <Text variant="muted" className="text-xs">
                    Kerjakan semua soal di bawah ini untuk menguji pemahaman konsep materi. Jawaban esai akan dievaluasi langsung oleh DeepTutor LLM Judge.
                  </Text>
                </div>

                {currentSession.isQuizSubmitted && (
                  <Button
                    onClick={() => {
                      saveSession(activeModuleId, {
                        isQuizSubmitted: false,
                        userAnswers: {},
                        evaluations: {},
                        triggeredMisconceptions: [],
                        essayFeedback: "",
                      });
                    }}
                    variant="outline"
                    className="rounded-xl border-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer self-start md:self-auto"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Ulangi Kuis
                  </Button>
                )}
              </div>

              {/* List of All Questions in the Module */}
              <div className="space-y-8">
                {activeContent.quizzes.map((quiz, qIndex) => {
                  const quizId = quiz.id || String(qIndex);
                  const userAnswer = currentSession.userAnswers[quizId] || "";
                  const evalDetail = currentSession.evaluations?.[quizId];
                  const rawOptions =
                    typeof quiz.options === "string"
                      ? JSON.parse(quiz.options)
                      : quiz.options || [];
                  const rawMisconceptions =
                    typeof quiz.misconceptions === "string"
                      ? JSON.parse(quiz.misconceptions)
                      : quiz.misconceptions;

                  const isMCQ =
                    quiz.question_type === "mcq" ||
                    (Array.isArray(rawOptions) && rawOptions.length > 0);

                  const isCorrect = evalDetail ? evalDetail.correct : userAnswer === quiz.expected_answer;

                  return (
                    <div
                      key={quizId}
                      className="p-5 rounded-2xl bg-slate-50/60 border border-slate-200/80 space-y-4"
                    >
                      {/* Question Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-800 text-white text-xs font-bold">
                            {qIndex + 1}
                          </span>
                          <Badge
                            className={`border-none text-[9px] font-bold uppercase px-2 py-0.5 ${
                              quiz.question_type === "essay"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {quiz.question_type}
                          </Badge>
                        </div>

                        {currentSession.isQuizSubmitted && evalDetail && (
                          <Badge
                            className={`border-none text-[10px] font-bold px-2.5 py-0.5 ${
                              evalDetail.correct || evalDetail.score > 0
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-rose-100 text-rose-800"
                            }`}
                          >
                            Skor: {evalDetail.score}
                          </Badge>
                        )}
                      </div>

                      {/* Question Text */}
                      <Heading
                        level={3}
                        variant="h5"
                        className="text-slate-900 text-sm font-bold leading-relaxed"
                      >
                        {quiz.question}
                      </Heading>

                      {/* Options / Essay Input */}
                      {isMCQ ? (
                        <div className="space-y-2 pt-1">
                          {rawOptions.map((opt: string, optIdx: number) => {
                            const isSelected = userAnswer === opt;
                            const isCorrectOpt = opt === quiz.expected_answer;

                            return (
                              <button
                                key={optIdx}
                                disabled={currentSession.isQuizSubmitted || isEvaluatingQuizzes}
                                onClick={() => handleQuizAnswerChange(quizId, opt)}
                                className={`w-full p-3.5 rounded-xl text-left text-xs font-semibold transition-all border flex items-center justify-between gap-3 ${
                                  currentSession.isQuizSubmitted
                                    ? isCorrectOpt
                                      ? "bg-emerald-50 border-emerald-300 text-emerald-900 ring-2 ring-emerald-500/20"
                                      : isSelected
                                      ? "bg-rose-50 border-rose-300 text-rose-900"
                                      : "bg-white border-slate-200/60 text-slate-500 opacity-60"
                                    : isSelected
                                    ? "bg-indigo-50 border-indigo-300 text-indigo-900 font-bold shadow-xs"
                                    : "bg-white hover:bg-slate-100 border-slate-200 text-slate-700 cursor-pointer"
                                }`}
                              >
                                <span>{opt}</span>
                                {currentSession.isQuizSubmitted && isCorrectOpt && (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                )}
                                {currentSession.isQuizSubmitted && isSelected && !isCorrectOpt && (
                                  <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        /* Essay Input */
                        <div className="space-y-2 pt-1">
                          <textarea
                            disabled={currentSession.isQuizSubmitted || isEvaluatingQuizzes}
                            value={userAnswer}
                            onChange={(e) => handleQuizAnswerChange(quizId, e.target.value)}
                            placeholder="Tuliskan jawaban penjelasan Anda di sini..."
                            rows={3}
                            className="w-full p-3.5 rounded-xl border border-slate-200 bg-white text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                          />
                        </div>
                      )}

                      {/* AI Evaluation in Progress Indicator */}
                      {isEvaluatingQuizzes && userAnswer && (
                        <div className="p-3 rounded-xl bg-indigo-50/80 border border-indigo-200 flex items-center gap-2.5 text-xs text-indigo-800 font-semibold animate-pulse">
                          <Loader2 className="w-4 h-4 animate-spin text-indigo-600 shrink-0" />
                          <span>
                            {quiz.question_type === "essay"
                              ? "🤖 DeepTutor LLM Judge sedang menilai esai berdasarkan rubrik..."
                              : "Mengevaluasi jawaban kuis..."}
                          </span>
                        </div>
                      )}

                      {/* Evaluated Result Card */}
                      {currentSession.isQuizSubmitted && (
                        <div className="space-y-3 pt-2">
                          {/* AI Feedback Banner (especially for Essay) */}
                          {evalDetail && evalDetail.feedback && (
                            <div className="p-4 rounded-2xl bg-indigo-50/90 border border-indigo-200/80 text-xs space-y-1.5 animate-in fade-in">
                              <div className="flex items-center gap-2 font-bold text-indigo-900">
                                <Bot className="w-4 h-4 text-indigo-600" />
                                <span>Feedback Evaluasi AI (DeepTutor):</span>
                              </div>
                              <p className="text-slate-800 leading-relaxed font-medium">
                                {evalDetail.feedback}
                              </p>
                            </div>
                          )}

                          {/* Reference Answer & Rubric */}
                          <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-xs space-y-2 animate-in fade-in">
                            <div className="flex items-center gap-2 font-bold text-amber-900">
                              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                              <span>Kunci Acuan & Rubrik:</span>
                            </div>
                            <p className="text-slate-700">
                              <strong>Kunci Jawaban:</strong> {quiz.expected_answer}
                            </p>

                            {quiz.rubric && (
                              <p className="text-slate-600">
                                <strong>Rubrik Penilaian:</strong> {quiz.rubric}
                              </p>
                            )}

                            {/* Misconceptions Mapping */}
                            {rawMisconceptions &&
                              typeof rawMisconceptions === "object" &&
                              Object.keys(rawMisconceptions).length > 0 && (
                                <div className="pt-2 border-t border-amber-200/60 space-y-1.5">
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                                    Catatan Miskonsepsi untuk Tiap Opsi:
                                  </span>
                                  {Object.entries(rawMisconceptions).map(([key, val]) => (
                                    <div
                                      key={key}
                                      className="flex items-start gap-1.5 text-amber-900 text-[11px]"
                                    >
                                      <Badge className="bg-amber-200 text-amber-900 border-none text-[9px] font-bold px-1.5 py-0 mt-0.5 shrink-0">
                                        Opsi {key}
                                      </Badge>
                                      <span>{String(val)}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Actions Footer: Submit Quiz OR Complete Module */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                {!currentSession.isQuizSubmitted ? (
                  <Button
                    onClick={handleSubmitQuiz}
                    disabled={Object.keys(currentSession.userAnswers).length === 0 || isEvaluatingQuizzes}
                    className="ml-auto rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs h-10 px-6 cursor-pointer shadow-md shadow-indigo-600/20 flex items-center gap-2"
                  >
                    {isEvaluatingQuizzes ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Mengevaluasi Kuis & Esai dengan DeepTutor AI...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Periksa Semua Jawaban Kuis ({Object.keys(currentSession.userAnswers).length}/
                        {activeContent.quizzes.length} Dijawab)
                      </>
                    )}
                  </Button>
                ) : (
                  <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-3 bg-indigo-50/70 p-4 rounded-2xl border border-indigo-200">
                    <div className="space-y-0.5">
                      <p className="font-bold text-xs text-indigo-900">
                        Kuis Modul Telah Selesai Dievaluasi oleh AI!
                      </p>
                      <p className="text-[11px] text-slate-600">
                        Kirim data penyelesaian modul ini ke DeepTutor Telemetry & MySQL Progress.
                      </p>
                    </div>

                    <Button
                      onClick={handleCompleteModule}
                      disabled={isCompletingModule || currentSession.isCompleted}
                      className={`rounded-xl font-bold text-xs h-10 px-6 cursor-pointer shadow-md transition-all flex items-center gap-2 shrink-0 ${
                        currentSession.isCompleted
                          ? "bg-emerald-600 text-white hover:bg-emerald-600 cursor-default"
                          : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20"
                      }`}
                    >
                      {isCompletingModule ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Menyimpan Progres Belajar...
                        </>
                      ) : currentSession.isCompleted ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          Modul Selesai ✓
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Selesaikan Modul
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
