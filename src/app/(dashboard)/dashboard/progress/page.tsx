
import YourProgress from "@/components/organisms/YourProgress";
import TaskSplitter from "@/components/organisms/TaskSplitter";

export default function DashboardPage() {
  return (
    <div className="w-full w-full pb-24">
      {/* SECTION 1: Your Progress*/}
      <YourProgress/>
    </div>
  );
}