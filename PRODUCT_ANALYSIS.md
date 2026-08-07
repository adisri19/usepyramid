# AbleSpace Product Analysis: "Take Data" Tab Workflow

This document evaluates the **Take Data** screen under the **Caseload** tab inside the AbleSpace product.

---

## 1. Navigation & Entry Point
- **Nav Path:** Clinicians log into the platform, click the **Caseload** tab in the main sidebar to view their list of students, select a specific student card, and click the **Take Data** sub-tab or active session logging button.

## 2. Screen Purpose
- **Core Goal:** To enable Speech-Language Pathologists (SLPs) and special educators to record, calculate, and log trial-by-trial therapeutic performance (correct/incorrect repetitions, task completions, frequency tallies) against specific IEP goals in real-time during a therapy session.

## 3. Step-by-Step Workflow
1. **Goal Selection:** The clinician selects one or more pre-configured IEP goals from a list (e.g., "Student will produce /r/ in the initial position of words with 80% accuracy").
2. **Trial Logging:** During the trial, the clinician taps visual inputs: `+` (success), `-` (incorrect/prompted), or logs counts for high-frequency behaviors.
3. **Session Notes:** The clinician adds optional qualitative session notes describing student behavior or prompts.
4. **Saving:** Tapping **Save** terminates the session, immediately writing the trials to the database.
5. **Visualization:** The logged trials are translated into charts, performance history logs, and progress graphs under the student's reports tab to track IEP compliance.

## 4. Field-by-Field Breakdown
- **Target IEP Goal (Required):** Selects which target is being practiced.
- **Trial Counters (Required):** Increments correct vs incorrect attempts.
- **Prompt Level (Optional Dropdown):** Specifies helper cues given (e.g., Verbal, Visual, Gestural, Physical).
- **Session Notes (Optional Text):** Free-form observation text.
- **Date & Duration (Defaults to current time):** Records when the therapy took place.

## 5. Edge Cases
- **No Goals Configured:** If a student has no goals, the screen disables data controls and prompts the user to add goals first or log a "Note Only" general session.
- **Editing Past Sessions:** Modifying previous entries requires navigating to the history log, opening the log sheet, and updating numbers with limits enforced (e.g., trials cannot be negative).
- **Extreme Inputs:** Input fields validate percentage scores to remain within 0-100% and prevent empty submits.

## 6. UI/UX & Functionality Improvement Suggestions

### UI/UX Improvements
1. **Keyboard-Driven Logging (Speed):** 
   - *Issue:* Clinicians must constantly click buttons on a screen while interacting with a student.
   - *Fix:* Introduce hotkeys (e.g., `Space` for correct/`+`, `Backspace` for incorrect/`-`) so data can be entered rapidly without looking away from the student.
2. **Instant Input Range Validation:**
   - *Issue:* Incorrect inputs (like 110% accuracy) only trigger warnings upon submitting.
   - *Fix:* Add real-time visual inline validation (red borders and help text) as the user types.
3. **Undo Session Save Toast:**
   - *Issue:* Clicking save by accident requires deep navigation to delete/edit the session log.
   - *Fix:* Display a 5-second "Undo" toast banner at the bottom of the screen upon saving.

### Functionality Improvements (Product Expansion)
1. **Offline-First Sync Capability:** 
   - *Benefit:* Allows clinicians working in rural schools or areas with poor cellular reception to log session trials uninterrupted. Data is saved in IndexedDB and automatically synced to the server once online.
2. **Hands-free Voice Commands:**
   - *Benefit:* Educators can speak commands (e.g., saying "Correct", "Error", or "Prompt visual") to log trials, leaving their hands free to manage therapy toys or flashcards.
3. **Multi-Student Session Logging:**
   - *Benefit:* SLPs often run group sessions of 2-4 students. A side-by-side split screen allows switching between student rosters to record data in a single integrated timeline.
