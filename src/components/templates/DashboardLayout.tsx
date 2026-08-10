// file : src/components/templates/DashboardLayout.tsx
import * as React from "react";
import Sidebar from "@/components/organisms/SideBar"; 
import Navbar from "@/components/organisms/NavBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar />

      {/* Navbar + main content */}
      <div className="flex w-full flex-1 flex-col transition-all duration-300 md:pl-64">
        
        {/* Navbar */}
        <Navbar />
        
        <main className="flex-1 overflow-y-auto bg-muted/20">
          <div className="mx-auto max-w-7xl h-full p-4 md:p-6">
            {children}
          </div>
        </main>
        
      </div>
    </div>
  );
}