// file: src/app/roleSelection/page.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import RoleCard from "@/components/molecules/roleCard"; // Komponen RoleCard milikmu
import { Heading, Text } from "@/components/atoms/Typography";
import FadeIn from "@/components/atoms/framer/FadeIn";

export default function RoleSelectionPage() {
  const router = useRouter();

  const handleRoleSelect = (role: "student" | "parent") => {
    // Simpan role ke localStorage / state jika dibutuhkan nanti di backend / context
    if (typeof window !== "undefined") {
      localStorage.setItem("user_role", role);
    }

    if (role === "student") {
      router.push("/levelCheck/level_1");
    } else {
      router.push("/dashboard/progress");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FD] flex flex-col items-center justify-center p-6 font-sans">
      <main className="max-w-4xl w-full flex flex-col items-center">
        
        {/* Header Teks */}
        <FadeIn direction="down" delay={0.1}>
          <div className="text-center mb-12">
            <Heading level={1} variant="display-hero" className="mb-3 text-slate-800">
              Who&apos;s playing today?
            </Heading>
            <Text variant="body-large" className="text-slate-500">
              Select your role to customize your learning journey
            </Text>
          </div>
        </FadeIn>

        {/* Pilihan Card */}
        <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch w-full max-w-2xl">
          
          {/* Kartu Student */}
          <FadeIn direction="up" delay={0.25} className="w-full">
            <RoleCard
              title="I am a Student"
              description="Ready to explore, learn, and earn rewards!"
              imageBgColor="#EAE4FC"
              imageSrc="/assets/images/student.webp"
              onClick={() => handleRoleSelect("student")}
            />
          </FadeIn>

          {/* Kartu Parent */}
          <FadeIn direction="up" delay={0.35} className="w-full">
            <RoleCard
              title="I am a Parent"
              description="Track progress and guide the learning adventure."
              imageBgColor="#FFEFE5"
              imageSrc="/assets/images/parents.webp"
              onClick={() => handleRoleSelect("parent")}
            />
          </FadeIn>

        </div>
      </main>
    </div>
  );
}