# Pyramid — Task Management System

Pyramid is a task management application featuring a Next.js 16 (App Router) frontend, a NestJS 11 backend API, and a shared TypeScript types package.

## Setup & Running

### Installation
Install all dependencies from the root directory:
```bash
npm install
```

### Run Locally
To start the NestJS API and Next.js Web app concurrently in development mode:
```bash
npm run dev
```
- **Web Frontend:** [http://localhost:3000](http://localhost:3000) (Guest & Google OAuth login options)
- **Backend API:** [http://localhost:3001](http://localhost:3001) (Automatically starts an in-memory MongoDB fallback)

---

## Features

- **Persisted Axis Theming:** Instantly toggle between Light/Dark mode and 6 accent colors. Configured on the server cookie level to prevent unstyled layout flashing (FOUC).
- **Interactive Views:** Board (Kanban with drag-and-drop status changes) and List (table with collapsible status groups) views.
- **Dynamic Field Toggles:** Hide/show columns (Priority, Due Date, Members, Labels) on the fly.
- **Task Details Panel:** Slide-out right panel to edit description, manage subtask checklists, and post comments. Includes a full-page route fallback.
- **Projects Page:** View and filter tasks by specific project workspaces.

---

## Project Structure
```
pyramid/
├── apps/
│   ├── web/           # Next.js 16 Client App
│   └── api/           # NestJS 11 Server App
├── packages/
│   └── shared-types/  # Common TypeScript Interfaces
└── PRODUCT_ANALYSIS.md # Part 2 AbleSpace Product understanding doc
```
