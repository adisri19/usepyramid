#!/bin/bash

echo "Starting automated git history split..."

# Unstage everything first
git reset

# Commit 1: Monorepo Root Setup
echo "Staging Commit 1..."
git add package.json package-lock.json
git commit -m "chore: scaffold monorepo root and configure npm workspaces"

# Commit 2: Shared Types Package
echo "Staging Commit 2..."
git add packages/shared-types/
git commit -m "feat(shared): establish common TypeScript typings and interfaces"

# Commit 3: Backend Scaffold and Database Module
echo "Staging Commit 3..."
git add apps/api/package.json apps/api/tsconfig*.json apps/api/eslint.config.mjs apps/api/nest-cli.json apps/api/src/app* apps/api/src/main.ts apps/api/src/database/ apps/api/test/
git commit -m "feat(api): scaffold NestJS app and configure dynamic in-memory MongoDB"

# Commit 4: JWT & Guest Sessions
echo "Staging Commit 4..."
git add apps/api/src/auth/jwt-payload.interface.ts apps/api/src/auth/current-user.decorator.ts apps/api/src/auth/jwt-auth.guard.ts apps/api/src/auth/strategies/jwt.strategy.ts apps/api/src/auth/auth.service.ts
git commit -m "feat(api): implement JWT session cookie auth and guest login"

# Commit 5: Google OAuth Integration
echo "Staging Commit 5..."
git add apps/api/src/auth/strategies/google.strategy.ts apps/api/src/auth/auth.controller.ts apps/api/src/auth/auth.module.ts
git commit -m "feat(api): integrate passport Google OAuth strategy and callback handler"

# Commit 6: API CRUD Controllers & Services
echo "Staging Commit 6..."
git add apps/api/src/users/ apps/api/src/workspaces/ apps/api/src/projects/ apps/api/src/tasks/ apps/api/src/comments/
git commit -m "feat(api): build REST controllers for Users, Workspaces, Projects, Tasks, and Comments"

# Commit 7: Frontend Scaffold and Tailwind CSS Variables
echo "Staging Commit 7..."
git add apps/web/package.json apps/web/tsconfig.json apps/web/next.config.ts apps/web/src/app/globals.css
git commit -m "feat(web): scaffold Next.js app and configure Tailwind CSS v4 variables"

# Commit 8: Theming Axis State Machine
echo "Staging Commit 8..."
git add apps/web/src/components/theme-provider.tsx apps/web/src/app/layout.tsx
git commit -m "feat(web): implement ThemeProvider for light/dark and 6 color accent modes"

# Commit 9: App Views Layout and Login Page
echo "Staging Commit 9..."
git add apps/web/src/app/login/ apps/web/src/app/page.tsx apps/web/src/components/sidebar.tsx apps/web/src/components/topbar.tsx apps/web/src/components/dashboard-layout.tsx apps/web/src/lib/api.ts
git commit -m "feat(web): build responsive layouts, sidebar, topbar, and Figma login page"

# Commit 10: Task Dashboards and Details Overlays
echo "Staging Commit 10..."
git add apps/web/src/components/board-view.tsx apps/web/src/components/board-column.tsx apps/web/src/components/task-card.tsx apps/web/src/components/list-view.tsx apps/web/src/components/task-detail-panel.tsx apps/web/src/app/tasks/ apps/web/src/app/projects/ apps/web/src/app/settings/ apps/web/src/context/
git commit -m "feat(web): build Kanban Board with drag-and-drop, List View tables, and task detail slide-overs"

# Commit 11: Final Documentation
echo "Staging Commit 11..."
git add README.md
git commit -m "docs: write setup instructions, walkthrough files, and Part 2 AbleSpace product analysis"

# Stage any leftover files
git add .
if ! git diff-index --quiet HEAD --; then
  echo "Staging leftovers..."
  git commit -m "chore: include remaining project configuration and assets"
fi

echo "Git history split successfully completed!"
