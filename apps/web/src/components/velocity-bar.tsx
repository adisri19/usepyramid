"use client";

import { useTasks } from "@/context/tasks-context";
import { CheckCircle2, TrendingUp, Sparkles, Command } from "lucide-react";

interface VelocityBarProps {
  onOpenCommandPalette?: () => void;
}

export function VelocityBar({ onOpenCommandPalette }: VelocityBarProps) {
  const { tasks } = useTasks();

  const total = tasks.length;
  const completed = tasks.filter(t => t.status === "Completed").length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
  const inProgress = tasks.filter(t => t.status === "Doing").length;
  const urgent = tasks.filter(t => t.priority === "Urgent" && t.status !== "Completed").length;

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-200/80 bg-zinc-50/50 p-3.5 mb-6 dark:border-zinc-800 dark:bg-zinc-900/30">
      <div className="flex items-center gap-4 flex-1 min-w-[240px]">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent/10 text-accent">
            <TrendingUp className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-900 dark:text-white">
                Workspace Velocity
              </span>
              <span className="text-[11px] font-bold text-accent">
                {percent}% Done
              </span>
            </div>
            <p className="text-[10px] text-zinc-450">
              {completed} of {total} tasks completed &bull; {inProgress} in progress
            </p>
          </div>
        </div>

        {/* Animated Progress Bar */}
        <div className="flex-1 max-w-xs h-2 rounded-full bg-zinc-200/80 overflow-hidden dark:bg-zinc-800">
          <div
            className="h-full rounded-full bg-accent transition-all duration-500 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        {urgent > 0 && (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-[10px] font-bold text-red-650 dark:bg-red-950/40 dark:text-red-400">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
            {urgent} Urgent
          </span>
        )}

        {onOpenCommandPalette && (
          <button
            onClick={onOpenCommandPalette}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-zinc-600 shadow-2xs hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-850 transition-colors"
          >
            <Command className="h-3 w-3" />
            <span>Command Menu</span>
            <kbd className="rounded bg-zinc-100 px-1 py-0.2 text-[9px] font-bold text-zinc-500 dark:bg-zinc-800">⌘K</kbd>
          </button>
        )}
      </div>
    </div>
  );
}
