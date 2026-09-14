"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type DeviceStatus = "idle" | "checking" | "ready" | "denied" | "unsupported";

export default function DeviceCheckPage() {
  const params = useParams<{ token: string }>();
  const [status, setStatus] = useState<DeviceStatus>("idle");
  const [level, setLevel] = useState(0);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
      streamRef.current?.getTracks().forEach((track) => track.stop());
      void audioContextRef.current?.close();
    };
  }, []);

  async function checkMicrophone() {
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus("unsupported");
      return;
    }

    setStatus("checking");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = stream;

      const AudioContextClass =
        window.AudioContext ||
        (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) {
        stream.getTracks().forEach((track) => track.stop());
        setStatus("unsupported");
        return;
      }
      const audioContext = new AudioContextClass();
      audioContextRef.current = audioContext;
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount);

      const updateLevel = () => {
        analyser.getByteTimeDomainData(data);
        const average = data.reduce((sum, value) => sum + Math.abs(value - 128), 0) / data.length;
        setLevel(Math.min(100, Math.round(average * 3)));
        animationRef.current = requestAnimationFrame(updateLevel);
      };

      updateLevel();
      setStatus("ready");
    } catch {
      setStatus("denied");
    }
  }

  const ready = status === "ready";

  return (
    <main className="min-h-screen bg-[#f6f8fb] px-5 py-8 sm:px-8">
      <div className="mx-auto max-w-2xl">
        <p className="text-sm font-semibold text-slate-500">Screenwise · Device setup</p>
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
          <p className="text-sm font-medium text-[#1f6f68]">Step 2 of 2</p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">Check your microphone</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Allow microphone access and make sure you are somewhere quiet before starting.
          </p>

          <div className="mt-8 space-y-3">
            <CheckRow label="Secure browser connection" complete />
            <CheckRow label="Microphone permission" complete={ready} />
            <CheckRow label="Audio input level" complete={ready} />
          </div>

          {ready && (
            <div className="mt-6 rounded-xl border border-[#cde4df] bg-[#eef7f5] p-4">
              <div className="flex items-center justify-between text-sm font-semibold text-[#1f6f68]">
                <span>Microphone input detected</span>
                <span>{level}%</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
                <div className="h-full rounded-full bg-[#1f6f68] transition-[width]" style={{ width: `${Math.max(level, 4)}%` }} />
              </div>
              <p className="mt-2 text-xs text-slate-600">Speak briefly to confirm the input meter responds.</p>
            </div>
          )}

          {status === "denied" && (
            <p role="alert" className="mt-6 rounded-xl bg-red-50 p-4 text-sm leading-6 text-red-700">
              Microphone access was blocked. Allow microphone access in your browser settings, then try again.
            </p>
          )}

          {status === "unsupported" && (
            <p role="alert" className="mt-6 rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-800">
              This browser does not support microphone access. Please use a recent version of Chrome, Edge, Safari, or Firefox.
            </p>
          )}

          {!ready && (
            <button
              type="button"
              onClick={checkMicrophone}
              disabled={status === "checking"}
              className="mt-8 w-full rounded-lg border border-[#8abdb6] bg-[#eef7f5] px-5 py-3 text-sm font-semibold text-[#1f6f68] hover:bg-[#e1f2ee] disabled:cursor-wait disabled:opacity-60"
            >
              {status === "checking" ? "Requesting microphone access..." : "Allow microphone and run test"}
            </button>
          )}

          {ready && (
            <div className="mt-8 rounded-xl bg-[#eef7f5] p-4 text-sm text-slate-600">
              <p className="font-semibold text-[#1f6f68]">You are ready to begin.</p>
              <p className="mt-1">Your microphone stays active only while the interview is open.</p>
              <Link href={`/i/${params.token}/session`} className="mt-4 inline-block rounded-lg bg-[#1f6f68] px-5 py-3 font-semibold text-white hover:bg-[#185b55]">
                Start interview
              </Link>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function CheckRow({ label, complete }: { label: string; complete?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${complete ? "bg-[#eef7f5] text-[#1f6f68]" : "bg-slate-100 text-slate-400"}`}>
        {complete ? "Ready" : "Waiting"}
      </span>
    </div>
  );
}
