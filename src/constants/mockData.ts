/// TYPES & INTERFACES (Definisi Struktur Data)
export type Role = "student" | "admin";
export type NodeStatus = "locked" | "in-progress" | "completed";
export type ChatRole = "user" | "ai";

export interface SubjectMastery {
  id: string;
  subject: string;
  masteryPercentage: number;
  isNew?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  role: Role;
  totalPoints: number;
  currentStreak: number;
  subjectMastery: SubjectMastery[];
}

export interface ChatMessage {
  id: string;
  role: ChatRole;
  message: string;
  timestamp: string;
}

export interface RoadmapNode {
  id: string;
  sequence: number;
  title: string;
  description: string;
  status: NodeStatus;
  type: "video" | "pdf" | "quiz";
  pointsReward: number;
}


/// MOCK DATA 
// 1. data Profil & Dashboard
export const MOCK_PROFILE: UserProfile = {
  id: "USR-001",
  name: "Bintang",
  role: "student",
  totalPoints: 1240,
  currentStreak: 7,
  subjectMastery: [
    {
      id: "SUB-01",
      subject: "Math: Algebra",
      masteryPercentage: 80,
      isNew: false,
    },
    {
      id: "SUB-02",
      subject: "Science: Bio",
      masteryPercentage: 5,
      isNew: true,
    },
    {
      id: "SUB-03",
      subject: "History",
      masteryPercentage: 45,
      isNew: false,
    },
  ],
};

// 2. data AI Study Buddy
export const MOCK_CHAT_HISTORY: ChatMessage[] = [
  {
    id: "MSG-001",
    role: "ai",
    message: "Halo Bintang! Ayo kita mulai belajar Fotosintesis hari ini. Masih ingat 3 bahan utama yang dibutuhkan tanaman untuk membuat makanannya sendiri?",
    timestamp: "14:30",
  },
  {
    id: "MSG-002",
    role: "user",
    message: "Hmm, aku tahu salah satunya cahaya matahari! Dan air... tapi aku lupa yang ketiga.",
    timestamp: "14:32",
  },
  {
    id: "MSG-003",
    role: "ai",
    message: "Kamu hebat, sudah ingat 2 dari 3! 🌟 Yang terakhir ada di udara yang kita hembuskan. Namanya Karbon Dioksida (CO2). Jadi lengkapnya: Cahaya Matahari, Air, dan CO2.",
    timestamp: "14:33",
  },
  {
    id: "MSG-004",
    role: "user",
    message: "Oh iya! Terus bagaimana cara mereka memasaknya?",
    timestamp: "14:35",
  },
  {
    id: "MSG-005",
    role: "ai",
    message: "Pertanyaan bagus! Tanaman punya 'dapur' kecil di daunnya yang bernama Kloroplas. Di situlah cahaya matahari digunakan untuk mengubah air dan CO2 menjadi makanan dan Oksigen.",
    timestamp: "14:36",
  },
  {
    id: "MSG-006",
    role: "user",
    message: "Wah keren! Berarti tanaman ngasih kita udara buat napas dong?",
    timestamp: "14:38",
  },
  {
    id: "MSG-007",
    role: "ai",
    message: "Tepat sekali! Itulah kenapa pohon sangat penting buat kita. Mau coba kuis singkat tentang ini?",
    timestamp: "14:38",
  },
  {
    id: "MSG-008",
    role: "user",
    message: "Boleh, kasih pertanyaan yang gampang dulu ya!",
    timestamp: "14:40",
  },
  {
    id: "MSG-009",
    role: "ai",
    message: "Siap! Pertanyaan pertama: Apa nama 'dapur' kecil yang ada di dalam daun tanaman?",
    timestamp: "14:40",
  },
];

// 3. data Roadmap AI
export const MOCK_ROADMAP: RoadmapNode[] = [
  {
    id: "NODE-1",
    sequence: 1,
    title: "Pengenalan Sel Tumbuhan",
    description: "Mari mengenal bagian-bagian dasar dari tumbuhan.",
    status: "completed",
    type: "video",
    pointsReward: 50,
  },
  {
    id: "NODE-2",
    sequence: 2,
    title: "Apa itu Klorofil?",
    description: "Membaca ringkasan tentang zat hijau daun.",
    status: "completed",
    type: "pdf",
    pointsReward: 50,
  },
  {
    id: "NODE-3",
    sequence: 3,
    title: "Proses Fotosintesis",
    description: "Bagaimana tumbuhan memasak makanannya?",
    status: "in-progress",
    type: "video",
    pointsReward: 50,
  },
  {
    id: "NODE-4",
    sequence: 4,
    title: "Mini Kuis: Biologi Dasar",
    description: "Uji pemahamanmu sebelum lanjut ke bab berikutnya.",
    status: "locked",
    type: "quiz",
    pointsReward: 100,
  },
  {
    id: "NODE-5",
    sequence: 5,
    title: "Rantai Makanan Ekosistem",
    description: "Mempelajari interaksi antar makhluk hidup.",
    status: "locked",
    type: "video",
    pointsReward: 50,
  },
];