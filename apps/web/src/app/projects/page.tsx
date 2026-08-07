"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard-layout";
import { apiFetch } from "@/lib/api";
import { Project, User } from "@pyramid/shared-types";
import { Calendar, User as UserIcon, Plus, X, Trash } from "lucide-react";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [addOpen, setAddOpen] = useState(false);
  const [name, setName] = useState("");
  const [lead, setLead] = useState("");
  const [dueDate, setDueDate] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const p = await apiFetch("/projects");
      setProjects(p);
      const u = await apiFetch("/users/me");
      if (u) setUsers([u]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await apiFetch("/projects", {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          lead: lead || undefined,
          dueDate: dueDate || undefined,
        }),
      });
      setName("");
      setLead("");
      setDueDate("");
      setAddOpen(false);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <DashboardLayout title="Projects">
      <div className="flex flex-col gap-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-zinc-405 uppercase tracking-wider">
            All Projects
          </h2>
          <button
            onClick={() => setAddOpen(true)}
            className="flex h-8 items-center gap-1.5 rounded-lg bg-zinc-900 px-3.5 text-xs font-bold text-white shadow hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Project</span>
          </button>
        </div>

        {/* Projects List Card */}
        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/30">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50/50 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900/60">
                  <th className="px-5 py-3 font-bold">Project Name</th>
                  <th className="px-5 py-3 font-bold">Lead</th>
                  <th className="px-5 py-3 font-bold">Due Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {projects.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-5 py-8 text-center text-xs text-zinc-400"
                    >
                      No projects created yet. Click Add Project to start.
                    </td>
                  </tr>
                ) : (
                  projects.map((proj) => {
                    const projectLead = proj.lead as User | undefined;
                    return (
                      <tr
                        key={proj.id}
                        className="hover:bg-zinc-50/70 dark:hover:bg-zinc-850/30 transition-colors"
                      >
                        <td className="px-5 py-4 font-semibold text-accent hover:underline">
                          <Link href={`/projects/${proj.id}`}>{proj.name}</Link>
                        </td>
                        <td className="px-5 py-4">
                          {projectLead ? (
                            <div className="flex items-center gap-2">
                              <img
                                src={projectLead.avatarUrl}
                                alt="Lead"
                                className="h-5.5 w-5.5 rounded-full object-cover"
                              />
                              <span className="text-zinc-700 dark:text-zinc-300">
                                {projectLead.fullName}
                              </span>
                            </div>
                          ) : (
                            <span className="text-zinc-400 inline-flex items-center gap-1">
                              <UserIcon className="h-3.5 w-3.5" />
                              Unassigned
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-zinc-500 dark:text-zinc-400">
                          {proj.dueDate ? (
                            <span className="inline-flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5" />
                              {formatDate(proj.dueDate)}
                            </span>
                          ) : (
                            "-"
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Project Modal */}
      {addOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 backdrop-blur-xs p-4">
          <div
            onClick={() => setAddOpen(false)}
            className="absolute inset-0 cursor-default"
          />

          <div className="relative w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-850 dark:bg-zinc-900">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3 mb-4">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                Create New Project
              </h3>
              <button
                onClick={() => setAddOpen(false)}
                className="rounded-lg p-1 hover:bg-zinc-100 text-zinc-400 hover:text-zinc-650 dark:hover:bg-zinc-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  Project Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Design Homepage"
                  required
                  autoFocus
                  className="rounded-lg border border-zinc-200 px-3 py-2 text-xs bg-transparent focus:outline-none focus:border-accent dark:border-zinc-800 text-zinc-800 dark:text-zinc-200"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  Project Lead (Optional)
                </label>
                <select
                  value={lead}
                  onChange={(e) => setLead(e.target.value)}
                  className="rounded-lg border border-zinc-250 bg-white px-3 py-2 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-955 text-zinc-800 dark:text-zinc-200"
                >
                  <option value="">Unassigned</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.fullName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  Due Date (Optional)
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="rounded-lg border border-zinc-200 px-3 py-2 text-xs bg-transparent focus:outline-none focus:border-accent dark:border-zinc-800 text-zinc-850 dark:text-zinc-200"
                />
              </div>

              <div className="flex items-center justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setAddOpen(false)}
                  className="px-3.5 py-2 rounded-lg border border-zinc-200 text-xs font-semibold hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-850"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-zinc-900 text-xs font-bold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
                >
                  <span>Create Project</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
