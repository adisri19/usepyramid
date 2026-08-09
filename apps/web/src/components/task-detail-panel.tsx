"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { Task, Comment, User, Project } from "@pyramid/shared-types";
import { 
  X, 
  Calendar, 
  ChevronDown, 
  Plus, 
  CornerDownRight, 
  Trash,
  CheckSquare,
  Square
} from "lucide-react";

interface TaskDetailPanelProps {
  taskId: string;
  isOverlay?: boolean;
}

export function TaskDetailPanel({ taskId, isOverlay = true }: TaskDetailPanelProps) {
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [subtasks, setSubtasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [newCommentBody, setNewCommentBody] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [labelInputActive, setLabelInputActive] = useState(false);

  useEffect(() => {
    async function loadTaskDetails() {
      setLoading(true);
      try {
        const t = await apiFetch(`/tasks/${taskId}`);
        setTask(t);
        if (t) {
          setTitle(t.title);
          setDescription(t.description || "");
        }

        const c = await apiFetch(`/tasks/${taskId}/comments`);
        setComments(c);

        const s = await apiFetch(`/tasks/${taskId}/subtasks`);
        setSubtasks(s);

        const p = await apiFetch("/projects");
        setProjects(p);

        // Load user context
        const me = await apiFetch("/users/me");
        if (me) setUsers([me]);
      } catch (err) {
        console.error("Failed to load task details", err);
      } finally {
        setLoading(false);
      }
    }
    loadTaskDetails();
  }, [taskId]);

  const handleClose = () => {
    if (isOverlay) {
      router.back();
    } else {
      router.push("/tasks");
    }
  };

  const updateField = async (fields: Partial<Task>) => {
    try {
      const updated = await apiFetch(`/tasks/${taskId}`, {
        method: "PATCH",
        body: JSON.stringify(fields),
      });
      setTask(updated);
    } catch (err) {
      console.error("Failed to update task field", err);
    }
  };

  const handleTitleBlur = () => {
    if (title.trim() && title !== task?.title) {
      updateField({ title: title.trim() });
    }
  };

  const handleDescriptionBlur = () => {
    if (description !== task?.description) {
      updateField({ description });
    }
  };

  const handleAddSubtask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;

    try {
      const sub = await apiFetch("/tasks", {
        method: "POST",
        body: JSON.stringify({
          title: newSubtaskTitle.trim(),
          parentTask: taskId,
          status: "To Do",
        }),
      });
      setSubtasks(prev => [...prev, sub]);
      setNewSubtaskTitle("");
    } catch (err) {
      console.error(err);
    }
  };

  const toggleSubtask = async (sub: Task) => {
    const nextStatus = sub.status === "Completed" ? "To Do" : "Completed";
    try {
      const updated = await apiFetch(`/tasks/${sub.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: nextStatus }),
      });
      setSubtasks(prev => prev.map(s => s.id === sub.id ? updated : s));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSubtask = async (subId: string) => {
    try {
      await apiFetch(`/tasks/${subId}`, { method: "DELETE" });
      setSubtasks(prev => prev.filter(s => s.id !== subId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentBody.trim()) return;

    try {
      const comm = await apiFetch(`/tasks/${taskId}/comments`, {
        method: "POST",
        body: JSON.stringify({ body: newCommentBody.trim() }),
      });
      setComments(prev => [...prev, comm]);
      setNewCommentBody("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddLabel = () => {
    if (!newLabel.trim() || !task) return;
    const labels = [...(task.labels || [])];
    if (!labels.includes(newLabel.trim())) {
      labels.push(newLabel.trim());
      updateField({ labels });
    }
    setNewLabel("");
    setLabelInputActive(false);
  };

  const handleRemoveLabel = (label: string) => {
    if (!task) return;
    const labels = (task.labels || []).filter(l => l !== label);
    updateField({ labels });
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-white dark:bg-zinc-950 p-6">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-white dark:bg-zinc-950 p-6">
        <p className="text-zinc-500">Task not found</p>
        <button onClick={handleClose} className="mt-4 text-xs text-accent font-semibold hover:underline">
          Go Back
        </button>
      </div>
    );
  }

  const assignee = task.assignee as User | undefined;
  const project = task.project as Project | undefined;

  return (
    <div className={`flex flex-col h-full bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 ${
      isOverlay ? "w-full max-w-2xl border-l border-zinc-200 shadow-2xl dark:border-zinc-800" : "flex-1"
    }`}>
      {/* Panel Header */}
      <div className="flex h-14 items-center justify-between border-b border-zinc-200/80 px-6 dark:border-zinc-800/80 shrink-0">
        <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
          <span>Tasks</span>
          <span>&gt;</span>
          <span className="font-semibold text-zinc-700 dark:text-zinc-300 truncate max-w-xs">
            {task.title}
          </span>
        </div>
        <button 
          onClick={handleClose}
          className="rounded-lg p-1.5 hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 dark:hover:bg-zinc-850 dark:hover:text-zinc-200"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Panel Content (Scrollable Area) */}
      <div className="flex-1 overflow-y-auto flex flex-col md:flex-row">
        {/* Left / Main Section */}
        <div className="flex-1 p-6 flex flex-col gap-6 md:border-r md:border-zinc-100 dark:md:border-zinc-900">
          {/* Title Editor */}
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleBlur}
              className="w-full text-xl font-bold tracking-tight bg-transparent border-b border-transparent focus:border-zinc-200 focus:outline-none py-1 dark:focus:border-zinc-800 text-zinc-900 dark:text-white"
              placeholder="Task Title"
            />
          </div>

          {/* Description Editor */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-2">
              Description
            </span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={handleDescriptionBlur}
              placeholder="Add a detailed description..."
              rows={4}
              className="w-full resize-none rounded-xl border border-zinc-200/80 bg-zinc-50/30 p-3 text-sm focus:border-accent focus:outline-none dark:border-zinc-800 dark:bg-zinc-900/20 text-zinc-850 dark:text-zinc-200"
            />
          </div>

          {/* Subtasks Checklist */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-2">
              Subtasks
            </span>
            
            <div className="flex flex-col gap-2 mb-3">
              {subtasks.map((sub, i) => {
                const subId = sub.id || (sub as any)._id || `sub-${i}`;
                const isCompleted = sub.status === "Completed";
                return (
                  <div 
                    key={subId} 
                    className="flex items-center justify-between group rounded-lg px-2.5 py-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                  >
                    <div 
                      onClick={() => toggleSubtask(sub)}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      {isCompleted ? (
                        <CheckSquare className="h-4.5 w-4.5 text-accent shrink-0" />
                      ) : (
                        <Square className="h-4.5 w-4.5 text-zinc-400 shrink-0" />
                      )}
                      <span className={`text-xs ${isCompleted ? "line-through text-zinc-450" : "text-zinc-700 dark:text-zinc-300"}`}>
                        {sub.title}
                      </span>
                    </div>
                    <button 
                      onClick={() => handleDeleteSubtask(subId)}
                      className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-500 transition-opacity p-0.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      <Trash className="h-3.5 w-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>

            <form onSubmit={handleAddSubtask} className="flex gap-2">
              <input
                type="text"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                placeholder="Add subtask..."
                className="flex-1 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs bg-transparent focus:outline-none focus:border-accent dark:border-zinc-800 text-zinc-800 dark:text-zinc-200"
              />
              <button 
                type="submit"
                className="flex h-8 items-center justify-center rounded-lg bg-zinc-900 px-3.5 text-xs font-bold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
              >
                Add
              </button>
            </form>
          </div>

          {/* Comments Section */}
          <div className="border-t border-zinc-100 dark:border-zinc-900 pt-6">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-3">
              Comments ({comments.length})
            </span>

            <div className="flex flex-col gap-4 mb-4">
              {comments.map((comm) => (
                <div key={comm.id} className="flex gap-3">
                  <img
                    src={comm.author.avatarUrl || "https://api.dicebear.com/7.x/initials/svg?seed=Author"}
                    alt="Comment Author"
                    className="h-7 w-7 rounded-full object-cover border border-zinc-100 dark:border-zinc-800"
                  />
                  <div className="flex flex-col flex-1 bg-zinc-50 p-3 rounded-2xl dark:bg-zinc-900/35 border border-zinc-200/50 dark:border-zinc-850">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-zinc-850 dark:text-zinc-200">
                        {comm.author.fullName}
                      </span>
                      <span className="text-[10px] text-zinc-400">
                        {new Date(comm.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed">
                      {comm.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddComment} className="flex gap-3">
              <textarea
                value={newCommentBody}
                onChange={(e) => setNewCommentBody(e.target.value)}
                placeholder="Write a comment..."
                rows={2}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleAddComment(e);
                  }
                }}
                className="flex-1 resize-none rounded-xl border border-zinc-200/80 p-3 text-xs focus:border-accent focus:outline-none dark:border-zinc-800 bg-transparent text-zinc-800 dark:text-zinc-200"
              />
              <button 
                type="submit"
                className="flex self-end h-8 items-center justify-center rounded-lg bg-zinc-900 px-4 text-xs font-bold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
              >
                Send
              </button>
            </form>
          </div>
        </div>

        {/* Right / Settings Sidebar (Properties) */}
        <div className="w-full md:w-60 p-6 flex flex-col gap-5 shrink-0 bg-zinc-50/20 dark:bg-zinc-900/10">
          {/* Status */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-1.5">
              Status
            </span>
            <div className="relative">
              <select
                value={task.status}
                onChange={(e) => updateField({ status: e.target.value as any })}
                className="w-full appearance-none rounded-lg border border-zinc-250 bg-white px-3 py-1.5 pr-8 text-xs font-semibold focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200"
              >
                {["To Do", "Doing", "Completed", "On Hold", "Backlog"].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-zinc-400 pointer-events-none" />
            </div>
          </div>

          {/* Priority */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-1.5">
              Priority
            </span>
            <div className="relative">
              <select
                value={task.priority}
                onChange={(e) => updateField({ priority: e.target.value as any })}
                className="w-full appearance-none rounded-lg border border-zinc-250 bg-white px-3 py-1.5 pr-8 text-xs font-semibold focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200"
              >
                {["No Priority", "Urgent", "High", "Medium", "Low"].map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-zinc-400 pointer-events-none" />
            </div>
          </div>

          {/* Assignee */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-1.5">
              Assignee
            </span>
            <div className="relative">
              <select
                value={assignee?.id || (assignee as any)?._id || ""}
                onChange={(e) => updateField({ assignee: e.target.value || null as any })}
                className="w-full appearance-none rounded-lg border border-zinc-250 bg-white px-3 py-1.5 pr-8 text-xs font-semibold focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200"
              >
                <option value="">Unassigned</option>
                {users.map((u, i) => {
                  const uid = u.id || (u as any)._id || `user-${i}`;
                  return (
                    <option key={uid} value={uid}>{u.fullName || u.username}</option>
                  );
                })}
              </select>
              <ChevronDown className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-zinc-400 pointer-events-none" />
            </div>
          </div>

          {/* Project */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-1.5">
              Project
            </span>
            <div className="relative">
              <select
                value={project?.id || (project as any)?._id || ""}
                onChange={(e) => updateField({ project: e.target.value || null as any })}
                className="w-full appearance-none rounded-lg border border-zinc-250 bg-white px-3 py-1.5 pr-8 text-xs font-semibold focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200"
              >
                <option value="">No Project</option>
                {projects.map((p, i) => {
                  const pid = p.id || (p as any)._id || `proj-${i}`;
                  return (
                    <option key={pid} value={pid}>{p.name}</option>
                  );
                })}
              </select>
              <ChevronDown className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-zinc-400 pointer-events-none" />
            </div>
          </div>

          {/* Dates */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-1.5">
              Due Date
            </span>
            <div className="relative flex items-center">
              <input
                type="date"
                value={task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : ""}
                onChange={(e) => updateField({ dueDate: e.target.value ? e.target.value : null as any })}
                className="w-full rounded-lg border border-zinc-250 bg-white px-3 py-1.5 text-xs font-semibold focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200"
              />
            </div>
          </div>

          {/* Labels / Tags */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-1.5">
              Labels
            </span>
            <div className="flex flex-wrap gap-1 mb-2">
              {task.labels && task.labels.map((l) => (
                <span
                  key={l}
                  className="flex items-center gap-1 rounded bg-zinc-100 px-2 py-0.5 text-[10px] font-bold text-zinc-650 dark:bg-zinc-800 dark:text-zinc-350"
                >
                  <span>{l}</span>
                  <button 
                    onClick={() => handleRemoveLabel(l)}
                    className="text-zinc-400 hover:text-zinc-600 dark:hover:text-white"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </span>
              ))}
            </div>

            {labelInputActive ? (
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="New label..."
                  autoFocus
                  onBlur={handleAddLabel}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddLabel();
                  }}
                  className="flex-1 rounded border border-zinc-250 bg-white px-2 py-1 text-[11px] focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200"
                />
              </div>
            ) : (
              <button
                onClick={() => setLabelInputActive(true)}
                className="flex items-center gap-1 text-[11px] font-bold text-accent hover:underline"
              >
                <Plus className="h-3 w-3" /> Add Label
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
