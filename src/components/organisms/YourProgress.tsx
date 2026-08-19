"use client";

import { useState, useEffect } from "react";
import { 
  Trophy, 
  TrendingUp,
  CheckCircle2,
  BookOpen,
  Calendar,
  Layers
} from "lucide-react";
import { Heading, Text } from "@/components/atoms/Typography";
import { Badge } from "@/components/ui/badge";
import FadeIn from "../atoms/framer/FadeIn";
import { useAuthStore } from "@/store/useAuthStore";
import { useProgressStore } from "@/store/useProgressStore";
import { courseApi, moduleApi, userApi, CourseItem } from "@/lib/api";

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function YourProgress() {
  const [mounted, setMounted] = useState(false);
  const { user, fetchUserProfile } = useAuthStore();
  const { progressList, fetchUserProgress } = useProgressStore();

  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [courseModuleCounts, setCourseModuleCounts] = useState<Record<string, number>>({});
  const [studentName, setStudentName] = useState<string>("Explorer");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch live user profile and progress list
  useEffect(() => {
    const initData = async () => {
      const activeUserId = user?.id;

      if (activeUserId) {
        setStudentName(user?.name || "Explorer");
        fetchUserProgress(activeUserId);
      } else {
        setStudentName("Explorer");
      }

      // Fetch real courses & module counts
      try {
        const courseData = await courseApi.getCourses();
        if (Array.isArray(courseData)) {
          setCourses(courseData);
          const counts: Record<string, number> = {};
          await Promise.all(
            courseData.map(async (c) => {
              if (c.id) {
                try {
                  const mods = await moduleApi.getModules(c.id);
                  counts[c.id] = Array.isArray(mods) ? mods.length : 1;
                } catch {
                  counts[c.id] = 1;
                }
              }
            })
          );
          setCourseModuleCounts(counts);
        }
      } catch (err) {
        console.warn("Could not load courses:", err);
      }
    };

    initData();
  }, [user?.id, fetchUserProfile, fetchUserProgress]);

  // Derived metrics from user_course_progress
  const completedCount = progressList.filter((p) => p.status === "completed").length;
  const inProgressCount = progressList.filter((p) => p.status === "in_progress").length;

  // Calculate day-of-week completions
  const dayCompletions: Record<string, number> = {
    Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0
  };

  progressList.forEach((p) => {
    if (p.completed_at) {
      try {
        const d = new Date(p.completed_at);
        const dayIdx = (d.getDay() + 6) % 7; // Monday = 0, Sunday = 6
        const dayName = DAYS_OF_WEEK[dayIdx];
        if (dayName) dayCompletions[dayName] = (dayCompletions[dayName] || 0) + 1;
      } catch {}
    }
  });

  const maxDayCount = Math.max(1, ...Object.values(dayCompletions));

  return (
    <FadeIn direction="up">
      <div className="mt-2 mb-6">
        <Heading suppressHydrationWarning level={2} variant="headline-large">
          Your Progress, {mounted ? studentName : "Explorer"}!
        </Heading>
        <Text variant="muted">
          Ringkasan aktivitas belajar dan penguasaan kurikulum materi kamu.
        </Text>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* Learning Activity Chart (Span 2) */}
        <div className="flex min-h-[300px] flex-col justify-between rounded-[24px] bg-white p-7 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 lg:col-span-2 space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-600" />
                <Text variant="label-bold" className="text-slate-800 text-sm">
                  Aktivitas Penyelesaian Modul
                </Text>
              </div>
              <Text variant="muted" className="text-xs">
                Modul selesai per hari dalam minggu ini (real timestamps)
              </Text>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 border border-indigo-100">
              <TrendingUp className="h-3.5 w-3.5" /> {completedCount} Total Selesai
            </div>
          </div>
          
          {/* Dynamic Bar Chart Area */}
          <div className="flex flex-1 items-end gap-3 justify-between border-b border-slate-100 pb-3 pt-6 min-h-[140px]">
            {DAYS_OF_WEEK.map((day) => {
              const count = dayCompletions[day] || 0;
              const barHeightPct = Math.max(12, Math.round((count / maxDayCount) * 100));
              const hasActivity = count > 0;

              return (
                <div key={day} className="flex-1 flex flex-col items-center gap-2 group">
                  {/* Tooltip / Count Label */}
                  <span className={`text-[10px] font-bold transition-opacity ${
                    hasActivity ? "text-indigo-600 opacity-100" : "text-slate-300 opacity-0 group-hover:opacity-100"
                  }`}>
                    {count > 0 ? `${count} mod` : "0"}
                  </span>

                  {/* Bar */}
                  <div className="w-full max-w-[36px] bg-slate-100 rounded-xl flex items-end h-[100px] overflow-hidden">
                    <div
                      className={`w-full rounded-xl transition-all duration-500 ${
                        hasActivity
                          ? "bg-gradient-to-t from-indigo-600 to-indigo-400 shadow-sm"
                          : "bg-slate-200/50"
                      }`}
                      style={{ height: `${barHeightPct}%` }}
                    />
                  </div>

                  {/* Day Label */}
                  <span className={`text-xs font-bold ${hasActivity ? "text-slate-800 font-extrabold" : "text-slate-400"}`}>
                    {day}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>Status Modul:</span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> {completedCount} Selesai
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> {inProgressCount} Sedang Berjalan
              </span>
            </div>
          </div>
        </div>

        {/* Mastery Stats (Kanan - Span 1) */}
        <div className="flex min-h-[300px] flex-col justify-between rounded-[24px] bg-white p-7 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100">
          <div className="flex items-center justify-between">
            <Heading variant="h6" className="text-slate-800 font-bold">Total Mastery</Heading>
            <Badge className="bg-emerald-50 text-emerald-700 border-none font-bold text-[10px]">
              Live Progress
            </Badge>
          </div>
          
          <div className="my-6 flex flex-col items-center justify-center text-center space-y-2">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 mb-1">
              <Trophy className="h-8 w-8" />
            </div>
            <Heading variant="headline-medium" className="text-3xl font-black text-slate-900 leading-tight">
              {completedCount}
            </Heading>
            <Text variant="muted" className="text-xs font-medium">
              Modul Telah Dikuasai
            </Text>
          </div>
          
          {/* Real Course Breakdown List */}
          <div className="space-y-2 pt-3 border-t border-slate-100">
            {courses.length === 0 ? (
              <p className="text-[11px] text-slate-400 text-center italic">Belum ada kursus</p>
            ) : (
              courses.slice(0, 3).map((c) => {
                const cId = c.id || "";
                const totalMods = courseModuleCounts[cId] || 1;
                const completedInCourse = progressList.filter(
                  (p) => p.course_id === cId && p.status === "completed"
                ).length;
                const pct = Math.min(100, Math.round((completedInCourse / totalMods) * 100));

                return (
                  <div key={cId} className="flex items-center justify-between text-xs">
                    <span className="text-slate-700 font-semibold truncate max-w-[130px]">
                      {c.title}
                    </span>
                    <span className="font-bold text-indigo-600 text-[11px] shrink-0">
                      {pct}% ({completedInCourse}/{totalMods})
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </FadeIn>
  );
}