import { ButtonHTMLAttributes, ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface ButtonPillProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "secondary" | "danger";
  icon?: LucideIcon;
}

export default function ButtonPill({
  children,
  variant = "secondary",
  icon: Icon,
  className = "",
  ...props
}: ButtonPillProps) {
  // Logika penentuan warna berdasarkan varian
  const variantClasses = {
    secondary: "bg-slate-200 text-slate-800 hover:bg-slate-300",
    danger: "bg-red-100 text-red-600 border border-red-200 hover:bg-red-200",
  };

  return (
    <button
      className={`flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-[14px] font-bold transition-all active:scale-[0.98] ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {/* Render Ikon jika properti icon diisi */}
      {Icon && <Icon className="h-[18px] w-[18px]" strokeWidth={2.5} />}
      {children}
    </button>
  );
}