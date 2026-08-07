"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { TaskDetailPanel } from "@/components/task-detail-panel";

interface PageProps {
  params: Promise<{ taskId: string }>;
}

export default function TaskDetailInterceptPage({ params }: PageProps) {
  const router = useRouter();
  const { taskId } = use(params);

  const handleBackdropClick = () => {
    router.back();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-zinc-950/20 backdrop-blur-[1px] animate-fade-in">
      {/* Backdrop */}
      <div 
        onClick={handleBackdropClick}
        className="absolute inset-0 cursor-default"
      />
      {/* Detail Slideover panel */}
      <div className="relative h-full w-full max-w-2xl bg-white shadow-2xl animate-slide-left dark:bg-zinc-950">
        <TaskDetailPanel taskId={taskId} isOverlay={true} />
      </div>
    </div>
  );
}
