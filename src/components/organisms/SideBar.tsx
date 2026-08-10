"use client";

// file : src/components/organisms/SideBar.tsx
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
import { Heading, Text } from "@/components/atoms/Typography";
import Image from "next/image";

const MAIN_MENU = [
  { name: "Roadmap", href: "/roadmap", icon: Map },
  { name: "Study Buddy", href: "/study-buddy", icon: Bot },
  { name: "Library", href: "/library", icon: BookOpen },
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
];

export default function SideBar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-[260px] h-screen fixed inset-y-0 left-0 z-50 flex-col bg-[#E8EFF1] rounded-r-[2rem] shadow-[4px_0_24px_rgba(0,0,0,0.03)] border-r border-white/60">
      
      {/* HEADER: Profil Maskot */}
      <div className="flex flex-col items-center gap-3 px-8 pt-10 pb-8">
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
          <Text variant="small" >
            Your Learning Co-pilot
          </Text>
        </div>
      </div>

      {/* MENU UTAMA */}
      <div className="flex-1 flex flex-col gap-1.5 px-5">
        {MAIN_MENU.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          
          return (
            <Link key={item.name} href={item.href}>
              <div
                className={`group flex items-center gap-4 px-5 py-3.5 transition-all duration-200 ${
                  isActive
                    ? "bg-[#CEC5FF] rounded-[40px] " 
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
        })}
      </div>

      {/* FOOTER: Tombol CTA & Pengaturan */}
      <div className="px-6 pb-8 pt-4 flex flex-col gap-2">
        <button className="mb-4 w-full bg-indigo-base text-white py-3.5 rounded-[16px] font-bold text-[15px] shadow-md shadow-indigo-base/20 hover:bg-indigo-700 transition-colors">
          Start Quiz
        </button>
        
        <button className="group flex items-center gap-4 px-5 py-3 transition-colors">
          <Settings className="w-[22px] h-[22px] text-slate-500 transition-colors group-hover:text-slate-800" strokeWidth={2.5} />
          <Text as="span" className="text-[15px] font-bold text-slate-500 transition-colors group-hover:text-slate-800">
            Settings
          </Text>
        </button>
        
        <button className="group flex items-center gap-4 px-5 py-3 transition-colors">
          <HelpCircle className="w-[22px] h-[22px] text-slate-500 transition-colors group-hover:text-slate-800" strokeWidth={2.5} />
          <Text as="span" className="text-[15px] font-bold text-slate-500 transition-colors group-hover:text-slate-800">
            Help
          </Text>
        </button>
      </div>
      
    </aside>
  );
}