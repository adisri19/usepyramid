"use client";

import { use, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { BoardView } from "@/components/board-view";
import { ListView } from "@/components/list-view";
import { TasksProvider, useTasks } from "@/context/tasks-context";

interface PageProps {
  params: Promise<{ projectId: string }>;
}

export default function ProjectDetailPage({ params }: PageProps) {
  const { projectId } = use(params);

  return (
    <TasksProvider>
      <ProjectDashboardContent projectId={projectId} />
    </TasksProvider>
  );
}

function ProjectDashboardContent({ projectId }: { projectId: string }) {
  const { view, setFilters, projects } = useTasks();
  
  const currentProject = projects.find((p) => p.id === projectId);
  const title = currentProject ? `Projects > ${currentProject.name}` : "Projects";

  useEffect(() => {
    setFilters({ project: projectId });
  }, [projectId, setFilters]);

  return (
    <DashboardLayout title={title}>
      {view === "board" ? <BoardView /> : <ListView />}
    </DashboardLayout>
  );
}
