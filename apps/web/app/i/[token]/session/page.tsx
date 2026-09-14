"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type InterviewerState = "speaking" | "listening" | "processing";

const questions = [
  "Welcome. Please introduce yourself and tell me what interests you about this role.",
  "Tell me about a Python project you are proud of.",
  "How would you approach debugging a slow API endpoint?",
];

export default function InterviewSessionPage() {
  const params = useParams<{ token: string }>();
  const router = useRouter();
  const [interviewerState, setInterviewerState] = useState<InterviewerState>("speaking");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [answer, setAnswer] = useState("");
  const [submittedAnswers, setSubmittedAnswers] = useState<string[]>([]);
  const [microphoneStatus, setMicrophoneStatus] = useState("Connecting microphone...");
  const [showEndDialog, setShowEndDialog] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    let mounted = true;
    const timer = window.setInterval(() => setElapsedSeconds((seconds) => seconds + 1), 1000);

    async function connectMicrophone() {
      if (!navigator.mediaDevices?.getUserMedia) {
        if (mounted) setMicrophoneStatus("Microphone unavailable");
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (!mounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        setMicrophoneStatus("Microphone ready");
      } catch {
        if (mounted) setMicrophoneStatus("Microphone unavailable");
      }
    }

    void connectMicrophone();
    return () => {
      mounted = false;
      if (timer) window.clearInterval(timer);
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  function submitAnswer() {
    if (!answer.trim() || interviewerState !== "listening") return;
    setSubmittedAnswers((current) => [...current, answer.trim()]);
    setAnswer("");
    setInterviewerState("processing");

    window.setTimeout(() => {
      setQuestionIndex((current) => Math.min(current + 1, questions.length - 1));
      setInterviewerState("speaking");
    }, 900);
  }

  function finishInterview() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    router.push(`/i/${params.token}/complete`);
  }

  const minutes = Math.floor(elapsedSeconds / 60).toString().padStart(2, "0");
  const seconds = (elapsedSeconds % 60).toString().padStart(2, "0");
  const question = questions[questionIndex];
  const isLastQuestion = questionIndex === questions.length - 1;

  return (
    <main className="min-h-screen bg-[#f6f8fb] px-5 py-6 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <header className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-slate-900">Junior Python Developer</p>
            <p className="mt-1 text-xs text-slate-500">
              Question {questionIndex + 1} of {questions.length} · {minutes}:{seconds} elapsed
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${microphoneStatus === "Microphone ready" ? "bg-emerald-500" : "bg-amber-500"}`} />
            <span className="hidden text-xs font-medium text-slate-500 sm:inline">{microphoneStatus}</span>
          </div>
        </header>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-12">
          <div className={`mx-auto flex h-24 w-24 items-center justify-center rounded-full text-4xl transition ${interviewerState === "listening" ? "bg-[#dcefeb] ring-8 ring-[#eef7f5]" : "bg-[#eef7f5]"}`}>
            {interviewerState === "processing" ? "…" : "◉"}
          </div>
          <p className="mt-6 text-sm font-semibold text-[#1f6f68]">
            {interviewerState === "speaking" && "Interviewer is speaking"}
            {interviewerState === "listening" && "Listening to your answer"}
            {interviewerState === "processing" && "Processing your response"}
          </p>
          <h1 className="mx-auto mt-3 max-w-xl text-2xl font-semibold tracking-tight text-slate-900">
            {question}
          </h1>

          <div className="mx-auto mt-8 flex max-w-md items-end justify-center gap-1" aria-label="Voice activity visualizer">
            {[18, 32, 48, 26, 40, 58, 34, 22, 44, 30, 52, 24].map((height, index) => (
              <span
                key={index}
                className={`w-1.5 rounded-full transition-all ${interviewerState === "listening" ? "bg-[#1f6f68]" : "bg-slate-200"}`}
                style={{ height: interviewerState === "listening" ? height : 8 }}
              />
            ))}
          </div>

          <div className="mx-auto mt-8 max-w-xl text-left">
            <label htmlFor="answer" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Optional transcript preview
            </label>
            <textarea
              id="answer"
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              disabled={interviewerState !== "listening"}
              placeholder={interviewerState === "listening" ? "Your answer will appear here in the realtime voice experience..." : "The interviewer will prompt you when it is your turn."}
              className="input mt-2 min-h-24 resize-y disabled:bg-slate-50 disabled:text-slate-400"
            />
          </div>

          <p className="mt-6 text-xs text-slate-400">You may answer in English, Urdu, or a mix of both.</p>
        </section>

        <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button type="button" onClick={() => setShowEndDialog(true)} className="text-sm font-semibold text-slate-500 hover:text-red-600">
            End interview
          </button>
          {interviewerState === "speaking" && (
            <button type="button" onClick={() => setInterviewerState("listening")} className="rounded-lg bg-[#1f6f68] px-5 py-3 text-sm font-semibold text-white hover:bg-[#185b55]">
              I&apos;m ready to answer
            </button>
          )}
          {interviewerState === "listening" && (
            <button type="button" onClick={submitAnswer} disabled={!answer.trim()} className="rounded-lg bg-[#1f6f68] px-5 py-3 text-sm font-semibold text-white hover:bg-[#185b55] disabled:cursor-not-allowed disabled:bg-slate-300">
              {isLastQuestion ? "Submit final answer" : "Submit answer"}
            </button>
          )}
          {interviewerState === "processing" && (
            <button type="button" disabled className="rounded-lg bg-slate-300 px-5 py-3 text-sm font-semibold text-white">
              Saving answer...
            </button>
          )}
        </div>

        {submittedAnswers.length > 0 && (
          <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Saved locally in this session</p>
            <p className="mt-2 text-sm text-slate-600">{submittedAnswers.length} answer{submittedAnswers.length === 1 ? "" : "s"} captured for the interview preview.</p>
          </div>
        )}
      </div>

      {showEndDialog && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-slate-900/30 px-5" role="dialog" aria-modal="true" aria-labelledby="end-interview-title">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 id="end-interview-title" className="text-lg font-semibold text-slate-900">End this interview?</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">Your current progress may be submitted to the hiring team. You can continue answering instead.</p>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setShowEndDialog(false)} className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">Continue interview</button>
              <button type="button" onClick={finishInterview} className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700">End interview</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
