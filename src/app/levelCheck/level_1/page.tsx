// file: src/app/assessment/step-1/page.tsx
"use client";

import React, { useState } from "react";
import { ArrowLeft, Sprout, GraduationCap, Flame } from "lucide-react";
import { useRouter } from "next/navigation";

// Import Komponen Design System
import { Heading, Text } from "@/components/atoms/Typography";
import { IconButton } from "@/components/atoms/IconButton";
import FadeIn from "@/components/atoms/framer/FadeIn";
import LevelProgress from "@/components/atoms/progressLevelCheck";
import LevelCard from "@/components/molecules/levelCard";

export default function LevelCheckStep1Page() {
  const router = useRouter();
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  const handleSelectLevel = (level: string) => {
    setSelectedLevel(level);

    // Transisi halus sebelum lanjut ke Step 2
    setTimeout(() => {
      router.push("/dashboard/progress"); // << ganti ke /levelCheck/step-2 jika sudah ada halaman Step 2
    }, 350);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FD] flex flex-col font-sans justify-between">
      
      {/* HEADER: Tombol Back + LevelProgress (1/3) */}
      <header className="p-6 md:p-8 flex items-center gap-4 md:gap-6 max-w-4xl mx-auto w-full">
        <FadeIn delay={0.1} direction="right">
          <IconButton
            icon={ArrowLeft}
            variant="ghost"
            onClick={() => router.back()}
            className="bg-slate-200/60 hover:bg-slate-200 text-slate-700 w-10 h-10 rounded-full shrink-0"
            aria-label="Kembali"
          />
        </FadeIn>

        {/* Level Progress Bar */}
        <div className="flex-1">
          <FadeIn delay={0.15} direction="down">
            <LevelProgress currentStep={1} totalSteps={3} />
          </FadeIn>
        </div>
      </header>

      {/* MAIN KONTEN */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-6 max-w-5xl mx-auto w-full">
        
        <FadeIn delay={0.25} direction="up" className="flex justify-center w-full">
          <div className="mb-8 relative w-32 h-32 md:w-36 md:h-36 bg-white rounded-full border-[6px] border-[#F8F9FD] shadow-md flex items-center justify-center overflow-hidden">
            <img
              src="/assets/images/prof-paw.webp"
              alt="Mascot Avatar"
              className="w-full h-full object-cover p-1"
              onError={(e) => {
                e.currentTarget.src = "https://api.dicebear.com/7.x/bottts/svg?seed=Buddy";
              }}
            />
          </div>
        </FadeIn>

        {/* Header Teks */}
        <FadeIn delay={0.35} direction="up" className="text-center mb-10 max-w-lg">
          <Heading level={1} variant="headline-medium" className="mb-3 text-slate-800">
            How much do you know about this topic?
          </Heading>
          <Text variant="body-large" className="text-slate-500">
            Don&apos;t worry, there are no wrong answers! This just helps me find the perfect starting point for you.
          </Text>
        </FadeIn>

        {/* Grid Pilihan Kartu Level */}
        <div className="flex flex-col md:flex-row gap-5 md:gap-6 justify-center w-full">
          
          {/* Option 1: Beginner */}
          <FadeIn delay={0.45} direction="up" className="w-full md:w-auto">
            <LevelCard
              title="I'm a Beginner"
              description="I'm new to this and ready to learn the basics."
              icon={<Sprout className="w-8 h-8 text-teal-600" />}
              iconBgColor="#E0F7F4"
              isSelected={selectedLevel === "beginner"}
              onClick={() => handleSelectLevel("beginner")}
            />
          </FadeIn>

          {/* Option 2: Intermediate (Popular) */}
          <FadeIn delay={0.55} direction="up" className="w-full md:w-auto">
            <LevelCard
              title="I Know a Bit"
              description="I've learned some things, but want to know more."
              icon={<GraduationCap className="w-8 h-8 text-indigo-600" />}
              iconBgColor="#EEEDFC"
              isPopular={true}
              isSelected={selectedLevel === "intermediate"}
              onClick={() => handleSelectLevel("intermediate")}
            />
          </FadeIn>

          {/* Option 3: Pro */}
          <FadeIn delay={0.65} direction="up" className="w-full md:w-auto">
            <LevelCard
              title="I'm a Pro"
              description="I know this well and want a tough challenge."
              icon={<Flame className="w-8 h-8 text-amber-600" />}
              iconBgColor="#FFF0E5"
              isSelected={selectedLevel === "advanced"}
              onClick={() => handleSelectLevel("advanced")}
            />
          </FadeIn>

        </div>
      </main>

      <footer className="h-10" />
    </div>
  );
}