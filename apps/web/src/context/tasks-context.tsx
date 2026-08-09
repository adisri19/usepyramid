"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { apiFetch } from "@/lib/api";
import { Task, Project, User } from "@pyramid/shared-types";

type ViewType = "board" | "list";

interface TasksContextType {
  tasks: Task[];
  projects: Project[];
  users: User[];
  loading: boolean;
  view: ViewType;
  setView: (v: ViewType) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  visibleFields: {
    priority: boolean;
    members: boolean;
    dueDate: boolean;
    labels: boolean;
    status: boolean;
    reporter: boolean;
  };
  toggleField: (field: string) => void;
  filters: {
    priority?: string;
    project?: string;
    status?: string;
    assignee?: string;
  };
  setFilters: (f: any) => void;
  refreshData: () => Promise<void>;
  updateTaskStatus: (taskId: string, newStatus: string) => Promise<void>;
  createTask: (title: string, status?: string, projectId?: string) => Promise<Task>;
  deleteTask: (taskId: string) => Promise<void>;
}

const Ctx = createContext<TasksContextType | null>(null);

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewType>("board");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleFields, setVisibleFields] = useState({
    priority: true,
    members: true,
    dueDate: true,
    labels: true,
    status: true,
    reporter: false,
  });
  const [filters, setFilters] = useState<any>({});

  const normalize = (item: any) => {
    if (!item) return item;
    return {
      ...item,
      id: item.id || item._id?.toString() || String(item._id),
    };
  };

  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      // Build filter query string
      const params = new URLSearchParams();
      if (filters.priority) params.append("priority", filters.priority);
      if (filters.project) params.append("project", filters.project);
      if (filters.status) params.append("status", filters.status);
      if (filters.assignee) params.append("assignee", filters.assignee);
      if (searchQuery) params.append("search", searchQuery);

      const qs = params.toString();
      const taskList = await apiFetch(`/tasks${qs ? `?${qs}` : ""}`);
      setTasks((taskList || []).map(normalize));

      const projectList = await apiFetch("/projects");
      setProjects((projectList || []).map(normalize));

      // Load mock workspace members or workspace owner since workspace endpoint just gives metadata
      const u = await apiFetch("/users/me");
      if (u) {
        setUsers([normalize(u)]);
      }
    } catch (err) {
      console.error("Failed to load workspace tasks details", err);
    } finally {
      setLoading(false);
    }
  }, [filters, searchQuery]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Responsive default: switch to List view on mobile viewports
  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        if (window.innerWidth < 768) {
          setView("list");
        }
      };
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const toggleField = (field: string) => {
    setVisibleFields((prev: any) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    // Optimistic Update
    const prevTasks = [...tasks];
    setTasks(prev => 
      prev.map(t => (t.id === taskId || (t as any)._id === taskId) ? { ...t, status: newStatus as any } : t)
    );

    try {
      await apiFetch(`/tasks/${taskId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      console.error("Failed to patch status in backend, rolling back", err);
      setTasks(prevTasks);
    }
  };

  const createTask = async (title: string, status = "To Do", projectId?: string) => {
    try {
      const created = await apiFetch("/tasks", {
        method: "POST",
        body: JSON.stringify({
          title,
          status,
          project: projectId || undefined,
        }),
      });
      const normalized = normalize(created);
      setTasks(prev => [...prev, normalized]);
      return normalized;
    } catch (err) {
      console.error("Failed to create task", err);
      throw err;
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await apiFetch(`/tasks/${taskId}`, { method: "DELETE" });
      setTasks(prev => prev.filter(t => t.id !== taskId && (t as any)._id !== taskId));
    } catch (err) {
      console.error("Failed to delete task", err);
    }
  };

  return (
    <Ctx.Provider
      value={{
        tasks,
        projects,
        users,
        loading,
        view,
        setView,
        searchQuery,
        setSearchQuery,
        visibleFields,
        toggleField,
        filters,
        setFilters,
        refreshData,
        updateTaskStatus,
        createTask,
        deleteTask,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export const useTasks = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useTasks must be used within TasksProvider");
  return ctx;
};
