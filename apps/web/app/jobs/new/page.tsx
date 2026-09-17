"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import RecruiterShell from "../../components/RecruiterShell";

type Competency = {
  id: number;
  name: string;
  targetLevel: string;
  weight: number;
  rubric: string;
};

const steps = ["Job details", "Competencies", "Interview settings", "Review"];

const initialCompetencies: Competency[] = [
  {
    id: 1,
    name: "Python",
    targetLevel: "Intermediate",
    weight: 40,
    rubric: "Understand core Python concepts and explain practical trade-offs.",
  },
  {
    id: 2,
    name: "Problem solving",
    targetLevel: "Intermediate",
    weight: 35,
    rubric: "Break down unfamiliar problems and communicate a clear approach.",
  },
  {
    id: 3,
    name: "Communication",
    targetLevel: "Intermediate",
    weight: 25,
    rubric: "Explain technical decisions clearly in English or Urdu.",
  },
];

export default function NewJobPage() {
  const [step, setStep] = useState(0);
  const [jobTitle, setJobTitle] = useState("Junior Python Developer");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState("Junior");
  const [languages, setLanguages] = useState<string[]>(["English", "Urdu"]);
  const [duration, setDuration] = useState("10");
  const [questionLimit, setQuestionLimit] = useState("8");
  const [followUps, setFollowUps] = useState(true);
  const [resumeRequired, setResumeRequired] = useState(false);
  const [recordingEnabled, setRecordingEnabled] = useState(false);
  const [competencies, setCompetencies] = useState(initialCompetencies);
  const [notice, setNotice] = useState("");

  const totalWeight = useMemo(
    () => competencies.reduce((total, competency) => total + competency.weight, 0),
    [competencies],
  );

  function toggleLanguage(language: string) {
    setLanguages((current) =>
      current.includes(language)
        ? current.filter((item) => item !== language)
        : [...current, language],
    );
  }

  function updateCompetency(id: number, field: keyof Competency, value: string | number) {
    setCompetencies((current) =>
      current.map((competency) =>
        competency.id === id ? { ...competency, [field]: value } : competency,
      ),
    );
  }

  function addCompetency() {
    setCompetencies((current) => [
      ...current,
      {
        id: Date.now(),
        name: "",
        targetLevel: "Intermediate",
        weight: 0,
        rubric: "",
      },
    ]);
  }

  function removeCompetency(id: number) {
    setCompetencies((current) => current.filter((competency) => competency.id !== id));
  }

  function validateStep() {
    if (step === 0 && (!jobTitle.trim() || !description.trim())) {
      setNotice("Add a job title and description before continuing.");
      return false;
    }

    if (step === 1) {
      if (competencies.length === 0 || competencies.some((competency) => !competency.name.trim())) {
        setNotice("Add a name to every competency before continuing.");
        return false;
      }
      if (totalWeight !== 100) {
        setNotice(`Competency weights must total 100%. They currently total ${totalWeight}%.`);
        return false;
      }
    }

    if (step === 2 && languages.length === 0) {
      setNotice("Select at least one interview language.");
      return false;
    }

    setNotice("");
    return true;
  }

  function nextStep() {
    if (validateStep()) setStep((current) => Math.min(current + 1, steps.length - 1));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validateStep()) return;
    setNotice("Job published successfully. Candidate links can be added from the job page.");
  }

  return (
    <RecruiterShell>
      <header className="border-b border-slate-200 bg-white px-5 py-4 sm:px-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div>
            <p className="text-sm font-bold tracking-tight text-slate-900">Screenwise</p>
            <p className="mt-1 text-xs text-slate-500">Create a new interview</p>
          </div>
          <Link href="/" className="text-sm font-semibold text-slate-500 hover:text-slate-900">
            Back to dashboard
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8">
        <div className="mb-8">
          <p className="text-sm font-medium text-[#1f6f68]">Job setup</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
            Build a structured interview
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Define what matters for this role so every candidate receives a consistent, evidence-based first round.
          </p>
        </div>

        <div className="mb-8 grid grid-cols-4 gap-2" aria-label="Job setup progress">
          {steps.map((label, index) => (
            <div key={label} className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  index <= step ? "bg-[#1f6f68] text-white" : "bg-white text-slate-400 ring-1 ring-slate-200"
                }`}
              >
                {index + 1}
              </div>
              <span className={`hidden text-xs font-semibold sm:block ${index <= step ? "text-slate-800" : "text-slate-400"}`}>
                {label}
              </span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          {step === 0 && (
            <section>
              <SectionHeading title="Tell us about the role" description="Candidates will see the title and a short version of this description before consenting." />
              <div className="mt-6 grid gap-5">
                <Field label="Job title" required>
                  <input value={jobTitle} onChange={(event) => setJobTitle(event.target.value)} className="input" placeholder="e.g. Junior Python Developer" />
                </Field>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Experience level">
                    <select value={level} onChange={(event) => setLevel(event.target.value)} className="input">
                      <option>Entry level</option>
                      <option>Junior</option>
                      <option>Mid-level</option>
                      <option>Senior</option>
                    </select>
                  </Field>
                  <Field label="Department">
                    <input className="input" placeholder="Engineering" />
                  </Field>
                </div>
                <Field label="Job description" required hint="Include the responsibilities and skills you want the interview to explore.">
                  <textarea value={description} onChange={(event) => setDescription(event.target.value)} className="input min-h-32 resize-y" placeholder="Describe the role, team, and what success looks like..." />
                </Field>
              </div>
            </section>
          )}

          {step === 1 && (
            <section>
              <SectionHeading title="Define the evaluation rubric" description="Weights determine how the final score is calculated. The total must equal 100%." />
              <div className={`mt-6 flex items-center justify-between rounded-xl px-4 py-3 ${totalWeight === 100 ? "bg-[#eef7f5]" : "bg-amber-50"}`}>
                <span className="text-sm font-medium text-slate-600">Total competency weight</span>
                <span className={`text-lg font-bold ${totalWeight === 100 ? "text-[#1f6f68]" : "text-amber-700"}`}>{totalWeight}%</span>
              </div>
              <div className="mt-5 space-y-4">
                {competencies.map((competency, index) => (
                  <div key={competency.id} className="rounded-xl border border-slate-200 p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-800">Competency {index + 1}</p>
                      {competencies.length > 1 && (
                        <button type="button" onClick={() => removeCompetency(competency.id)} className="text-xs font-semibold text-red-500 hover:underline">
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="grid gap-4 sm:grid-cols-[1.4fr_1fr_100px]">
                      <Field label="Name">
                        <input value={competency.name} onChange={(event) => updateCompetency(competency.id, "name", event.target.value)} className="input" placeholder="e.g. APIs" />
                      </Field>
                      <Field label="Target level">
                        <select value={competency.targetLevel} onChange={(event) => updateCompetency(competency.id, "targetLevel", event.target.value)} className="input">
                          <option>Beginner</option>
                          <option>Intermediate</option>
                          <option>Advanced</option>
                        </select>
                      </Field>
                      <Field label="Weight">
                        <input type="number" min="0" max="100" value={competency.weight} onChange={(event) => updateCompetency(competency.id, "weight", Number(event.target.value))} className="input" />
                      </Field>
                    </div>
                    <div className="mt-4">
                      <Field label="Evidence rubric" hint="What should a strong answer demonstrate?">
                        <textarea value={competency.rubric} onChange={(event) => updateCompetency(competency.id, "rubric", event.target.value)} className="input min-h-20 resize-y" placeholder="Describe the evidence the interviewer should look for..." />
                      </Field>
                    </div>
                  </div>
                ))}
              </div>
              <button type="button" onClick={addCompetency} className="mt-4 rounded-lg border border-dashed border-[#8abdb6] px-4 py-2.5 text-sm font-semibold text-[#1f6f68] hover:bg-[#eef7f5]">
                + Add competency
              </button>
            </section>
          )}

          {step === 2 && (
            <section>
              <SectionHeading title="Configure the interview" description="These settings control the candidate experience and interview policy." />
              <div className="mt-6 grid gap-5">
                <Field label="Interview languages" hint="Candidates may naturally mix English and Urdu during the interview.">
                  <div className="flex flex-wrap gap-2">
                    {["English", "Urdu"].map((language) => (
                      <button type="button" key={language} onClick={() => toggleLanguage(language)} className={`rounded-lg border px-4 py-2.5 text-sm font-semibold ${languages.includes(language) ? "border-[#1f6f68] bg-[#eef7f5] text-[#1f6f68]" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}>
                        {language}
                      </button>
                    ))}
                  </div>
                </Field>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Interview duration">
                    <select value={duration} onChange={(event) => setDuration(event.target.value)} className="input">
                      <option value="5">5 minutes</option>
                      <option value="10">10 minutes</option>
                      <option value="15">15 minutes</option>
                      <option value="20">20 minutes</option>
                    </select>
                  </Field>
                  <Field label="Maximum questions">
                    <select value={questionLimit} onChange={(event) => setQuestionLimit(event.target.value)} className="input">
                      <option value="6">6 questions</option>
                      <option value="8">8 questions</option>
                      <option value="10">10 questions</option>
                      <option value="12">12 questions</option>
                    </select>
                  </Field>
                </div>
                <Toggle label="Adaptive follow-up questions" description="Ask one targeted follow-up when an answer lacks sufficient evidence." checked={followUps} onChange={setFollowUps} />
                <Toggle label="Require a resume" description="Ask candidates to upload a PDF or DOCX resume before the interview." checked={resumeRequired} onChange={setResumeRequired} />
                <Toggle label="Enable audio recording" description="Store interview audio only after the candidate gives explicit recording consent." checked={recordingEnabled} onChange={setRecordingEnabled} />
              </div>
            </section>
          )}

          {step === 3 && (
            <section>
              <SectionHeading title="Review before publishing" description="Check the rubric and interview settings before candidates receive this job." />
              <div className="mt-6 space-y-5">
                <ReviewBlock title="Role">
                  <p className="font-semibold text-slate-800">{jobTitle}</p>
                  <p className="mt-1 text-sm text-slate-500">{level} · {duration} minutes · {languages.join(" + ")}</p>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
                </ReviewBlock>
                <ReviewBlock title="Competencies">
                  <div className="space-y-3">
                    {competencies.map((competency) => (
                      <div key={competency.id} className="flex items-center justify-between gap-4 text-sm">
                        <span className="text-slate-700">{competency.name}</span>
                        <span className="font-semibold text-[#1f6f68]">{competency.weight}%</span>
                      </div>
                    ))}
                  </div>
                </ReviewBlock>
                <ReviewBlock title="Interview policy">
                  <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                    <p>Maximum questions: <strong className="text-slate-800">{questionLimit}</strong></p>
                    <p>Adaptive follow-ups: <strong className="text-slate-800">{followUps ? "Enabled" : "Disabled"}</strong></p>
                    <p>Resume: <strong className="text-slate-800">{resumeRequired ? "Required" : "Optional"}</strong></p>
                    <p>Audio recording: <strong className="text-slate-800">{recordingEnabled ? "Available with consent" : "Disabled"}</strong></p>
                  </div>
                </ReviewBlock>
              </div>
            </section>
          )}

          {notice && <p role="alert" className="mt-6 rounded-lg bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">{notice}</p>}

          <div className="mt-8 flex flex-col-reverse justify-between gap-3 border-t border-slate-100 pt-6 sm:flex-row">
            <button type="button" onClick={() => setStep((current) => Math.max(current - 1, 0))} disabled={step === 0} className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">
              Back
            </button>
            {step < steps.length - 1 ? (
              <button type="button" onClick={nextStep} className="rounded-lg bg-[#1f6f68] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#185b55]">
                Continue
              </button>
            ) : (
              <div className="flex flex-col gap-3 sm:flex-row">
                <button type="button" onClick={() => setNotice("Draft saved locally for this prototype.")} className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                  Save draft
                </button>
                <button type="submit" className="rounded-lg bg-[#1f6f68] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#185b55]">
                  Publish job
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </RecruiterShell>
  );
}

function SectionHeading({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
    </div>
  );
}

function Field({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700">{label}{required && <span className="ml-1 text-red-500">*</span>}</span>
      {hint && <span className="mt-1 block text-xs leading-5 text-slate-400">{hint}</span>}
      <span className="mt-2 block">{children}</span>
    </label>
  );
}

function Toggle({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-slate-200 p-4">
      <span>
        <span className="block text-sm font-semibold text-slate-800">{label}</span>
        <span className="mt-1 block text-xs leading-5 text-slate-500">{description}</span>
      </span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="mt-1 h-5 w-5 accent-[#1f6f68]" />
    </label>
  );
}

function ReviewBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">{title}</p>
      {children}
    </div>
  );
}
