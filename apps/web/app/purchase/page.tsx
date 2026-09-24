"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";

const plans = {
  starter: { name: "Starter", price: 49, interviews: "100 interviews/month" },
  growth: { name: "Growth", price: 129, interviews: "500 interviews/month" },
  scale: { name: "Scale", price: 299, interviews: "2,000 interviews/month" },
} as const;

export default function PurchasePage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#f6f8fb] text-sm text-slate-500">Loading checkout...</div>}>
      <PurchaseContent />
    </Suspense>
  );
}

function PurchaseContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const requestedPlan = searchParams.get("plan") as keyof typeof plans | null;
  const [plan, setPlan] = useState<keyof typeof plans>(requestedPlan && requestedPlan in plans ? requestedPlan : "growth");
  const [processing, setProcessing] = useState(false);
  const selected = plans[plan];

  function handlePurchase(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setProcessing(true);
    window.setTimeout(() => {
      router.push("/overview?subscription=success");
    }, 900);
  }

  return (
    <main className="min-h-screen bg-[#f6f8fb] px-5 py-8 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="flex w-fit items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1f6f68] text-lg font-bold text-white">S</span><span><span className="block text-sm font-bold tracking-tight text-slate-900">Screenwise</span><span className="block text-xs text-slate-500">AI interviewer</span></span></Link>
        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-bold uppercase tracking-widest text-[#1f6f68]">Start your workspace</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Choose your Screenwise plan</h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">Your workspace will be ready immediately after checkout.</p>
            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {(Object.keys(plans) as Array<keyof typeof plans>).map((key) => <button type="button" key={key} onClick={() => setPlan(key)} className={`rounded-xl border p-4 text-left transition ${plan === key ? "border-[#1f6f68] bg-[#eef7f5] ring-2 ring-[#1f6f68]/15" : "border-slate-200 hover:border-slate-300"}`}><span className="block text-sm font-semibold text-slate-900">{plans[key].name}</span><span className="mt-2 block text-2xl font-semibold text-slate-900">${plans[key].price}<span className="text-xs font-normal text-slate-500">/mo</span></span></button>)}
            </div>
            <form onSubmit={handlePurchase} className="mt-8 space-y-5">
              <div><label htmlFor="name" className="text-sm font-semibold text-slate-700">Full name</label><input id="name" required className="input mt-2" placeholder="Adil Rizwan" /></div>
              <div><label htmlFor="email" className="text-sm font-semibold text-slate-700">Work email</label><input id="email" type="email" required className="input mt-2" placeholder="you@company.com" /></div>
              <div><label htmlFor="card" className="text-sm font-semibold text-slate-700">Card details</label><input id="card" required inputMode="numeric" className="input mt-2" placeholder="4242 4242 4242 4242" /></div>
              <button type="submit" disabled={processing} className="w-full rounded-lg bg-[#1f6f68] px-5 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-[#185b55] disabled:cursor-wait disabled:opacity-70">{processing ? "Completing subscription..." : `Subscribe to ${selected.name} — $${selected.price}/month`}</button>
              <p className="text-center text-xs text-slate-500">Demo checkout for the frontend prototype. Connect Stripe or your payment provider before production.</p>
            </form>
          </section>
          <aside className="h-fit rounded-2xl bg-[#102e2c] p-6 text-white shadow-sm sm:p-8"><p className="text-sm font-bold uppercase tracking-widest text-[#92d3c9]">Your plan</p><h2 className="mt-4 text-2xl font-semibold">{selected.name}</h2><p className="mt-2 text-sm text-white/70">{selected.interviews}</p><p className="mt-8 text-4xl font-semibold">${selected.price}<span className="text-sm font-normal text-white/60"> / month</span></p><ul className="mt-8 space-y-4 text-sm text-white/80"><li>✓ Multilingual AI interviews</li><li>✓ Evidence-based candidate reports</li><li>✓ Recruiter workspace dashboard</li><li>✓ Secure candidate invitation links</li></ul><div className="mt-8 border-t border-white/15 pt-5 text-sm text-white/60">After successful payment, you will be taken directly to your workspace overview.</div></aside>
        </div>
      </div>
    </main>
  );
}
