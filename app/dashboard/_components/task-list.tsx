"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Task {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  due_date: string | null;
  remind_at: string | null;
  is_checklist: boolean;
  created_at: string;
}

export function TaskList({ tasks }: { tasks: Task[] }) {
  const router = useRouter();

  async function toggleTask(id: string, completed: boolean) {
    await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !completed }),
    });
    router.refresh();
  }

  async function deleteTask(id: string) {
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    router.refresh();
  }

  const open = tasks.filter((t) => !t.completed);
  const done = tasks.filter((t) => t.completed);

  return (
    <div className="space-y-6">
      {open.length > 0 && (
        <div>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
            Open ({open.length})
          </h2>
          <div className="space-y-2">
            {open.map((task) => (
              <TaskItem key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} />
            ))}
          </div>
        </div>
      )}

      {done.length > 0 && (
        <div>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
            Completed ({done.length})
          </h2>
          <div className="space-y-2 opacity-60">
            {done.map((task) => (
              <TaskItem key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} />
            ))}
          </div>
        </div>
      )}

      {tasks.length === 0 && (
        <div className="text-center text-gray-400 py-12">
          <p className="font-semibold">No tasks yet</p>
          <p className="text-sm mt-1">Add one above or ask the AI Coach to create tasks for you</p>
        </div>
      )}
    </div>
  );
}

function TaskItem({
  task,
  onToggle,
  onDelete,
}: {
  task: Task;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
}) {
  const [deleting, setDeleting] = useState(false);

  return (
    <div className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm border border-gray-100 group">
      <button
        onClick={() => onToggle(task.id, task.completed)}
        className={`mt-0.5 w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
          task.completed
            ? "bg-maroon border-maroon text-white"
            : "border-gray-300 hover:border-maroon/50"
        }`}
      >
        {task.completed && <span className="text-xs">&#10003;</span>}
      </button>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${task.completed ? "line-through text-gray-400" : "text-dark"}`}>
          {task.title}
        </p>
        {task.description && (
          <p className="text-xs text-gray-400 mt-1">{task.description}</p>
        )}
        {task.due_date && (
          <p className="text-xs text-maroon font-medium mt-1">
            Due {new Date(task.due_date).toLocaleDateString()}
          </p>
        )}
        {task.remind_at && !task.completed && (
          <p className="text-xs text-gold-dark font-medium mt-0.5">
            Reminder set
          </p>
        )}
      </div>
      <button
        onClick={() => { setDeleting(true); onDelete(task.id); }}
        disabled={deleting}
        className="text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all text-lg leading-none"
      >
        &times;
      </button>
    </div>
  );
}
