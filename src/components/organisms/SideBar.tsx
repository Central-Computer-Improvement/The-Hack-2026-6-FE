"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Map, 
  Bot, 
  BookOpen, 
  LayoutDashboard, 
  Settings, 
  HelpCircle,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Heading, Text } from "@/components/atoms/Typography";
import Image from "next/image";
import AnimatePresence from "@/components/atoms/framer/AnimatePresence";
import { MotionDiv } from "@/components/atoms/framer/motion";

const MAIN_MENU = [
  { name: "Roadmap", href: "/roadmap", icon: Map },
  { 
    name: "Learning", 
    icon: Bot,
    children: [
      { name: "Video Lessons", href: "/learning/videoLearning" },
      { name: "Study Buddy", href: "/learning/study-budy" },
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

const FOOTER_MENU = [
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Help", href: "/helpCenter", icon: HelpCircle },
];

export default function SideBar() {
  const pathname = usePathname();

  // STATE ACCORDION
  const [openMenu, setOpenMenu] = useState<string | null>("Dashboard");

  // Lacak pathname sebelumnya, dipakai untuk sinkronisasi openMenu SAAT RENDER
  // (bukan di useEffect) agar tidak memicu cascading render / error eslint
  // react-hooks/set-state-in-effect
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);

    let matchedMenu: string | null = null;

    MAIN_MENU.forEach((menu) => {
      if (menu.children) {


        const isAnyChildActive = menu.children.some(
          (child) => pathname === child.href
        );
        if (isAnyChildActive) {
          matchedMenu = menu.name;
        }
      }
    });

    // Jika tidak ada child yang aktif, matchedMenu tetap null
    // (otomatis menutup accordion, menggantikan logic isChildActiveFound sebelumnya)
    setOpenMenu(matchedMenu);
  }

  // LOGIKA TOGGLE
  const toggleMenu = (menuName: string) => {
    setOpenMenu((prev) => (prev === menuName ? null : menuName));
  };

  return (
    <aside className="hidden md:flex w-[260px] min-w-[260px] shrink-0 h-screen fixed inset-y-0 left-0 z-50 flex-col overflow-y-auto overflow-x-hidden bg-[#E8EFF1] rounded-r-[2rem] shadow-[4px_0_24px_rgba(0,0,0,0.03)] border-r border-white/60 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      
      {/* HEADER: Profil Maskot */}
      <div className="flex flex-col items-center gap-3 px-8 pt-10 pb-8 shrink-0">
        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-full bg-white shadow-sm border border-slate-200">
          <Image
            src="/assets/images/prof-paw.webp" 
            alt="Professor Paw" 
            width={800}
            height={800}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col text-center">
          <Heading variant="headline-medium" className="leading-tight">
            Professor Paw
          </Heading>
          <Text variant="small">
            Your Learning Co-pilot
          </Text>
        </div>
      </div>

      {/* MENU UTAMA */}
      <div className="flex-1 flex flex-col gap-2 px-5 py-2 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {MAIN_MENU.map((item) => {
          
          // ==========================================
          // RENDER SINGLE LINK (Roadmap & Library)
          // ==========================================
          if (!item.children) {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link key={item.name} href={item.href!}>
                <div
                  className={`group flex w-full cursor-pointer items-center gap-4 px-5 py-3.5 transition-all duration-200 active:scale-[0.98] ${
                    isActive
                      ? "rounded-[40px] bg-[#CEC5FF] hover:bg-[#C2B6FF]" 
                      : "rounded-[20px] hover:bg-slate-200/60" 
                  }`}
                >
                  <item.icon 
                    className={`h-[22px] w-[22px] transition-colors ${
                      isActive 
                        ? "text-indigo-dark" 
                        : "text-slate-500 group-hover:text-slate-900"
                    }`} 
                    strokeWidth={2.5} 
                  />
                  <Text 
                    as="span" 
                    className={`text-[16px] tracking-tight transition-colors ${
                      isActive 
                        ? "font-extrabold text-indigo-dark" 
                        : "font-bold text-slate-600 group-hover:text-slate-900"
                    }`}
                  >
                    {item.name}
                  </Text>
                </div>
              </Link>
            );
          }

          // ==========================================
          // RENDER PARENT TOGGLE (Learning & Dashboard)
          // ==========================================
          const isMenuOpen = openMenu === item.name;

          return (
            <div key={item.name} className="flex flex-col">
              
              {/* Tombol Parent Toggle */}
              <button
                onClick={() => toggleMenu(item.name)}
                // Hanya gunakan isMenuOpen sebagai indikator aktif Parent Toggle
                className={`group flex w-full cursor-pointer items-center justify-between px-5 py-3.5 transition-all duration-200 active:scale-[0.98] ${
                  isMenuOpen
                    ? "rounded-[40px] bg-[#CEC5FF] hover:bg-[#C2B6FF]" 
                    : "rounded-[20px] hover:bg-slate-200/60"
                }`}
              >
                <div className="flex items-center gap-4">
                  <item.icon 
                    className={`h-[22px] w-[22px] transition-colors ${
                      isMenuOpen 
                        ? "font-extrabold text-indigo-dark" 
                        : "font-bold text-slate-600 group-hover:text-slate-900"
                    }`} 
                    strokeWidth={2.5} 
                  />
                  <Text 
                    as="span" 
                    className={`text-[16px] tracking-tight transition-colors ${
                      isMenuOpen 
                        ? "font-extrabold text-indigo-dark" 
                        : "font-bold text-slate-600 group-hover:text-slate-900"
                    }`}
                  >
                    {item.name}
                  </Text>
                </div>
                
                {/* Ikon Chevron (Menghadap atas bila buka, bawah bila tutup) */}
                {isMenuOpen ? (
                  <ChevronUp className="h-5 w-5 text-indigo-dark transition-colors" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-slate-400 transition-colors group-hover:text-slate-600" />
                )}
              </button>

              {/* Sub-menu Items dengan Animasi Framer Motion */}
              <AnimatePresence>
                {isMenuOpen && (
                  <MotionDiv 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="flex flex-col mt-1 mb-2 bg-white rounded-md overflow-hidden shadow-[0_2px_10px_rgb(0,0,0,0.02)]"
                  >
                    {item.children.map((child, index) => {
                      const isChildActive = pathname === child.href;
                      
                      return (
                        <Link key={child.name} href={child.href}>
                          <div
                            className={`px-12 py-3 transition-colors border-b border-slate-200 last:border-b-0 ${
                            isChildActive 
                              ? "bg-[#CEC5FF] hover:bg-[#C2B6FF]" 
                              : "hover:bg-slate-200/60"
                            }`}
                          >
                            <Text 
                              as="span" 
                              className={`text-[14px] ${
                                isChildActive
                                ? "font-extrabold text-indigo-dark" 
                                : "font-bold text-slate-600 group-hover:text-slate-900"
                              }`}
                            >
                              {child.name}
                            </Text>
                          </div>
                        </Link>
                      );
                    })}
                  </MotionDiv>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* FOOTER: Tombol CTA & Pengaturan */}
      {/* FOOTER: Tombol Quiz + Menu Bawah (Settings & Help) */}
      <div className="px-5 pb-8 pt-4 flex flex-col gap-2 shrink-0">
        
        {/* Tombol Start Quiz */}
        <button className="mb-2 w-full bg-[#5D44D8] text-white py-3.5 rounded-[16px] font-bold text-[15px] shadow-md shadow-[#5D44D8]/20 hover:bg-indigo-700 transition-colors active:scale-[0.98]">
          Start Quiz
        </button>

        {/* Pemetaan Menu Footer (Settings & Help) */}
        {FOOTER_MENU.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link key={item.name} href={item.href}>
              <div
                className={`group flex w-full cursor-pointer items-center gap-4 px-5 py-3.5 transition-all duration-200 active:scale-[0.98] ${
                  isActive
                    ? "rounded-[40px] bg-[#CEC5FF] hover:bg-[#C2B6FF]" 
                    : "rounded-[20px] hover:bg-slate-200/60"
                }`}
              >
                <item.icon 
                  className={`h-[22px] w-[22px] transition-colors ${
                    isActive 
                      ? "text-white" 
                      : "text-slate-500 group-hover:text-slate-900"
                  }`} 
                  strokeWidth={2.5} 
                />
                <Text 
                  as="span" 
                  className={`text-[16px] tracking-tight transition-colors ${
                    isActive 
                      ? "font-extrabold text-white" 
                      : "font-bold text-slate-600 group-hover:text-slate-900"
                  }`}
                >
                  {item.name}
                </Text>
              </div>
            </Link>
          );
        })}
      </div>
      
    </aside>
  );
}
