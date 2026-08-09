"use client";

import { usePathname } from "next/navigation";
import { Menu, Flame, Coins, Bell } from "lucide-react";
import { motion } from "framer-motion";

import { useUIStore } from "@/store/useUIStore";
import { MOCK_PROFILE } from "@/constants/mockData";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatIndicator } from "@/components/atoms/StatsIndicator";
import { Heading } from "@/components/atoms/Typography";
import { IconButton } from "@/components/atoms/IconButton";

// Fungsi helper route URL sesuai Halaman
const getPageTitle = (pathname: string) => {
  if (pathname.includes("/dashboard")) return "Dashboard";
  if (pathname.includes("/roadmap")) return "AI Roadmap";
  if (pathname.includes("/study-buddy")) return "AI Study Buddy";
  if (pathname.includes("/library")) return "Library";
  if (pathname.includes("/admin/create-course")) return "Create Course";
  return "Welcome Back!"; // Default fallback
};

export default function Navbar() {
  const pathname = usePathname();
  const { openMobileSidebar } = useUIStore();
  const pageTitle = getPageTitle(pathname || "");

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border bg-card px-4 md:px-6 shadow-sm transition-all">
      
      {/* AREA KIRI: Hamburger Menu & Judul Halaman */}
      <div className="flex items-center gap-3">
        {/* hanya di layar Mobile & Tablet */}
        <div className="md:hidden">
          <IconButton 
            icon={Menu} 
            variant="ghost" 
            onClick={openMobileSidebar}
            aria-label="Buka navigasi menu"
          />
        </div>
        
        {/* container */}
        <div className="relative flex h-full items-center">
          <Heading level={1} variant="h5" className="text-primary tracking-tight">
            {pageTitle}
          </Heading>
          
          {/* Animasi Sliding Border */}
          <motion.div
            layoutId="navbar-active-border"
            className="absolute -bottom-[21px] left-0 h-[3px] w-full rounded-t-md bg-indigo-base"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>
      </div>


      {/* AREA KANAN: Gamification Stats & Profil */}
      <div className="flex items-center gap-3 sm:gap-4">
        
        {/* Indikator Streak */}
        <StatIndicator 
          icon={Flame} 
          value={`${MOCK_PROFILE.currentStreak} Days`} 
          iconClassName="text-orange-500 fill-orange-500 animate-pulse"
          className="hidden sm:flex" 
        />
        
        {/* Indikator Poin */}
        <StatIndicator 
          icon={Coins} 
          value={MOCK_PROFILE.totalPoints.toLocaleString("id-ID")} 
        />

        {/* Separator Visual */}
        <div className="hidden h-6 w-px bg-border sm:block"></div>

        {/* Tombol Notifikasi */}
        <IconButton 
          icon={Bell} 
          variant="ghost" 
          iconSize={20} 
          className="hidden sm:flex h-10 w-10 text-muted-foreground hover:text-primary" 
        />
        
        {/* Avatar Profil Siswa */}
        <Avatar className="h-10 w-10 border-2 border-transparent cursor-pointer hover:border-indigo-base transition-colors">
          <AvatarImage src="" alt={MOCK_PROFILE.name} />
          <AvatarFallback className="bg-indigo-base text-white font-bold">
            {MOCK_PROFILE.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        
      </div>
    </header>
  );
}