import Link from "next/link";

const jobs = [
  { id: "junior-python-developer", title: "Junior Python Developer", level: "Junior", candidates: 41, completed: 15, status: "Published", languages: "English + Urdu" },
  { id: "senior-backend-engineer", title: "Senior Backend Engineer", level: "Senior", candidates: 32, completed: 25, status: "Published", languages: "English" },
  { id: "product-designer", title: "Product Designer", level: "Mid-level", candidates: 18, completed: 9, status: "Draft", languages: "English" },
];

export default function JobsPage() {
  return (
    <main className="min-h-screen bg-[#f6f8fb]">
      <header className="border-b border-slate-200 bg-white px-5 py-4 sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div><p className="text-sm font-bold tracking-tight text-slate-900">Screenwise</p><p className="mt-1 text-xs text-slate-500">Jobs</p></div>
          <div className="flex items-center gap-4"><Link href="/" className="text-sm font-semibold text-slate-500 hover:text-slate-900">Dashboard</Link><Link href="/jobs/new" className="rounded-lg bg-[#1f6f68] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#185b55]">Create a job</Link></div>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-medium text-[#1f6f68]">Hiring workspace</p><h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">Your jobs</h1><p className="mt-2 text-sm text-slate-500">Manage interview rubrics and invite candidates to open roles.</p></div><div className="flex gap-2"><button className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">All jobs</button><button className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-50">Drafts</button></div></div>
        <div className="mt-8 grid gap-4 md:grid-cols-3"><SummaryCard label="Published jobs" value="2" /><SummaryCard label="Candidates invited" value="91" /><SummaryCard label="Reports ready" value="49" /></div>
        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="hidden grid-cols-[1.6fr_0.8fr_0.8fr_0.8fr_140px] gap-4 border-b border-slate-100 px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 md:grid"><span>Job</span><span>Status</span><span>Candidates</span><span>Completed</span><span /></div>
          {jobs.map((job) => <div key={job.id} className="grid gap-4 border-b border-slate-100 px-5 py-5 last:border-0 md:grid-cols-[1.6fr_0.8fr_0.8fr_0.8fr_140px] md:items-center"><div><p className="font-semibold text-slate-800">{job.title}</p><p className="mt-1 text-xs text-slate-500">{job.level} · {job.languages}</p></div><span className={`w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${job.status === "Published" ? "bg-[#eef7f5] text-[#1f6f68]" : "bg-slate-100 text-slate-500"}`}>{job.status}</span><p className="text-sm text-slate-600"><span className="font-semibold text-slate-800">{job.candidates}</span> invited</p><p className="text-sm text-slate-600"><span className="font-semibold text-slate-800">{job.completed}</span> complete</p><Link href={`/jobs/${job.id}/candidates`} className="text-sm font-semibold text-[#1f6f68] hover:underline">Manage candidates →</Link></div>)}
        </div>
      </div>
    </main>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-5"><p className="text-sm text-slate-500">{label}</p><p className="mt-3 text-3xl font-semibold text-slate-900">{value}</p></div>;
}
