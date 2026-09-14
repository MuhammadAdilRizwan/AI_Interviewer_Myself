"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function CandidateSetupPage() {
  const params = useParams<{ token: string }>();
  const [consent, setConsent] = useState(false);
  const [language, setLanguage] = useState("English");

  return (
    <main className="min-h-screen bg-[#f6f8fb] px-5 py-8 sm:px-8">
      <div className="mx-auto max-w-2xl">
        <Link href={`/i/${params.token}`} className="text-sm font-semibold text-slate-500 hover:text-slate-900">← Back</Link>
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
          <p className="text-sm font-medium text-[#1f6f68]">Step 1 of 2</p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">Consent and language</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">Please review how this interview works before continuing.</p>
          <div className="mt-6 space-y-3 rounded-xl border border-slate-200 p-4 text-sm leading-6 text-slate-600"><p>• Your voice will be processed to conduct the interview and create a transcript.</p><p>• Your answers are evaluated against the job competencies, not your accent or language choice.</p><p>• The hiring team will review the transcript and evidence-based report.</p></div>
          <label className="mt-6 flex cursor-pointer gap-3 rounded-xl bg-[#eef7f5] p-4 text-sm text-slate-700"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-1 h-4 w-4 accent-[#1f6f68]" /><span>I consent to AI processing and transcript creation for this interview.</span></label>
          <div className="mt-8"><p className="text-sm font-semibold text-slate-700">Preferred interview language</p><div className="mt-3 flex flex-wrap gap-2">{["English", "Urdu", "Mixed"].map((item) => <button type="button" key={item} onClick={() => setLanguage(item)} className={`rounded-lg border px-4 py-2.5 text-sm font-semibold ${language === item ? "border-[#1f6f68] bg-[#eef7f5] text-[#1f6f68]" : "border-slate-200 text-slate-500"}`}>{item}</button>)}</div></div>
          <div className="mt-8 flex justify-end"><Link href={consent ? `/i/${params.token}/device` : "#"} aria-disabled={!consent} className={`rounded-lg px-5 py-3 text-sm font-semibold ${consent ? "bg-[#1f6f68] text-white hover:bg-[#185b55]" : "cursor-not-allowed bg-slate-100 text-slate-400"}`}>Continue to device check</Link></div>
        </section>
      </div>
    </main>
  );
}
