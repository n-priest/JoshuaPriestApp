"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function TaskForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [remindAt, setRemindAt] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title.trim(),
        due_date: dueDate || null,
        remind_at: remindAt ? new Date(remindAt).toISOString() : null,
      }),
    });

    setTitle("");
    setDueDate("");
    setRemindAt("");
    setExpanded(false);
    setSubmitting(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex gap-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a task..."
          className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-maroon/40 focus:ring-2 focus:ring-maroon/10"
          onFocus={() => setExpanded(true)}
        />
        <button
          type="submit"
          disabled={!title.trim() || submitting}
          className="bg-maroon text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-maroon-light disabled:opacity-40 transition-all"
        >
          Add
        </button>
      </div>

      {expanded && (
        <div className="flex gap-3 mt-3">
          <div className="flex-1">
            <label className="text-xs font-medium text-gray-400 block mb-1">Due date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-maroon/40"
            />
          </div>
          <div className="flex-1">
            <label className="text-xs font-medium text-gray-400 block mb-1">Text reminder</label>
            <input
              type="datetime-local"
              value={remindAt}
              onChange={(e) => setRemindAt(e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-maroon/40"
            />
          </div>
        </div>
      )}
    </form>
  );
}
