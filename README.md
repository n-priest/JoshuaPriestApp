# JoshuaPriest.com

**Joshua doesn't need to learn to code. He needs to learn to direct AI.**

This is Joshua Priest's recruiting site and AI-learning sandbox. The site is a real, deployed artifact — and a teaching tool he controls in plain English through Claude Code.

## Architecture

The public recruiting pages are static HTML in `public/`. The private dashboard is a Next.js App Router app behind Clerk auth. Scouts see the recruiting page. Joshua sees the dashboard.

| Path | What it does |
|------|-------------|
| `public/index.html` | Single-page recruiting hub: hero, stats, about, film, journal, contact |
| `public/learn.html` | 4-phase guide teaching Joshua to direct AI |
| `public/styles.css` | Shared stylesheet for the static pages |
| `/dashboard` | Private dashboard — overview, AI coach, task manager |
| `/dashboard/chat` | AI coach chatbot (Vercel AI SDK + Claude) |
| `/dashboard/tasks` | Task and checklist manager with SMS reminders |
| `/api/chat` | AI chat API endpoint |
| `/api/tasks` | Task CRUD API |
| `/api/cron/reminders` | Vercel Cron — checks for pending SMS reminders every 15 min |

## Stack

- **Next.js 16** (App Router) on Vercel
- **Clerk** for auth (single-user: Joshua only)
- **Supabase** for database (tasks, chat history)
- **Vercel AI SDK v6** + AI Gateway for the chatbot
- **Twilio** for SMS task reminders
- **Tailwind CSS v4** for dashboard styling

## The Two Tools

- **Cowork** (chat) = hitting coach. Talk through ideas, research, draft, think out loud. It doesn't touch files.
- **Claude Code** (this terminal) = strength coach. It writes files, builds features, ships changes. It does the reps.
- **Joshua** = player AND GM. He decides what gets built. AI executes.

## Setup

1. Install Clerk and Supabase via Vercel Marketplace
2. Pull env vars: `vercel env pull .env.local`
3. Run the Supabase migration for the tasks + chat_messages tables
4. Add Twilio credentials to env vars
5. `npm install && npm run dev`

## Pre-Handoff TODOs (Dad)

1. **Drop a real photo** — save a game-day photo as `joshua.jpg` in `public/`, then ask Claude Code to swap the placeholder
2. **Confirm the inbox** — contact button sends to `npriest@1tul.com`
3. **Create Joshua's Clerk account** — disable public sign-up in Clerk dashboard
4. **Add Twilio creds** — for SMS reminders to work
