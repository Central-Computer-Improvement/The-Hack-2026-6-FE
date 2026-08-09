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
import { useUIStore } from "@/store/useUIStore";
// import { useAuthStore } from "@/store/useAuthStore"; 

import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ProfileIdentity } from "@/components/molecules/ProfileIdentity";

// --- KONFIGURASI MENU ---
const MAIN_MENU = [
  { name: "Roadmap", href: "/roadmap", icon: Map },
  { name: "Study Buddy", href: "/study-buddy", icon: Bot },
  { name: "Library", href: "/library", icon: BookOpen },
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isMobileSidebarOpen, closeMobileSidebar } = useUIStore();

  const renderSidebarContent = () => (
    <div className="flex h-full flex-col bg-card border-r border-border text-foreground">
      <div className="flex items-center justify-center pt-8 pb-6 px-6 border-b border-border">
        <ProfileIdentity 
          name="Professor Paw"
          role="Your Learning Co-pilot"
          avatarSrc="/assets/images/professor-paw.png" 
          orientation="vertical"
          size="lg"
        />
      </div>

      {/* RENDER LIST MENU */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        {MAIN_MENU.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href} onClick={closeMobileSidebar}>
              <div
                className={`flex items-center gap-3 px-3 py-3 rounded-btn transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-soft text-indigo-base font-bold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? "text-indigo-base" : ""}`} />
                <span className="text-body-medium">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* --- FOOTER SIDEBAR  --- */}
      <div className="p-4 border-t border-border flex flex-col gap-2">
        
        {/* CTA */}
        <Button 
          className="w-full mb-2 h-14 bg-indigo-base hover:bg-indigo-700 text-white rounded-btn shadow-sm text-base font-bold"
        >
          Start Quiz
        </Button>
        
        {/* Settings (Ghost) */}
        <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground hover:bg-muted">
          <Settings className="w-5 h-5" />
          <span className="text-body-medium">Settings</span>
        </Button>
        
        {/* Help (Ghost) */}
        <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground hover:bg-muted">
          <HelpCircle className="w-5 h-5" />
          <span className="text-body-medium">Help</span>
        </Button>
        
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden md:flex w-64 h-screen fixed inset-y-0 left-0 z-50">
        {renderSidebarContent()}
      </aside>

      <Sheet open={isMobileSidebarOpen} onOpenChange={(open) => !open && closeMobileSidebar()}>
        <SheetContent side="left" className="p-0 w-72 border-none">
          <SheetTitle className="sr-only">Navigasi Menu</SheetTitle>
          {renderSidebarContent()}
        </SheetContent>
      </Sheet>
    </>
  );
}