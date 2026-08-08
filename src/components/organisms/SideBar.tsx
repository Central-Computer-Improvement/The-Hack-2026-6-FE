"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Map, Bot, BookOpen, PlusCircle, LogOut } from "lucide-react";
import { useUIStore } from "@/store/useUIStore";
// import { useAuthStore } from "@/store/useAuthStore"; 

import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

// --- KONFIGURASI MENU ---
const MAIN_MENU = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "AI Roadmap", href: "/roadmap", icon: Map },
  { name: "Study Buddy", href: "/study-buddy", icon: Bot },
  { name: "Library", href: "/library", icon: BookOpen },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isMobileSidebarOpen, closeMobileSidebar } = useUIStore();
  
  const isAdmin = true; 

  const renderSidebarContent = () => (
    <div className="flex h-full flex-col bg-card border-r border-border text-foreground">
      <div className="flex h-16 items-center px-6 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-indigo-base flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-primary font-sans">
            AI Learning
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        <p className="px-2 text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">
          Menu Utama
        </p>
        
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

        {isAdmin && (
          <div className="mt-8 pt-6 border-t border-border">
            <p className="px-2 text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">
              Admin Panel
            </p>
            <Link href="/admin/create-course" onClick={closeMobileSidebar}>
              <div
                className={`flex items-center gap-3 px-3 py-3 rounded-btn transition-all duration-200 ${
                  pathname === "/admin/create-course"
                    ? "bg-amber-soft text-amber-dark font-bold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <PlusCircle className="w-5 h-5" />
                <span className="text-body-medium">Create Course</span>
              </div>
            </Link>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-border">
        <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive">
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
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