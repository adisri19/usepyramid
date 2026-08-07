"use client";

import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { BoardColumn } from "./board-column";
import { useTasks } from "@/context/tasks-context";

const COLUMNS = ["To Do", "Doing", "Completed", "On Hold"] as const;

export function BoardView() {
  const { tasks, updateTaskStatus, loading } = useTasks();

  // Distinguish clicks from drags using distance constraint (5px)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overStatus = over.id as string; // Column ID is the status string

    // Find the task to see if status actually changed
    const task = tasks.find((t) => t.id === activeId);
    if (task && task.status !== overStatus) {
      await updateTaskStatus(activeId, overStatus);
    }
  };

  if (loading && tasks.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4 h-full min-h-[calc(100vh-200px)]">
        {COLUMNS.map((columnStatus) => (
          <BoardColumn
            key={columnStatus}
            status={columnStatus}
            tasks={tasks.filter((t) => t.status === columnStatus)}
          />
        ))}
      </div>
    </DndContext>
  );
}
