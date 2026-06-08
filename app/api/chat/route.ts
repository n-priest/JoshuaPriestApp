import { streamText, gateway, zodSchema, stepCountIs } from "ai";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { z } from "zod";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { messages } = await req.json();
  const supabase = createServerSupabaseClient();

  const result = streamText({
    model: gateway("anthropic/claude-sonnet-4-5"),
    system: `You are Joshua Priest's personal AI coach and assistant. Joshua is a 17-year-old baseball player — Class of 2026 outfielder at Cathedral Catholic in San Diego, committed to Arizona State University on a baseball scholarship. He had knee surgery in January 2026 and is rehabbing.

His stats: .531 AVG, .571 OBP, 6.41 60-yard dash, PG Grade 9.5, #18 national, #1 CA outfielder.

Your role:
- Help Joshua organize his day, training, rehab, and recruiting
- Create tasks and reminders when he asks (or when it makes sense)
- Help him think in systems: inputs, outputs, feedback loops, leverage points
- Be direct, practical, and encouraging — talk like a coach, not a professor
- Keep responses concise unless he asks for detail

Joshua is learning to direct AI. Help him get better at asking good questions.`,
    messages,
    tools: {
      create_task: {
        description: "Create a task or reminder for Joshua",
        inputSchema: zodSchema(z.object({
          title: z.string().describe("Short task title"),
          description: z.string().optional().describe("Optional details"),
          due_date: z.string().optional().describe("ISO date string for when it is due"),
          remind_at: z.string().optional().describe("ISO datetime for SMS reminder"),
        })),
        execute: async ({ title, description, due_date, remind_at }: {
          title: string;
          description?: string;
          due_date?: string;
          remind_at?: string;
        }) => {
          const { data } = await supabase
            .from("tasks")
            .insert({
              user_id: userId,
              title,
              description: description ?? null,
              due_date: due_date ?? null,
              remind_at: remind_at ?? null,
            })
            .select()
            .single();
          return { created: true, task: data };
        },
      },
      list_tasks: {
        description: "List Joshua's current tasks",
        inputSchema: zodSchema(z.object({
          completed: z.boolean().optional().describe("Filter by completion status"),
        })),
        execute: async ({ completed }: { completed?: boolean }) => {
          let query = supabase
            .from("tasks")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false })
            .limit(20);
          if (completed !== undefined) {
            query = query.eq("completed", completed);
          }
          const { data } = await query;
          return { tasks: data };
        },
      },
    },
    stopWhen: stepCountIs(3),
  });

  return result.toUIMessageStreamResponse();
}
