import Link from "next/link";

export default async function CandidateLandingPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return (
    <main className="min-h-screen bg-[#f6f8fb] px-5 py-8 sm:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-2xl items-center">
        <section className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
          <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1f6f68] text-lg font-bold text-white">S</div><div><p className="text-sm font-bold text-slate-900">Screenwise</p><p className="text-xs text-slate-500">AI-assisted first-round interview</p></div></div>
          <div className="mt-10"><p className="text-sm font-medium text-[#1f6f68]">You are invited to interview</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Junior Python Developer</h1><p className="mt-4 text-sm leading-6 text-slate-600">This interview takes around 10 minutes and uses a voice conversation to explore your Python, problem-solving, and communication skills.</p></div>
          <div className="mt-8 grid gap-3 sm:grid-cols-3"><Info label="Duration" value="10 minutes" /><Info label="Languages" value="English + Urdu" /><Info label="Format" value="Voice interview" /></div>
          <div className="mt-8 rounded-xl bg-[#eef7f5] p-4"><p className="text-sm font-semibold text-[#1f6f68]">Before you begin</p><p className="mt-2 text-sm leading-6 text-slate-600">You will review privacy and recording consent, choose a language, and test your microphone before the interview starts.</p></div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><p className="text-xs text-slate-400">Interview invitation</p><Link href={`/i/${token}/setup`} className="rounded-lg bg-[#1f6f68] px-5 py-3 text-center text-sm font-semibold text-white hover:bg-[#185b55]">Continue to consent</Link></div>
        </section>
      </div>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg border border-slate-200 p-3"><p className="text-xs text-slate-400">{label}</p><p className="mt-1 text-sm font-semibold text-slate-800">{value}</p></div>;
}
