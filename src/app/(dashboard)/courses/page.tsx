"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Heading, Text } from "@/components/atoms/Typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Plus,
  CheckCircle2,
  Loader2,
  Trash2,
  Layers,
  Video,
  PlayCircle,
  HelpCircle,
  Sparkles,
  X,
  FileQuestion,
  ShieldAlert,
} from "lucide-react";
import {
  courseApi,
  moduleApi,
  videoApi,
  quizApi,
  CourseItem,
  ModuleItem,
  VideoItem,
  VideoConceptItem,
  QuizItem,
} from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";

export default function CoursesManagerPage() {
  const { user } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  // 1. Course State
  const [courseTitle, setCourseTitle] = useState("Algoritma dan Struktur Data");
  const [courseDescription, setCourseDescription] = useState(
    "Kursus fundamental algoritma sorting, searching, dan struktur data untuk pemula."
  );
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [isCreatingCourse, setIsCreatingCourse] = useState(false);
  const [deletingCourseId, setDeletingCourseId] = useState<string | null>(null);

  // 2. Module State
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [moduleTitle, setModuleTitle] = useState("Modul 1: Sorting Algorithms");
  const [orderIndex, setOrderIndex] = useState<number>(1);
  const [modules, setModules] = useState<ModuleItem[]>([]);
  const [isCreatingModule, setIsCreatingModule] = useState(false);
  const [deletingModuleId, setDeletingModuleId] = useState<string | null>(null);

  // 3. Video State
  const [selectedModuleId, setSelectedModuleId] = useState<string>("");
  const [videoTitle, setVideoTitle] = useState("Pengenalan Bubble Sort & Time Complexity");
  const [videoUrl, setVideoUrl] = useState("https://www.youtube.com/watch?v=example123");
  const [videoOrderIndex, setVideoOrderIndex] = useState<number>(1);
  const [concepts, setConcepts] = useState<VideoConceptItem[]>([
    {
      title: "Bubble Sort Algorithm",
      description: "Comparison-based sorting with O(n^2) time complexity.",
    },
  ]);
  const [conceptTitleInput, setConceptTitleInput] = useState("");
  const [conceptDescInput, setConceptDescInput] = useState("");
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [isCreatingVideo, setIsCreatingVideo] = useState(false);
  const [deletingVideoId, setDeletingVideoId] = useState<string | null>(null);

  // 4. Quiz State
  const [quizType, setQuizType] = useState<"mcq" | "essay">("mcq");
  const [quizQuestion, setQuizQuestion] = useState("Apa kompleksitas waktu terburuk dari Bubble Sort?");
  const [mcqOptionA, setMcqOptionA] = useState("A) O(n)");
  const [mcqOptionB, setMcqOptionB] = useState("B) O(log n)");
  const [mcqOptionC, setMcqOptionC] = useState("C) O(n^2)");
  const [mcqOptionD, setMcqOptionD] = useState("D) O(1)");
  const [expectedAnswer, setExpectedAnswer] = useState("C) O(n^2)");
  const [essayRubric, setEssayRubric] = useState("Siswa harus menyebutkan perbandingan nested loop bernilai n*(n-1)/2.");
  const [misconceptionA, setMisconceptionA] = useState("Linear time hanya terjadi pada array yang sudah terurut sempurna.");
  const [misconceptionB, setMisconceptionB] = useState("Logarithmic time adalah ciri khas divide-and-conquer seperti binary search.");
  const [misconceptionC, setMisconceptionC] = useState("Quadratic time adalah untuk nested comparison loop.");
  const [misconceptionD, setMisconceptionD] = useState("Konstan hanya untuk pengaksesan elemen langsung.");
  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
  const [isCreatingQuiz, setIsCreatingQuiz] = useState(false);
  const [deletingQuizId, setDeletingQuizId] = useState<string | null>(null);

  // Status Banners
  const [statusMsg, setStatusMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Fetch Courses
  const fetchCourses = async () => {
    try {
      const data = await courseApi.getCourses();
      if (Array.isArray(data)) {
        setCourses(data);
        if (data.length > 0 && !selectedCourseId) {
          setSelectedCourseId(data[0].id || "");
        }
      }
    } catch (err: any) {
      console.warn("Could not fetch courses:", err.message);
    }
  };

  // Fetch Modules for Selected Course
  const fetchModules = async (cid: string) => {
    if (!cid) {
      setModules([]);
      setSelectedModuleId("");
      return;
    }
    try {
      const data = await moduleApi.getModules(cid);
      if (Array.isArray(data)) {
        setModules(data);
        if (data.length > 0) {
          setSelectedModuleId(data[0].id || "");
        } else {
          setSelectedModuleId("");
        }
      }
    } catch (err: any) {
      console.warn("Could not fetch modules:", err.message);
    }
  };

  // Fetch Videos for Selected Module
  const fetchVideos = async (mid: string) => {
    if (!mid) {
      setVideos([]);
      return;
    }
    try {
      const data = await videoApi.getVideos(mid);
      if (Array.isArray(data)) {
        setVideos(data);
      }
    } catch (err: any) {
      console.warn("Could not fetch videos:", err.message);
    }
  };

  // Fetch Quizzes for Selected Module
  const fetchQuizzes = async (mid: string) => {
    if (!mid) {
      setQuizzes([]);
      return;
    }
    try {
      const data = await quizApi.getQuizzes({ module_id: mid });
      if (Array.isArray(data)) {
        setQuizzes(data);
      }
    } catch (err: any) {
      console.warn("Could not fetch quizzes:", err.message);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourseId) {
      fetchModules(selectedCourseId);
    }
  }, [selectedCourseId]);

  useEffect(() => {
    if (selectedModuleId) {
      fetchVideos(selectedModuleId);
      fetchQuizzes(selectedModuleId);
    } else {
      setVideos([]);
      setQuizzes([]);
    }
  }, [selectedModuleId]);

  // Handle Create Course
  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle.trim()) return;

    setIsCreatingCourse(true);
    setErrorMsg("");
    setStatusMsg("");

    try {
      const res = await courseApi.createCourse({
        title: courseTitle.trim(),
        description: courseDescription.trim(),
      });

      setStatusMsg(`Kursus "${res.title}" berhasil dibuat!`);
      if (res.id) setSelectedCourseId(res.id);
      fetchCourses();
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal membuat kursus.");
    } finally {
      setIsCreatingCourse(false);
    }
  };

  // Handle Delete Course
  const handleDeleteCourse = async (id: string, title: string) => {
    if (!id || deletingCourseId) return;

    setDeletingCourseId(id);
    setErrorMsg("");
    setStatusMsg("");

    try {
      await courseApi.deleteCourse(id);
      setStatusMsg(`Kursus "${title}" berhasil dihapus!`);
      if (selectedCourseId === id) setSelectedCourseId("");
      fetchCourses();
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal menghapus kursus.");
    } finally {
      setDeletingCourseId(null);
    }
  };

  // Handle Create Module
  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseId || !moduleTitle.trim()) return;

    setIsCreatingModule(true);
    setErrorMsg("");
    setStatusMsg("");

    try {
      const res = await moduleApi.createModule({
        course_id: selectedCourseId,
        title: moduleTitle.trim(),
        order_index: Number(orderIndex) || 1,
      });

      setStatusMsg(`Modul "${res.title}" berhasil dibuat!`);
      setOrderIndex((prev) => prev + 1);
      fetchModules(selectedCourseId);
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal membuat modul.");
    } finally {
      setIsCreatingModule(false);
    }
  };

  // Handle Delete Module
  const handleDeleteModule = async (id: string, title: string) => {
    if (!id || deletingModuleId) return;

    setDeletingModuleId(id);
    setErrorMsg("");
    setStatusMsg("");

    try {
      await moduleApi.deleteModule(id);
      setStatusMsg(`Modul "${title}" berhasil dihapus!`);
      fetchModules(selectedCourseId);
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal menghapus modul.");
    } finally {
      setDeletingModuleId(null);
    }
  };

  // Add Concept to List
  const handleAddConcept = () => {
    if (!conceptTitleInput.trim()) return;
    setConcepts((prev) => [
      ...prev,
      {
        title: conceptTitleInput.trim(),
        description: conceptDescInput.trim() || "Concept explanation",
      },
    ]);
    setConceptTitleInput("");
    setConceptDescInput("");
  };

  // Remove Concept from List
  const handleRemoveConcept = (idx: number) => {
    setConcepts((prev) => prev.filter((_, i) => i !== idx));
  };

  // Handle Create Video
  const handleCreateVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedModuleId || !videoTitle.trim() || !videoUrl.trim()) return;

    setIsCreatingVideo(true);
    setErrorMsg("");
    setStatusMsg("");

    try {
      const res = await videoApi.createVideo({
        module_id: selectedModuleId,
        title: videoTitle.trim(),
        video_url: videoUrl.trim(),
        order_index: Number(videoOrderIndex) || 1,
        kb_concepts: concepts,
      });

      setStatusMsg(`Video "${res.title}" berhasil ditambahkan ke modul!`);
      setVideoOrderIndex((prev) => prev + 1);
      fetchVideos(selectedModuleId);
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal membuat video.");
    } finally {
      setIsCreatingVideo(false);
    }
  };

  // Handle Delete Video
  const handleDeleteVideo = async (id: string, title: string) => {
    if (!id || deletingVideoId) return;

    setDeletingVideoId(id);
    setErrorMsg("");
    setStatusMsg("");

    try {
      await videoApi.deleteVideo(id);
      setStatusMsg(`Video "${title}" berhasil dihapus!`);
      fetchVideos(selectedModuleId);
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal menghapus video.");
    } finally {
      setDeletingVideoId(null);
    }
  };

  // Handle Create Quiz
  const handleCreateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedModuleId || !quizQuestion.trim() || !expectedAnswer.trim()) return;

    setIsCreatingQuiz(true);
    setErrorMsg("");
    setStatusMsg("");

    try {
      const payload: any = {
        module_id: selectedModuleId,
        question: quizQuestion.trim(),
        question_type: quizType,
        expected_answer: expectedAnswer.trim(),
      };

      if (quizType === "mcq") {
        payload.options = [mcqOptionA.trim(), mcqOptionB.trim(), mcqOptionC.trim(), mcqOptionD.trim()];
        const miscs: Record<string, string> = {};
        if (expectedAnswer !== mcqOptionA && misconceptionA.trim()) miscs["A"] = misconceptionA.trim();
        if (expectedAnswer !== mcqOptionB && misconceptionB.trim()) miscs["B"] = misconceptionB.trim();
        if (expectedAnswer !== mcqOptionC && misconceptionC.trim()) miscs["C"] = misconceptionC.trim();
        if (expectedAnswer !== mcqOptionD && misconceptionD.trim()) miscs["D"] = misconceptionD.trim();
        payload.misconceptions = miscs;
      } else {
        payload.rubric = essayRubric.trim();
      }

      const res = await quizApi.createQuiz(payload);
      setStatusMsg(`Kuis "${res.question.slice(0, 30)}..." berhasil ditambahkan!`);
      fetchQuizzes(selectedModuleId);
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal membuat kuis.");
    } finally {
      setIsCreatingQuiz(false);
    }
  };

  // Handle Delete Quiz
  const handleDeleteQuiz = async (id: string, questionText: string) => {
    if (!id || deletingQuizId) return;

    setDeletingQuizId(id);
    setErrorMsg("");
    setStatusMsg("");

    try {
      await quizApi.deleteQuiz(id);
      setStatusMsg(`Kuis berhasil dihapus!`);
      fetchQuizzes(selectedModuleId);
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal menghapus kuis.");
    } finally {
      setDeletingQuizId(null);
    }
  };

  if (mounted && user?.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center">
        <div className="w-16 h-16 rounded-3xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mb-4 shadow-sm">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <Heading level={2} variant="headline-medium" className="mb-2 text-slate-800">
          Admin Access Required
        </Heading>
        <Text variant="muted" className="text-sm max-w-md mb-6 leading-relaxed">
          Halaman Course & Module Management hanya dapat diakses oleh pengguna dengan role <strong>Admin</strong>. Role akun Anda saat ini: <span className="font-mono uppercase font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{user?.role || "student"}</span>.
        </Text>
        <Link
          href="/learning/courses"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
        >
          <BookOpen className="w-4 h-4" />
          <span>Kembali ke Course Catalog</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full font-sans max-w-5xl mx-auto space-y-8 p-4 md:p-6 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm">
        <div>
          <Heading level={1} variant="headline-medium" className="text-slate-900 mb-1">
            Pengelola Kursus, Modul, Video & Kuis
          </Heading>
          <Text variant="muted" className="text-sm">
            Kelola struktur pembelajaran terstruktur mulai dari Kursus, Modul, Video hingga Kuis Evaluasi AI.
          </Text>
        </div>

        <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200 text-xs font-bold px-3 py-1.5 self-start md:self-auto">
          Admin Curriculum Manager
        </Badge>
      </div>

      {/* Global Status Banner */}
      {statusMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{statusMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
          {errorMsg}
        </div>
      )}

      {/* SECTION 1: COURSE CREATION & LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Form Create Course */}
        <div className="bg-white rounded-[24px] p-6 border border-slate-200/80 shadow-sm space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <Heading level={2} variant="h5" className="text-slate-900 text-base font-bold">
              1. Buat Kursus Baru
            </Heading>
          </div>

          <form onSubmit={handleCreateCourse} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Judul Kursus (*title)
              </label>
              <Input
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                placeholder="Judul Kursus..."
                className="rounded-xl border-slate-200 text-sm font-medium h-10"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Deskripsi Kursus (*description)
              </label>
              <Textarea
                value={courseDescription}
                onChange={(e) => setCourseDescription(e.target.value)}
                placeholder="Deskripsi singkat..."
                rows={2}
                className="rounded-xl border-slate-200 text-sm font-medium resize-none"
              />
            </div>

            <Button
              type="submit"
              disabled={isCreatingCourse || !courseTitle.trim()}
              className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-10 text-xs shadow-md shadow-indigo-600/20 cursor-pointer"
            >
              {isCreatingCourse ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Membuat Kursus...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Plus className="w-3.5 h-3.5" />
                  Buat Kursus
                </span>
              )}
            </Button>
          </form>
        </div>

        {/* Existing Courses List */}
        <div className="bg-white rounded-[24px] p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <Heading level={2} variant="h5" className="text-slate-900 text-base font-bold flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              Daftar Kursus ({courses.length})
            </Heading>
          </div>

          <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
            {courses.length === 0 ? (
              <Text variant="muted" className="text-xs italic">
                Belum ada kursus. Buat kursus pertama di sebelah kiri!
              </Text>
            ) : (
              courses.map((c) => {
                const isSelected = c.id === selectedCourseId;
                return (
                  <div
                    key={c.id || c.title}
                    onClick={() => c.id && setSelectedCourseId(c.id)}
                    className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? "bg-indigo-50/80 border-indigo-300 ring-2 ring-indigo-500/20"
                        : "bg-slate-50 hover:bg-slate-100 border-slate-200/70"
                    }`}
                  >
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900 truncate">{c.title}</span>
                        {isSelected && (
                          <Badge className="bg-indigo-600 text-white border-none text-[9px] font-bold">
                            Selected
                          </Badge>
                        )}
                      </div>
                      {c.id && (
                        <p className="font-mono text-[10px] text-slate-400 truncate">ID: {c.id}</p>
                      )}
                    </div>

                    {c.id && (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCourse(c.id!, c.title);
                        }}
                        disabled={deletingCourseId === c.id}
                        variant="ghost"
                        className="h-7 px-2 rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-50 text-[11px] font-semibold cursor-pointer shrink-0"
                      >
                        {deletingCourseId === c.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                      </Button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* SECTION 2: MODULE CREATION & LIST FOR SELECTED COURSE */}
      <div className="bg-white rounded-[24px] p-6 md:p-8 border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            <div>
              <Heading level={2} variant="h4" className="text-slate-900 text-lg font-bold">
                2. Buat Modul Materi
              </Heading>
              <Text variant="muted" className="text-xs">
                Pilih kursus induk lalu tentukan urutan modul pembelajaran
              </Text>
            </div>
          </div>

          {selectedCourseId && (
            <Badge className="bg-indigo-100 text-indigo-800 border-none font-mono text-xs px-3 py-1 font-bold">
              course_id: {selectedCourseId.slice(0, 8)}...
            </Badge>
          )}
        </div>

        {courses.length === 0 ? (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium">
            ⚠️ Buat kursus terlebih dahulu di atas sebelum menambahkan modul!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            
            {/* Form Create Module */}
            <form onSubmit={handleCreateModule} className="space-y-4 bg-slate-50/70 p-5 rounded-2xl border border-slate-200/70">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Pilih Kursus (*course_id)
                </label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} ({c.id?.slice(0, 8)}...)
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Judul Modul (*title)
                </label>
                <Input
                  value={moduleTitle}
                  onChange={(e) => setModuleTitle(e.target.value)}
                  placeholder="Contoh: Modul 1: Sorting Algorithms"
                  className="rounded-xl border-slate-200 text-sm font-medium h-10 bg-white"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Urutan Modul (*order_index)
                </label>
                <Input
                  type="number"
                  min={1}
                  value={orderIndex}
                  onChange={(e) => setOrderIndex(Number(e.target.value))}
                  className="rounded-xl border-slate-200 text-sm font-medium h-10 bg-white"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isCreatingModule || !selectedCourseId || !moduleTitle.trim()}
                className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-10 text-xs shadow-md shadow-indigo-600/20 cursor-pointer"
              >
                {isCreatingModule ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Membuat Modul...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Plus className="w-3.5 h-3.5" />
                    Buat Modul
                  </span>
                )}
              </Button>
            </form>

            {/* List Modules for Selected Course */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Daftar Modul ({modules.length})
                </span>
                <span className="text-[11px] text-slate-400 font-medium">Modul Kursus Terpilih</span>
              </div>

              {modules.length === 0 ? (
                <Text variant="muted" className="text-xs italic py-4 block text-center">
                  Belum ada modul untuk kursus ini.
                </Text>
              ) : (
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {modules.map((m) => {
                    const isSelected = m.id === selectedModuleId;
                    return (
                      <div
                        key={m.id || m.title}
                        onClick={() => m.id && setSelectedModuleId(m.id)}
                        className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                          isSelected
                            ? "bg-indigo-50/80 border-indigo-300 ring-2 ring-indigo-500/20"
                            : "bg-slate-50 hover:bg-slate-100 border-slate-200/70"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold shrink-0">
                            #{m.order_index}
                          </span>
                          <div className="min-w-0">
                            <p className="font-bold text-xs text-slate-900 truncate">{m.title}</p>
                            {m.id && (
                              <p className="font-mono text-[10px] text-slate-400 truncate">ID: {m.id}</p>
                            )}
                          </div>
                        </div>

                        {m.id && (
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteModule(m.id!, m.title);
                            }}
                            disabled={deletingModuleId === m.id}
                            variant="ghost"
                            className="h-7 px-2 rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-50 text-[11px] font-semibold cursor-pointer shrink-0"
                          >
                            {deletingModuleId === m.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        )}
      </div>

      {/* SECTION 3: VIDEO CREATION & LIST FOR SELECTED MODULE */}
      <div className="bg-white rounded-[24px] p-6 md:p-8 border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-indigo-600" />
            <div>
              <Heading level={2} variant="h4" className="text-slate-900 text-lg font-bold">
                3. Tambah Video Materi
              </Heading>
              <Text variant="muted" className="text-xs">
                Sematkan video pembelajaran YouTube beserta konsep materi yang dipelajari
              </Text>
            </div>
          </div>

          {selectedModuleId && (
            <Badge className="bg-emerald-100 text-emerald-800 border-none font-mono text-xs px-3 py-1 font-bold">
              module_id: {selectedModuleId.slice(0, 8)}...
            </Badge>
          )}
        </div>

        {!selectedModuleId ? (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium">
            ⚠️ Pilih atau buat modul terlebih dahulu di atas sebelum menambahkan materi video!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            
            {/* Form Create Video */}
            <form onSubmit={handleCreateVideo} className="space-y-4 bg-slate-50/70 p-5 rounded-2xl border border-slate-200/70">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Pilih Modul (*module_id)
                </label>
                <select
                  value={selectedModuleId}
                  onChange={(e) => setSelectedModuleId(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {modules.map((m) => (
                    <option key={m.id} value={m.id}>
                      #{m.order_index} {m.title} ({m.id?.slice(0, 8)}...)
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Judul Video (*title)
                </label>
                <Input
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  placeholder="Contoh: Pengenalan Bubble Sort"
                  className="rounded-xl border-slate-200 text-sm font-medium h-10 bg-white"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  URL Video (*video_url)
                </label>
                <Input
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="rounded-xl border-slate-200 text-sm font-medium h-10 bg-white"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Urutan Video (*order_index)
                </label>
                <Input
                  type="number"
                  min={1}
                  value={videoOrderIndex}
                  onChange={(e) => setVideoOrderIndex(Number(e.target.value))}
                  className="rounded-xl border-slate-200 text-sm font-medium h-10 bg-white"
                  required
                />
              </div>

              {/* Concept Tags Builder */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-indigo-600" />
                    Konsep Materi (kb_concepts)
                  </label>
                </div>

                <div className="flex flex-col gap-2">
                  <Input
                    value={conceptTitleInput}
                    onChange={(e) => setConceptTitleInput(e.target.value)}
                    placeholder="Judul Konsep (contoh: Bubble Sort)"
                    className="rounded-xl border-slate-200 text-xs h-9 bg-white"
                  />
                  <div className="flex gap-2">
                    <Input
                      value={conceptDescInput}
                      onChange={(e) => setConceptDescInput(e.target.value)}
                      placeholder="Deskripsi ringkas konsep..."
                      className="rounded-xl border-slate-200 text-xs h-9 bg-white"
                    />
                    <Button
                      type="button"
                      onClick={handleAddConcept}
                      disabled={!conceptTitleInput.trim()}
                      className="h-9 px-3 rounded-xl bg-slate-800 text-white text-xs font-bold shrink-0 cursor-pointer"
                    >
                      + Tambah
                    </Button>
                  </div>
                </div>

                {concepts.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {concepts.map((c, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-800 text-[11px] font-medium"
                      >
                        <strong>{c.title}</strong>
                        <button
                          type="button"
                          onClick={() => handleRemoveConcept(i)}
                          className="hover:text-rose-600 ml-1 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <Button
                type="submit"
                disabled={isCreatingVideo || !selectedModuleId || !videoTitle.trim()}
                className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-10 text-xs shadow-md shadow-indigo-600/20 cursor-pointer"
              >
                {isCreatingVideo ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Menyimpan Video...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Plus className="w-3.5 h-3.5" />
                    Tambah Video
                  </span>
                )}
              </Button>
            </form>

            {/* List Videos for Selected Module */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Daftar Video ({videos.length})
                </span>
                <span className="text-[11px] text-slate-400 font-medium">Video Modul Terpilih</span>
              </div>

              {videos.length === 0 ? (
                <Text variant="muted" className="text-xs italic py-4 block text-center">
                  Belum ada video untuk modul ini.
                </Text>
              ) : (
                <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                  {videos.map((v) => (
                    <div
                      key={v.id || v.title}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-start justify-between gap-3"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold shrink-0 mt-0.5">
                          <PlayCircle className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 space-y-1">
                          <p className="font-bold text-xs text-slate-900 truncate">
                            #{v.order_index} {v.title}
                          </p>
                          <p className="font-mono text-[10px] text-indigo-600 truncate">{v.video_url}</p>
                          {v.kb_concepts && v.kb_concepts.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-0.5">
                              {v.kb_concepts.map((c, idx) => (
                                <Badge
                                  key={idx}
                                  className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-[9px] font-normal px-1.5 py-0"
                                >
                                  {c.title}
                                </Badge>
                              ))}
                            </div>
                          )}
                          {v.id && (
                            <p className="font-mono text-[9px] text-slate-400">ID: {v.id}</p>
                          )}
                        </div>
                      </div>

                      {v.id && (
                        <Button
                          onClick={() => handleDeleteVideo(v.id!, v.title)}
                          disabled={deletingVideoId === v.id}
                          variant="ghost"
                          className="h-7 px-2 rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-50 text-[11px] font-semibold cursor-pointer shrink-0"
                        >
                          {deletingVideoId === v.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}
      </div>

      {/* SECTION 4: QUIZ CREATION & LIST FOR SELECTED MODULE */}
      <div className="bg-white rounded-[24px] p-6 md:p-8 border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-indigo-600" />
            <div>
              <Heading level={2} variant="h4" className="text-slate-900 text-lg font-bold">
                4. Tambah Kuis & Evaluasi AI
              </Heading>
              <Text variant="muted" className="text-xs">
                Mendukung Pilihan Ganda (MCQ) & Esai Singkat untuk evaluasi DeepTutor AI (+10 Coins)
              </Text>
            </div>
          </div>

          {selectedModuleId && (
            <Badge className="bg-amber-100 text-amber-800 border-none font-mono text-xs px-3 py-1 font-bold">
              module_id: {selectedModuleId.slice(0, 8)}...
            </Badge>
          )}
        </div>

        {!selectedModuleId ? (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium">
            ⚠️ Pilih atau buat modul terlebih dahulu di atas sebelum menambahkan kuis!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            
            {/* Form Create Quiz */}
            <form onSubmit={handleCreateQuiz} className="space-y-4 bg-slate-50/70 p-5 rounded-2xl border border-slate-200/70">
              
              {/* Module Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Pilih Modul (*module_id)
                </label>
                <select
                  value={selectedModuleId}
                  onChange={(e) => setSelectedModuleId(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {modules.map((m) => (
                    <option key={m.id} value={m.id}>
                      #{m.order_index} {m.title} ({m.id?.slice(0, 8)}...)
                    </option>
                  ))}
                </select>
              </div>

              {/* Type Switcher */}
              <div className="flex items-center gap-2 p-1 bg-slate-200/80 rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    setQuizType("mcq");
                    setExpectedAnswer(mcqOptionC);
                  }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    quizType === "mcq"
                      ? "bg-white text-indigo-700 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Pilihan Ganda (MCQ)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setQuizType("essay");
                    setExpectedAnswer("Squaring ensures positive loss gradients.");
                  }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    quizType === "essay"
                      ? "bg-white text-indigo-700 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Esai Singkat (Essay)
                </button>
              </div>

              {/* Question Text */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Pertanyaan (*question)
                </label>
                <Textarea
                  value={quizQuestion}
                  onChange={(e) => setQuizQuestion(e.target.value)}
                  placeholder="Ketik pertanyaan kuis..."
                  rows={2}
                  className="rounded-xl border-slate-200 text-sm font-medium bg-white resize-none"
                  required
                />
              </div>

              {/* MCQ Fields */}
              {quizType === "mcq" ? (
                <div className="space-y-4 pt-2 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                      Opsi & Pemetaan Miskonsepsi (*options & misconceptions)
                    </label>
                    <span className="text-[10px] text-indigo-600 font-semibold">
                      Pilih opsi yang benar di bawah
                    </span>
                  </div>

                  {/* Option A */}
                  <div className={`p-3 rounded-xl border space-y-2 transition-all ${
                    expectedAnswer === mcqOptionA ? "bg-emerald-50/60 border-emerald-300" : "bg-white border-slate-200"
                  }`}>
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        id="radioA"
                        name="correctOpt"
                        checked={expectedAnswer === mcqOptionA}
                        onChange={() => setExpectedAnswer(mcqOptionA)}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <label htmlFor="radioA" className="text-xs font-bold text-slate-800 flex-1 flex items-center justify-between">
                        <span>Opsi A {expectedAnswer === mcqOptionA && <span className="text-emerald-600 font-bold ml-1.5">✓ Kunci Jawaban</span>}</span>
                      </label>
                    </div>
                    <Input
                      value={mcqOptionA}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (expectedAnswer === mcqOptionA) setExpectedAnswer(val);
                        setMcqOptionA(val);
                      }}
                      placeholder="Teks Opsi A..."
                      className="rounded-lg border-slate-200 text-xs h-8 bg-white"
                      required
                    />
                    {expectedAnswer !== mcqOptionA && (
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-amber-700 uppercase flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                          Miskonsepsi jika siswa memilih Opsi A (DeepTutor L2):
                        </label>
                        <Input
                          value={misconceptionA}
                          onChange={(e) => setMisconceptionA(e.target.value)}
                          placeholder="Alasan mengapa Opsi A adalah kesalahan konsep..."
                          className="rounded-lg border-amber-200 text-[11px] h-7 bg-amber-50/40"
                        />
                      </div>
                    )}
                  </div>

                  {/* Option B */}
                  <div className={`p-3 rounded-xl border space-y-2 transition-all ${
                    expectedAnswer === mcqOptionB ? "bg-emerald-50/60 border-emerald-300" : "bg-white border-slate-200"
                  }`}>
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        id="radioB"
                        name="correctOpt"
                        checked={expectedAnswer === mcqOptionB}
                        onChange={() => setExpectedAnswer(mcqOptionB)}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <label htmlFor="radioB" className="text-xs font-bold text-slate-800 flex-1 flex items-center justify-between">
                        <span>Opsi B {expectedAnswer === mcqOptionB && <span className="text-emerald-600 font-bold ml-1.5">✓ Kunci Jawaban</span>}</span>
                      </label>
                    </div>
                    <Input
                      value={mcqOptionB}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (expectedAnswer === mcqOptionB) setExpectedAnswer(val);
                        setMcqOptionB(val);
                      }}
                      placeholder="Teks Opsi B..."
                      className="rounded-lg border-slate-200 text-xs h-8 bg-white"
                      required
                    />
                    {expectedAnswer !== mcqOptionB && (
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-amber-700 uppercase flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                          Miskonsepsi jika siswa memilih Opsi B (DeepTutor L2):
                        </label>
                        <Input
                          value={misconceptionB}
                          onChange={(e) => setMisconceptionB(e.target.value)}
                          placeholder="Alasan mengapa Opsi B adalah kesalahan konsep..."
                          className="rounded-lg border-amber-200 text-[11px] h-7 bg-amber-50/40"
                        />
                      </div>
                    )}
                  </div>

                  {/* Option C */}
                  <div className={`p-3 rounded-xl border space-y-2 transition-all ${
                    expectedAnswer === mcqOptionC ? "bg-emerald-50/60 border-emerald-300" : "bg-white border-slate-200"
                  }`}>
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        id="radioC"
                        name="correctOpt"
                        checked={expectedAnswer === mcqOptionC}
                        onChange={() => setExpectedAnswer(mcqOptionC)}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <label htmlFor="radioC" className="text-xs font-bold text-slate-800 flex-1 flex items-center justify-between">
                        <span>Opsi C {expectedAnswer === mcqOptionC && <span className="text-emerald-600 font-bold ml-1.5">✓ Kunci Jawaban</span>}</span>
                      </label>
                    </div>
                    <Input
                      value={mcqOptionC}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (expectedAnswer === mcqOptionC) setExpectedAnswer(val);
                        setMcqOptionC(val);
                      }}
                      placeholder="Teks Opsi C..."
                      className="rounded-lg border-slate-200 text-xs h-8 bg-white"
                      required
                    />
                    {expectedAnswer !== mcqOptionC && (
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-amber-700 uppercase flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                          Miskonsepsi jika siswa memilih Opsi C (DeepTutor L2):
                        </label>
                        <Input
                          value={misconceptionC}
                          onChange={(e) => setMisconceptionC(e.target.value)}
                          placeholder="Alasan mengapa Opsi C adalah kesalahan konsep..."
                          className="rounded-lg border-amber-200 text-[11px] h-7 bg-amber-50/40"
                        />
                      </div>
                    )}
                  </div>

                  {/* Option D */}
                  <div className={`p-3 rounded-xl border space-y-2 transition-all ${
                    expectedAnswer === mcqOptionD ? "bg-emerald-50/60 border-emerald-300" : "bg-white border-slate-200"
                  }`}>
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        id="radioD"
                        name="correctOpt"
                        checked={expectedAnswer === mcqOptionD}
                        onChange={() => setExpectedAnswer(mcqOptionD)}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <label htmlFor="radioD" className="text-xs font-bold text-slate-800 flex-1 flex items-center justify-between">
                        <span>Opsi D {expectedAnswer === mcqOptionD && <span className="text-emerald-600 font-bold ml-1.5">✓ Kunci Jawaban</span>}</span>
                      </label>
                    </div>
                    <Input
                      value={mcqOptionD}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (expectedAnswer === mcqOptionD) setExpectedAnswer(val);
                        setMcqOptionD(val);
                      }}
                      placeholder="Teks Opsi D..."
                      className="rounded-lg border-slate-200 text-xs h-8 bg-white"
                      required
                    />
                    {expectedAnswer !== mcqOptionD && (
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-amber-700 uppercase flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                          Miskonsepsi jika siswa memilih Opsi D (DeepTutor L2):
                        </label>
                        <Input
                          value={misconceptionD}
                          onChange={(e) => setMisconceptionD(e.target.value)}
                          placeholder="Alasan mengapa Opsi D adalah kesalahan konsep..."
                          className="rounded-lg border-amber-200 text-[11px] h-7 bg-amber-50/40"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Essay Fields */
                <div className="space-y-3 pt-2 border-t border-slate-200">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                      Jawaban Acuan / Model (*expected_answer)
                    </label>
                    <Textarea
                      value={expectedAnswer}
                      onChange={(e) => setExpectedAnswer(e.target.value)}
                      placeholder="Jawaban acuan yang benar..."
                      rows={2}
                      className="rounded-xl border-slate-200 text-xs bg-white resize-none"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                      Rubrik Penilaian AI (*rubric)
                    </label>
                    <Textarea
                      value={essayRubric}
                      onChange={(e) => setEssayRubric(e.target.value)}
                      placeholder="Kriteria penilaian esai untuk DeepTutor..."
                      rows={2}
                      className="rounded-xl border-slate-200 text-xs bg-white resize-none"
                      required
                    />
                  </div>
                </div>
              )}

              <Button
                type="submit"
                disabled={isCreatingQuiz || !selectedModuleId || !quizQuestion.trim()}
                className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-10 text-xs shadow-md shadow-indigo-600/20 cursor-pointer"
              >
                {isCreatingQuiz ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Menyimpan Kuis...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Plus className="w-3.5 h-3.5" />
                    Tambah Kuis
                  </span>
                )}
              </Button>
            </form>

            {/* List Quizzes for Selected Module */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Daftar Kuis ({quizzes.length})
                </span>
                <span className="text-[11px] text-slate-400 font-medium">Kuis Modul Terpilih</span>
              </div>

              {quizzes.length === 0 ? (
                <Text variant="muted" className="text-xs italic py-4 block text-center">
                  Belum ada kuis untuk modul ini.
                </Text>
              ) : (
                <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                  {quizzes.map((q) => {
                    const rawOptions = typeof q.options === "string" ? JSON.parse(q.options) : q.options;
                    const rawMisconceptions = typeof q.misconceptions === "string" ? JSON.parse(q.misconceptions) : q.misconceptions;

                    return (
                      <div
                        key={q.id || q.question}
                        className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2.5"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 min-w-0">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 text-amber-800 text-xs font-bold shrink-0 mt-0.5">
                              <FileQuestion className="w-4 h-4" />
                            </div>
                            <div className="min-w-0 space-y-1">
                              <div className="flex items-center gap-2">
                                <Badge className={`border-none text-[9px] font-bold uppercase px-2 py-0.5 ${
                                  q.question_type === "essay"
                                    ? "bg-purple-100 text-purple-700"
                                    : "bg-amber-100 text-amber-800"
                                }`}>
                                  {q.question_type}
                                </Badge>
                                <span className="font-bold text-xs text-slate-900 truncate">
                                  {q.question}
                                </span>
                              </div>

                              {Array.isArray(rawOptions) && rawOptions.length > 0 && (
                                <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-600 pt-1">
                                  {rawOptions.map((opt: string, idx: number) => (
                                    <span
                                      key={idx}
                                      className={`truncate px-2 py-1 rounded text-xs ${
                                        opt === q.expected_answer
                                          ? "bg-emerald-100 text-emerald-800 font-bold border border-emerald-200"
                                          : "bg-white border border-slate-200/60"
                                      }`}
                                    >
                                      {opt} {opt === q.expected_answer && "✓"}
                                    </span>
                                  ))}
                                </div>
                              )}

                              {q.question_type === "essay" && (
                                <p className="text-[11px] text-slate-600">
                                  <strong>Kunci Acuan:</strong> {q.expected_answer}
                                </p>
                              )}

                              {/* Misconceptions Mapping Display */}
                              {rawMisconceptions && typeof rawMisconceptions === "object" && Object.keys(rawMisconceptions).length > 0 && (
                                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200/70 text-[11px] space-y-1 mt-2">
                                  <span className="font-bold text-amber-900 flex items-center gap-1 text-[10px] uppercase">
                                    <Sparkles className="w-3 h-3 text-amber-600" />
                                    Pemetaan Miskonsepsi (DeepTutor L2 Memory):
                                  </span>
                                  {Object.entries(rawMisconceptions).map(([key, val]) => (
                                    <div key={key} className="flex items-start gap-1.5 text-amber-900">
                                      <Badge className="bg-amber-200 text-amber-900 border-none text-[9px] font-bold px-1.5 py-0 shrink-0 mt-0.5">
                                        Opsi {key}
                                      </Badge>
                                      <span className="leading-tight text-[11px]">{String(val)}</span>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {q.id && (
                                <p className="font-mono text-[9px] text-slate-400 pt-1">ID: {q.id}</p>
                              )}
                            </div>
                          </div>

                          {q.id && (
                            <Button
                              onClick={() => handleDeleteQuiz(q.id!, q.question)}
                              disabled={deletingQuizId === q.id}
                              variant="ghost"
                              className="h-7 px-2 rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-50 text-[11px] font-semibold cursor-pointer shrink-0"
                            >
                              {deletingQuizId === q.id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <Trash2 className="w-3.5 h-3.5" />
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
