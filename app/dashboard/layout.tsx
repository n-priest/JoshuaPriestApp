import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-56 bg-dark text-white flex flex-col shrink-0">
        <div className="p-5 border-b border-white/10">
          <Link href="/" className="text-sm font-black tracking-widest uppercase text-white hover:text-gold transition-colors">
            Joshua·Priest
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <NavLink href="/dashboard">Overview</NavLink>
          <NavLink href="/dashboard/chat">AI Coach</NavLink>
          <NavLink href="/dashboard/tasks">Tasks</NavLink>
        </nav>
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <UserButton />
            <span className="text-xs text-white/50">Joshua Priest</span>
          </div>
        </div>
      </aside>

      <main className="flex-1 min-h-screen overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="block px-3 py-2 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors"
    >
      {children}
    </Link>
  );
}
