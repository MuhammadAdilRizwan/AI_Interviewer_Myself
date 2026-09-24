import { loginAdmin, isAdminAuthenticated, logoutAdmin } from "./actions";
import Link from "next/link";

const metrics = [
  { label: "Total organizations", value: "248", change: "+12 this month", tone: "teal" },
  { label: "Active subscriptions", value: "192", change: "77.4% of organizations", tone: "blue" },
  { label: "Monthly recurring revenue", value: "$12,480", change: "+8.6% from last month", tone: "violet" },
  { label: "Interviews this month", value: "4,821", change: "+18.2% from last month", tone: "amber" },
];

const recentOrganizations = [
  ["Northstar Labs", "Business", "Today, 09:42", "Active"],
  ["Crescent Health", "Starter", "Yesterday, 16:18", "Trial"],
  ["Vertex Consulting", "Business", "Yesterday, 11:05", "Active"],
  ["Atlas Commerce", "Starter", "Sep 14, 2026", "Past due"],
];

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    const { error } = await searchParams;
    return <AdminLogin error={error === "invalid"} />;
  }

  return (
    <div className="min-h-screen bg-[#f6f8fb]">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-slate-950 px-5 py-6 text-white lg:block">
          <div className="flex items-center gap-3 px-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3a9b91] text-lg font-bold">S</div>
            <div><p className="text-sm font-bold tracking-tight">Screenwise</p><p className="text-xs text-slate-400">Platform admin</p></div>
          </div>
          <nav className="mt-10 space-y-1" aria-label="Admin navigation">
            <AdminNavItem label="Platform overview" active />
            <AdminNavItem label="Organizations" />
            <AdminNavItem label="Subscriptions" />
            <AdminNavItem label="Usage & costs" />
            <AdminNavItem label="System health" />
          </nav>
          <div className="mt-10 border-t border-slate-800 pt-6">
            <p className="px-3 text-[11px] font-semibold uppercase tracking-widest text-slate-500">Workspace</p>
            <Link href="/overview" className="mt-3 flex rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 hover:bg-slate-900 hover:text-white">Open customer workspace</Link>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-8">
            <div><p className="text-xs font-medium text-slate-400">SaaS owner console</p><h1 className="mt-1 text-xl font-semibold tracking-tight text-slate-900">Platform overview</h1></div>
            <form action={logoutAdmin}><button type="submit" className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">Sign out</button></form>
          </header>

          <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div><p className="text-sm font-medium text-[#1f6f68]">Owner dashboard</p><h2 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">Run your platform</h2><p className="mt-2 text-sm text-slate-500">Monitor growth, revenue, customer usage, and operational health from one place.</p></div>
              <span className="w-fit rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">Demo metrics</span>
            </div>

            <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Platform metrics">
              {metrics.map((metric) => <MetricCard key={metric.label} {...metric} />)}
            </section>

            <section className="mt-8 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
              <div className="rounded-2xl border border-slate-200 bg-white">
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div><h3 className="font-semibold text-slate-900">Usage and revenue trend</h3><p className="mt-1 text-xs text-slate-500">Monthly platform performance</p></div><span className="text-xs font-semibold text-[#1f6f68]">Last 6 months</span></div>
                <div className="grid h-64 grid-cols-6 items-end gap-3 px-5 py-6">
                  {[42, 51, 47, 64, 73, 86].map((height, index) => <div key={height} className="flex h-full flex-col items-center justify-end gap-2"><div className="w-full max-w-10 rounded-t-md bg-[#b9ded7]" style={{ height: `${height}%` }} /><span className="text-[11px] text-slate-400">{["Apr", "May", "Jun", "Jul", "Aug", "Sep"][index]}</span></div>)}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5"><h3 className="font-semibold text-slate-900">Subscription mix</h3><p className="mt-1 text-xs text-slate-500">Current organizations by plan</p><div className="mt-6 space-y-5"><PlanRow label="Business" value="96" percent="50%" color="bg-[#1f6f68]" /><PlanRow label="Starter" value="72" percent="38%" color="bg-[#7bbab2]" /><PlanRow label="Enterprise" value="24" percent="12%" color="bg-[#c5e3de]" /></div></div>
            </section>

            <section className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
              <div className="rounded-2xl border border-slate-200 bg-white"><div className="border-b border-slate-100 px-5 py-4"><h3 className="font-semibold text-slate-900">Recent organizations</h3><p className="mt-1 text-xs text-slate-500">Latest customer and account activity</p></div><div className="divide-y divide-slate-100">{recentOrganizations.map(([name, plan, joined, status]) => <div key={name} className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-semibold text-slate-800">{name}</p><p className="mt-1 text-xs text-slate-500">{plan} plan · {joined}</p></div><StatusBadge status={status} /></div>)}</div></div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5"><h3 className="font-semibold text-slate-900">Operational alerts</h3><p className="mt-1 text-xs text-slate-500">Items requiring owner attention</p><div className="mt-5 space-y-3"><Alert label="13 interviews failed this month" detail="Review failure reasons" tone="red" /><Alert label="4 accounts nearing usage limit" detail="Open usage report" tone="amber" /><Alert label="API and transcription healthy" detail="No action required" tone="teal" /></div></div>
            </section>

            <section className="mt-6 grid gap-4 sm:grid-cols-3"><MetricCard label="Trial conversion" value="24.8%" change="+3.1% this month" tone="teal" /><MetricCard label="Interview completion" value="84.6%" change="Across all organizations" tone="blue" /><MetricCard label="AI cost per interview" value="$0.42" change="12% below target" tone="violet" /></section>
          </div>
        </main>
      </div>
    </div>
  );
}

function AdminLogin({ error }: { error: boolean }) {
  return <main className="flex min-h-screen items-center justify-center bg-[#f6f8fb] px-5 py-8"><section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1f6f68] text-lg font-bold text-white">S</div><div><p className="text-sm font-bold text-slate-900">Screenwise</p><p className="text-xs text-slate-500">Owner administration</p></div></div><h1 className="mt-8 text-2xl font-semibold text-slate-900">Admin sign in</h1><p className="mt-2 text-sm leading-6 text-slate-500">This area is restricted to the SaaS owner.</p>{error && <p role="alert" className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">Incorrect admin password. Please try again.</p>}<form action={loginAdmin} className="mt-6"><label htmlFor="password" className="text-sm font-semibold text-slate-700">Admin password</label><input id="password" name="password" type="password" required className="input mt-2" autoComplete="current-password" /><button type="submit" className="mt-5 w-full rounded-lg bg-[#1f6f68] px-5 py-3 text-sm font-semibold text-white hover:bg-[#185b55]">Open owner dashboard</button></form><Link href="/" className="mt-5 block text-center text-sm font-semibold text-slate-500 hover:text-slate-900">Back to workspace</Link></section></main>;
}

