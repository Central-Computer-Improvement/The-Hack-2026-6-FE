"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Map, 
  Bot, 
  BookOpen, 
  LayoutDashboard, 
  Settings, 
  HelpCircle 
} from "lucide-react";

const MAIN_MENU = [
  { name: "Roadmap", href: "/roadmap", icon: Map },
  { name: "Study Buddy", href: "/study-buddy", icon: Bot },
  { name: "Library", href: "/library", icon: BookOpen },
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
];

export default function SideBar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-[260px] h-screen fixed inset-y-0 left-0 z-50 flex-col bg-[#E8EFF1] rounded-r-2xl shadow-[4px_0_24px_rgba(0,0,0,0.02)] border-r border-white/50">
      
      {/* HEADER: Profil Maskot */}
      <div className="flex flex-col items-center gap-3 px-8 pt-10 pb-8">
        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-white shadow-sm border border-slate-200">
          <img 
            src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=200&auto=format&fit=crop" 
            alt="Professor Paw" 
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-[17px] font-extrabold text-slate-900 tracking-tight leading-tight">
            Professor Paw
          </span>
          <span className="text-[12px] font-medium text-slate-500">
            Your Learning Co-pilot
          </span>
        </div>
      </div>

      {/* MENU UTAMA */}
      <div className="flex-1 flex flex-col gap-1 px-5">
        {MAIN_MENU.map((item) => {
          // Asumsikan '/dashboard' aktif untuk preview ini
          const isActive = item.name === "Dashboard" || pathname === item.href; 
          
          return (
            <Link key={item.name} href={item.href}>
              <div
                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all ${
                  isActive
                    ? "text-indigo-base font-bold bg-white/60 shadow-[0_2px_10px_rgb(0,0,0,0.02)]"
                    : "text-slate-500 font-semibold hover:text-slate-700 hover:bg-slate-200/50"
                }`}
              >
                <item.icon className={`w-[22px] h-[22px] ${isActive ? "text-indigo-base" : "text-slate-400"}`} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[15px]">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* FOOTER: Tombol CTA & Pengaturan */}
      <div className="px-6 pb-8 pt-4 flex flex-col gap-2">
        <button className="mb-4 w-full bg-indigo-base text-white py-3.5 rounded-2xl font-bold text-[15px] shadow-md shadow-indigo-base/20 hover:bg-indigo-700 transition-colors">
          Start Quiz
        </button>
        
        <button className="flex items-center gap-4 px-4 py-3 text-slate-500 font-semibold hover:text-slate-700 transition-colors">
          <Settings className="w-[20px] h-[20px] text-slate-600" strokeWidth={2.5} />
          <span className="text-[15px]">Settings</span>
        </button>
        
        <button className="flex items-center gap-4 px-4 py-3 text-slate-500 font-semibold hover:text-slate-700 transition-colors">
          <HelpCircle className="w-[20px] h-[20px] text-slate-600" strokeWidth={2.5} />
          <span className="text-[15px]">Help</span>
        </button>
      </div>
      
    </aside>
  );
}