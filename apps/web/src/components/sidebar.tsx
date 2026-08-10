"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "./theme-provider";
import { apiFetch, clearAuthToken } from "@/lib/api";
import { 
  LayoutGrid, 
  Database, 
  ChevronsUpDown, 
  Settings as SettingsIcon, 
  LogOut, 
  Sun, 
  Moon, 
  Sparkles 
} from "lucide-react";

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({ isCollapsed, onToggleCollapse, isMobileOpen, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, colorMode, setTheme, setColorMode } = useTheme();

  const [user, setUser] = useState<any>(null);
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [activeWorkspace, setActiveWorkspace] = useState<any>(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const u = await apiFetch("/users/me");
        setUser(u);
        const w = await apiFetch("/workspaces");
        setWorkspaces(w);
        if (w.length > 0) {
          // Find workspace matching user ID or fallback to first
          setActiveWorkspace(w[0]);
        }
      } catch (err) {
        console.error("Failed to load sidebar user data", err);
      }
    }
    loadData();
  }, []);

  const handleLogout = async () => {
    try {
      await apiFetch("/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      clearAuthToken();
      router.push("/login");
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

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between p-4 bg-zinc-50 border-r border-zinc-200/80 dark:bg-zinc-900/30 dark:border-zinc-800/80">
      <div className="flex flex-col gap-6">
        {/* Profile / Dexter Area */}
        <div className="relative">
          <div 
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className="flex items-center justify-between p-2 rounded-xl cursor-pointer hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <img
                src={user?.avatarUrl || "https://api.dicebear.com/7.x/initials/svg?seed=Dexter"}
                alt="Avatar"
                className="h-9 w-9 rounded-full bg-accent object-cover border border-zinc-200/80 dark:border-zinc-700/80"
              />
              {!isCollapsed && (
                <div className="flex flex-col text-left">
                  <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                    {user?.fullName || "Dexter"}
                  </span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    {user?.title || "Product Design"}
                  </span>
                </div>
              )}
            </div>
            {!isCollapsed && <ChevronsUpDown className="h-4 w-4 text-zinc-400" />}
          </div>

          {/* Profile Dropdown Menu */}
          {profileMenuOpen && (
            <div className="absolute left-0 top-14 z-50 w-64 rounded-2xl border border-zinc-200 bg-white p-4 shadow-xl dark:border-zinc-850 dark:bg-zinc-900">
              {/* Theme Switcher */}
              <div className="mb-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  Theme
                </span>
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => setTheme("light")}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-1.5 text-xs font-medium transition-colors ${
                      theme === "light"
                        ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white"
                        : "text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
                    }`}
                  >
                    <Sun className="h-3.5 w-3.5" /> Light
                  </button>
                  <button
                    onClick={() => setTheme("dark")}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-1.5 text-xs font-medium transition-colors ${
                      theme === "dark"
                        ? "bg-zinc-800 text-white dark:bg-zinc-700"
                        : "text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
                    }`}
                  >
                    <Moon className="h-3.5 w-3.5" /> Dark
                  </button>
                </div>
              </div>

              {/* Accent Color Modes */}
              <div className="mb-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  Color Mode
                </span>
                <div className="mt-2 grid grid-cols-6 gap-1.5">
                  {accentColors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setColorMode(color.name as any)}
                      title={color.label}
                      style={{ backgroundColor: color.hex }}
                      className={`h-7 w-7 rounded-full border-2 transition-transform hover:scale-110 ${
                        colorMode === color.name
                          ? "border-zinc-900 dark:border-white scale-105"
                          : "border-transparent"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="border-t border-zinc-100 dark:border-zinc-800 my-2" />

              {/* Links */}
              <div className="flex flex-col gap-1">
                <Link
                  href="/settings"
                  onClick={() => setProfileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800/60"
                >
                  <SettingsIcon className="h-4 w-4" />
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Workspace Dropdown */}
        <div>
          {!isCollapsed ? (
            <div 
              onClick={() => setWorkspaceMenuOpen(!workspaceMenuOpen)}
              className="flex items-center justify-between px-2 py-1 cursor-pointer"
            >
              <div className="flex flex-col text-left">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Workspace
                </span>
                <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                  {activeWorkspace?.name || "Dexter's Workspace"}
                </span>
              </div>
              <ChevronsUpDown className="h-4 w-4 text-zinc-400" />
            </div>
          ) : (
            <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-1" />
          )}

          {workspaceMenuOpen && !isCollapsed && (
            <div className="absolute left-4 top-32 z-40 w-56 rounded-xl border border-zinc-200 bg-white p-2 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
              {workspaces.map((ws) => (
                <div
                  key={ws._id}
                  onClick={() => {
                    setActiveWorkspace(ws);
                    setWorkspaceMenuOpen(false);
                  }}
                  className={`px-3 py-2 text-sm rounded-lg cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 ${
                    activeWorkspace?._id === ws._id ? "bg-accent/10 text-accent font-medium" : "text-zinc-700 dark:text-zinc-300"
                  }`}
                >
                  {ws.name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Navigation Section */}
        <nav className="flex flex-col gap-1">
          <Link
            href="/tasks"
            onClick={onCloseMobile}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              pathname.startsWith("/tasks")
                ? "bg-accent text-white dark:text-zinc-950 shadow-sm"
                : "text-zinc-650 hover:bg-zinc-200/50 dark:text-zinc-450 dark:hover:bg-zinc-800/40"
            }`}
          >
            <LayoutGrid className="h-4 w-4 shrink-0" />
            {!isCollapsed && <span>Tasks</span>}
          </Link>

          <Link
            href="/projects"
            onClick={onCloseMobile}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              pathname.startsWith("/projects")
                ? "bg-accent text-white dark:text-zinc-950 shadow-sm"
                : "text-zinc-650 hover:bg-zinc-200/50 dark:text-zinc-450 dark:hover:bg-zinc-800/40"
            }`}
          >
            <Database className="h-4 w-4 shrink-0" />
            {!isCollapsed && <span>Projects</span>}
          </Link>
        </nav>
      </div>

      {/* Footer Info / Logo */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2.5 px-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 3L3 20h18L12 3z" />
            </svg>
          </div>
          {!isCollapsed && (
            <span className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
              Pyramid
            </span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop/Tablet Sidebar Wrapper */}
      <aside 
        className={`hidden md:block transition-all duration-300 shrink-0 h-screen ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="h-full w-full">{sidebarContent}</div>
      </aside>

      {/* Mobile Drawer (visible on mobile menu trigger) */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-zinc-950/40 backdrop-blur-sm">
          <div 
            onClick={onCloseMobile} 
            className="absolute inset-0"
          />
          <div className="relative w-64 h-full animate-slide-right">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
