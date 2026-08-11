"use client";

import { useTasks } from "@/context/tasks-context";
import { X, TrendingUp, CheckCircle2, AlertTriangle, Clock, BarChart3, Layers } from "lucide-react";

interface AnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AnalyticsModal({ isOpen, onClose }: AnalyticsModalProps) {
  const { tasks, projects } = useTasks();

  if (!isOpen) return null;

  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "Completed").length;
  const inProgress = tasks.filter((t) => t.status === "Doing").length;
  const todo = tasks.filter((t) => t.status === "To Do").length;
  const onHold = tasks.filter((t) => t.status === "On Hold").length;

  const urgent = tasks.filter((t) => t.priority === "Urgent" && t.status !== "Completed").length;
  const high = tasks.filter((t) => t.priority === "High" && t.status !== "Completed").length;
  const medium = tasks.filter((t) => t.priority === "Medium" && t.status !== "Completed").length;
  const low = tasks.filter((t) => t.priority === "Low" && t.status !== "Completed").length;

  const completionPct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Workspace Velocity & Insights
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Real-time performance metrics and completion velocity
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
          <div className="rounded-2xl border border-zinc-100 bg-zinc-50/50 p-4 dark:border-zinc-800/60 dark:bg-zinc-800/30">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">Completion</span>
              <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
            </div>
            <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-100">{completionPct}%</p>
            <span className="text-[10px] text-zinc-400">{completed} of {total} tasks</span>
          </div>

          <div className="rounded-2xl border border-zinc-100 bg-zinc-50/50 p-4 dark:border-zinc-800/60 dark:bg-zinc-800/30">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">In Progress</span>
              <Clock className="h-3.5 w-3.5 text-amber-500" />
            </div>
            <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-100">{inProgress}</p>
            <span className="text-[10px] text-zinc-400">active sprint items</span>
          </div>

          <div className="rounded-2xl border border-zinc-100 bg-zinc-50/50 p-4 dark:border-zinc-800/60 dark:bg-zinc-800/30">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">Urgent Issues</span>
              <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
            </div>
            <p className="mt-2 text-2xl font-bold text-red-600 dark:text-red-400">{urgent}</p>
            <span className="text-[10px] text-zinc-400">requires immediate action</span>
          </div>

          <div className="rounded-2xl border border-zinc-100 bg-zinc-50/50 p-4 dark:border-zinc-800/60 dark:bg-zinc-800/30">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">Projects</span>
              <Layers className="h-3.5 w-3.5 text-blue-500" />
            </div>
            <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-100">{projects.length}</p>
            <span className="text-[10px] text-zinc-400">active workspaces</span>
          </div>
        </div>

        {/* Status Distribution Visual Bar */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            <span>Status Distribution</span>
            <span>{total} Total Tasks</span>
          </div>
          <div className="h-3 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden flex">
            {completed > 0 && (
              <div 
                style={{ width: `${(completed / total) * 100}%` }} 
                className="bg-emerald-500 transition-all duration-500" 
                title={`Completed: ${completed}`} 
              />
            )}
            {inProgress > 0 && (
              <div 
                style={{ width: `${(inProgress / total) * 100}%` }} 
                className="bg-accent transition-all duration-500" 
                title={`In Progress: ${inProgress}`} 
              />
            )}
            {todo > 0 && (
              <div 
                style={{ width: `${(todo / total) * 100}%` }} 
                className="bg-blue-400 transition-all duration-500" 
                title={`To Do: ${todo}`} 
              />
            )}
            {onHold > 0 && (
              <div 
                style={{ width: `${(onHold / total) * 100}%` }} 
                className="bg-zinc-400 transition-all duration-500" 
                title={`On Hold: ${onHold}`} 
              />
            )}
          </div>
          <div className="flex flex-wrap items-center gap-4 text-[11px] pt-1 text-zinc-500 dark:text-zinc-400">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Completed ({completed})</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-accent" /> Doing ({inProgress})</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-blue-400" /> To Do ({todo})</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-zinc-400" /> On Hold ({onHold})</span>
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="rounded-2xl border border-zinc-100 bg-zinc-50/50 p-4 dark:border-zinc-800/60 dark:bg-zinc-800/30">
          <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-3">
            Open Task Priority Matrix
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
              <span className="text-xs font-semibold text-red-600">Urgent</span>
              <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{urgent}</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
              <span className="text-xs font-semibold text-red-500">High</span>
              <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{high}</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
              <span className="text-xs font-semibold text-amber-500">Medium</span>
              <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{medium}</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
              <span className="text-xs font-semibold text-zinc-500">Low</span>
              <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{low}</span>
            </div>
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-900 text-xs font-bold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
