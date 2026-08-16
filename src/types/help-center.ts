// file: src/types/help-center.ts
import { LucideIcon } from "lucide-react";

export interface HelpTopic {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  iconBg: string; // tailwind bg-* class
  iconColor: string; // tailwind text-* class
}

export interface FaqItem {
  id: string;
  question: string;
  /** string = paragraf biasa, string[] = ditampilkan sebagai daftar langkah bernomor */
  answer: string | string[];
}