function AdminNavItem({ label, active = false }: { label: string; active?: boolean }) {
  return <a href="#" className={`flex rounded-lg px-3 py-2.5 text-sm font-medium ${active ? "bg-slate-800 text-white" : "text-slate-400 hover:bg-slate-900 hover:text-white"}`}>{label}</a>;
}

function MetricCard({ label, value, change, tone }: { label: string; value: string; change: string; tone: string }) {
  const toneClass = tone === "teal" ? "text-[#1f6f68]" : tone === "blue" ? "text-blue-600" : tone === "violet" ? "text-violet-600" : "text-amber-600";
  return <div className="rounded-2xl border border-slate-200 bg-white p-5"><p className="text-sm text-slate-500">{label}</p><p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{value}</p><p className={`mt-2 text-xs font-medium ${toneClass}`}>{change}</p></div>;
}

function PlanRow({ label, value, percent, color }: { label: string; value: string; percent: string; color: string }) {
  return <div><div className="flex justify-between text-sm"><span className="font-medium text-slate-700">{label}</span><span className="text-slate-500">{value} · {percent}</span></div><div className="mt-2 h-2 rounded-full bg-slate-100"><div className={`h-2 rounded-full ${color}`} style={{ width: percent }} /></div></div>;
}

function StatusBadge({ status }: { status: string }) {
  const classes = status === "Active" ? "bg-[#eef7f5] text-[#1f6f68]" : status === "Trial" ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700";
  return <span className={`w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${classes}`}>{status}</span>;
}

function Alert({ label, detail, tone }: { label: string; detail: string; tone: string }) {
  const classes = tone === "red" ? "bg-red-50 text-red-700" : tone === "amber" ? "bg-amber-50 text-amber-700" : "bg-[#eef7f5] text-[#1f6f68]";
  return <div className={`rounded-xl p-3 ${classes}`}><p className="text-sm font-semibold">{label}</p><p className="mt-1 text-xs opacity-80">{detail}</p></div>;
}
