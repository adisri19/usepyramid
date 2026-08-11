"use client";

import { useState } from "react";
import { 
  DndContext, 
  DragEndEvent, 
  DragStartEvent, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import { BoardColumn } from "./board-column";
import { TaskCard } from "./task-card";
import { useTasks } from "@/context/tasks-context";
import { Task } from "@pyramid/shared-types";
import { triggerConfetti } from "@/lib/confetti";

const COLUMNS = ["To Do", "Doing", "Completed", "On Hold"] as const;

export function BoardView() {
  const { tasks, updateTaskStatus, loading, visibleFields } = useTasks();
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // Distinguish clicks from drags using distance constraint (6px)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const activeId = event.active.id as string;
    const task = tasks.find((t) => (t.id || (t as any)._id) === activeId);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id as string;
    const overStatus = over.id as string; // Column ID is the status string

    const task = tasks.find((t) => (t.id || (t as any)._id) === activeId);
    if (task && task.status !== overStatus) {
      await updateTaskStatus(activeId, overStatus);
      if (overStatus === "Completed") {
        triggerConfetti();
      }
    }
  };

  const handleDragCancel = () => {
    setActiveTask(null);
  };

  if (loading && tasks.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="flex gap-4 overflow-x-auto pb-4 h-full min-h-[calc(100vh-200px)]">
        {COLUMNS.map((columnStatus) => (
          <BoardColumn
            key={columnStatus}
            status={columnStatus}
            tasks={tasks.filter((t) => t.status === columnStatus)}
          />
        ))}
      </div>

      {/* Smooth, elevated drag preview floating under the cursor */}
      <DragOverlay
        dropAnimation={{
          duration: 180,
          easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
          sideEffects: defaultDropAnimationSideEffects({
            styles: {
              active: {
                opacity: "0.4",
              },
            },
          }),
        }}
      >
        {activeTask ? (
          <div className="w-[280px]">
            <TaskCard
              task={activeTask}
              visibleFields={visibleFields}
              isOverlay
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
