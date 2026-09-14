"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { recordConsent } from "@/lib/api/interviews";
import type { InterviewLanguage } from "@/lib/types";

export default function CandidateSetupPage() {
  const params = useParams<{ token: string }>();
  const router = useRouter();
  const [consent, setConsent] = useState(false);
  const [language, setLanguage] = useState("English");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const languageValue: InterviewLanguage =
    language === "Urdu" ? "urdu" : language === "Mixed" ? "mixed" : "english";

  async function continueToDevice() {
    if (!consent || saving) return;
    setSaving(true);
    setError("");
    try {
      await recordConsent(params.token, languageValue);
      router.push(`/i/${params.token}/device`);
    } catch {
      setError("We could not save your consent. Please try again.");
      setSaving(false);
    }
  }

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
          {error && <p role="alert" className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
          <div className="mt-8 flex justify-end"><button type="button" onClick={continueToDevice} disabled={!consent || saving} className={`rounded-lg px-5 py-3 text-sm font-semibold ${consent ? "bg-[#1f6f68] text-white hover:bg-[#185b55]" : "cursor-not-allowed bg-slate-100 text-slate-400"}`}>{saving ? "Saving consent..." : "Continue to device check"}</button></div>
        </section>
      </div>
    </main>
  );
}
