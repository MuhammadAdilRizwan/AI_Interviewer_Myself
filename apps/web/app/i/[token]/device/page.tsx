"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function DeviceCheckPage() {
  const params = useParams<{ token: string }>();
  const [checked, setChecked] = useState(false);

  return (
    <main className="min-h-screen bg-[#f6f8fb] px-5 py-8 sm:px-8">
      <div className="mx-auto max-w-2xl">
        <p className="text-sm font-semibold text-slate-500">Screenwise · Device setup</p>
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
          <p className="text-sm font-medium text-[#1f6f68]">Step 2 of 2</p><h1 className="mt-2 text-2xl font-semibold text-slate-900">Check your microphone</h1><p className="mt-2 text-sm leading-6 text-slate-500">Allow microphone access and make sure you are somewhere quiet before starting.</p>
          <div className="mt-8 space-y-3"><CheckRow label="Secure browser connection" complete /><CheckRow label="Microphone permission" complete={checked} /><CheckRow label="Audio input level" complete={checked} /></div>
          {!checked && <button type="button" onClick={() => setChecked(true)} className="mt-8 w-full rounded-lg border border-[#8abdb6] bg-[#eef7f5] px-5 py-3 text-sm font-semibold text-[#1f6f68] hover:bg-[#e1f2ee]">Allow microphone and run test</button>}
          {checked && <div className="mt-8 rounded-xl bg-[#eef7f5] p-4 text-sm text-slate-600"><p className="font-semibold text-[#1f6f68]">You are ready to begin.</p><p className="mt-1">Microphone input detected. The interview will start when you continue.</p><Link href={`/i/${params.token}/session`} className="mt-4 inline-block rounded-lg bg-[#1f6f68] px-5 py-3 font-semibold text-white hover:bg-[#185b55]">Start interview</Link></div>}
        </section>
      </div>
    </main>
  );
}

function CheckRow({ label, complete }: { label: string; complete?: boolean }) {
  return <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4"><span className="text-sm font-medium text-slate-700">{label}</span><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${complete ? "bg-[#eef7f5] text-[#1f6f68]" : "bg-slate-100 text-slate-400"}`}>{complete ? "Ready" : "Waiting"}</span></div>;
}
