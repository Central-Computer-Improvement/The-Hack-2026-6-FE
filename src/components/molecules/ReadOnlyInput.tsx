import { LucideIcon } from "lucide-react";

interface ReadOnlyInputProps {
  icon: LucideIcon;
  value: string;
  className?: string;
}

export default function ReadOnlyInput({
  icon: Icon,
  value,
  className = "",
}: ReadOnlyInputProps) {
  return (
    <div
      className={`flex items-center gap-4 rounded-[14px] bg-slate-100 px-5 py-3.5 ${className}`}
    >
      {/* Ikon di sebelah kiri */}
      <Icon className="h-5 w-5 text-slate-500" strokeWidth={2} />
      
      {/* Teks nilai (Value) */}
      <span className="text-[15px] font-medium text-slate-400">
        {value}
      </span>
    </div>
  );
}