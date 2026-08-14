import { 
  Sparkles, 
  MoreVertical, 
  Plus 
} from "lucide-react";
import { Heading, Text } from "@/components/atoms/Typography";
import { Button } from "@/components/ui/button";
import FadeIn from "../atoms/framer/FadeIn";

export default function TaskSplitter() {
    return (
    <FadeIn direction="up">
        <div className="mt-2 mb-4">
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
      </FadeIn>
  );
}