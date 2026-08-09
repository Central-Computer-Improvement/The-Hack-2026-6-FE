import { Heading, Text } from "@/components/atoms/typography";
import { RewardCard } from "@/components/molecules/RewardCard";
import { Award, BookOpen, Rocket, Target } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Halaman */}
      <div>
        <Heading level={1} variant="headline-large" className="mb-2">
          Welcome back! 🚀
        </Heading>
        <Text variant="muted" className="max-w-2xl">
          Terus pertahankan semangat belajarmu hari ini. Berikut adalah ringkasan progres dan pencapaian yang sedang kamu kejar.
        </Text>
      </div>

      {/* Sesi Kartu Pencapaian (Menguji Molekul RewardCard) */}
      <section>
        <Heading level={2} variant="h5" className="mb-4">
          Recent Achievements
        </Heading>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          
          <RewardCard
            title="Math Master"
            description="Level 5 Completed"
            isUnlocked={true}
            icon={Award}
            iconWrapperClassName="bg-amber-100 text-amber-600"
          />
          
          <RewardCard
            title="Bookworm"
            description="10 Books Read"
            isUnlocked={true}
            icon={BookOpen}
            iconWrapperClassName="bg-blue-100 text-blue-600"
          />
          
          <RewardCard
            title="Space Explorer"
            description="Science Lvl 10"
            isUnlocked={false}
            progressValue={65}
            icon={Rocket}
          />

          <RewardCard
            title="Focus Master"
            description="3 Hours Streak"
            isUnlocked={false}
            progressValue={30}
            icon={Target}
          />
          
        </div>
      </section>

      {/* Sesi Placeholder untuk Konten Lainnya */}
      <section>
        <Heading level={2} variant="h5" className="mb-4">
          Today's Missions
        </Heading>
        <div className="flex h-48 w-full items-center justify-center rounded-card border-2 border-dashed border-border bg-card">
          <Text variant="muted">Area ini akan diisi dengan daftar tugas harian nanti.</Text>
        </div>
      </section>
      
    </div>
  );
}