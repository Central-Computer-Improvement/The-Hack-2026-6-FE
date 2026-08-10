import SideBar from "@/components/organisms/SideBar";
import NavBar from "@/components/organisms/NavBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      
      {/* SIDEBAR KIRI */}
      <SideBar />

      {/* NAVBAR + MAIN CONTENT */}
      <div className="flex w-full flex-1 flex-col transition-all duration-300 md:pl-64">       
        <NavBar />

        {/* Children */}
        <main className="flex-1 overflow-y-auto bg-slate-50/50">
          <div className="mx-auto h-full max-w-[1200px] p-4 md:p-8">
            {children}
          </div>
        </main>
        
      </div>
    </div>
  );
}