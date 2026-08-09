"use client";

import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { Task } from "@pyramid/shared-types";
import { TaskCard } from "./task-card";
import { useTasks } from "@/context/tasks-context";
import { Plus, MoreHorizontal, Check, X } from "lucide-react";

interface BoardColumnProps {
  status: string;
  tasks: Task[];
}

export function BoardColumn({ status, tasks }: BoardColumnProps) {
  const { visibleFields, createTask } = useTasks();
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      await createTask(newTitle.trim(), status);
      setNewTitle("");
      setIsAdding(false);
    } catch (err) {
      console.error("Failed to create task", err);
    }
  };

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col w-[280px] shrink-0 rounded-2xl bg-zinc-50/50 p-3 border border-transparent transition-colors ${
        isOver ? "bg-accent/5 border-accent/20" : ""
      } dark:bg-zinc-900/10`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
            {status}
          </span>
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-zinc-200/80 px-1 text-[10px] font-bold text-zinc-650 dark:bg-zinc-800 dark:text-zinc-400">
            {tasks.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setIsAdding(true)}
            className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-zinc-200/60 text-zinc-500 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-250"
            title="Add task to column"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button 
            className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-zinc-200/60 text-zinc-500 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-250"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Cards List container */}
      <div className="flex flex-col gap-2.5 overflow-y-auto max-h-[calc(100vh-230px)] pr-0.5">
        {tasks.map((task) => {
          const taskId = task.id || (task as any)._id || task.title;
          return (
            <TaskCard key={taskId} task={{ ...task, id: taskId }} visibleFields={visibleFields} />
          );
        })}

        {/* Inline Task Creation Form */}
        {isAdding && (
          <form 
            onSubmit={handleAddTask}
            className="rounded-xl border border-zinc-200 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/65"
          >
            <textarea
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="What needs to be done?"
              rows={2}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleAddTask(e);
                }
              }}
              className="w-full resize-none text-xs text-zinc-800 focus:outline-none border-b border-zinc-100 pb-1.5 mb-2 bg-transparent dark:text-zinc-200 dark:border-zinc-800"
            />
            <div className="flex items-center justify-end gap-1.5">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="flex h-6 w-6 items-center justify-center rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600 dark:hover:bg-zinc-800"
              >
                <X className="h-3.5 w-3.5" />
              </button>
              <button
                type="submit"
                className="flex h-6 px-2.5 items-center justify-center gap-1 rounded-lg bg-zinc-900 text-[10px] font-bold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
              >
                <Check className="h-3 w-3" />
                <span>Save</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Bottom Column Trigger (only if not adding) */}
      {!isAdding && (
        <button
          onClick={() => setIsAdding(true)}
          className="mt-2.5 flex items-center justify-center gap-1.5 py-2.5 w-full rounded-xl border border-dashed border-zinc-200 text-xs font-semibold text-zinc-500 hover:text-zinc-700 hover:border-zinc-350 hover:bg-zinc-50 transition-all dark:border-zinc-800 dark:text-zinc-450 dark:hover:text-zinc-200 dark:hover:bg-zinc-900/30"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Task</span>
        </button>
      )}
    </div>
  );
}
