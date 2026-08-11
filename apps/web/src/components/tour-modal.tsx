"use client";

import { X, Sparkles, LayoutGrid, Terminal, Palette, Database, ShieldCheck, Zap } from "lucide-react";
import { PyramidLogoBadge } from "./pyramid-logo";

interface TourModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TourModal({ isOpen, onClose }: TourModalProps) {
  if (!isOpen) return null;

  const features = [
    {
      icon: <LayoutGrid className="h-5 w-5 text-accent" />,
      title: "Kanban Drag & Drop with Tilt Physics",
      desc: "Smooth @dnd-kit drag-and-drop between To Do, Doing, Completed, and On Hold with distance sensors and spring drop animations.",
    },
    {
      icon: <Zap className="h-5 w-5 text-amber-500" />,
      title: "Parallel & Intercepting Slide-Out Routes",
      desc: "Instant modal slide-outs (@detail/(.)[taskId]) with full-page fallback (/tasks/[taskId]) and live metadata editing.",
    },
    {
      icon: <Terminal className="h-5 w-5 text-blue-500" />,
      title: "Linear-Style ⌘K Command Palette & Hotkeys",
      desc: "Press ⌘K / Ctrl+K anywhere for fuzzy search, theme switching, task creation (C), view switches (B, L), and CSV export.",
    },
    {
      icon: <Palette className="h-5 w-5 text-pink-500" />,
      title: "Zero-FOUC Dual-Axis Server Theming",
      desc: "Light/Dark modes + 6 accent color themes persisted server-side in cookies to prevent layout flash on page reloads.",
    },
    {
      icon: <Sparkles className="h-5 w-5 text-purple-500" />,
      title: "AI Task Breakdown & Subtask Generator",
      desc: "1-click AI task decomposition directly inside the detail panel to generate actionable subtasks with smart priorities.",
    },
    {
      icon: <ShieldCheck className="h-5 w-5 text-emerald-500" />,
      title: "Enterprise Dual Auth & Auto-Seeding",
      desc: "1-click Guest session + Google OAuth with HttpOnly JWT cookies and automatic Figma mock data provisioning.",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/65 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <PyramidLogoBadge className="h-9 w-9 rounded-xl" iconClassName="h-5 w-5" />
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                Pyramid Engineering Tour <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent font-bold">Highlights</span>
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Key architecture and feature highlights built into this submission
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

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-5">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-zinc-100 bg-zinc-50/50 p-4 transition-all hover:bg-zinc-50 dark:border-zinc-800/60 dark:bg-zinc-800/25 dark:hover:bg-zinc-800/40"
            >
              <div className="flex items-center gap-2.5 mb-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700/60">
                  {feat.icon}
                </div>
                <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                  {feat.title}
                </h4>
              </div>
              <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800">
          <span className="text-xs text-zinc-400">Press <kbd className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-[10px] font-mono">?</kbd> anytime for keyboard shortcuts</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-900 text-xs font-bold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 transition-colors"
          >
            Explore Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
