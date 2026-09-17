"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export default function RecruiterShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const jobsActive = pathname === "/jobs" || pathname === "/jobs/new";
  const candidatesActive = pathname.includes("/candidates");
  const overviewActive = pathname === "/";

  return (
    <div className="min-h-screen bg-[#f6f8fb]">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white px-5 py-6 lg:block">
          <div className="flex items-center gap-3 px-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1f6f68] text-lg font-bold text-white">S</div>
            <div>
              <p className="text-sm font-bold tracking-tight text-slate-900">Screenwise</p>
              <p className="text-xs text-slate-500">AI interviewer</p>
            </div>
          </div>

          <nav className="mt-10 space-y-1" aria-label="Main navigation">
            <NavItem label="Overview" href="/" active={overviewActive} />
            <NavItem label="Jobs" href="/jobs" active={jobsActive} />
            <NavItem label="Candidates" href="/jobs" active={candidatesActive} />
            <NavItem label="Reports" />
          </nav>

          <div className="mt-10 border-t border-slate-100 pt-6">
            <p className="px-3 text-[11px] font-semibold uppercase tracking-widest text-slate-400">Workspace</p>
            <nav className="mt-3 space-y-1" aria-label="Workspace navigation">
              <NavItem label="Team" />
              <NavItem label="Billing" />
              <NavItem label="Privacy" />
            </nav>
          </div>

          <div className="mt-auto pt-20">
            <div className="rounded-2xl bg-[#eef7f5] p-4">
              <p className="text-xs font-semibold text-[#1f6f68]">Starter plan</p>
              <p className="mt-2 text-xs leading-5 text-slate-600">42 of 100 interviews used this month.</p>
              <button className="mt-3 text-xs font-semibold text-[#1f6f68] hover:underline">Manage plan</button>
            </div>
          </div>
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}

function NavItem({ label, href = "#", active = false }: { label: string; href?: string; active?: boolean }) {
  return (
    <Link
      href={href}
      className={`flex w-full items-center rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
        active ? "bg-[#eef7f5] text-[#1f6f68]" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      <span className={`mr-3 h-1.5 w-1.5 rounded-full ${active ? "bg-[#1f6f68]" : "bg-slate-300"}`} />
      {label}
    </Link>
  );
}
