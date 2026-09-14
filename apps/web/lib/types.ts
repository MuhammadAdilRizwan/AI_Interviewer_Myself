export type InterviewLanguage = "english" | "urdu" | "mixed";

export type InterviewStatus =
  | "created"
  | "consented"
  | "connecting"
  | "active"
  | "completing"
  | "completed"
  | "failed";

export type InterviewEventType =
  | "consent_recorded"
  | "session_started"
  | "realtime_connected"
  | "candidate_turn_completed"
  | "interview_completed";

export type InterviewEvent = {
  eventId: string;
  type: InterviewEventType;
  payload: Record<string, string | number | boolean>;
  sequence: number;
  createdAt: string;
};

export type InterviewSession = {
  sessionId: string;
  token: string;
  status: InterviewStatus;
  language: InterviewLanguage;
  startedAt: string;
};

export type ProblemDetails = {
  type: string;
  title: string;
  status: number;
  detail: string;
  requestId: string;
};
