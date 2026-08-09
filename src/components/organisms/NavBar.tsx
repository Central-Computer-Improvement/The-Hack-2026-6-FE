"use client";
const APP_NAME = "AuraLearn";

import { Flame } from "lucide-react";

export default function NavBar() {
  return (
    <header className="sticky top-0 z-40 flex h-[90px] w-full items-center justify-between bg-[#F8F9FD]/80 backdrop-blur-md px-4 md:px-10">
      
      {/* Area Kiri Kosong (Hanya Hamburger di Mobile) */}
      <div className="flex items-center">
        {/* Tombol Hamburger (Mobile Only) */}
        <button className="md:hidden p-2 text-slate-600">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
      </div>

      {/* Area Kanan: Status Bar (Points, Streak, Avatar) */}
      <div className="flex items-center gap-4">
        
        {/* Indicator Poin (Knowledge Points) */}
        <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-[0_2px_10px_rgb(0,0,0,0.03)]">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-white text-[10px] font-black">
            $
          </div>
          <span className="text-[14px] font-extrabold text-slate-700 tracking-tight">1,240</span>
        </div>

        {/* Indicator Streak */}
        <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-[0_2px_10px_rgb(0,0,0,0.03)]">
          <Flame className="h-5 w-5 fill-red-500 text-red-500" />
          <span className="text-[14px] font-extrabold text-slate-700 tracking-tight">7</span>
        </div>

        {/* Avatar Profil */}
        <div className="ml-2 h-10 w-10 cursor-pointer overflow-hidden rounded-full border-2 border-indigo-200 bg-white shadow-sm hover:border-indigo-base transition-colors">
          <img 
            src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=200&auto=format&fit=crop" 
            alt="User Avatar" 
            className="h-full w-full object-cover"
          />
        </div>

      </div>
    </header>
  );
}