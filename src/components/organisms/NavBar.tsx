"use client";
const APP_NAME = "AuraLearn";

import { Flame } from "lucide-react";
import { MOCK_PROFILE } from "@/constants/mockData";
import { Heading, Text } from "@/components/atoms/Typography";
import { motion } from "framer-motion";
import { useNavbarScroll } from "@/hooks/useNavbarScroll";

export default function NavBar() {
  const initialLetter = MOCK_PROFILE.name.charAt(0).toUpperCase();
  
  // 3. Inisialisasi pergerakan Y. 
  // Angka 100 memastikan seluruh elemen (termasuk margin atas) tersembunyi.
  const y = useNavbarScroll(100);

  return (
    <motion.header 
      style={{ y }}
      className="sticky top-4 z-40 mx-4 mt-4 flex h-[76px] items-center justify-between rounded-[24px] bg-white px-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] md:mx-8"
    >
      
      {/* =========================================
          AREA KIRI: Hamburger Menu & Logo Brand
          ========================================= */}
      <div className="flex items-center gap-3">
        <button className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 md:hidden">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        
        <span className="hidden text-[26px] font-extrabold tracking-tight text-indigo-dark md:block">
          {APP_NAME}
        </span>
      </div>

      {/* =========================================
          AREA KANAN: Indikator Gamifikasi & Avatar
          ========================================= */}
      <div className="flex items-center gap-3 md:gap-4">
        
        {/* Indikator Poin (Coins) */}
        <div className="flex items-center gap-2.5 rounded-full bg-indigo-soft px-4 py-2.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-base text-[13px] font-bold text-white shadow-sm">
            $
          </div>
          <span className="text-[15px] font-bold tracking-tight text-indigo-base">
            {MOCK_PROFILE.totalPoints.toLocaleString("id-ID")} Coins
          </span>
        </div>

        {/* Indikator Streak */}
        <div className="flex items-center gap-2.5 rounded-full bg-amber-soft px-4 py-2.5">
          <Flame className="h-6 w-6 fill-amber-base text-amber-base" />
          <span className="text-[15px] font-bold tracking-tight text-amber-dark">
            {MOCK_PROFILE.currentStreak} Day Streak
          </span>
        </div>

        {/* Avatar Profil Pengguna */}
        <div className="ml-1 flex h-[46px] w-[46px] shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-indigo-base bg-indigo-100 shadow-sm transition-transform hover:scale-105">
          {MOCK_PROFILE.avatar ? (
            <img 
              src={MOCK_PROFILE.avatar as string} 
              alt={MOCK_PROFILE.name} 
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-[18px] font-extrabold text-indigo-700">{initialLetter}</span>
          )}
        </div>

      </div>
    </motion.header>
  );
}