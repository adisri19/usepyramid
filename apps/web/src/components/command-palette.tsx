"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTasks } from "@/context/tasks-context";
import { useTheme } from "@/components/theme-provider";
import { 
  Search, 
  Plus, 
  Kanban, 
  List, 
  Sun, 
  Moon, 
  FolderKanban, 
  Settings, 
  Download, 
  CheckCircle2, 
  ArrowRight,
  Command as CommandIcon,
  Sparkles
} from "lucide-react";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAddTask: () => void;
}

export function CommandPalette({ isOpen, onClose, onOpenAddTask }: CommandPaletteProps) {
  const router = useRouter();
  const { tasks, setView, view } = useTasks();
  const { theme, setTheme } = useTheme();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Export tasks as CSV
  const handleExportCSV = () => {
    if (!tasks.length) return;
    const headers = ["ID", "Title", "Status", "Priority", "Due Date", "Labels"];
    const rows = tasks.map(t => [
      `"${t.id}"`,
      `"${(t.title || "").replace(/"/g, '""')}"`,
      `"${t.status || ""}"`,
      `"${t.priority || ""}"`,
      `"${t.dueDate ? new Date(t.dueDate).toISOString().split("T")[0] : ""}"`,
      `"${(t.labels || []).join(", ")}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `pyramid-tasks-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onClose();
  };

  // Base system actions
  const actions = [
    {
      id: "create-task",
      title: "Create new task",
      category: "Actions",
      icon: Plus,
      shortcut: "C",
      perform: () => {
        onClose();
        onOpenAddTask();
      },
    },
    {
      id: "switch-board",
      title: "Switch to Board View",
      category: "View",
      icon: Kanban,
      shortcut: "B",
      perform: () => {
        setView("board");
        onClose();
      },
    },
    {
      id: "switch-list",
      title: "Switch to List View",
      category: "View",
      icon: List,
      shortcut: "L",
      perform: () => {
        setView("list");
        onClose();
      },
    },
    {
      id: "toggle-theme",
      title: `Toggle Theme (Currently ${theme})`,
      category: "Preferences",
      icon: theme === "dark" ? Sun : Moon,
      shortcut: "T",
      perform: () => {
        setTheme(theme === "dark" ? "light" : "dark");
        onClose();
      },
    },
    {
      id: "nav-projects",
      title: "Go to Projects",
      category: "Navigation",
      icon: FolderKanban,
      shortcut: "G P",
      perform: () => {
        router.push("/projects");
        onClose();
      },
    },
    {
      id: "nav-settings",
      title: "Go to Settings",
      category: "Navigation",
      icon: Settings,
      shortcut: "G S",
      perform: () => {
        router.push("/settings");
        onClose();
      },
    },
    {
      id: "export-csv",
      title: "Export all tasks to CSV",
      category: "Data",
      icon: Download,
      perform: handleExportCSV,
    },
  ];

  // Dynamic matching tasks
  const matchingTasks = tasks
    .filter(t => (t.title || "").toLowerCase().includes(query.toLowerCase()))
    .slice(0, 5)
    .map(t => ({
      id: `task-${t.id}`,
      title: t.title,
      category: `Task (${t.status})`,
      icon: CheckCircle2,
      subtitle: `${t.priority} priority`,
      perform: () => {
        router.push(`/tasks/${t.id}`);
        onClose();
      },
    }));

  const filteredActions = [
    ...actions.filter(a => a.title.toLowerCase().includes(query.toLowerCase())),
    ...(query.trim() ? matchingTasks : []),
  ];

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, filteredActions.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredActions.length) % Math.max(1, filteredActions.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = filteredActions[selectedIndex];
      if (item) item.perform();
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-zinc-950/40 backdrop-blur-xs p-4 animate-fade-in">
      <div 
        onClick={onClose} 
        className="absolute inset-0 cursor-default"
      />

      <div className="relative w-full max-w-xl rounded-2xl border border-zinc-200 bg-white shadow-2xl overflow-hidden dark:border-zinc-800 dark:bg-zinc-900 animate-scale-up">
        {/* Input Bar */}
        <div className="flex items-center gap-3 border-b border-zinc-100 px-4 py-3.5 dark:border-zinc-800">
          <Search className="h-4.5 w-4.5 text-zinc-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or search tasks..."
            className="flex-1 text-sm bg-transparent focus:outline-none text-zinc-900 placeholder:text-zinc-400 dark:text-zinc-100"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 rounded bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2">
          {filteredActions.length === 0 ? (
            <div className="py-8 text-center text-xs text-zinc-400">
              No results found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            filteredActions.map((item, index) => {
              const Icon = item.icon;
              const isSelected = index === selectedIndex;

              return (
                <div
                  key={item.id}
                  onClick={() => item.perform()}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                      : "text-zinc-650 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-850"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className={`h-4 w-4 shrink-0 ${isSelected ? "text-accent" : "text-zinc-400"}`} />
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-xs font-semibold truncate">{item.title}</span>
                      <span className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {(item as any).shortcut && (
                      <kbd className="rounded bg-zinc-200/60 px-1.5 py-0.5 text-[10px] font-bold text-zinc-600 dark:bg-zinc-700/60 dark:text-zinc-300">
                        {(item as any).shortcut}
                      </kbd>
                    )}
                    {isSelected && <ArrowRight className="h-3.5 w-3.5 text-zinc-400" />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Navigation Hints */}
        <div className="flex items-center justify-between border-t border-zinc-100 bg-zinc-50/50 px-4 py-2 text-[10px] font-medium text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <span><kbd className="rounded bg-zinc-200/60 px-1 py-0.5 dark:bg-zinc-800">↑</kbd> <kbd className="rounded bg-zinc-200/60 px-1 py-0.5 dark:bg-zinc-800">↓</kbd> to navigate</span>
            <span><kbd className="rounded bg-zinc-200/60 px-1.5 py-0.5 dark:bg-zinc-800">↵</kbd> to select</span>
          </div>
          <div className="flex items-center gap-1 font-semibold text-accent">
            <Sparkles className="h-3 w-3" />
            <span>Pyramid Command Palette</span>
          </div>
        </div>
      </div>
    </div>
  );
}
