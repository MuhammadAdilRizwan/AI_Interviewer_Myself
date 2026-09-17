"use client";

import Link from "next/link";
import { useState } from "react";
import RecruiterShell from "../../../components/RecruiterShell";

export default function CandidatesPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [expires, setExpires] = useState("7");
  const [attempts, setAttempts] = useState("1");
  const [sent, setSent] = useState(false);
  const [link, setLink] = useState("");

  function createInvitation(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim() || !email.trim()) return;
    const token = `demo-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
    setLink(`${window.location.origin}/i/${token}`);
    setSent(true);
  }

  return (
    <RecruiterShell>
      <header className="border-b border-slate-200 bg-white px-5 py-4 sm:px-8"><div className="mx-auto flex max-w-6xl items-center justify-between"><div><p className="text-sm font-bold tracking-tight text-slate-900">Screenwise</p><p className="mt-1 text-xs text-slate-500">Candidate invitations</p></div><Link href="/jobs" className="text-sm font-semibold text-slate-500 hover:text-slate-900">Back to jobs</Link></div></header>
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <p className="text-sm font-medium text-[#1f6f68]">Junior Python Developer</p><h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">Invite a candidate</h1><p className="mt-2 text-sm text-slate-500">Create a secure interview link. Candidates do not need to create an account.</p>
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
          <form onSubmit={createInvitation} className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-8"><h2 className="text-lg font-semibold text-slate-900">Candidate details</h2><div className="mt-6 grid gap-5"><label><span className="text-sm font-semibold text-slate-700">Full name<span className="ml-1 text-red-500">*</span></span><input required value={name} onChange={(event) => setName(event.target.value)} className="input mt-2" placeholder="e.g. Amina Khan" /></label><label><span className="text-sm font-semibold text-slate-700">Email address<span className="ml-1 text-red-500">*</span></span><input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="input mt-2" placeholder="candidate@example.com" /></label><div className="grid gap-5 sm:grid-cols-2"><label><span className="text-sm font-semibold text-slate-700">Link expires in</span><select value={expires} onChange={(event) => setExpires(event.target.value)} className="input mt-2"><option value="1">1 day</option><option value="7">7 days</option><option value="14">14 days</option><option value="30">30 days</option></select></label><label><span className="text-sm font-semibold text-slate-700">Maximum attempts</span><select value={attempts} onChange={(event) => setAttempts(event.target.value)} className="input mt-2"><option value="1">1 attempt</option><option value="2">2 attempts</option><option value="3">3 attempts</option></select></label></div></div><button type="submit" className="mt-8 rounded-lg bg-[#1f6f68] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#185b55]">Generate interview link</button>{sent && <div className="mt-6 rounded-xl bg-[#eef7f5] p-4"><p className="text-sm font-semibold text-[#1f6f68]">Interview link created for {name}</p><p className="mt-1 text-xs text-slate-600">Valid for {expires} day(s) · {attempts} attempt(s)</p><div className="mt-3 flex flex-col gap-2 sm:flex-row"><input readOnly value={link} className="input bg-white text-xs" /><Link href={link.replace(window.location.origin, "")} target="_blank" className="rounded-lg bg-white px-3 py-2 text-center text-xs font-semibold text-[#1f6f68] ring-1 ring-inset ring-[#cde4df]">Preview link</Link></div></div>}</form>
          <aside className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"><p className="text-xs font-bold uppercase tracking-wider text-slate-400">What candidates will see</p><h2 className="mt-3 text-lg font-semibold text-slate-900">A calm, guided first round</h2><ul className="mt-5 space-y-4 text-sm leading-5 text-slate-600"><li>✓ Job and organization introduction</li><li>✓ Privacy and recording consent</li><li>✓ English and Urdu language selection</li><li>✓ Microphone and connection check</li><li>✓ 10-minute adaptive voice interview</li></ul></aside>
        </div>
      </div>
    </RecruiterShell>
  );
}
