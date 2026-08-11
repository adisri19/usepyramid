"use client";

import { useState, useEffect, useRef } from "react";
import { useTasks } from "@/context/tasks-context";
import { 
  Search, 
  SlidersHorizontal, 
  Filter, 
  Plus, 
  Menu,
  Check,
  X,
  Compass
} from "lucide-react";

interface TopbarProps {
  onToggleSidebar: () => void;
  onOpenMobileSidebar: () => void;
  onOpenAddTaskModal: () => void;
  onOpenTourModal?: () => void;
  title?: string;
}

export function Topbar({ 
  onToggleSidebar, 
  onOpenMobileSidebar, 
  onOpenAddTaskModal, 
  onOpenTourModal,
  title = "Tasks" 
}: TopbarProps) {
  const { 
    view, 
    setView, 
    searchQuery, 
    setSearchQuery, 
    visibleFields, 
    toggleField,
    filters,
    setFilters,
    projects
  } = useTasks();

  const [searchActive, setSearchActive] = useState(false);
  const [fieldsOpen, setFieldsOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const fieldsRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  // Focus search on ⌘F or Ctrl+F
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "f") {
        e.preventDefault();
        setSearchActive(true);
        setTimeout(() => searchInputRef.current?.focus(), 50);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (fieldsOpen && fieldsRef.current && !fieldsRef.current.contains(e.target as Node)) {
        setFieldsOpen(false);
      }
      if (filterOpen && filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [fieldsOpen, filterOpen]);

  const toggleFilter = (type: string, value: string) => {
    const activeFilters = filters as any;
    if (activeFilters[type] === value) {
      const updated = { ...filters } as any;
      delete updated[type];
      setFilters(updated);
    } else {
      setFilters({ ...filters, [type]: value });
    }
  };

  const clearAllFilters = () => {
    setFilters({});
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <header className="flex h-14 items-center justify-between border-b border-zinc-200/80 px-6 bg-white dark:bg-zinc-950 dark:border-zinc-800/80">
      <div className="flex items-center gap-4 flex-1">
        {/* Toggle Sidebar (Desktop) / Hamburger (Mobile) */}
        <button 
          onClick={onToggleSidebar}
          className="hidden md:flex h-8 w-8 items-center justify-center rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-550 dark:text-zinc-400"
          title="Toggle Sidebar"
        >
          <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M9 3v18" />
          </svg>
        </button>
        <button 
          onClick={onOpenMobileSidebar}
          className="flex md:hidden h-8 w-8 items-center justify-center rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-550 dark:text-zinc-400"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Title / Breadcrumb */}
        {!searchActive && (
          <h1 className="text-base font-bold text-zinc-900 dark:text-white shrink-0">
            {title}
          </h1>
        )}

        {/* Inline Search Bar */}
        <div className="flex-1 max-w-md relative flex items-center">
          {searchActive ? (
            <div className="flex items-center w-full h-8 px-2 rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 transition-all">
              <Search className="h-4 w-4 text-zinc-400 shrink-0 mr-2" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks (Press Esc to close)..."
                className="w-full text-xs bg-transparent focus:outline-none text-zinc-850 dark:text-zinc-200"
              />
              <button 
                onClick={() => {
                  setSearchQuery("");
                  setSearchActive(false);
                }}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setSearchActive(true);
                setTimeout(() => searchInputRef.current?.focus(), 50);
              }}
              className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500"
              title="Search (⌘F)"
            >
              <Search className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2">
        {/* Tour Highlights Button */}
        {onOpenTourModal && (
          <button
            onClick={onOpenTourModal}
            className="hidden sm:inline-flex h-8 items-center gap-1.5 rounded-lg border border-accent/30 bg-accent/10 px-2.5 text-xs font-bold text-accent shadow-2xs hover:bg-accent/20 transition-all"
            title="Overview of Features & Tech Highlights"
          >
            <Compass className="h-3.5 w-3.5 animate-pulse" />
            <span>Tour</span>
          </button>
        )}

        {/* Fields Dropdown */}
        <div className="relative" ref={fieldsRef}>
          <button
            onClick={() => setFieldsOpen(!fieldsOpen)}
            className={`flex h-8 items-center gap-2 rounded-lg border px-3 text-xs font-semibold shadow-sm transition-colors ${
              fieldsOpen 
                ? "bg-zinc-100 border-zinc-300 text-zinc-900 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                : "border-zinc-200 bg-white hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-850"
            }`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-zinc-500" />
            <span>Fields</span>
          </button>

          {fieldsOpen && (
            <div className="absolute right-0 top-9 z-50 w-56 rounded-xl border border-zinc-200 bg-white p-3 shadow-xl dark:border-zinc-850 dark:bg-zinc-900">
              {/* Segmented View Mode Toggle */}
              <div className="flex rounded-lg bg-zinc-100 p-0.5 dark:bg-zinc-850 mb-3">
                <button
                  onClick={() => setView("list")}
                  className={`flex-1 rounded-md py-1 text-[11px] font-bold text-center transition-all ${
                    view === "list"
                      ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-white"
                      : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                  }`}
                >
                  List
                </button>
                <button
                  onClick={() => setView("board")}
                  className={`flex-1 rounded-md py-1 text-[11px] font-bold text-center transition-all ${
                    view === "board"
                      ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-white"
                      : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                  }`}
                >
                  Board
                </button>
              </div>

              {/* Field Visibility Checkboxes */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1">
                  Columns / Fields
                </span>
                {Object.keys(visibleFields).map((field) => {
                  const label = field === "dueDate" ? "Due Date" : field.charAt(0).toUpperCase() + field.slice(1);
                  const isChecked = (visibleFields as any)[field];
                  return (
                    <label
                      key={field}
                      className="flex items-center justify-between rounded-lg px-2 py-1 text-xs cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                    >
                      <span>{label}</span>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleField(field)}
                        className="h-3.5 w-3.5 rounded border-zinc-300 accent-accent focus:ring-0"
                      />
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Filter Dropdown */}
        <div className="relative" ref={filterRef}>
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className={`flex h-8 items-center gap-2 rounded-lg border px-3 text-xs font-semibold shadow-sm transition-colors ${
              filterOpen || hasActiveFilters
                ? "bg-accent/15 border-accent text-accent"
                : "border-zinc-200 bg-white hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-850"
            }`}
          >
            <Filter className="h-3.5 w-3.5" />
            <span>Filter</span>
            {hasActiveFilters && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[9px] font-bold text-white">
                {Object.keys(filters).length}
              </span>
            )}
          </button>

          {filterOpen && (
            <div className="absolute right-0 top-9 z-50 w-64 rounded-xl border border-zinc-200 bg-white p-3 shadow-xl dark:border-zinc-850 dark:bg-zinc-900">
              <div className="flex items-center justify-between mb-3 border-b border-zinc-100 dark:border-zinc-800 pb-2">
                <span className="text-xs font-bold text-zinc-850 dark:text-zinc-200">Filters</span>
                {hasActiveFilters && (
                  <button 
                    onClick={clearAllFilters}
                    className="text-[10px] text-accent font-semibold hover:underline"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Priority Filters */}
              <div className="mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-1.5">
                  Priority
                </span>
                <div className="flex flex-wrap gap-1">
                  {["Urgent", "High", "Medium", "Low", "No Priority"].map((p) => {
                    const isActive = filters.priority === p;
                    return (
                      <button
                        key={p}
                        onClick={() => toggleFilter("priority", p)}
                        className={`px-2 py-1 text-[11px] rounded-lg border transition-colors ${
                          isActive
                            ? "bg-accent border-accent text-white"
                            : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-850 dark:text-zinc-300 dark:hover:bg-zinc-800"
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Project Filters */}
              {projects.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-1.5">
                    Project
                  </span>
                  <div className="flex flex-col gap-1 max-h-40 overflow-y-auto">
                    {projects.map((proj) => {
                      const isActive = filters.project === proj.id;
                      return (
                        <button
                          key={proj.id}
                          onClick={() => toggleFilter("project", proj.id)}
                          className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left text-xs transition-colors ${
                            isActive
                              ? "bg-accent/10 text-accent font-semibold"
                              : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800/60"
                          }`}
                        >
                          <span>{proj.name}</span>
                          {isActive && <Check className="h-3 w-3" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Add Task Button */}
        <button
          onClick={onOpenAddTaskModal}
          className="flex h-8 items-center gap-1.5 rounded-lg bg-zinc-900 px-3 text-xs font-bold text-white shadow hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
        >
          <Plus className="h-3.5 w-3.5 stroke-[3px]" />
          <span>Add Task</span>
        </button>
      </div>
    </header>
  );
}
