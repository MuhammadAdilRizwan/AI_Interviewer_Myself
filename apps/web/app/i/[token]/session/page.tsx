"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function InterviewSessionPage() {
  const params = useParams<{ token: string }>();
  const [speaking, setSpeaking] = useState(false);
  return (
    <main className="min-h-screen bg-[#f6f8fb] px-5 py-6 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <header className="flex items-center justify-between"><div><p className="text-sm font-bold text-slate-900">Junior Python Developer</p><p className="mt-1 text-xs text-slate-500">Question 1 of 8 · 01:24 elapsed</p></div><span className="rounded-full bg-[#eef7f5] px-3 py-1.5 text-xs font-semibold text-[#1f6f68]">Connected</span></header>
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-12"><div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#eef7f5] text-4xl">◉</div><p className="mt-6 text-sm font-semibold text-[#1f6f68]">{speaking ? "Listening to your answer" : "Interviewer is ready"}</p><h1 className="mx-auto mt-3 max-w-xl text-2xl font-semibold tracking-tight text-slate-900">{speaking ? "Tell me about a Python project you are proud of." : "Welcome. We will begin with a short introduction."}</h1><div className="mx-auto mt-8 flex max-w-md items-end justify-center gap-1">{[18, 32, 48, 26, 40, 58, 34, 22, 44, 30, 52, 24].map((height, index) => <span key={index} className={`w-1.5 rounded-full ${speaking ? "bg-[#1f6f68]" : "bg-slate-200"}`} style={{ height }} />)}</div><p className="mt-8 text-xs text-slate-400">You may answer in English, Urdu, or a mix of both.</p></section>
        <div className="mt-5 flex items-center justify-between"><button type="button" onClick={() => setSpeaking((value) => !value)} className="rounded-lg bg-[#1f6f68] px-5 py-3 text-sm font-semibold text-white hover:bg-[#185b55]">{speaking ? "Stop speaking" : "Start answering"}</button><Link href={`/i/${params.token}/complete`} className="text-sm font-semibold text-slate-500 hover:text-red-600">End interview</Link></div>
      </div>
    </main>
  );
}
