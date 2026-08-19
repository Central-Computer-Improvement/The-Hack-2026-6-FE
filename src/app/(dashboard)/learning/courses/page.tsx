"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Heading, Text } from "@/components/atoms/Typography";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Search,
  Layers,
  Calendar,
  Eye,
  X,
  ArrowRight,
  Loader2,
  CheckCircle2,
  PlayCircle,
  Sparkles,
} from "lucide-react";
import {
  courseApi,
  moduleApi,
  userApi,
  progressApi,
  CourseItem,
  ModuleItem,
  UserCourseProgress,
} from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";

export default function CourseCatalogPage() {
  const { user } = useAuthStore();
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [moduleCounts, setModuleCounts] = useState<Record<string, number>>({});
  const [userProgressList, setUserProgressList] = useState<UserCourseProgress[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [selectedCourse, setSelectedCourse] = useState<CourseItem | null>(null);
  const [courseModules, setCourseModules] = useState<ModuleItem[]>([]);
  const [isLoadingModules, setIsLoadingModules] = useState(false);

  // Fetch Courses, Module Counts, and Live Progress
  useEffect(() => {
    const loadCoursesAndProgress = async () => {
      setIsLoading(true);
      try {
        // 1. Fetch Courses
        const courseData = await courseApi.getCourses();
        if (Array.isArray(courseData)) {
          setCourses(courseData);

          // 2. Fetch module counts for each course
          const counts: Record<string, number> = {};
          await Promise.all(
            courseData.map(async (c) => {
              if (c.id) {
                try {
                  const mods = await moduleApi.getModules(c.id);
                  counts[c.id] = Array.isArray(mods) ? mods.length : 0;
                } catch {
                  counts[c.id] = 0;
                }
              }
            })
          );
          setModuleCounts(counts);
        }

        // 3. Resolve active student user ID from useAuthStore
        const activeUserId: string | undefined = user?.id;

        // 4. Fetch Progress from MySQL API for active user
        if (activeUserId) {
          const prog = await progressApi.getProgress({ user_id: activeUserId });
          if (Array.isArray(prog)) {
            setUserProgressList(prog);
          } else {
            setUserProgressList([]);
          }
        } else {
          setUserProgressList([]);
        }
      } catch (err) {
        console.warn("Could not fetch courses or progress from backend:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadCoursesAndProgress();
  }, [user?.id]);

  // Open Detail Modal
  const handleOpenDetail = async (course: CourseItem) => {
    setSelectedCourse(course);
    setCourseModules([]);
    if (!course.id) return;

    setIsLoadingModules(true);
    try {
      const mods = await moduleApi.getModules(course.id);
      if (Array.isArray(mods)) {
        setCourseModules(mods);
      }
    } catch (err) {
      console.warn("Could not fetch course modules for modal:", err);
    } finally {
      setIsLoadingModules(false);
    }
  };

  // Filtered Courses
  const filteredCourses = courses.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      c.title.toLowerCase().includes(q) ||
      (c.description && c.description.toLowerCase().includes(q))
    );
  });

  return (
    <div className="w-full font-sans max-w-6xl mx-auto space-y-8 p-4 md:p-6 pb-16">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-[24px] p-6 md:p-8 border border-slate-100 shadow-sm">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-bold text-indigo-700 uppercase tracking-wider">
              Katalog Pembelajaran
            </span>
            <Badge className="bg-emerald-50 text-emerald-700 border-none font-bold text-[10px]">
              Live MySQL Progress
            </Badge>
          </div>
          <Heading level={1} variant="h4" className="text-slate-900 font-bold text-xl md:text-2xl">
            Daftar Kursus & Materi STEM
          </Heading>
          <Text variant="muted" className="text-xs md:text-sm max-w-xl">
            Pilih kursus yang ingin kamu pelajari. Setiap modul dilengkapi video pembelajaran interaktif, pencatatan konsep DeepTutor, dan kuis evaluasi AI.
          </Text>
        </div>

        <Link
          href="/courses"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all shrink-0 cursor-pointer"
        >
          Kelola Kursus & Modul
        </Link>
      </div>

      {/* Search and Stats Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Cari judul kursus atau materi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 rounded-xl bg-white border-slate-200 text-xs shadow-xs focus:ring-2 focus:ring-indigo-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
            >
              ✕
            </button>
          )}
        </div>

        <span className="text-xs font-semibold text-slate-500 self-end sm:self-auto">
          Menampilkan <strong className="text-slate-800">{filteredCourses.length}</strong> dari {courses.length} kursus
        </span>
      </div>

      {/* Course Grid */}
      {isLoading ? (
        <div className="py-16 flex flex-col items-center justify-center gap-3 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <Text variant="muted" className="text-xs font-medium">
            Memuat daftar kursus dan progres belajar dari database...
          </Text>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-[24px] border border-slate-200/80 space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 mx-auto">
            <BookOpen className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <Heading level={2} variant="h5" className="text-slate-800 font-bold text-base">
              {searchQuery ? "Kursus tidak ditemukan" : "Belum ada kursus tersedia"}
            </Heading>
            <Text variant="muted" className="text-xs max-w-md mx-auto">
              {searchQuery
                ? `Tidak ada kursus yang cocok dengan kata kunci "${searchQuery}". Coba gunakan kata kunci lain.`
                : "Belum ada kursus yang dibuat di database. Gunakan halaman Kelola Kursus untuk membuat kursus pertama!"}
            </Text>
          </div>
          {!searchQuery && (
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 shadow-md shadow-indigo-600/20"
            >
              Buat Kursus Baru
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const cId = course.id || "";
            const modCount = moduleCounts[cId] || 0;
            const completedInCourse = userProgressList.filter(
              (p) => p.course_id === cId && p.status === "completed"
            ).length;
            const inProgressInCourse = userProgressList.filter(
              (p) => p.course_id === cId && p.status === "in_progress"
            ).length;

            const progressPercentage =
              modCount > 0 ? Math.min(100, Math.round((completedInCourse / modCount) * 100)) : 0;
            const isFinished = progressPercentage === 100;
            const isStarted = completedInCourse > 0 || inProgressInCourse > 0;

            const createdDate = course.created_at
              ? new Date(course.created_at).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : "Aktif";

            return (
              <div
                key={cId || course.title}
                className="flex flex-col justify-between p-6 rounded-[24px] bg-white border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all gap-5 group"
              >
                <div className="space-y-4">
                  {/* Top Meta & Status Pill */}
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-xs">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    
                    <Badge
                      className={`text-[10px] font-bold border-none px-2.5 py-0.5 ${
                        isFinished
                          ? "bg-emerald-100 text-emerald-800"
                          : isStarted
                          ? "bg-amber-100 text-amber-800"
                          : "bg-indigo-50 text-indigo-700"
                      }`}
                    >
                      {isFinished
                        ? "Selesai ✓"
                        : isStarted
                        ? "Sedang Berjalan"
                        : `${modCount} Modul`}
                    </Badge>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1.5">
                    <Heading
                      level={2}
                      variant="h5"
                      className="text-slate-900 group-hover:text-indigo-600 transition-colors font-bold text-base line-clamp-2"
                    >
                      {course.title}
                    </Heading>
                    <Text variant="muted" className="text-xs leading-relaxed line-clamp-3">
                      {course.description || "Kursus materi interaktif dengan video pembelajaran dan kuis evaluasi."}
                    </Text>
                  </div>
                </div>

                {/* Progress Bar & Footer */}
                <div className="space-y-4 pt-3 border-t border-slate-100">
                  {/* Live Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] font-semibold text-slate-500">
                      <span>Progres Belajar</span>
                      <span className="font-bold text-indigo-600">
                        {completedInCourse}/{modCount} Modul ({progressPercentage}%)
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isFinished
                            ? "bg-emerald-500"
                            : progressPercentage > 0
                            ? "bg-indigo-600"
                            : "bg-slate-300"
                        }`}
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-slate-400 text-[11px] font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {createdDate}
                    </span>
                    <span className="flex items-center gap-1 text-slate-500 font-semibold">
                      <Layers className="w-3.5 h-3.5 text-indigo-500" />
                      {modCount} Modul
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={() => handleOpenDetail(course)}
                      variant="outline"
                      className="rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs h-9.5 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Silabus
                    </Button>
                    <Link
                      href={`/learning/courses/${course.id}`}
                      className={`rounded-xl font-bold text-xs h-9.5 flex items-center justify-center gap-1.5 transition-all shadow-xs ${
                        isStarted
                          ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20"
                          : "bg-slate-900 hover:bg-indigo-600 text-white"
                      }`}
                    >
                      {isFinished ? "Ulas Materi" : isStarted ? "Lanjutkan" : "Mulai Belajar"}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DETAIL & SYLLABUS PREVIEW MODAL */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] max-w-xl w-full p-6 md:p-8 space-y-6 shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col justify-between animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="space-y-1 min-w-0">
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-bold text-indigo-700 uppercase tracking-wider">
                  Detail Silabus Kursus
                </span>
                <Heading level={2} variant="h4" className="text-slate-900 text-lg font-bold truncate">
                  {selectedCourse.title}
                </Heading>
                {selectedCourse.id && (
                  <p className="font-mono text-[10px] text-slate-400">ID: {selectedCourse.id}</p>
                )}
              </div>

              <button
                onClick={() => setSelectedCourse(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-5 overflow-y-auto pr-1">
              {/* Description */}
              <div className="space-y-1.5 bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Deskripsi Kursus:
                </span>
                <Text variant="muted" className="text-xs leading-relaxed text-slate-700">
                  {selectedCourse.description || "Tidak ada deskripsi tambahan untuk kursus ini."}
                </Text>
              </div>

              {/* Modules List */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  Daftar Modul ({courseModules.length} Modul)
                </span>

                {isLoadingModules ? (
                  <div className="p-8 flex flex-col items-center justify-center gap-2 text-slate-400">
                    <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
                    <span className="text-xs">Memuat silabus...</span>
                  </div>
                ) : courseModules.length === 0 ? (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-400 italic">
                    Belum ada modul yang terdaftar di kursus ini.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {courseModules.map((mod, idx) => {
                      const isModCompleted = userProgressList.some(
                        (p) => p.module_id === mod.id && p.status === "completed"
                      );

                      return (
                        <div
                          key={mod.id || idx}
                          className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                              isModCompleted ? "bg-emerald-100 text-emerald-700" : "bg-indigo-100 text-indigo-700"
                            }`}>
                              {isModCompleted ? "✓" : mod.order_index}
                            </span>
                            <span className="text-xs font-bold text-slate-800 truncate">
                              {mod.title}
                            </span>
                          </div>

                          {isModCompleted ? (
                            <Badge className="bg-emerald-100 text-emerald-800 border-none text-[9px] font-bold shrink-0">
                              Selesai ✓
                            </Badge>
                          ) : (
                            <span className="text-[11px] text-slate-400 font-medium shrink-0">
                              Modul #{mod.order_index}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <Button
                onClick={() => setSelectedCourse(null)}
                variant="ghost"
                className="rounded-xl text-xs font-bold text-slate-500 cursor-pointer"
              >
                Tutup
              </Button>
              <Link
                href={`/learning/courses/${selectedCourse.id}`}
                className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs h-10 px-5 flex items-center gap-2 shadow-md shadow-indigo-600/20"
              >
                Buka Player Pembelajaran
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
