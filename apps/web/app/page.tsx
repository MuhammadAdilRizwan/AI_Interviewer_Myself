import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f6f8fb]">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white px-5 py-6 lg:block">
          <div className="flex items-center gap-3 px-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1f6f68] text-lg font-bold text-white">
              S
            </div>
            <div>
              <p className="text-sm font-bold tracking-tight text-slate-900">Screenwise</p>
              <p className="text-xs text-slate-500">AI interviewer</p>
            </div>
          </div>

          <nav className="mt-10 space-y-1" aria-label="Main navigation">
            <NavItem label="Overview" active />
            <NavItem label="Jobs" />
            <NavItem label="Candidates" />
            <NavItem label="Reports" />
          </nav>

          <div className="mt-10 border-t border-slate-100 pt-6">
            <p className="px-3 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
              Workspace
            </p>
            <nav className="mt-3 space-y-1" aria-label="Workspace navigation">
              <NavItem label="Team" />
              <NavItem label="Billing" />
              <NavItem label="Privacy" />
            </nav>
          </div>

          <div className="mt-auto pt-20">
            <div className="rounded-2xl bg-[#eef7f5] p-4">
              <p className="text-xs font-semibold text-[#1f6f68]">Starter plan</p>
              <p className="mt-2 text-xs leading-5 text-slate-600">
                42 of 100 interviews used this month.
              </p>
              <button className="mt-3 text-xs font-semibold text-[#1f6f68] hover:underline">
                Manage plan
              </button>
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-8">
            <div>
              <p className="text-xs font-medium text-slate-400">Monday, September 14, 2026</p>
              <h1 className="mt-1 text-xl font-semibold tracking-tight text-slate-900">
                Good morning, Ayesha
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button className="hidden rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 sm:block">
                View as candidate
              </button>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#dcefeb] text-sm font-bold text-[#1f6f68]">
                AR
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
            <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-sm font-medium text-[#1f6f68]">Workspace overview</p>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
                  Your hiring pipeline
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Review interview progress and discover your strongest candidates.
                </p>
              </div>
              <Link
                href="/jobs/new"
                className="rounded-lg bg-[#1f6f68] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#185b55]"
              >
                Create a job
              </Link>
            </section>

            <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Workspace metrics">
              <MetricCard label="Active jobs" value="06" change="+2 this month" />
              <MetricCard label="Candidates screened" value="128" change="+18% from last month" />
              <MetricCard label="Completion rate" value="84.6%" change="+6.2% from last month" />
              <MetricCard label="Minutes remaining" value="613" change="of 1,000 plan minutes" />
            </section>

            <section className="mt-8 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
              <div className="rounded-2xl border border-slate-200 bg-white">
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                  <div>
                    <h3 className="font-semibold text-slate-900">Active jobs</h3>
                    <p className="mt-1 text-xs text-slate-500">Track candidates across your open roles.</p>
                  </div>
                  <button className="text-sm font-semibold text-[#1f6f68] hover:underline">View all</button>
                </div>
                <div className="divide-y divide-slate-100">
                  <JobRow title="Senior Backend Engineer" candidates="32 candidates" progress="78%" tone="teal" />
                  <JobRow title="Product Designer" candidates="18 candidates" progress="54%" tone="blue" />
                  <JobRow title="Junior Python Developer" candidates="41 candidates" progress="36%" tone="amber" />
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white">
                <div className="border-b border-slate-100 px-5 py-4">
                  <h3 className="font-semibold text-slate-900">Recent interviews</h3>
                  <p className="mt-1 text-xs text-slate-500">Reports ready for your review.</p>
                </div>
                <div className="divide-y divide-slate-100">
                  <InterviewRow initials="HM" name="Hassan Malik" role="Backend Engineer" score="86" />
                  <InterviewRow initials="SA" name="Sara Ahmed" role="Product Designer" score="79" />
                  <InterviewRow initials="OK" name="Omar Khan" role="Python Developer" score="74" />
                </div>
                <div className="px-5 py-4">
                  <button className="w-full rounded-lg border border-slate-200 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                    Open reports
                  </button>
                </div>
              </div>
            </section>

            <section className="mt-6 rounded-2xl border border-[#cde4df] bg-[#eef7f5] p-5 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-[#1f6f68]">Ready to create your next interview?</p>
                <p className="mt-1 text-sm text-slate-600">
                  Define a job rubric first, then let Screenwise handle the first round.
                </p>
              </div>
              <button className="mt-4 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#1f6f68] shadow-sm ring-1 ring-inset ring-[#cde4df] hover:bg-[#f9fffd] sm:mt-0">
                Start with a job
              </button>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

function NavItem({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <button
      className={`flex w-full items-center rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
        active
          ? "bg-[#eef7f5] text-[#1f6f68]"
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      <span className={`mr-3 h-1.5 w-1.5 rounded-full ${active ? "bg-[#1f6f68]" : "bg-slate-300"}`} />
      {label}
    </button>
  );
}

function MetricCard({ label, value, change }: { label: string; value: string; change: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
      <p className="mt-2 text-xs font-medium text-[#1f6f68]">{change}</p>
    </div>
  );
}

function JobRow({
  title,
  candidates,
  progress,
  tone,
}: {
  title: string;
  candidates: string;
  progress: string;
  tone: "teal" | "blue" | "amber";
}) {
  const colors = {
    teal: "bg-[#1f6f68]",
    blue: "bg-blue-500",
    amber: "bg-amber-500",
  };

  return (
    <div className="px-5 py-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-800">{title}</p>
          <p className="mt-1 text-xs text-slate-500">{candidates}</p>
        </div>
        <span className="text-sm font-semibold text-slate-700">{progress}</span>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${colors[tone]}`} style={{ width: progress }} />
      </div>
    </div>
  );
}

function InterviewRow({
  initials,
  name,
  role,
  score,
}: {
  initials: string;
  name: string;
  role: string;
  score: string;
}) {
  return (
    <div className="flex items-center gap-3 px-5 py-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
        {initials}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-800">{name}</p>
        <p className="mt-1 truncate text-xs text-slate-500">{role}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold text-[#1f6f68]">{score}/100</p>
        <p className="mt-1 text-[11px] text-slate-400">Report ready</p>
      </div>
    </div>
  );
}
