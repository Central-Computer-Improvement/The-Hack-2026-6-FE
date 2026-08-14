import SideBar from "@/components/organisms/SideBar";
import NavBar from "@/components/organisms/NavBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full bg-[#F8F9FD]">
      
      {/* SIDEBAR KIRI */}
      <SideBar />

      {/* NAVBAR + MAIN CONTENT */}
      <div className="flex w-full flex-1 flex-col transition-all duration-300 md:pl-[260px]">       
        <NavBar />
        <main className="flex-1">
          <div className="mx-auto max-w-[1200px] p-4 md:px-8">
            {children}
          </div>
        </main>
        
      </div>
    </div>
  );
}