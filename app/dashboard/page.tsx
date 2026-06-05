import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function DashboardPage() {
  const { userId } = await auth();
  const supabase = createServerSupabaseClient();

  const { count: openTasks } = await supabase
    .from("tasks")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId!)
    .eq("completed", false);

  const { count: completedTasks } = await supabase
    .from("tasks")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId!)
    .eq("completed", true);

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-dark mb-1">Dashboard</h1>
      <p className="text-charcoal/60 mb-8">Your command center. The GM&apos;s desk.</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Open Tasks" value={openTasks ?? 0} />
        <StatCard label="Completed" value={completedTasks ?? 0} />
        <StatCard label="AI Coach" value="Ready" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <QuickLink
          href="/dashboard/chat"
          title="AI Coach"
          description="Talk through ideas, get tasks organized, research anything"
        />
        <QuickLink
          href="/dashboard/tasks"
          title="Tasks & Checklists"
          description="Track what needs to get done and when"
        />
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <div className="text-2xl font-black text-maroon">{value}</div>
      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mt-1">{label}</div>
    </div>
  );
}

function QuickLink({ href, title, description }: { href: string; title: string; description: string }) {
  return (
    <Link
      href={href}
      className="block bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-maroon/20 transition-all"
    >
      <h3 className="font-bold text-dark mb-1">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </Link>
  );
}
