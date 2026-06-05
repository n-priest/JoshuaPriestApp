import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { TaskList } from "../_components/task-list";
import { TaskForm } from "../_components/task-form";

export default async function TasksPage() {
  const { userId } = await auth();
  const supabase = createServerSupabaseClient();

  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", userId!)
    .order("completed", { ascending: true })
    .order("due_date", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false });

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-dark mb-1">Tasks & Checklists</h1>
      <p className="text-charcoal/60 mb-6">Track what needs to get done. The AI Coach can add tasks for you too.</p>

      <TaskForm />

      <div className="mt-8">
        <TaskList tasks={tasks ?? []} />
      </div>
    </div>
  );
}
