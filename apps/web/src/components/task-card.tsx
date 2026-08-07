"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useRouter } from "next/navigation";
import { Task, User } from "@pyramid/shared-types";
import { Calendar, MoreHorizontal, AlertCircle } from "lucide-react";

interface TaskCardProps {
  task: Task;
  visibleFields: {
    priority: boolean;
    members: boolean;
    dueDate: boolean;
    labels: boolean;
    status: boolean;
    reporter: boolean;
  };
}

export function TaskCard({ task, visibleFields }: TaskCardProps) {
  const router = useRouter();
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  });

  const style = {
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    opacity: isDragging ? 0.4 : 1,
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Avoid opening panel if user clicked action menu or was dragging
    if ((e.target as HTMLElement).closest("button")) {
      return;
    }
    router.push(`/tasks/${task.id}`);
  };

  // Format date e.g. "29 Jul"
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
  };

  const isOverdue = (dateStr?: string) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return d < today && task.status !== "Completed";
  };

  // Render Priority Icon matching Figma specs
  const renderPriorityIcon = () => {
    const p = task.priority;
    if (p === "Urgent") {
      return (
        <span className="flex items-end gap-[1.5px] h-3 text-red-600" title="Urgent Priority">
          <span className="w-[2.5px] h-1.5 bg-current rounded-sm" />
          <span className="w-[2.5px] h-2.5 bg-current rounded-sm" />
          <span className="w-[2.5px] h-3.5 bg-current rounded-sm" />
        </span>
      );
    }
    if (p === "High") {
      return (
        <span className="flex items-end gap-[1.5px] h-3 text-red-500" title="High Priority">
          <span className="w-[2.5px] h-1.5 bg-current rounded-sm" />
          <span className="w-[2.5px] h-2.5 bg-current rounded-sm" />
          <span className="w-[2.5px] h-3.5 bg-zinc-200 dark:bg-zinc-700 rounded-sm" />
        </span>
      );
    }
    if (p === "Medium") {
      return (
        <span className="flex items-end gap-[1.5px] h-3 text-amber-500" title="Medium Priority">
          <span className="w-[2.5px] h-1.5 bg-current rounded-sm" />
          <span className="w-[2.5px] h-2 bg-zinc-200 dark:bg-zinc-700 rounded-sm" />
          <span className="w-[2.5px] h-2 bg-zinc-200 dark:bg-zinc-700 rounded-sm" />
        </span>
      );
    }
    if (p === "Low") {
      return (
        <span className="flex items-end gap-[1.5px] h-3 text-zinc-400 dark:text-zinc-500" title="Low Priority">
          <span className="w-[2.5px] h-1 bg-current rounded-sm" />
          <span className="w-[2.5px] h-1 bg-zinc-200 dark:bg-zinc-700 rounded-sm" />
          <span className="w-[2.5px] h-1 bg-zinc-200 dark:bg-zinc-700 rounded-sm" />
        </span>
      );
    }
    // No Priority
    return (
      <span className="h-3 w-3 flex items-center justify-center text-zinc-400 dark:text-zinc-500" title="No Priority">
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
      </span>
    );
  };

  const assignee = task.assignee as User | undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={handleCardClick}
      className={`group relative rounded-xl border border-zinc-200/80 bg-white p-3.5 shadow-sm hover:shadow-md transition-all cursor-pointer dark:border-zinc-800/85 dark:bg-zinc-900/60`}
    >
      {/* Draggable handle is the entire card, listener boundaries are attached */}
      <div {...attributes} {...listeners} className="absolute inset-0 z-0 rounded-xl" />

      {/* Card Contents (Relative positioned to stay clickable over the drag listener overlay) */}
      <div className="relative z-10 pointer-events-none">
        <div className="flex items-start justify-between gap-2">
          <p className="text-[13px] font-semibold tracking-tight text-zinc-850 dark:text-zinc-150 line-clamp-2 leading-snug">
            {task.title}
          </p>
          <button className="pointer-events-auto text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-200">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>

        {/* Due Date & Assignee row */}
        {(visibleFields.dueDate || visibleFields.members) && (
          <div className="mt-3 flex items-center justify-between">
            {/* Assignee Avatar */}
            {visibleFields.members && assignee ? (
              <div className="flex items-center gap-1.5">
                <img
                  src={assignee.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${assignee.fullName}`}
                  alt="Assignee"
                  className="h-5.5 w-5.5 rounded-full object-cover border border-zinc-150 dark:border-zinc-750"
                  title={assignee.fullName}
                />
                <span className="text-[10px] text-zinc-500 dark:text-zinc-400">
                  {assignee.fullName?.split(" ")[0]}
                </span>
              </div>
            ) : (
              <div />
            )}

            {/* Due Date Badge */}
            {visibleFields.dueDate && task.dueDate && (
              <div
                className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  isOverdue(task.dueDate as any)
                    ? "bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400"
                    : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                }`}
              >
                <Calendar className="h-3 w-3 shrink-0" />
                <span>{formatDate(task.dueDate as any)}</span>
              </div>
            )}
          </div>
        )}

        {/* Bottom row: Labels & Priority */}
        {(visibleFields.labels || visibleFields.priority) && (
          <div className="mt-2.5 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/60 pt-2">
            {/* Labels */}
            {visibleFields.labels && task.labels && task.labels.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {task.labels.map((label) => (
                  <span
                    key={label}
                    className="rounded px-1.5 py-0.5 text-[9px] font-bold bg-zinc-100/60 text-zinc-550 border border-zinc-200/50 dark:bg-zinc-800/40 dark:text-zinc-400 dark:border-zinc-700/50"
                  >
                    {label}
                  </span>
                ))}
              </div>
            ) : (
              <div />
            )}

            {/* Priority Indicator */}
            {visibleFields.priority && renderPriorityIcon()}
          </div>
        )}
      </div>
    </div>
  );
}
