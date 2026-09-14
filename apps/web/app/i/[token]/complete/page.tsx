import Link from "next/link";

export default function InterviewCompletePage() {
  return <main className="flex min-h-screen items-center justify-center bg-[#f6f8fb] px-5"><section className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#eef7f5] text-2xl text-[#1f6f68]">✓</div><h1 className="mt-6 text-2xl font-semibold text-slate-900">Interview submitted</h1><p className="mt-3 text-sm leading-6 text-slate-500">Thank you for completing the interview. The hiring team will review your responses and contact you if needed.</p><Link href="/" className="mt-8 inline-block text-sm font-semibold text-[#1f6f68] hover:underline">Close this page</Link></section></main>;
}
