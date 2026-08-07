# Pyramid — Task Management System

Pyramid is a premium task management application structured as a monorepo containing a **Next.js 16 (App Router)** web frontend, a **NestJS 11** backend API, and a shared TypeScript types library. It leverages **Tailwind CSS v4** for styling and **MongoDB** (with Mongoose) for data persistence.

---

## 1. Monorepo Architecture

```
pyramid/
├── apps/
│   ├── web/                # Next.js 16 + Tailwind CSS v4 + dnd-kit (Frontend)
│   └── api/                # NestJS 11 + Mongoose (Backend API)
├── packages/
│   └── shared-types/       # Shared TypeScript typings (Task, User, Project, etc.)
├── package.json            # Root configuration using npm workspaces
└── README.md
```

- **Shared Types (`@pyramid/shared-types`):** Ensures type safety between the Next.js client and the NestJS server.
- **Backend API (`@pyramid/api`):** Out-of-the-box in-memory MongoDB support (`mongodb-memory-server`) starts automatically if no external database is configured. Handles JWT cookies, Google OAuth, and CRUD operations.
- **Web Frontend (`@pyramid/web`):** Responsive design implementing parallel slots (`@detail`) for sliding task overlay panels and persistent theme/color modes.

---

## 2. Setup and Execution

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation
From the root directory, install all workspace dependencies:
```bash
npm install
```

### Configuration (Environment Variables)
No environment variables are required to run locally out-of-the-box. The application uses working fallbacks (e.g., in-memory MongoDB and fallback JWT secret keys).

To configure custom variables, create a `.env` file in `apps/api/`:
```env
PORT=3001
FRONTEND_URL=http://localhost:3000
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-secure-jwt-key
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3001/auth/google/callback
```

### Running Locally
To launch both Next.js (port 3000) and NestJS (port 3001) concurrently:
```bash
npm run dev
```
- Frontend starts at: [http://localhost:3000](http://localhost:3000)
- Backend starts at: [http://localhost:3001](http://localhost:3001)

### Building
To verify and compile all workspaces:
```bash
npm run build
```

---

## 3. Features & Implementation Details

1. **Persisted Axis Theming:** Supports light/dark mode and 6 accent colors (Amber, Blue, Pink, Rose, Emerald, Black). Variables are read from request cookies on the server before rendering to eliminate FOUC (flash of unstyled content).
2. **Guest & Google Login:** Users can immediately evaluate the app with "Continue as Guest" (creating an anonymous session and default workspace) or connect their account via Google OAuth.
3. **Fields Visibility & Collapsible Lists:** Toggles columns like Priority, Members, Due Date, and Labels in real-time, or collapses status groups in the List table view.
4. **Drag & Drop (Kanban Board):** Leverages `@dnd-kit/core` with a `PointerSensor` activation constraint (5px distance) to prevent click conflicts, enabling smooth drag-and-drop status changes.
5. **Intercepting Details Overlay:** Parallel slots (`@detail`) slide in a task details panel on the right side over the dashboard, with a full-page route fallback upon refresh or direct navigation.
6. **Responsive Adaptation:** Detects mobile viewports (<768px) and auto-switches to the List view, collapsing the sidebar to a responsive drawer overlay.

---

## 4. Part 2 — AbleSpace Product Analysis

This section explores the **Take Data** screen under the **Caseload** tab inside the AbleSpace product.

### 4.1 Navigation & Entry Point
- **Nav Path:** Clinicians log into the platform, click the **Caseload** tab in the main sidebar to view their list of students, select a specific student card, and click the **Take Data** sub-tab or active session logging button.

### 4.2 Screen Purpose
- **Core Goal:** To enable Speech-Language Pathologists (SLPs) and special educators to record, calculate, and log trial-by-trial therapeutic performance (correct/incorrect repetitions, task completions, frequency tallies) against specific IEP goals in real-time during a therapy session.

### 4.3 Step-by-Step Workflow
1. **Goal Selection:** The clinician selects one or more pre-configured IEP goals from a list (e.g., "Student will produce /r/ in the initial position of words with 80% accuracy").
2. **Trial Logging:** During the trial, the clinician taps visual inputs: `+` (success), `-` (incorrect/prompted), or logs counts for high-frequency behaviors.
3. **Session Notes:** The clinician adds optional qualitative session notes describing student behavior or prompts.
4. **Saving:** Tapping **Save** terminates the session, immediately writing the trials to the database.
5. **Visualization:** The logged trials are translated into charts, performance history logs, and progress graphs under the student's reports tab to track IEP compliance.

### 4.4 Field-by-Field Breakdown
- **Target IEP Goal (Required):** Selects which target is being practiced.
- **Trial Counters (Required):** Increments correct vs incorrect attempts.
- **Prompt Level (Optional Dropdown):** Specifies helper cues given (e.g., Verbal, Visual, Gestural, Physical).
- **Session Notes (Optional Text):** Free-form observation text.
- **Date & Duration (Defaults to current time):** Records when the therapy took place.

### 4.5 Edge Cases
- **No Goals Configured:** If a student has no goals, the screen disables data controls and prompts the user to add goals first or log a "Note Only" general session.
- **Editing Past Sessions:** Modifying previous entries requires navigating to the history log, opening the log sheet, and updating numbers with limits enforced (e.g., trials cannot be negative).
- **Extreme Inputs:** Input fields validate percentage scores to remain within 0-100% and prevent empty submits.

### 4.6 UI/UX & Functionality Improvement Suggestions

#### UI/UX Improvements
1. **Keyboard-Driven Logging (Speed):** 
   - *Issue:* Clinicians must constantly click buttons on a screen while interacting with a student.
   - *Fix:* Introduce hotkeys (e.g., `Space` for correct/`+`, `Backspace` for incorrect/`-`) so data can be entered rapidly without looking away from the student.
2. **Instant Input Range Validation:**
   - *Issue:* Incorrect inputs (like 110% accuracy) only trigger warnings upon submitting.
   - *Fix:* Add real-time visual inline validation (red borders and help text) as the user types.
3. **Undo Session Save Toast:**
   - *Issue:* Clicking save by accident requires deep navigation to delete/edit the session log.
   - *Fix:* Display a 5-second "Undo" toast banner at the bottom of the screen upon saving.

#### Functionality Improvements (Product Expansion)
1. **Offline-First Sync Capability:** 
   - *Benefit:* Allows clinicians working in rural schools or areas with poor cellular reception to log session trials uninterrupted. Data is saved in IndexedDB and automatically synced to the server once online.
2. **Hands-free Voice Commands:**
   - *Benefit:* Educators can speak commands (e.g., saying "Correct", "Error", or "Prompt visual") to log trials, leaving their hands free to manage therapy toys or flashcards.
3. **Multi-Student Session Logging:**
   - *Benefit:* SLPs often run group sessions of 2-4 students. A side-by-side split screen allows switching between student rosters to record data in a single integrated timeline.
