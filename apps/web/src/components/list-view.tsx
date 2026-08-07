"use client";

import { useState } from "react";
import { useTasks } from "@/context/tasks-context";
import { Task, User } from "@pyramid/shared-types";
import { useRouter } from "next/navigation";
import { 
  ChevronDown, 
  ChevronRight, 
  Plus, 
  MoreHorizontal, 
  Calendar,
  Check,
  X
} from "lucide-react";

const COLUMNS = ["To Do", "Doing", "Completed", "On Hold"] as const;

export function ListView() {
  const { tasks, visibleFields, createTask, deleteTask } = useTasks();
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (status: string) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [status]: !prev[status],
    }));
  };

  return (
    <div className="flex flex-col gap-6 pb-6">
      {COLUMNS.map((status) => {
        const groupTasks = tasks.filter(t => t.status === status);
        const isCollapsed = collapsedGroups[status];

        return (
          <ListGroup
            key={status}
            status={status}
            tasks={groupTasks}
            isCollapsed={isCollapsed}
            onToggle={() => toggleGroup(status)}
            visibleFields={visibleFields}
            createTask={createTask}
            deleteTask={deleteTask}
          />
        );
      })}
    </div>
  );
}

interface ListGroupProps {
  status: string;
  tasks: Task[];
  isCollapsed: boolean;
  onToggle: () => void;
  visibleFields: any;
  createTask: any;
  deleteTask: any;
}

function ListGroup({ status, tasks, isCollapsed, onToggle, visibleFields, createTask, deleteTask }: ListGroupProps) {
  const router = useRouter();
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
      console.error(err);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  };

  const renderPriorityIcon = (priority: string) => {
    if (priority === "Urgent") {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600">
          <span className="flex items-end gap-[1px] h-2.5">
            <span className="w-[2px] h-1.5 bg-current rounded-sm" />
            <span className="w-[2px] h-2.5 bg-current rounded-sm" />
            <span className="w-[2px] h-3.5 bg-current rounded-sm" />
          </span>
          <span>Urgent</span>
        </span>
      );
    }
    if (priority === "High") {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-500">
          <span className="flex items-end gap-[1px] h-2.5">
            <span className="w-[2px] h-1.5 bg-current rounded-sm" />
            <span className="w-[2px] h-2.5 bg-current rounded-sm" />
            <span className="w-[2px] h-3.5 bg-zinc-200 dark:bg-zinc-700 rounded-sm" />
          </span>
          <span>High</span>
        </span>
      );
    }
    if (priority === "Medium") {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-500">
          <span className="flex items-end gap-[1px] h-2.5">
            <span className="w-[2px] h-1.5 bg-current rounded-sm" />
            <span className="w-[2px] h-2.5 bg-zinc-250 dark:bg-zinc-700 rounded-sm" />
            <span className="w-[2px] h-2.5 bg-zinc-250 dark:bg-zinc-700 rounded-sm" />
          </span>
          <span>Medium</span>
        </span>
      );
    }
    if (priority === "Low") {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 dark:text-zinc-500">
          <span className="flex items-end gap-[1px] h-2.5">
            <span className="w-[2px] h-1 bg-current rounded-sm" />
            <span className="w-[2px] h-1.5 bg-zinc-250 dark:bg-zinc-700 rounded-sm" />
            <span className="w-[2px] h-1.5 bg-zinc-250 dark:bg-zinc-700 rounded-sm" />
          </span>
          <span>Low</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-450 dark:text-zinc-500">
        <span className="h-1.5 w-1.5 rounded-full bg-zinc-300 dark:bg-zinc-650" />
        <span>No Priority</span>
      </span>
    );
  };

  return (
    <div className="flex flex-col">
      {/* Group Title Trigger */}
      <button
        onClick={onToggle}
        className="flex items-center gap-2 py-2 px-1 text-zinc-800 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-white transition-colors text-left"
      >
        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        <span className="text-xs font-bold uppercase tracking-wider">{status}</span>
        <span className="text-xs text-zinc-400">({tasks.length})</span>
      </button>

      {/* Table Content */}
      {!isCollapsed && (
        <div className="mt-1.5 overflow-hidden rounded-xl border border-zinc-200/75 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/50 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900/70">
                <th className="px-4 py-2.5 font-bold">Task</th>
                {visibleFields.priority && <th className="px-4 py-2.5 font-bold">Priority</th>}
                {visibleFields.members && <th className="px-4 py-2.5 font-bold">Members</th>}
                {visibleFields.dueDate && <th className="px-4 py-2.5 font-bold">Due Date</th>}
                <th className="px-4 py-2.5 font-bold text-right w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-250/65 dark:divide-zinc-800/80">
              {tasks.length === 0 && !isAdding ? (
                <tr>
                  <td 
                    colSpan={5} 
                    className="px-4 py-6 text-center text-xs text-zinc-400 dark:text-zinc-500"
                  >
                    No tasks in this group.
                  </td>
                </tr>
              ) : (
                tasks.map((task) => {
                  const assignee = task.assignee as User | undefined;
                  return (
                    <tr
                      key={task.id}
                      onClick={() => router.push(`/tasks/${task.id}`)}
                      className="group cursor-pointer hover:bg-zinc-50/70 dark:hover:bg-zinc-850/50 transition-colors"
                    >
                      <td className="px-4 py-3 font-semibold text-zinc-850 dark:text-zinc-200">
                        {task.title}
                      </td>
                      {visibleFields.priority && (
                        <td className="px-4 py-3">
                          {renderPriorityIcon(task.priority)}
                        </td>
                      )}
                      {visibleFields.members && (
                        <td className="px-4 py-3">
                          {assignee ? (
                            <div className="flex items-center gap-2">
                              <img
                                src={assignee.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${assignee.fullName}`}
                                alt="Assignee"
                                className="h-5.5 w-5.5 rounded-full object-cover border border-zinc-200 dark:border-zinc-700"
                              />
                              <span className="text-zinc-600 dark:text-zinc-400">
                                {assignee.fullName}
                              </span>
                            </div>
                          ) : (
                            <span className="text-zinc-400">-</span>
                          )}
                        </td>
                      )}
                      {visibleFields.dueDate && (
                        <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                          {task.dueDate ? (
                            <span className="inline-flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                              <span>{formatDate(task.dueDate as any)}</span>
                            </span>
                          ) : (
                            <span>-</span>
                          )}
                        </td>
                      )}
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteTask(task.id);
                          }}
                          className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-red-600 dark:hover:bg-zinc-800 dark:hover:text-red-400"
                          title="Delete Task"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}

              {/* Inline Task Add Input Row */}
              {isAdding ? (
                <tr>
                  <td colSpan={5} className="p-2.5 bg-zinc-50/30 dark:bg-zinc-900/10">
                    <form onSubmit={handleAddTask} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="Add task title..."
                        autoFocus
                        className="flex-1 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs bg-white focus:outline-none focus:border-accent dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
                      />
                      <button
                        type="submit"
                        className="flex h-8 items-center justify-center rounded-lg bg-zinc-900 px-3 text-xs font-bold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsAdding(false)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-450 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-850 dark:text-zinc-400"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </form>
                  </td>
                </tr>
              ) : (
                <tr>
                  <td colSpan={5} className="p-0">
                    <button
                      onClick={() => setIsAdding(true)}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-xs font-semibold text-zinc-500 hover:bg-zinc-50/50 hover:text-zinc-800 dark:text-zinc-450 dark:hover:bg-zinc-850/30 dark:hover:text-zinc-200"
                    >
                      <Plus className="h-4 w-4 shrink-0" />
                      <span>Add Task</span>
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
