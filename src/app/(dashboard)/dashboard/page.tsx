import RewardRoom from "@/components/organisms/RewardRoom";
import YourProgress from "@/components/organisms/YourProgress";
import TaskSplitter from "@/components/organisms/TaskSplitter";

export default function DashboardPage() {
  return (
    <div className="w-full w-full pb-24">
      {/* SECTION 1: REWARD ROOM */}
      <RewardRoom/>

      {/* SECTION 2: YOUR PROGRESS */}
      <YourProgress/>

      {/* SECTION 3: TASK SPLITTER */}
      <TaskSplitter/>
    </div>
  );
}