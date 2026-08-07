"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useTheme } from "@/components/theme-provider";
import { ArrowLeft, Sun, Moon, Trash2, Check } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const { theme, colorMode, setTheme, setColorMode } = useTheme();

  const [user, setUser] = useState<any>(null);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [activeWorkspace, setActiveWorkspace] = useState<any>(null);

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSettingsData() {
      try {
        const u = await apiFetch("/users/me");
        setUser(u);
        if (u) {
          setFullName(u.fullName || "");
          setUsername(u.username || "");
          setTitle(u.title || "");
          setEmail(u.email || "");
          setAvatarUrl(u.avatarUrl || "");
        }

        const w = await apiFetch("/workspaces");
        if (w.length > 0) {
          setActiveWorkspace(w[0]);
        }
      } catch (err) {
        console.error("Failed to load settings data", err);
      }
    }
    loadSettingsData();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError(null);

    try {
      const updated = await apiFetch("/users/me", {
        method: "PATCH",
        body: JSON.stringify({
          fullName,
          username,
          title,
          avatarUrl,
        }),
      });
      setUser(updated);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleLeaveWorkspace = async () => {
    if (!activeWorkspace) return;
    const confirm = window.confirm(
      `Are you sure you want to leave/delete "${activeWorkspace.name}"? This action is destructive and cannot be undone.`
    );
    if (!confirm) return;

    try {
      await apiFetch(`/workspaces/${activeWorkspace.id}`, {
        method: "DELETE",
      });
      // Logout and return to login
      await apiFetch("/auth/logout", { method: "POST" });
      router.push("/login");
    } catch (err: any) {
      alert(err.message || "Failed to leave workspace.");
    }
  };

  const accentColors = [
    { name: "amber", label: "Amber", hex: "#f59e0b" },
    { name: "blue", label: "Blue", hex: "#3b82f6" },
    { name: "pink", label: "Pink", hex: "#ec4899" },
    { name: "rose", label: "Rose", hex: "#f43f5e" },
    { name: "emerald", label: "Emerald", hex: "#10b981" },
    { name: "black", label: "Black", hex: "#09090b" },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6 md:p-12">
      <div className="max-w-3xl mx-auto flex flex-col gap-8">
        {/* Back to App Link */}
        <div>
          <Link
            href="/tasks"
            className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to app</span>
          </Link>
        </div>

        {/* Page Title */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Settings
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Manage your personal profile, theme modes, and workspaces.
          </p>
        </div>

        {/* Success / Error Messages */}
        {success && (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3.5 text-xs text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400">
            <Check className="h-4 w-4 shrink-0" />
            <span>Profile saved successfully!</span>
          </div>
        )}
        {error && (
          <div className="rounded-xl bg-red-50 p-3.5 text-xs text-red-600 dark:bg-red-950/20 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Profile Settings Section */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-850 dark:bg-zinc-900">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-2">
            My Profile
          </h2>

          <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Dexter"
                  required
                  className="rounded-lg border border-zinc-200 px-3 py-2 text-xs bg-transparent focus:outline-none focus:border-accent dark:border-zinc-800 text-zinc-800 dark:text-zinc-200"
                />
              </div>

              {/* Username */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. dexter_designer"
                  required
                  className="rounded-lg border border-zinc-200 px-3 py-2 text-xs bg-transparent focus:outline-none focus:border-accent dark:border-zinc-800 text-zinc-800 dark:text-zinc-200"
                />
              </div>

              {/* Job Title */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Product Designer"
                  className="rounded-lg border border-zinc-200 px-3 py-2 text-xs bg-transparent focus:outline-none focus:border-accent dark:border-zinc-800 text-zinc-800 dark:text-zinc-200"
                />
              </div>

              {/* Email (Read-Only) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  Email (Guest accounts may be empty)
                </label>
                <input
                  type="email"
                  value={email}
                  disabled
                  placeholder="No email address linked"
                  className="rounded-lg border border-zinc-200 px-3 py-2 text-xs bg-zinc-50 text-zinc-400 dark:border-zinc-800 dark:bg-zinc-850 dark:text-zinc-500"
                />
              </div>
            </div>

            {/* Avatar URL */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Avatar Image URL
              </label>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="e.g. https://api.dicebear.com/7.x/initials/svg?seed=Dexter"
                className="rounded-lg border border-zinc-200 px-3 py-2 text-xs bg-transparent focus:outline-none focus:border-accent dark:border-zinc-800 text-zinc-800 dark:text-zinc-200"
              />
            </div>

            <div className="flex justify-end mt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 rounded-lg bg-zinc-900 text-xs font-bold text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 transition-colors"
              >
                {saving ? "Saving Profile..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>

        {/* Display Aesthetics Section */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-850 dark:bg-zinc-900">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-2">
            Display Settings
          </h2>

          <div className="flex flex-col gap-5">
            {/* Theme Axes */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-250">
                  Theme Axis
                </span>
                <p className="text-[10px] text-zinc-450 mt-0.5">
                  Toggle between Light and Dark interface modes.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setTheme("light")}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 border text-xs font-semibold transition-colors ${
                    theme === "light"
                      ? "bg-zinc-100 border-zinc-300 text-zinc-900 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                      : "border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-850 text-zinc-500"
                  }`}
                >
                  <Sun className="h-4 w-4" /> Light
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 border text-xs font-semibold transition-colors ${
                    theme === "dark"
                      ? "bg-zinc-850 border-zinc-700 text-white dark:bg-zinc-700"
                      : "border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-850 text-zinc-500"
                  }`}
                >
                  <Moon className="h-4 w-4" /> Dark
                </button>
              </div>
            </div>

            <div className="border-t border-zinc-100 dark:border-zinc-800/60 my-1" />

            {/* Accent Color Modes */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-250">
                  Color Mode (Accent Color)
                </span>
                <p className="text-[10px] text-zinc-450 mt-0.5">
                  Swap the active user interface accent theme.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {accentColors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setColorMode(color.name as any)}
                    title={color.label}
                    style={{ backgroundColor: color.hex }}
                    className={`h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 ${
                      colorMode === color.name
                        ? "border-zinc-900 dark:border-white scale-105"
                        : "border-transparent"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Workspace Management (Destructive Action) */}
        {activeWorkspace && (
          <div className="rounded-2xl border border-red-200 bg-red-50/20 p-6 shadow-sm dark:border-red-950/25 dark:bg-red-950/5">
            <h2 className="text-sm font-bold text-red-650 dark:text-red-400 uppercase tracking-wider mb-2">
              Workspace Settings
            </h2>
            <p className="text-xs text-zinc-500 mb-4">
              You are currently managing <strong>{activeWorkspace.name}</strong>. Leaving this workspace will permanently remove you and all associated tasks/projects.
            </p>

            <button
              onClick={handleLeaveWorkspace}
              className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-500 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              <span>Leave Workspace</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
