import { 
  Flame, 
  Star, 
  Rocket, 
  BookOpen, 
  Lightbulb, 
  Trophy
} from "lucide-react";
import { MOCK_PROFILE } from "@/constants/mockData";
import { Heading, Text } from "@/components/atoms/Typography";

export default function RewardRoom() {
  const getIconForSubject = (subjectName: string, isMastered: boolean) => {
    const className = `h-8 w-8 ${isMastered ? "text-indigo-500" : "text-slate-400"}`;
    if (subjectName.toLowerCase().includes("math")) return <BookOpen className={className} />;
    if (subjectName.toLowerCase().includes("science")) return <Rocket className={className} />;
    if (subjectName.toLowerCase().includes("history")) return <Lightbulb className={className} />;
    return <Trophy className={className} />;
  };

  return (
      <div>
        <div className="mb-8">
          <Heading level={1} variant="headline-large">
            Reward Room
          </Heading>
          <Text variant="muted">
            Celebrate your achievements and see how far you have come!
          </Text>
        </div>

        <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex items-center justify-between rounded-[24px] bg-white p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] transition-transform hover:scale-[1.02]">
            <div>
              <Heading variant="h6" className="text-slate-700 mb-2">Total Knowledge Points</Heading>
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
              <Heading variant="h6" className="text-slate-700 mb-2">Current Learning Streak</Heading>
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

        <div>
          <Heading level={2} className ="mb-6">
            Subject Mastery Progress
          </Heading>
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
            {MOCK_PROFILE.subjectMastery.map((subject) => {
              const isMastered = subject.masteryPercentage >= 50;
              return (
                <div key={subject.id} className={`relative flex aspect-square flex-col items-center justify-center rounded-[24px] p-6 text-center transition-transform hover:scale-[1.03] cursor-pointer ${isMastered ? "bg-white shadow-[0_4px_20px_rgb(0,0,0,0.03)]" : "bg-white/40 border border-dashed border-slate-300"}`}>
                  {subject.isNew && (
                    <span className="absolute right-4 top-4 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">NEW</span>
                  )}
                  <div className={`mb-4 flex h-20 w-20 items-center justify-center rounded-full ${isMastered ? "bg-slate-100/80 border border-slate-100" : "bg-slate-200/50"}`}>
                    {getIconForSubject(subject.subject, isMastered)}
                  </div>
                  <h4 className={`text-[15px] font-extrabold ${isMastered ? "text-slate-900" : "text-slate-500"}`}>{subject.subject}</h4>
                  <p className="mb-3 text-[13px] font-medium text-slate-500">Mastery: {subject.masteryPercentage}%</p>
                  <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                    <div className={`h-full rounded-full ${isMastered ? "bg-amber-400" : "bg-indigo-base"}`} style={{ width: `${subject.masteryPercentage}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
  );
}