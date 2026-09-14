import type {
  InterviewEvent,
  InterviewEventType,
  InterviewLanguage,
  InterviewSession,
} from "@/lib/types";
import { apiRequest, isApiConfigured } from "@/lib/api/client";

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
  if (isApiConfigured()) {
    const response = await apiRequest<{ session_id: string; next: "setup" }>(
      `/api/v1/interviews/${encodeURIComponent(token)}/consent`,
      {
      method: "POST",
      body: JSON.stringify({
        consent: true,
        policy_version: "2026-09-12",
        language,
      }),
      },
    );
    return createEvent("consent_recorded", 1, {
      token,
      consent: true,
      policyVersion: "2026-09-12",
      language,
      sessionId: response.session_id,
    });
  }

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
  if (isApiConfigured()) {
    const response = await apiRequest<{
      session_id: string;
      realtime_client_secret?: string;
    }>(`/api/v1/interviews/${encodeURIComponent(token)}/start`, {
      method: "POST",
      body: JSON.stringify({ language, device_info: { user_agent: navigator.userAgent } }),
    });
    return {
      sessionId: response.session_id,
      token,
      status: "active" as const,
      language,
      startedAt: new Date().toISOString(),
    };
  }

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
  if (isApiConfigured()) {
    await apiRequest<{ accepted: boolean }>(
      `/api/v1/interviews/${encodeURIComponent(session.sessionId)}/events`,
      {
      method: "POST",
      headers: {
        "Idempotency-Key": eventIdFor(session.sessionId, sequence),
      },
      body: JSON.stringify({
        event_id: eventIdFor(session.sessionId, sequence),
        type,
        payload,
        sequence,
      }),
      },
    );
    return createEvent(type, sequence, payload);
  }

  await delay(150);
  const event = createEvent(type, sequence, payload);
  const key = `interview:${session.sessionId}:events`;
  const current = JSON.parse(window.sessionStorage.getItem(key) ?? "[]") as InterviewEvent[];
  window.sessionStorage.setItem(key, JSON.stringify([...current, event]));
  return event;
}

export async function completeInterview(session: InterviewSession, sequence: number) {
  if (isApiConfigured()) {
    const response = await apiRequest<{ status: "completed"; report_status: "pending" }>(
      `/api/v1/interviews/${encodeURIComponent(session.sessionId)}/complete`,
      {
        method: "POST",
        body: JSON.stringify({ reason: "candidate_completed" }),
      },
    );
    return {
      session: { ...session, status: response.status },
      event: createEvent("interview_completed", sequence, { reason: "candidate_completed" }),
    };
  }

  const event = await recordInterviewEvent(session, "interview_completed", sequence, {
    reason: "candidate_completed",
  });
  const completedSession: InterviewSession = { ...session, status: "completed" };
  window.sessionStorage.setItem(`interview:${session.token}:session`, JSON.stringify(completedSession));
  return { session: completedSession, event };
}

function eventIdFor(sessionId: string, sequence: number) {
  return `client-${sessionId}-${sequence}`;
}
