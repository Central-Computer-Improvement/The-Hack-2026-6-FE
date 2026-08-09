import SideBar from "@/components/organisms/SideBar";
import NavBar from "@/components/organisms/NavBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Kontainer utama: Mengisi layar penuh (h-screen) dan mengunci scroll ganda
    <div className="flex h-screen w-full overflow-hidden bg-background">
      
      {/* 1. SIDEBAR KIRI */}
      {/* Komponen ini sudah menangani responsivitasnya sendiri (fixed & hidden di mobile) */}
      <SideBar />

      {/* 2. AREA KANAN (NAVBAR + KONTEN UTAMA) */}
      {/* md:pl-64 sangat penting untuk mendorong konten ke kanan sejauh 256px agar tidak tertutup Sidebar di versi Desktop */}
      <div className="flex w-full flex-1 flex-col transition-all duration-300 md:pl-64">
        
        {/* Navbar akan menempel di atas */}
        <NavBar />

        {/* 3. WADAH KONTEN DINAMIS (Children) */}
        {/* flex-1 dan overflow-y-auto memastikan hanya area tengah ini yang bisa di-scroll */}
        <main className="flex-1 overflow-y-auto bg-slate-50/50">
          <div className="mx-auto h-full max-w-[1200px] p-4 md:p-8">
            {children}
          </div>
        </main>
        
      </div>
    </div>
  );
}