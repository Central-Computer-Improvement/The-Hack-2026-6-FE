"use client";

import { useState, useEffect } from "react";
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
      { name: "Progress", href: "/dashboard" },
      { name: "Achievements & Rewards", href: "/dashboard/rewards" }, 
    ]
  },
];

export default function SideBar() {
  const pathname = usePathname();

  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    "Learning": false,
    "Dashboard": true 
  });

  // toggle buka/tutup menu
  const toggleMenu = (menuName: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuName]: !prev[menuName]
    }));
  };

  // Effect untuk membuka menu jika aktif 
  useEffect(() => {
    MAIN_MENU.forEach((menu) => {
      if (menu.children) {
        const isAnyChildActive = menu.children.some(
          (child) => pathname === child.href || pathname.startsWith(`${child.href}/`)
        );
        if (isAnyChildActive) {
          setOpenMenus((prev) => ({ ...prev, [menu.name]: true }));
        }
      }
    });
  }, [pathname]);
  return (
    <aside 
      className="hidden md:flex w-[260px] min-w-[260px] shrink-0 h-screen fixed inset-y-0 left-0 z-50 flex-col  
      bg-[#E8EFF1] rounded-r-[2rem] shadow-[4px_0_24px_rgba(0,0,0,0.03)] border-r border-white/60">
      
      {/* HEADER: Profil Maskot */}
      <div className="flex flex-col items-center gap-3 px-8 pt-10 pb-4 shrink-0">
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
          // Cek apakah item ini tidak memiliki dropdown (Single Link)
          if (!item.children) {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link key={item.name} href={item.href!}>
                <div
                  className={`group flex items-center gap-4 px-5 py-3.5 transition-all duration-200 ${
                    isActive
                      ? "bg-[#CEC5FF] rounded-[40px]" 
                      : "hover:bg-slate-200/60 rounded-[20px]" 
                  }`}
                >
                  <item.icon 
                    className={`w-[22px] h-[22px] transition-colors ${
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

          // Cek dropdown (Parent Menu)
          const isMenuOpen = openMenus[item.name];
          const isAnyChildActive = item.children.some(
            (child) => pathname === child.href
          );

          return (
            <div key={item.name} className="flex flex-col">
              {/* Parent Toggle Button */}
              <button
                onClick={() => toggleMenu(item.name)}
                className="group flex items-center justify-between w-full px-5 py-3.5 transition-all duration-200 hover:bg-slate-200/60 rounded-[20px]"
              >
                <div className="flex items-center gap-4">
                  <item.icon 
                    className={`w-[22px] h-[22px] transition-colors ${
                      isAnyChildActive 
                        ? "text-indigo-base" 
                        : "text-slate-600 group-hover:text-slate-900"
                    }`} 
                    strokeWidth={2.5} 
                  />
                  <Text 
                    as="span" 
                    className={`text-[16px] tracking-tight transition-colors ${
                      isAnyChildActive 
                        ? "font-extrabold text-indigo-base" 
                        : "font-bold text-slate-700 group-hover:text-slate-900"
                    }`}
                  >
                    {item.name}
                  </Text>
                </div>
                {/* Ikon Chevron (Panah) */}
                {isMenuOpen ? (
                  <ChevronUp className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                )}
              </button>

              {/* Sub-menu Items (Dropdown Box Putih) */}
              {isMenuOpen && (
                <div className="flex flex-col mt-1 mb-2 bg-white rounded-md overflow-hidden  shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
                  {item.children.map((child, index) => {
                    const isChildActive = pathname === child.href;
                    
                    return (
                      <Link key={child.name} href={child.href}>
                        <div
                          className={`px-12 py-3 transition-colors border-b border-slate-200 last:border-b-0 ${
                          isChildActive 
                            ? "bg-[#CEC5FF]" 
                            : "bg-white hover:bg-slate-50"
                          }`}
                        >
                          <Text 
                            as="span" 
                            className={`text-[14px] ${
                              isChildActive
                                ? "font-bold text-slate-900"
                                : "font-medium text-slate-700"
                            }`}
                          >
                            {child.name}
                          </Text>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* FOOTER: Tombol CTA & Pengaturan */}
      <div className="px-6 pb-4 pt-4 flex flex-col gap-2 shrink-0">
        <button className="w-full bg-indigo-base text-white py-3.5 rounded-[16px] font-bold text-[15px] shadow-md shadow-indigo-base/20 hover:bg-indigo-700 transition-colors">
          Start Quiz
        </button>
        
        <button className="group flex items-center gap-4 px-5 py-3 transition-colors">
          <Settings className="w-[22px] h-[22px] text-slate-600 transition-colors group-hover:text-slate-900" strokeWidth={2.5} />
          <Text as="span" className="text-[15px] font-bold text-slate-600 transition-colors group-hover:text-slate-900">
            Settings
          </Text>
        </button>
        
        <button className="group flex items-center gap-4 px-5 py-3 transition-colors">
          <HelpCircle className="w-[22px] h-[22px] text-slate-600 transition-colors group-hover:text-slate-900" strokeWidth={2.5} />
          <Text as="span" className="text-[15px] font-bold text-slate-600 transition-colors group-hover:text-slate-900">
            Help
          </Text>
        </button>
      </div>
      
    </aside>
  );
}