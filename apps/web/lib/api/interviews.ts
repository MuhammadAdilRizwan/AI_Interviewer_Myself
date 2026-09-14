import type {
  InterviewEvent,
  InterviewEventType,
  InterviewLanguage,
  InterviewSession,
} from "@/lib/types";

const delay = (milliseconds: number) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, milliseconds));

const createEvent = (
  type: InterviewEventType,
  sequence: number,
  payload: Record<string, string | number | boolean>,
): InterviewEvent => ({
  eventId: crypto.randomUUID(),
  type,
  payload,
  sequence,
  createdAt: new Date().toISOString(),
});

export async function recordConsent(token: string, language: InterviewLanguage) {
  await delay(250);
  const event = createEvent("consent_recorded", 1, {
    token,
    consent: true,
    policyVersion: "2026-09-12",
    language,
  });
  window.sessionStorage.setItem(`interview:${token}:consent`, JSON.stringify(event));
  return event;
}

export async function startInterview(token: string, language: InterviewLanguage) {
  await delay(300);
  const session: InterviewSession = {
    sessionId: crypto.randomUUID(),
    token,
    status: "active",
    language,
    startedAt: new Date().toISOString(),
  };
  window.sessionStorage.setItem(`interview:${token}:session`, JSON.stringify(session));
  return session;
}

export async function recordInterviewEvent(
  session: InterviewSession,
  type: InterviewEventType,
  sequence: number,
  payload: Record<string, string | number | boolean>,
) {
  await delay(150);
  const event = createEvent(type, sequence, payload);
  const key = `interview:${session.sessionId}:events`;
  const current = JSON.parse(window.sessionStorage.getItem(key) ?? "[]") as InterviewEvent[];
  window.sessionStorage.setItem(key, JSON.stringify([...current, event]));
  return event;
}

export async function completeInterview(session: InterviewSession, sequence: number) {
  const event = await recordInterviewEvent(session, "interview_completed", sequence, {
    reason: "candidate_completed",
  });
  const completedSession: InterviewSession = { ...session, status: "completed" };
  window.sessionStorage.setItem(`interview:${session.token}:session`, JSON.stringify(completedSession));
  return { session: completedSession, event };
}
