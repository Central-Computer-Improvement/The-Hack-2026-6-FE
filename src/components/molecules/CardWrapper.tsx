import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface CardWrapperProps {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
  className?: string;
}

export default function CardWrapper({
  title,
  icon: Icon,
  children,
  className = "",
}: CardWrapperProps) {
  return (
    <div
      className={`flex flex-col rounded-[24px] border border-slate-200 bg-white shadow-sm overflow-hidden ${className}`}
    >
      {/* HEADER CARD: Ikon dan Judul */}
      <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5">
        <Icon className="h-5 w-5 text-slate-700" strokeWidth={2.5} />
        <h2 className="text-[16px] font-bold tracking-tight text-slate-800">
          {title}
        </h2>
      </div>

      {/* BODY CARD: Tempat komponen lain (seperti input dan tombol) dimasukkan */}
      <div className="flex flex-col gap-3 p-6">
        {children}
      </div>
    </div>
  );
}