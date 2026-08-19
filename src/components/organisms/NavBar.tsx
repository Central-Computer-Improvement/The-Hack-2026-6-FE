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
  X,
  Settings,
  HelpCircle,
  Brain,
  Layers,
} from "lucide-react";
import { MOCK_PROFILE } from "@/constants/mockData";
import { AnimatePresence } from "framer-motion";
import { useNavbarScroll } from "@/hooks/useNavbarScroll";
import { Text } from "@/components/atoms/Typography";
import { MotionDrawer, MotionHeader, MotionBackdrop, MotionDiv } from "@/components/atoms/framer/motion";
import { useAuthStore } from "@/store/useAuthStore";

const MAIN_MENU = [
  { name: "Roadmap", href: "/roadmap", icon: Map },
  { 
    name: "Learning", 
    icon: Bot,
    children: [
      { name: "Course Catalog", href: "/learning/courses" },
      { name: "Video Lessons", href: "/learning/videoLearning", hidden: true },
      { name: "Study Buddy", href: "/learning/study-budy" },
      { name: "AI Task", href: "/learning/AiTask", hidden: true },
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
  { name: "Courses & Modules", href: "/courses", icon: Layers, adminOnly: true },
  { name: "AI Memory", href: "/memory", icon: Brain },
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Help", href: "/helpCenter", icon: HelpCircle },
];

export default function NavBar() {
  const [mounted, setMounted] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const userName = mounted && user?.name ? user.name : MOCK_PROFILE.name;
  const totalCoins = mounted && user?.coins !== undefined ? user.coins : MOCK_PROFILE.totalPoints;
  const currentStreak = mounted && user?.streak_count !== undefined ? user.streak_count : MOCK_PROFILE.currentStreak;
  const initialLetter = userName.charAt(0).toUpperCase();

  const y = useNavbarScroll(100);
  const pathname = usePathname();

  // State untuk mengontrol Mobile Drawer dan Dropdown
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>("Dashboard");

  const toggleMenu = (menuName: string) => {
    setOpenMenu((prev) => (prev === menuName ? null : menuName));
  };

  // Efek untuk menutup menu saat halaman berpindah
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setIsMobileMenuOpen(false);
  }

  // Efek untuk mengunci scroll body saat menu terbuka
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileMenuOpen]);

  return (
    <>
      <MotionHeader style={{ y }} className="sticky top-4 z-40 mx-4 mt-4 flex h-[76px] items-center justify-between rounded-[24px] bg-white px-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] md:mx-8">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsMobileMenuOpen(true)} className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 md:hidden">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
          <span className="hidden text-[26px] font-extrabold tracking-tight text-indigo-dark md:block">{APP_NAME}</span>
        </div>
        <div className="flex items-center gap-3 md:gap-4">
          <div className="flex items-center gap-2.5 rounded-full bg-indigo-soft px-4 py-2.5 hidden sm:flex">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-base text-[13px] font-bold text-white shadow-sm">$</div>
            <span className="text-[15px] font-bold tracking-tight text-indigo-base">{totalCoins.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex items-center gap-2.5 rounded-full bg-amber-soft px-4 py-2.5">
            <Flame className="h-6 w-6 fill-amber-base text-amber-base" />
            <span className="text-[15px] font-bold tracking-tight text-amber-dark">{currentStreak}</span>
          </div>
          <div className="ml-1 flex h-[46px] w-[46px] shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-indigo-base bg-indigo-100 shadow-sm transition-transform hover:scale-105">
            {mounted && user?.photo_url ? (
              <img src={user.photo_url} alt={userName} className="h-full w-full object-cover"/>
            ) : (
              <span className="text-[18px] font-extrabold text-indigo-700">{initialLetter}</span>
            )}
          </div>
        </div>
      </MotionHeader>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <MotionBackdrop onClick={() => setIsMobileMenuOpen(false)} />
            <MotionDrawer>
              <div className="flex items-center justify-between px-6 py-6 border-b border-white/60 shrink-0">
                <span className="text-[22px] font-extrabold tracking-tight text-indigo-dark">{APP_NAME}</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="rounded-full p-2 bg-white text-slate-500 shadow-sm transition-colors hover:bg-slate-100">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* MENU UTAMA */}
              <div className="flex-1 flex flex-col gap-2 px-5 py-6 overflow-y-auto">
                {MAIN_MENU.map((item) => {
                  if (!item.children) {
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                    return (
                      <Link key={item.name} href={item.href!}>
                        <div className={`group flex items-center gap-4 px-5 py-3.5 transition-all duration-200 active:scale-[0.98] ${isActive ? "bg-[#CEC5FF] rounded-[40px]" : "hover:bg-slate-200/60 rounded-[20px]"}`}>
                          <item.icon className={`w-[22px] h-[22px] transition-colors ${isActive ? "text-indigo-dark" : "text-slate-500 group-hover:text-slate-900"}`} strokeWidth={2.5} />
                          <Text as="span" className={`text-[16px] tracking-tight transition-colors ${isActive ? "font-extrabold text-indigo-dark" : "font-bold text-slate-600 group-hover:text-slate-900"}`}>{item.name}</Text>
                        </div>
                      </Link>
                    );
                  }

                  const isMenuOpen = openMenu === item.name;
                  const isAnyChildActive = item.children.some(
                    (child) => pathname === child.href || pathname.startsWith(`${child.href}/`)
                  );

                  return (
                    <div key={item.name} className="flex flex-col">
                      <button
                        onClick={() => toggleMenu(item.name)}
                        className={`group flex items-center justify-between px-5 py-3.5 rounded-[20px] transition-all duration-200 ${
                          isAnyChildActive ? "bg-indigo-50" : "hover:bg-slate-200/60"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <item.icon
                            className={`w-[22px] h-[22px] transition-colors ${
                              isAnyChildActive ? "text-indigo-600" : "text-slate-500 group-hover:text-slate-900"
                            }`}
                            strokeWidth={2.5}
                          />
                          <Text
                            as="span"
                            className={`text-[16px] tracking-tight transition-colors ${
                              isAnyChildActive
                                ? "font-extrabold text-indigo-900"
                                : "font-bold text-slate-600 group-hover:text-slate-900"
                            }`}
                          >
                            {item.name}
                          </Text>
                        </div>
                        {isMenuOpen ? (
                          <ChevronUp className="w-5 h-5 text-slate-500" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-slate-500" />
                        )}
                      </button>

                      <AnimatePresence>
                        {isMenuOpen && (
                          <MotionDiv
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden flex flex-col gap-1 pl-12 pr-2 py-1"
                          >
                            {item.children
                              .filter((child) => !child.hidden)
                              .map((child) => {
                                const isChildActive = pathname === child.href;
                                return (
                                  <Link key={child.name} href={child.href}>
                                    <div
                                      className={`px-4 py-2.5 rounded-[14px] transition-all ${
                                        isChildActive
                                          ? "bg-[#CEC5FF] text-indigo-dark font-extrabold"
                                          : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/40 font-semibold"
                                      }`}
                                    >
                                      <Text as="span" className="text-[14px]">
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

              {/* MENU FOOTER */}
              <div className="px-5 py-4 border-t border-white/60 flex flex-col gap-1 shrink-0">
                {FOOTER_MENU.filter((item) => !item.adminOnly || (mounted && user?.role === "admin")).map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link key={item.name} href={item.href}>
                      <div className={`group flex items-center gap-4 px-5 py-3 rounded-[20px] transition-all ${isActive ? "bg-slate-200/80 font-bold text-slate-900" : "hover:bg-slate-200/60 text-slate-500"}`}>
                        <item.icon className="w-5 h-5 text-slate-500 group-hover:text-slate-900" strokeWidth={2.5} />
                        <Text as="span" className="text-[15px] font-bold">{item.name}</Text>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </MotionDrawer>
          </>
        )}
      </AnimatePresence>
    </>
  );
}