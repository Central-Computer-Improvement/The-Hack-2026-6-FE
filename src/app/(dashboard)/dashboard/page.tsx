import { 
  Flame, 
  Star, 
  Rocket, 
  BookOpen, 
  Lightbulb, 
  Trophy, 
  TrendingUp, 
  Sparkles, 
  MoreVertical, 
  Plus 
} from "lucide-react";
import { MOCK_PROFILE } from "@/constants/mockData";
import { Heading, Text } from "@/components/atoms/Typography";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const getIconForSubject = (subjectName: string, isMastered: boolean) => {
    const className = `h-8 w-8 ${isMastered ? "text-indigo-500" : "text-slate-400"}`;
    if (subjectName.toLowerCase().includes("math")) return <BookOpen className={className} />;
    if (subjectName.toLowerCase().includes("science")) return <Rocket className={className} />;
    if (subjectName.toLowerCase().includes("history")) return <Lightbulb className={className} />;
    return <Trophy className={className} />;
  };

  return (
    <div className="w-full max-w-[1000px] pb-24 font-sans">
      
      {/* SECTION 1: REWARD ROOM */}
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


      {/* SECTION 2: YOUR PROGRESS */}
      <div className="mt-16">
        <div className="mb-8">
          <Heading level={2} variant="headline-large">
            Your Progress!
          </Heading>
          <Text variant="muted">
            Keep up the great work, you are crushing it.
          </Text>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          
          {/* Learning Hours Chart (Kiri - Span 2) */}
          <div className="flex min-h-[280px] flex-col rounded-[24px] bg-white p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] lg:col-span-2">
            <div className="mb-8 flex items-start justify-between">
              <div>
                <Text variant="label-bold">Learning Hours</Text>
                <Text variant="muted">This Week</Text>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-indigo-500 px-3.5 py-1.5 text-xs font-bold text-white">
                <TrendingUp className="h-3.5 w-3.5" /> +15%
              </div>
            </div>
            
            {/* Mock Chart Area */}
            <div className="flex flex-1 gap-4">
              <div className="flex flex-col justify-between pb-6 text-xs font-medium text-slate-400">
                <Text variant="muted">4h</Text>
                <Text variant="muted">2h</Text>
                <Text variant="muted">0h</Text>
              </div>
              <div className="flex flex-1 items-end justify-between border-b border-slate-100 pb-2">
                {/* area bar grafik */}
                <Text variant="label-bold">Mon</Text>
                <Text variant="label-bold">Tue</Text>
                <Text variant="label-bold">Wed</Text>
                <Text variant="label-bold">Thu</Text>
                <Text variant="label-bold">Fri</Text>
              </div>
            </div>
          </div>

          {/* Mastery Stats */}
          <div className="flex min-h-[280px] flex-col rounded-[24px] bg-white p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
            <Heading variant="h6" className="text-slate-700 mb-2">Mastery</Heading>
            
            <div className="my-8 flex flex-col items-center justify-center">
              <Trophy className="mb-2 h-10 w-10 text-indigo-500" />
              <Heading variant="headline-medium">12</Heading>
              <Text variant="muted">Skills</Text>
            </div>
            
            <div className="mt-auto flex justify-center gap-5">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-indigo-500"></div>
                <Text variant="small" className="font-bold">Math (75%)</Text>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-amber-400"></div>
                <Text variant="small" className="font-bold">Science (60%)</Text>
              </div>
            </div>
          </div>

        </div>
      </div>


      {/* SECTION 3: TASK SPLITTER */}
      <div className="mt-16">
        <div className="mb-8">
          <Heading level={2} variant="headline-large">
            Split Tasks
          </Heading>
          <Text variant="muted">
            Easy way to learn more
          </Text>
        </div>
        
        {/* Top Input Form Container */}
        <div className="mb-10 flex flex-col items-end gap-4 rounded-[24px] bg-white p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] md:flex-row">
          <div className="w-full flex-1">
            <Text variant="body-medium" className="font-bold mb-2">What do you need to do?</Text>
            <input 
              type="text" 
              placeholder="e.g. Science Project about Volcanoes" 
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-[14px] focus:outline-none focus:ring-2 focus:ring-indigo-base" 
            />
          </div>
          <div className="w-full md:w-[220px]">
            <Text variant="body-medium" className="font-bold mb-2">Deadline</Text>
            <input 
              type="date" 
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-[14px] text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-base" 
            />
          </div>
          <Button type="submit" className="flex h-12 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-base px-8 font-bold text-white transition-colors hover:bg-indigo-700 md:w-auto">
            <Sparkles className="h-5 w-5" /> Split it!
          </Button>
        </div>

        {/* Micro-Tasks Timeline */}
        <div>
          <Heading variant="headline-medium" className="mb-4">
            Your Micro-Tasks
          </Heading>
          
          <div className="relative pl-10">
            {/* Garis vertikal timeline */}
            <div className="absolute bottom-6 left-[19px] top-6 w-0.5 bg-slate-200"></div>

            {/* Task 1 */}
            <div className="relative mb-5">
              {/* Lingkaran Titik Timeline */}
              <div className="absolute -left-[32.5px] top-5 h-6 w-6 rounded-full border-2 border-slate-200 bg-slate-100"></div>
              
              <div className="flex flex-col gap-4 rounded-[20px] bg-white p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <Heading variant="h5">Gather Materials</Heading>
                  <Text variant="muted">Find cardboard, paint, and baking soda.</Text>
                </div>
                <div className="flex items-center gap-3">
                  <Text variant="small" className="rounded-full bg-indigo-500 px-4 py-1.5 font-bold text-white">Step 1</Text>
                  <button className="text-slate-400 hover:text-slate-600"><MoreVertical className="h-5 w-5" /></button>
                </div>
              </div>
            </div>

            {/* Task 2 */}
            <div className="relative mb-5">
              <div className="absolute -left-[32.5px] top-5 h-6 w-6 rounded-full border-2 border-slate-200 bg-slate-100"></div>
              
              <div className="flex flex-col gap-4 rounded-[20px] bg-white p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <Heading variant="h5">Build Volcano Structure</Heading>
                  <Text variant="muted">Shape the cardboard and glue it together.</Text>
                </div>
                <div className="flex items-center gap-3">
                  <Text variant="small" className="rounded-full bg-amber-100 px-4 py-1.5 text-xs font-bold text-amber-700">Step 2</Text>
                  <button className="text-slate-400 hover:text-slate-600"><MoreVertical className="h-5 w-5" /></button>
                </div>
              </div>
            </div>

            {/* Tombol Tambah Task */}
            <div className="relative mt-2">
              <div className="absolute -left-[24px] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-slate-200"></div>
              <button className="flex items-center gap-2 text-[14px] font-bold text-indigo-base hover:text-indigo-700">
                <Plus className="h-4 w-4" /> Add a custom step
              </button>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}