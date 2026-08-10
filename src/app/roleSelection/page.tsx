// file: src/app/role-selection/page.tsx
"use client";

import { useRouter } from 'next/navigation';
import RoleCard from '@/components/molecules/roleCard';
import { Logo } from '@/components/atoms/Logo';
import { Heading, Text } from '@/components/atoms/Typography';

export default function RoleSelectionPage() {
  const router = useRouter();

  const handleRoleSelect = (role: string) => {
    // Debugging di console untuk memastikan role yang diklik
    console.log(`Role terpilih: ${role}`);
    
    // Opsional: Simpan role pilihan user (bisa ke localStorage, context, atau zustand)
    // localStorage.setItem('userRole', role);

    // Navigasi langsung ke dashboard
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FD] flex flex-col font-sans">
      
      {/* Header (menggunakan Logo dari temanmu) */}
      <header className="p-8">
        <Logo showText={true} className="text-indigo-dark" />
      </header>

      {/* Konten Utama */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-20">
        
        {/* Judul Halaman */}
        <div className="text-center mb-12">
          <Heading level={1} variant="display-hero" className="mb-4 text-slate-900">
            {"Who's playing today?"}
          </Heading>
          <Text variant="body-large" className="text-slate-500">
            Select your role to customize your learning journey
          </Text>
        </div>

        {/* Grid Pilihan Role */}
        <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch">
          
          {/* Kartu Siswa */}
          <RoleCard 
            title="I am a Student"
            description="Ready to explore, learn, and earn rewards!"
            imageBgColor="#EAE4FC" 
            imageSrc="/assets/images/student-illustration.png" 
            onClick={() => handleRoleSelect("student")} 
          />

          {/* Kartu Orang Tua */}
          <RoleCard 
            title="I am a Parent"
            description="Track progress and guide the learning adventure."
            imageBgColor="#FFEFE5" 
            imageSrc="/assets/images/parent-illustration.png" 
            onClick={() => handleRoleSelect("parent")}
          />

        </div>
      </main>
    </div>
  );
}