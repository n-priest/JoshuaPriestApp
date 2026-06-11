import { Resend } from "resend";

export async function sendReminder(subject: string, body: string) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  return resend.emails.send({
    from: "Joshua Priest <reminders@joshuapriest.com>",
    to: process.env.JOSHUA_EMAIL!,
    subject,
    text: body,
  });
}
