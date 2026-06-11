import { createServerSupabaseClient } from "@/lib/supabase/server";
import { sendReminder } from "@/lib/email";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServerSupabaseClient();

  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .lte("remind_at", new Date().toISOString())
    .eq("reminder_sent", false)
    .eq("completed", false);

  if (!tasks || tasks.length === 0) {
    return NextResponse.json({ sent: 0 });
  }

  let sent = 0;
  for (const task of tasks) {
    const due = task.due_date
      ? ` — due ${new Date(task.due_date).toLocaleDateString()}`
      : "";
    await sendReminder(
      `Reminder: ${task.title}`,
      `Hey Joshua — reminder: ${task.title}${due}`
    );
    await supabase
      .from("tasks")
      .update({ reminder_sent: true })
      .eq("id", task.id);
    sent++;
  }

  return NextResponse.json({ sent });
}
