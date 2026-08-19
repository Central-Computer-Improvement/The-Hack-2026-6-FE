"use client";

import { useState, useEffect } from "react";
import { 
  Flame, 
  Star, 
  Rocket, 
  BookOpen, 
  Lightbulb, 
  Trophy 
} from "lucide-react";
import { Heading, Text } from "@/components/atoms/Typography";
import FadeIn from "../atoms/framer/FadeIn";
import { useAuthStore } from "@/store/useAuthStore";
import { useProgressStore } from "@/store/useProgressStore";
import { courseApi, moduleApi, userApi, CourseItem } from "@/lib/api";

export default function RewardRoom() {
  const [mounted, setMounted] = useState(false);
  const { user, fetchUserProfile } = useAuthStore();
  const { progressList, fetchUserProgress } = useProgressStore();

  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [courseModuleCounts, setCourseModuleCounts] = useState<Record<string, number>>({});
  const [userCoins, setUserCoins] = useState<number>(0);
  const [userStreak, setUserStreak] = useState<number>(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch live user and progress
  useEffect(() => {
    const initData = async () => {
      const activeUserId = user?.id;

      if (activeUserId) {
        fetchUserProgress(activeUserId);
        try {
          const profile: any = await userApi.getUserById(activeUserId);
          if (profile) {
            setUserCoins(profile.coins ?? 0);
            setUserStreak(profile.streak_count ?? 0);
          }
        } catch {}
      }

      // Fetch real courses from database
      try {
        const courseData = await courseApi.getCourses();
        if (Array.isArray(courseData) && courseData.length > 0) {
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
        console.warn("Could not load courses for mastery stats:", err);
      }
    };

    initData();
  }, [user?.id, fetchUserProfile, fetchUserProgress]);

  const totalPoints = userCoins || user?.coins || 0;
  const currentStreak = userStreak || user?.streak_count || 0;

  const getIconForSubject = (subjectName: string, isMastered: boolean) => {
    const className = `h-8 w-8 ${isMastered ? "text-indigo-500" : "text-slate-400"}`;
    const lower = subjectName.toLowerCase();
    if (lower.includes("math") || lower.includes("matematika")) return <BookOpen className={className} />;
    if (lower.includes("science") || lower.includes("algo") || lower.includes("sort") || lower.includes("struktur")) return <Rocket className={className} />;
    if (lower.includes("history") || lower.includes("ai") || lower.includes("neural")) return <Lightbulb className={className} />;
    return <Trophy className={className} />;
  };

  // Fallback default subjects if database has 0 courses
  const displaySubjects = courses.length > 0 ? courses.map((c) => {
    const cId = c.id || "";
    const totalMods = courseModuleCounts[cId] || 1;
    const completedInCourse = progressList.filter(
      (p) => p.course_id === cId && p.status === "completed"
    ).length;
    const masteryPercentage = Math.min(100, Math.round((completedInCourse / totalMods) * 100));

    return {
      id: cId,
      subject: c.title,
      masteryPercentage,
      isNew: false,
    };
  }) : [
    { id: "1", subject: "Math & Logic", masteryPercentage: 75, isNew: false },
    { id: "2", subject: "Sorting Algorithms", masteryPercentage: progressList.filter(p => p.status === 'completed').length > 0 ? 100 : 0, isNew: true },
    { id: "3", subject: "Computer Science", masteryPercentage: 50, isNew: false },
    { id: "4", subject: "General STEM", masteryPercentage: 30, isNew: false },
  ];

  return (
    <FadeIn direction="up">
      {/* Header */}
      <div className="mt-2 mb-4">
        <Heading level={1} variant="headline-large">
          Reward Room
        </Heading>
        <Text variant="muted">
          Celebrate your achievements and see how far you have come!
        </Text>
      </div>

      {/* Two Top Cards: Total Knowledge Points & Current Learning Streak */}
      <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex items-center justify-between rounded-[24px] bg-white p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] transition-transform hover:scale-[1.02]">
          <div>
            <Heading variant="h6" className="text-slate-700 mb-2">Total Knowledge Points</Heading>
            <div className="flex items-baseline gap-2">
              <span suppressHydrationWarning className="text-[46px] font-black tracking-tight text-indigo-base leading-none">
                {mounted ? totalPoints.toLocaleString("id-ID") : "0"}
              </span>
              <span className="text-[20px] font-bold text-indigo-300">KP</span>
            </div>
          </div>
          <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-indigo-500 text-white shadow-lg shadow-indigo-500/30">
            <Star className="h-8 w-8 fill-current" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-[24px] bg-white p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] transition-transform hover:scale-[1.02]">
          <div>
            <Heading variant="h6" className="text-slate-700 mb-2">Current Learning Streak</Heading>
            <div className="flex items-baseline gap-2">
              <span suppressHydrationWarning className="text-[46px] font-black tracking-tight text-amber-base leading-none">
                {mounted ? currentStreak : "0"}
              </span>
              <span className="text-[20px] font-bold text-amber-300">Days</span>
            </div>
          </div>
          <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-red-100 text-red-500">
            <Flame className="h-10 w-10 fill-current" />
          </div>
        </div>
      </div>

      {/* Subject Mastery Progress Grid (Original Square Layout) */}
      <div>
        <Heading level={2} className="mb-6">
          Subject Mastery Progress
        </Heading>
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
          {displaySubjects.map((subject) => {
            const isMastered = subject.masteryPercentage >= 50;

            return (
              <div 
                key={subject.id} 
                className={`relative flex aspect-square flex-col items-center justify-center rounded-[24px] p-6 text-center transition-transform hover:scale-[1.03] cursor-pointer ${
                  isMastered ? "bg-white shadow-[0_4px_20px_rgb(0,0,0,0.03)]" : "bg-white/40 border border-dashed border-slate-300"
                }`}
              >
                {subject.isNew && (
                  <span className="absolute right-4 top-4 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">NEW</span>
                )}
                <div className={`mb-4 flex h-20 w-20 items-center justify-center rounded-full ${isMastered ? "bg-slate-100/80 border border-slate-100" : "bg-slate-200/50"}`}>
                  {getIconForSubject(subject.subject, isMastered)}
                </div>
                <h4 className={`text-[15px] font-extrabold truncate max-w-full ${isMastered ? "text-slate-900" : "text-slate-500"}`}>
                  {subject.subject}
                </h4>
                <p className="mb-3 text-[13px] font-medium text-slate-500">
                  Mastery: {subject.masteryPercentage}%
                </p>
                <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${isMastered ? "bg-amber-400" : "bg-indigo-base"}`} 
                    style={{ width: `${subject.masteryPercentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </FadeIn>
  );
}