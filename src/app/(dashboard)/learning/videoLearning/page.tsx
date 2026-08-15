// file: src/app/(dashboard)/learning/videoLearning/page.tsx
"use client";

import React from "react";
import FadeIn from "@/components/atoms/framer/FadeIn";
import { Heading, Text } from "@/components/atoms/Typography";
import AiVideoSummary from "@/components/organisms/AIVideo";
import LessonSidebar from "@/components/organisms/lessonSideBar";
import { Clock, Award } from "lucide-react";

// --- DUMMY DATA ---
const MOCK_LESSON = {
  title: "Pengenalan Tata Surya & Planet Terdalam",
  subject: "Sains / IPA Kelas 5",
  duration: "12:45",
  videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  summary:
    "Dalam video pembelajaran ini, kita mempelajari struktur dasar Tata Surya kita yang berpusat pada Matahari. Kita mengulas karakteristik 4 planet dalam (Merkurius, Venus, Bumi, dan Mars) serta bagaimana gravitasi menjaga keseimbangan orbit masing-masing planet.",
  keyPoints: [
    "Matahari merupakan pusat Tata Surya dengan massa terbesar.",
    "Planet dalam terdiri dari Merkurius, Venus, Bumi, dan Mars yang memiliki permukaan padat/batuan.",
    "Bumi adalah satu-satunya planet yang terbukti memiliki kehidupan dan air cair di permukaan.",
    "Mars memiliki warna merah khas akibat kandungan besi oksida di permukaannya.",
  ],
  keywords: ["TataSurya", "PlanetDalam", "Gravitasi", "Matahari", "Bumi"],
  takeaways: [
    {
      id: "t1",
      timestamp: "01:20",
      title: "Pusat Tata Surya",
      description: "Penjelasan mengapa matahari menjadi pusat rotasi seluruh benda langit.",
      isCompleted: true,
    },
    {
      id: "t2",
      timestamp: "04:45",
      title: "Karakteristik Planet Batuan",
      description: "Perbedaan struktur planet dalam (batuan) vs planet luar (gas).",
      isCompleted: true,
    },
    {
      id: "t3",
      timestamp: "08:15",
      title: "Atmosfer & Zona Layak Huni",
      description: "Mengapa Bumi aman untuk makhluk hidup dibandingkan Venus dan Mars.",
      isCompleted: false,
    },
  ],
  quiz: {
    id: "q1",
    question: "Planet manakah yang dikenal sebagai 'Planet Merah' karena lapisan besi oksida?",
    options: ["Merkurius", "Venus", "Mars", "Jupiter"],
    correctAnswer: 2,
  },
};

export default function VideoLessonsPage() {
  const handleJumpToTimestamp = (timestamp: string) => {
    console.log(`Lompat ke timestamp: ${timestamp}`);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FD] p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        
        {/* HEADER LESSON */}
        <FadeIn direction="down" duration={0.4}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-[24px] p-6 border border-slate-200/80 shadow-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-[#5D44D8]">
                  {MOCK_LESSON.subject}
                </span>
                <span className="flex items-center gap-1 text-xs font-semibold text-slate-400">
                  <Clock className="h-3.5 w-3.5" />
                  {MOCK_LESSON.duration}
                </span>
              </div>
              <Heading level={1} variant="headline-medium" className="text-slate-900">
                {MOCK_LESSON.title}
              </Heading>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-xl bg-amber-50 px-3 py-2 border border-amber-200 text-amber-700 text-xs font-bold">
                <Award className="h-4 w-4 text-amber-500" />
                Dapatkan 50 XP Selesai Nonton
              </div>
            </div>
          </div>
        </FadeIn>

        {/* MAIN GRID LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* UTAMA (KIRI/TENGAH) - VIDEO & AI SUMMARY */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Pemutar Video */}
            <FadeIn direction="up" duration={0.5}>
              <div className="relative overflow-hidden rounded-[24px] bg-slate-900 shadow-lg">
                <div className="relative aspect-video w-full bg-slate-950 flex items-center justify-center">
                  <iframe
                    src={MOCK_LESSON.videoUrl}
                    title={MOCK_LESSON.title}
                    className="h-full w-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            </FadeIn>

            {/* AI Summary Section (Di Bawah Video) */}
            <FadeIn direction="up" delay={0.1} duration={0.5}>
              <AiVideoSummary
                summaryText={MOCK_LESSON.summary}
                keyPoints={MOCK_LESSON.keyPoints}
                keywords={MOCK_LESSON.keywords}
              />
            </FadeIn>

          </div>

          {/* SIDEBAR (KANAN) - TAKEAWAYS & POP QUIZ */}
          <div className="lg:col-span-1">
            <FadeIn direction="left" delay={0.2} duration={0.5}>
              <LessonSidebar
                takeaways={MOCK_LESSON.takeaways}
                quiz={MOCK_LESSON.quiz}
                onJumpToTimestamp={handleJumpToTimestamp}
              />
            </FadeIn>
          </div>

        </div>

      </div>
    </div>
  );
}