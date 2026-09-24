import Link from "next/link";

const features = [
  ["Evidence-based screening", "Every answer becomes structured evidence your team can review."],
  ["English, Urdu, or mixed", "Meet candidates in the language where they communicate best."],
  ["Built for fairer hiring", "Consistent rubrics and comparable reports for every candidate."],
];

const plans = [
  { name: "Starter", price: "$49", description: "For small teams getting started", features: ["100 interviews/month", "English and Urdu interviews", "Evidence-based reports"] },
  { name: "Growth", price: "$129", description: "For teams hiring every week", features: ["500 interviews/month", "Adaptive follow-up questions", "Advanced recruiter analytics"], featured: true },
  { name: "Scale", price: "$299", description: "For high-volume recruiting teams", features: ["Unlimited team members", "2,000 interviews/month", "Priority support and exports"] },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-white text-slate-900">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1f6f68] text-lg font-bold text-white">S</span>
          <span><span className="block text-sm font-bold tracking-tight">Screenwise</span><span className="block text-xs text-slate-500">AI interviewer</span></span>
        </Link>
        <div className="hidden items-center gap-7 text-sm font-medium text-slate-600 md:flex">
          <a href="#how-it-works" className="hover:text-[#1f6f68]">How it works</a>
          <a href="#features" className="hover:text-[#1f6f68]">Features</a>
          <a href="#pricing" className="hover:text-[#1f6f68]">Pricing</a>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/overview" className="hidden text-sm font-semibold text-slate-600 hover:text-[#1f6f68] sm:block">Sign in</Link>
          <Link href="/purchase" className="rounded-lg bg-[#1f6f68] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#185b55]">Get started</Link>
        </div>
      </nav>

      <section className="relative mx-auto max-w-7xl px-5 pb-20 pt-14 sm:px-8 sm:pt-20 lg:pb-28 lg:pt-24">
        <div className="absolute -right-32 -top-24 -z-0 h-96 w-96 rounded-full bg-[#eef7f5] blur-3xl" />
        <div className="relative z-10 max-w-3xl">
          <p className="inline-flex rounded-full border border-[#cde4df] bg-[#eef7f5] px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#1f6f68]">First-round hiring, reimagined</p>
          <h1 className="mt-6 text-5xl font-semibold leading-[1.08] tracking-tight text-slate-950 sm:text-7xl">Find the right people, <span className="text-[#1f6f68]">faster.</span></h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">Screenwise conducts thoughtful AI interviews in English, Urdu, and mixed language, then gives your team clear evidence to make better hiring decisions.</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/purchase" className="rounded-lg bg-[#1f6f68] px-6 py-3.5 text-center text-sm font-semibold text-white shadow-lg shadow-[#1f6f68]/20 hover:bg-[#185b55]">Start screening candidates</Link>
            <a href="#how-it-works" className="rounded-lg border border-slate-200 px-6 py-3.5 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50">See how it works</a>
          </div>
          <p className="mt-5 text-xs text-slate-500">No long implementation. Start with your first job in minutes.</p>
        </div>
        <div className="relative z-10 mt-14 grid max-w-4xl gap-4 sm:grid-cols-3">
          {["84.6% completion rate", "3 languages supported", "Evidence in every report"].map((item) => <div key={item} className="rounded-xl border border-slate-200 bg-white/80 p-4 text-sm font-semibold text-slate-700 shadow-sm">{item}</div>)}
        </div>
      </section>

      <section id="how-it-works" className="border-y border-slate-100 bg-[#f8fbfa] px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-xl"><p className="text-sm font-bold uppercase tracking-widest text-[#1f6f68]">A simpler workflow</p><h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">From job description to confident decision.</h2></div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[["01", "Define your rubric", "Set the competencies, language, duration, and evidence standards for the role."], ["02", "Invite candidates", "Share a secure interview link. Candidates complete the first round on their own schedule."], ["03", "Review the evidence", "See transcripts, competency scores, and supporting answers in one focused report."]].map(([number, title, text]) => <div key={number} className="rounded-2xl border border-slate-200 bg-white p-6"><p className="text-sm font-bold text-[#1f6f68]">{number}</p><h3 className="mt-5 text-lg font-semibold">{title}</h3><p className="mt-3 text-sm leading-6 text-slate-500">{text}</p></div>)}
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start"><div><p className="text-sm font-bold uppercase tracking-widest text-[#1f6f68]">Why Screenwise</p><h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">More signal. Less screening fatigue.</h2></div><div className="grid gap-4">{features.map(([title, text]) => <div key={title} className="rounded-2xl border border-slate-200 p-6"><h3 className="font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{text}</p></div>)}</div></div>
      </section>

      <section id="pricing" className="bg-[#102e2c] px-5 py-20 text-white sm:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl"><div className="max-w-xl"><p className="text-sm font-bold uppercase tracking-widest text-[#92d3c9]">Simple pricing</p><h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Choose a plan that fits your hiring rhythm.</h2></div><div className="mt-12 grid gap-5 lg:grid-cols-3">{plans.map((plan) => <div key={plan.name} className={`rounded-2xl p-6 ${plan.featured ? "bg-[#1f6f68] ring-2 ring-[#92d3c9]" : "bg-white/10"}`}><p className="font-semibold">{plan.name}</p><p className="mt-2 text-sm text-white/70">{plan.description}</p><p className="mt-7 text-4xl font-semibold">{plan.price}<span className="text-sm font-normal text-white/60"> / month</span></p><ul className="mt-7 space-y-3 text-sm text-white/80">{plan.features.map((feature) => <li key={feature}>✓ {feature}</li>)}</ul><Link href={`/purchase?plan=${plan.name.toLowerCase()}`} className="mt-8 block rounded-lg bg-white px-4 py-3 text-center text-sm font-semibold text-[#1f6f68] hover:bg-[#f1fffc]">{plan.featured ? "Choose Growth" : `Choose ${plan.name}`}</Link></div>)}</div></div>
      </section>

      <footer className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8"><p>© 2026 Screenwise. Evidence-based hiring for modern teams.</p><Link href="/purchase" className="font-semibold text-[#1f6f68] hover:underline">Get started</Link></footer>
    </main>
  );
}
