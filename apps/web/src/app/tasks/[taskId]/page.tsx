"use client";

import { use } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { TaskDetailPanel } from "@/components/task-detail-panel";

interface PageProps {
  params: Promise<{ taskId: string }>;
}

export default function TaskDetailPage({ params }: PageProps) {
  const { taskId } = use(params);

  return (
    <DashboardLayout title="Task Detail">
      <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-850 dark:bg-zinc-950 max-w-4xl mx-auto h-[calc(100vh-120px)] overflow-hidden">
        <TaskDetailPanel taskId={taskId} isOverlay={false} />
      </div>
    </DashboardLayout>
  );
}
