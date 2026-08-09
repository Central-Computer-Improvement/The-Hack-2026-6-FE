import { Flame, Star, Rocket, BookOpen, Lightbulb, Trophy } from "lucide-react";
import { MOCK_PROFILE } from "@/constants/mockData";

export default function DashboardPage() {
  // Fungsi sederhana untuk memilih ikon berdasarkan nama subjek
  const getIconForSubject = (subjectName: string, isMastered: boolean) => {
    const className = `h-8 w-8 ${isMastered ? "text-indigo-500" : "text-slate-400"}`;
    if (subjectName.toLowerCase().includes("math")) return <BookOpen className={className} />;
    if (subjectName.toLowerCase().includes("science")) return <Rocket className={className} />;
    if (subjectName.toLowerCase().includes("history")) return <Lightbulb className={className} />;
    return <Trophy className={className} />;
  };

  return (
    <div className="w-full max-w-[1000px] pb-20 font-sans">
      
      {/* Header Halaman */}
      <div className="mb-8">
        <h1 className="mb-2 text-[32px] font-extrabold tracking-tight text-slate-900">
          Reward Room
        </h1>
        <p className="text-[16px] font-medium text-slate-500">
          Celebrate your achievements and see how far you've come!
        </p>
      </div>

      {/* =========================================================
          STATISTIK UTAMA (Dari totalPoints & currentStreak)
          ========================================================= */}
      <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2">
        
        <div className="flex items-center justify-between rounded-[24px] bg-white p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] transition-transform hover:scale-[1.02]">
          <div>
            <h3 className="mb-2 text-[15px] font-bold text-slate-700">Total Knowledge Points</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-[46px] font-black tracking-tight text-indigo-base leading-none">
                {MOCK_PROFILE.totalPoints.toLocaleString("id-ID")}
              </span>
              <span className="text-[20px] font-bold text-indigo-300">KP</span>
            </div>
          </div>
          <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-indigo-500 text-white shadow-lg shadow-indigo-500/30">
            <Star className="h-8 w-8 fill-current" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-[24px] bg-white p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] transition-transform hover:scale-[1.02]">
          <div>
            <h3 className="mb-2 text-[15px] font-bold text-slate-700">Current Learning Streak</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-[46px] font-black tracking-tight text-amber-base leading-none">
                {MOCK_PROFILE.currentStreak}
              </span>
              <span className="text-[20px] font-bold text-amber-300">Days</span>
            </div>
          </div>
          <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-red-100 text-red-500">
            <Flame className="h-10 w-10 fill-current" />
          </div>
        </div>

      </div>

      {/* =========================================================
          SUBJECT MASTERY (Mapping Dinamis dari MOCK_PROFILE)
          ========================================================= */}
      <div>
        <h2 className="mb-6 text-[22px] font-bold tracking-tight text-slate-900">
          Subject Mastery Progress
        </h2>
        
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
          
          {MOCK_PROFILE.subjectMastery.map((subject) => {
            // Logika visual: Jika penguasaan >= 50, anggap kartu "solid/terbuka"
            const isMastered = subject.masteryPercentage >= 50;

            return (
              <div 
                key={subject.id} 
                className={`relative flex aspect-square flex-col items-center justify-center rounded-[24px] p-6 text-center transition-transform hover:scale-[1.03] cursor-pointer ${
                  isMastered 
                    ? "bg-white shadow-[0_4px_20px_rgb(0,0,0,0.03)]" 
                    : "bg-white/40 border border-dashed border-slate-300"
                }`}
              >
                {/* Indikator "NEW" Dinamis */}
                {subject.isNew && (
                  <span className="absolute right-4 top-4 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                    NEW
                  </span>
                )}

                {/* Ikon Lingkaran */}
                <div className={`mb-4 flex h-20 w-20 items-center justify-center rounded-full ${
                  isMastered ? "bg-slate-100/80 border border-slate-100" : "bg-slate-200/50"
                }`}>
                  {getIconForSubject(subject.subject, isMastered)}
                </div>

                {/* Teks Subjek */}
                <h4 className={`text-[15px] font-extrabold ${isMastered ? "text-slate-900" : "text-slate-500"}`}>
                  {subject.subject}
                </h4>
                
                <p className="mb-3 text-[13px] font-medium text-slate-500">
                  Mastery: {subject.masteryPercentage}%
                </p>

                {/* Progress Bar Dinamis sesuai persentase */}
                <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${isMastered ? "bg-amber-400" : "bg-indigo-base"}`} 
                    style={{ width: `${subject.masteryPercentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}

        </div>
      </div>

    </div>
  );
}