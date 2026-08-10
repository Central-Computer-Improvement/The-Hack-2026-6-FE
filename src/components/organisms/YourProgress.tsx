import { 
  Trophy, 
  TrendingUp
} from "lucide-react";
import { Heading, Text } from "@/components/atoms/Typography";

export default function YourProgress() {
  return (
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
                <Text variant="label-bold">Sat</Text>
                <Text variant="label-bold">Sun</Text>
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
  );
}