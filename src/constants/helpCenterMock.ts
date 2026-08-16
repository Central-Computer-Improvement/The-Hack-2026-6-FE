// file: src/constants/helpCenterMock.ts
import { User, Route, Bot, BookOpen, UploadCloud, Trophy } from "lucide-react";
import { HelpTopic, FaqItem } from "@/types/help-center";

export const HELP_TOPICS: HelpTopic[] = [
  {
    id: "TOPIC-01",
    title: "Masalah Login & Akun",
    description: "Bantuan untuk login, daftar akun, dan password",
    icon: User,
    iconBg: "bg-indigo-base",
    iconColor: "text-white",
  },
  {
    id: "TOPIC-02",
    title: "AI Learning Roadmap",
    description: "Pelajari cara menggunakan dan mengikuti roadmap belajar",
    icon: Route,
    iconBg: "bg-amber-soft",
    iconColor: "text-amber-dark",
  },
  {
    id: "TOPIC-03",
    title: "AI Study Buddy",
    description: "Pelajari cara bertanya dan belajar bersama AI",
    icon: Bot,
    iconBg: "bg-teal-100",
    iconColor: "text-teal-600",
  },
  {
    id: "TOPIC-04",
    title: "Materi & Video",
    description: "Bantuan untuk mengakses dan mempelajari materi",
    icon: BookOpen,
    iconBg: "bg-indigo-soft",
    iconColor: "text-indigo-base",
  },
  {
    id: "TOPIC-05",
    title: "Upload Dokumen & Quiz",
    description: "Pelajari cara upload PDF/PPT dan membuat quiz",
    icon: UploadCloud,
    iconBg: "bg-amber-soft",
    iconColor: "text-amber-dark",
  },
  {
    id: "TOPIC-06",
    title: "Progress & Rewards",
    description: "Lihat informasi tentang progress, poin, streak, dan badge",
    icon: Trophy,
    iconBg: "bg-indigo-base",
    iconColor: "text-white",
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "FAQ-01",
    question: "Bagaimana cara menggunakan AI Learning Roadmap?",
    answer: [
      'Pilih topik atau tujuan belajarmu di menu "Roadmap".',
      "Ikuti kuis singkat agar AI dapat menilai tingkat kemampuan awalmu.",
      "AI akan membuatkan jalur belajar khusus yang terdiri dari modul-modul yang disesuaikan.",
      "Ikuti modul secara berurutan untuk mendapatkan pemahaman terbaik.",
    ],
  },
  {
    id: "FAQ-02",
    question: "Apakah saya bisa mengakses materi secara offline?",
    answer:
      "Saat ini seluruh materi (video, ringkasan, dan quiz) memerlukan koneksi internet karena diproses dan disesuaikan secara real-time oleh AI. Fitur unduh materi untuk akses offline sedang kami pertimbangkan untuk pengembangan berikutnya.",
  },
  {
    id: "FAQ-03",
    question: "Bagaimana cara mereset password akun saya?",
    answer:
      'Buka halaman login, klik "Lupa Password", lalu masukkan email yang terdaftar. Kami akan mengirimkan tautan reset password ke email tersebut. Jika kamu login menggunakan Google, password diatur langsung lewat akun Google-mu.',
  },
  {
    id: "FAQ-04",
    question: "Format dokumen apa saja yang didukung untuk diupload?",
    answer:
      "Kamu bisa mengunggah file dalam format PDF atau PPT dengan ukuran maksimal 15MB. Pastikan dokumenmu berisi teks (bukan hasil scan gambar tanpa OCR) agar AI dapat membuatkan ringkasan dan kuis dengan baik.",
  },
  {
    id: "FAQ-05",
    question: "Bagaimana cara mendapatkan poin dan badge?",
    answer:
      "Kamu mendapat +50 poin setiap menyelesaikan 1 video/materi, dan +100 poin setiap menyelesaikan kuis dengan sempurna. Badge pencapaian akan muncul otomatis saat kamu mencapai target tertentu, misalnya mempertahankan streak belajar harian.",
  },
  {
    id: "FAQ-06",
    question: "Bagaimana cara menghubungi AI Study Buddy?",
    answer:
      'Buka menu "Study Buddy" di sidebar, lalu ketik pertanyaanmu di kolom chat atau pilih salah satu saran pertanyaan yang tersedia. AI Study Buddy siap membantu menjelaskan materi dengan bahasa yang santai dan mudah dipahami.',
  },
];
