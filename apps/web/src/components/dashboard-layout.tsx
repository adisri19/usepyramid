"use client";

import { useState } from "react";
import { TasksProvider, useTasks } from "@/context/tasks-context";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { X, Check } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  return (
    <TasksProvider>
      <DashboardLayoutContent title={title}>{children}</DashboardLayoutContent>
    </TasksProvider>
  );
}

function DashboardLayoutContent({ children, title }: DashboardLayoutProps) {
  const { createTask, projects } = useTasks();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [addTaskOpen, setAddTaskOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskProject, setNewTaskProject] = useState("");

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      await createTask(
        newTaskTitle.trim(),
        "To Do",
        newTaskProject || undefined
      );
      setNewTaskTitle("");
      setNewTaskProject("");
      setAddTaskOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white dark:bg-zinc-950">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        isMobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        <Topbar
          title={title}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          onOpenAddTaskModal={() => setAddTaskOpen(true)}
        />
        
        <main className="flex-1 overflow-auto p-6 bg-white dark:bg-zinc-950">
          {children}
        </main>
      </div>

      {/* Add Task Modal Dialog (Standard Backdrop Dismiss & Esc support) */}
      {addTaskOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 backdrop-blur-xs p-4 animate-fade-in">
          {/* Backdrop click to close */}
          <div 
            onClick={() => setAddTaskOpen(false)} 
            className="absolute inset-0 cursor-default"
          />

          {/* Modal Card */}
          <div className="relative w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-850 dark:bg-zinc-900 animate-scale-up">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3 mb-4">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                Create New Task
              </h3>
              <button
                onClick={() => setAddTaskOpen(false)}
                className="rounded-lg p-1 hover:bg-zinc-100 text-zinc-400 hover:text-zinc-650 dark:hover:bg-zinc-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="flex flex-col gap-4">
              {/* Task Title */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  Task Title
                </label>
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="What needs to be done?"
                  required
                  autoFocus
                  className="rounded-lg border border-zinc-200 px-3 py-2 text-xs bg-transparent focus:outline-none focus:border-accent dark:border-zinc-800 text-zinc-800 dark:text-zinc-200"
                />
              </div>

              {/* Project association */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  Project (Optional)
                </label>
                <select
                  value={newTaskProject}
                  onChange={(e) => setNewTaskProject(e.target.value)}
                  className="rounded-lg border border-zinc-250 bg-white px-3 py-2 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200"
                >
                  <option value="">No Project</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setAddTaskOpen(false)}
                  className="px-3.5 py-2 rounded-lg border border-zinc-200 text-xs font-semibold hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-850"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-zinc-900 text-xs font-bold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
                >
                  <Check className="h-3.5 w-3.5 stroke-[2.5px]" />
                  <span>Create Task</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
