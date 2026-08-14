"use client";
const APP_NAME = "AuraLearn";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Flame, 
  Map, 
  Bot, 
  BookOpen, 
  LayoutDashboard, 
  ChevronDown, 
  ChevronUp, 
  X 
} from "lucide-react";
import { MOCK_PROFILE } from "@/constants/mockData";
import { motion, AnimatePresence } from "framer-motion";
import { useNavbarScroll } from "@/hooks/useNavbarScroll";
import { Text } from "@/components/atoms/Typography";

const MAIN_MENU = [
  { name: "Roadmap", href: "/roadmap", icon: Map },
  { 
    name: "Learning", 
    icon: Bot,
    children: [
      { name: "Video Lessons", href: "/learning/video-lessons" },
      { name: "Study Buddy", href: "/learning/study-buddy" },
      { name: "AI Task", href: "/learning/AiTask" },
    ]
  },
  { name: "Library", href: "/library", icon: BookOpen },
  { 
    name: "Dashboard", 
    icon: LayoutDashboard,
    children: [
      { name: "Progress", href: "/dashboard/progress" },
      { name: "Achievements & Rewards", href: "/dashboard/rewards" }, 
    ]
  },
];

export default function NavBar() {
  const initialLetter = MOCK_PROFILE.name.charAt(0).toUpperCase();
  const y = useNavbarScroll(100);
  const pathname = usePathname();

  // State untuk mengontrol Mobile Drawer dan Dropdown
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({
    "Learning": false,
    "Dashboard": true
  });

  // Efek untuk menutup menu saat halaman berpindah
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Efek untuk mengunci scroll body saat menu terbuka
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileMenuOpen]);

  const toggleDropdown = (menuName: string) => {
    setOpenDropdowns((prev) => ({ ...prev, [menuName]: !prev[menuName] }));
  };

 return (
    <>
      <motion.header 
        style={{ y }}
        className="sticky top-4 z-40 mx-4 mt-4 flex h-[76px] items-center justify-between rounded-[24px] bg-white px-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] md:mx-8"
      >
        
        {/* =========================================
            AREA KIRI: Hamburger Menu & Logo Brand
            ========================================= */}
        <div className="flex items-center gap-3">
          {/* Tombol Hamburger Diberi Event onClick */}
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 md:hidden"
          >
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
          
          <div className="flex items-center gap-2.5 rounded-full bg-indigo-soft px-4 py-2.5 hidden sm:flex">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-base text-[13px] font-bold text-white shadow-sm">
              $
            </div>
            <span className="text-[15px] font-bold tracking-tight text-indigo-base">
              {MOCK_PROFILE.totalPoints.toLocaleString("id-ID")}
            </span>
          </div>

          <div className="flex items-center gap-2.5 rounded-full bg-amber-soft px-4 py-2.5">
            <Flame className="h-6 w-6 fill-amber-base text-amber-base" />
            <span className="text-[15px] font-bold tracking-tight text-amber-dark">
              {MOCK_PROFILE.currentStreak}
            </span>
          </div>

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

      {/* =========================================
          DRAWER MOBILE MENU (Slide dari kiri)
          ========================================= */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Latar Belakang Gelap (Backdrop) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm md:hidden"
            />
            
            {/* Panel Menu Mobile */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col bg-[#E8EFF1] shadow-2xl md:hidden overflow-y-auto"
            >
              <div className="flex items-center justify-between px-6 py-6 border-b border-white/60">
                <span className="text-[22px] font-extrabold tracking-tight text-indigo-dark">
                  {APP_NAME}
                </span>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-full p-2 bg-white text-slate-500 shadow-sm transition-colors hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Render Menu (Logika adaptasi dari SideBar) */}
              <div className="flex flex-col gap-2 px-5 py-6">
                {MAIN_MENU.map((item) => {
                  if (!item.children) {
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                    return (
                      <Link key={item.name} href={item.href!}>
                        <div className={`flex items-center gap-4 px-5 py-3.5 transition-all duration-200 ${isActive ? "bg-[#CEC5FF] rounded-[40px]" : "hover:bg-slate-200/60 rounded-[20px]"}`}>
                          <item.icon className={`w-[22px] h-[22px] ${isActive ? "text-indigo-dark" : "text-slate-500"}`} strokeWidth={2.5} />
                          <Text as="span" className={`text-[16px] tracking-tight ${isActive ? "font-extrabold text-indigo-dark" : "font-bold text-slate-600"}`}>
                            {item.name}
                          </Text>
                        </div>
                      </Link>
                    );
                  }

                  const isMenuOpen = openDropdowns[item.name];
                  const isAnyChildActive = item.children.some((child) => pathname === child.href);

                  return (
                    <div key={item.name} className="flex flex-col">
                      <button
                        onClick={() => toggleDropdown(item.name)}
                        className="flex items-center justify-between w-full px-5 py-3.5 transition-all duration-200 hover:bg-slate-200/60 rounded-[20px]"
                      >
                        <div className="flex items-center gap-4">
                          <item.icon className={`w-[22px] h-[22px] ${isAnyChildActive ? "text-indigo-base" : "text-slate-600"}`} strokeWidth={2.5} />
                          <Text as="span" className={`text-[16px] tracking-tight ${isAnyChildActive ? "font-extrabold text-indigo-base" : "font-bold text-slate-700"}`}>
                            {item.name}
                          </Text>
                        </div>
                        {isMenuOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                      </button>

                      <AnimatePresence>
                        {isMenuOpen && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="flex flex-col mt-1 mb-2 bg-white rounded-md overflow-hidden shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-slate-200"
                          >
                            {item.children.map((child) => {
                              const isChildActive = pathname === child.href;
                              return (
                                <Link key={child.name} href={child.href}>
                                  <div className={`px-12 py-3 transition-colors border-b border-slate-200 last:border-b-0 ${isChildActive ? "bg-[#CEC5FF]" : "bg-white active:bg-slate-50"}`}>
                                    <Text as="span" className={`text-[14px] ${isChildActive ? "font-bold text-slate-900" : "font-medium text-slate-700"}`}>
                                      {child.name}
                                    </Text>
                                  </div>
                                </Link>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}