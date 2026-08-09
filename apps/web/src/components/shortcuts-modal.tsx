"use client";

import { X, Keyboard } from "lucide-react";

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShortcutsModal({ isOpen, onClose }: ShortcutsModalProps) {
  if (!isOpen) return null;

  const shortcutGroups = [
    {
      title: "General",
      items: [
        { key: "⌘ K / Ctrl K", label: "Open Command Palette" },
        { key: "?", label: "Show Keyboard Shortcuts" },
        { key: "Esc", label: "Close Modal / Overlay" },
      ],
    },
    {
      title: "Navigation & Views",
      items: [
        { key: "B", label: "Switch to Kanban Board View" },
        { key: "L", label: "Switch to List Table View" },
        { key: "⌘ F", label: "Focus Search Bar" },
      ],
    },
    {
      title: "Actions",
      items: [
        { key: "C", label: "Create New Task" },
        { key: "T", label: "Toggle Dark / Light Theme" },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 backdrop-blur-xs p-4 animate-fade-in">
      <div 
        onClick={onClose} 
        className="absolute inset-0 cursor-default"
      />

      <div className="relative w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 animate-scale-up">
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3 mb-5">
          <div className="flex items-center gap-2">
            <Keyboard className="h-4.5 w-4.5 text-accent" />
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
              Keyboard Shortcuts
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-zinc-100 text-zinc-400 hover:text-zinc-650 dark:hover:bg-zinc-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-col gap-5">
          {shortcutGroups.map((group) => (
            <div key={group.title} className="flex flex-col gap-2">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                {group.title}
              </h4>
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800/80 rounded-xl border border-zinc-150 dark:border-zinc-800/60 overflow-hidden bg-zinc-50/40 dark:bg-zinc-900/30">
                {group.items.map((item) => (
                  <div key={item.key} className="flex items-center justify-between px-3.5 py-2 text-xs">
                    <span className="text-zinc-700 dark:text-zinc-300 font-medium">
                      {item.label}
                    </span>
                    <kbd className="rounded-md border border-zinc-250 bg-white px-2 py-0.5 text-[11px] font-bold text-zinc-800 shadow-2xs dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                      {item.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
