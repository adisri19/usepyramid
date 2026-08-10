# Pyramid — Full-Stack Task Management System

A high-performance task and project management application built with **Next.js 16 (App Router)**, **NestJS 11**, **MongoDB**, and a shared **TypeScript Monorepo**.

---

## ⚡ Quick Start (Zero-Configuration Evaluation)

The application includes an automatic in-memory MongoDB fallback, allowing reviewers to boot the entire stack with **zero database setup**:

```bash
# 1. Install dependencies across all monorepo workspaces
npm install

# 2. Start frontend and backend concurrently
npm run dev
```

* **Frontend:** [http://localhost:3000](http://localhost:3000) *(Click **"Continue as Guest"** for instant 1-click access)*
* **Backend API:** [http://localhost:3001](http://localhost:3001)

---

## ✨ Core Features & Engineering Highlights

* **🎯 Production Monorepo:** Structured using npm workspaces with `@pyramid/shared-types` providing end-to-end type safety between client and server.
* **⚡ Linear-Style `⌘K` Command Palette:** Press `⌘K` anywhere to search tasks with fuzzy matching, switch views, toggle themes, or export data.
* **⌨️ Pro Keyboard Shortcuts:** 
  * `C` $\rightarrow$ Create task modal
  * `B` $\rightarrow$ Kanban Board view
  * `L` $\rightarrow$ List Table view
  * `?` $\rightarrow$ Shortcuts cheat sheet modal
  * `Esc` $\rightarrow$ Close active overlay
* **🎨 FOUC-Proof Dual-Axis Theming:** Light/Dark modes + 6 accent color themes persisted server-side in cookies to prevent layout flashing.
* **🗂️ Interactive Task Views:**
  * **Kanban Board:** Smooth `@dnd-kit` drag-and-drop between status columns with distance sensors distinguishing clicks from drags.
  * **List View:** Expandable/collapsible status table with customizable column field toggles (Priority, Due Date, Assignee, Labels).
* **🪟 Parallel & Intercepting Routes:** Fast slide-out task panel (`@detail/(.)[taskId]`) with description autosave, subtasks checklist, and comment feed, with a full-page fallback route (`/tasks/[taskId]`).
* **🌱 Automatic Figma Mock Seeding:** Automatically provisions realistic sample tasks, subtasks, projects, and priority badges matching Figma designs on first load.
* **📊 Workspace Velocity Bar:** Real-time completion progress, animated gradient indicator, and active urgent task badges.
* **📥 CSV Data Export:** One-click export of all workspace tasks to a downloadable `.csv` spreadsheet.
* **🔐 Enterprise Authentication:** Supports frictionless guest sessions and Google OAuth with secure HttpOnly JWT cookies.

---

## ⌨️ Keyboard Shortcuts Reference

| Shortcut | Description |
| :--- | :--- |
| <kbd>⌘ K</kbd> / <kbd>Ctrl K</kbd> | Open Spotlight Command Palette |
| <kbd>C</kbd> | Open Create Task Dialog |
| <kbd>B</kbd> | Switch to Kanban Board View |
| <kbd>L</kbd> | Switch to List Table View |
| <kbd>?</kbd> | Open Keyboard Shortcuts Cheat Sheet |
| <kbd>Esc</kbd> | Close any active modal / slide-out panel |

---

## 📁 Repository Structure

```
usepyramid/
├── apps/
│   ├── web/               # Next.js 16 (App Router, React 19, Tailwind CSS v4, @dnd-kit)
│   └── api/               # NestJS 11 (Mongoose, Passport, Firebase Admin SDK)
├── packages/
│   └── shared-types/      # Shared TypeScript Data Models & DTOs
├── PRODUCT_ANALYSIS.md    # Part 2: AbleSpace Product & Clinical Workflow Analysis
└── README.md
```

---

## 📖 Part 2 Deliverable: AbleSpace Product Understanding

The comprehensive product and clinical workflow analysis for AbleSpace (Caseload $\rightarrow$ Take Data navigation, IEP tracking, edge cases, UX improvements, and product roadmap expansions) is documented in **[PRODUCT_ANALYSIS.md](./PRODUCT_ANALYSIS.md)**.
