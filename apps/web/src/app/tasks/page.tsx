"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { BoardView } from "@/components/board-view";
import { ListView } from "@/components/list-view";
import { useTasks } from "@/context/tasks-context";

export default function TasksPage() {
  return (
    <DashboardLayout title="Tasks">
      <TasksContent />
    </DashboardLayout>
  );
}

function TasksContent() {
  const { view } = useTasks();
  return view === "board" ? <BoardView /> : <ListView />;
}
