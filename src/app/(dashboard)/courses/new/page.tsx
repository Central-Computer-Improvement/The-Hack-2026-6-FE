"use client";

import React, { useState, useEffect } from "react";
import { Heading, Text } from "@/components/atoms/Typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Plus, CheckCircle2, Loader2, Trash2 } from "lucide-react";
import { courseApi, CourseItem } from "@/lib/api";

export default function CreateCoursePage() {
  const [title, setTitle] = useState("Algoritma dan Struktur Data");
  const [description, setDescription] = useState(
    "Kursus fundamental algoritma sorting, searching, dan struktur data untuk pemula."
  );

  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [createdCourse, setCreatedCourse] = useState<CourseItem | null>(null);
  const [statusMsg, setStatusMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [existingCourses, setExistingCourses] = useState<CourseItem[]>([]);

  const fetchCourses = async () => {
    try {
      const data = await courseApi.getCourses();
      if (Array.isArray(data)) {
        setExistingCourses(data);
      }
    } catch (err: any) {
      console.warn("Could not fetch courses:", err.message);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsLoading(true);
    setErrorMsg("");
    setStatusMsg("");
    setCreatedCourse(null);

    try {
      const res = await courseApi.createCourse({
        title: title.trim(),
        description: description.trim(),
      });

      setCreatedCourse(res);
      setStatusMsg(`Kursus "${res.title}" berhasil dibuat!`);
      fetchCourses();
    } catch (err: any) {
      console.error("Create course error:", err);
      setErrorMsg(err.message || "Gagal membuat kursus baru.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (courseId: string, courseTitle: string) => {
    if (!courseId || deletingId) return;

    setDeletingId(courseId);
    setErrorMsg("");
    setStatusMsg("");

    try {
      await courseApi.deleteCourse(courseId);
      setStatusMsg(`Kursus "${courseTitle}" berhasil dihapus!`);
      setCreatedCourse(null);
      fetchCourses();
    } catch (err: any) {
      console.error("Delete course error:", err);
      setErrorMsg(err.message || "Gagal menghapus kursus.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="w-full font-sans max-w-4xl mx-auto space-y-8 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm">
        <div>
          <Heading level={1} variant="headline-medium" className="text-slate-900 mb-1">
            Buat & Kelola Kursus
          </Heading>
          <Text variant="muted" className="text-sm">
            Buat kursus baru dan kelola seluruh kurikulum pembelajaran terstruktur.
          </Text>
        </div>

        <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200 text-xs font-bold px-3 py-1.5 self-start md:self-auto">
          Course Management
        </Badge>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-[24px] p-6 md:p-8 border border-slate-200/80 shadow-sm space-y-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Judul Kursus (*title)
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Algoritma dan Struktur Data"
              className="rounded-xl border-slate-200 h-11 text-sm font-medium focus:ring-indigo-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Deskripsi Kursus (*description)
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Deskripsi singkat mengenai isi dan tujuan kursus..."
              rows={3}
              className="rounded-xl border-slate-200 text-sm font-medium focus:ring-indigo-500 resize-none"
            />
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {statusMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{statusMsg}</span>
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading || !title.trim()}
            className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-11 shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
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

        {/* Success Output Banner */}
        {createdCourse && (
          <div className="p-5 rounded-2xl bg-emerald-50/90 border border-emerald-200 text-emerald-900 space-y-3">
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Kursus Berhasil Dibuat!</span>
            </div>

            <div className="bg-white/80 rounded-xl p-4 border border-emerald-100 font-mono text-xs text-slate-800 space-y-1.5 overflow-x-auto">
              <div><span className="text-slate-400">id:</span> <span className="text-indigo-600 font-bold">{createdCourse.id}</span></div>
              <div><span className="text-slate-400">title:</span> "{createdCourse.title}"</div>
              <div><span className="text-slate-400">description:</span> "{createdCourse.description}"</div>
              {createdCourse.created_at && (
                <div><span className="text-slate-400">created_at:</span> {createdCourse.created_at}</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Existing Courses List with Delete Option */}
      <div className="bg-white rounded-[24px] p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <Heading level={2} variant="h5" className="text-slate-900 text-base font-bold flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            Daftar Kursus di Database ({existingCourses.length})
          </Heading>
        </div>

        {existingCourses.length === 0 ? (
          <Text variant="muted" className="text-xs italic py-2">
            Belum ada kursus di database. Gunakan form di atas untuk membuat kursus pertama!
          </Text>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {existingCourses.map((c) => (
              <div
                key={c.id || c.title}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-3 hover:border-indigo-200 transition-all flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-xs text-slate-900 line-clamp-1">{c.title}</span>
                    {c.id && (
                      <Badge className="bg-slate-200 text-slate-700 hover:bg-slate-200 border-none font-mono text-[9px] shrink-0">
                        {c.id.slice(0, 8)}...
                      </Badge>
                    )}
                  </div>
                  {c.description && (
                    <Text variant="muted" className="text-xs line-clamp-2">
                      {c.description}
                    </Text>
                  )}
                </div>

                {c.id && (
                  <div className="pt-2 border-t border-slate-200/60 flex justify-end">
                    <Button
                      onClick={() => handleDelete(c.id!, c.title)}
                      disabled={deletingId === c.id}
                      variant="ghost"
                      className="h-8 px-2.5 rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-50 font-semibold text-[11px] flex items-center gap-1.5 cursor-pointer"
                    >
                      {deletingId === c.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                      Hapus Kursus
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
