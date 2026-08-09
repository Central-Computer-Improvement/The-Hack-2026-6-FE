"use client";

import { Menu, Flame, Coins } from "lucide-react";
import { useUIStore } from "@/store/useUIStore";
import { MOCK_PROFILE } from "@/constants/mockData";

// Fallback APP_NAME (config file not a module in some environments)
const APP_NAME = "AuraLearn";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatIndicator } from "@/components/atoms/StatsIndicator";
import { IconButton } from "@/components/atoms/IconButton";

export default function Navbar() {
  const { openMobileSidebar } = useUIStore();

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-8 transition-all">
      
      <div className="flex items-center gap-3">
        <div className="md:hidden">
          <IconButton 
            icon={Menu} 
            variant="ghost" 
            onClick={openMobileSidebar}
            aria-label="Buka navigasi menu"
          />
        </div>
        
        {/* APP_NAME */}
        <span className="font-sans text-xl font-extrabold tracking-tight text-primary md:text-2xl">
          {APP_NAME}
        </span>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <StatIndicator 
          icon={Coins} 
          value={MOCK_PROFILE.totalPoints.toLocaleString("id-ID")} 
        />
        <StatIndicator 
          icon={Flame} 
          value={`${MOCK_PROFILE.currentStreak} Days`} 
          iconClassName="text-orange-500 fill-orange-500"
        />
        <div className="hidden h-6 w-px bg-border sm:block"></div>
        <Avatar className="h-10 w-10 shrink-0 border-2 border-transparent cursor-pointer hover:border-indigo-base shadow-sm transition-all hover:scale-105">
          <AvatarImage src={MOCK_PROFILE.avatar} alt={MOCK_PROFILE.name} className="object-cover" />
          <AvatarFallback className="bg-indigo-base text-white font-bold">
            {MOCK_PROFILE.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}