# Multilingual AI Interviewer SaaS

## Database Design Specification

**Version:** 1.0  
**Status:** Discussion draft  
**Database:** PostgreSQL 16+  
**Audience:** Backend engineering, frontend engineering, product, security

---

## 1. Purpose

This document defines the proposed relational database structure for the
Multilingual AI Interviewer SaaS. It is based on the product SRS/SDS and the
current frontend workflows.

The database must support:

- Multi-tenant organizations
- Recruiter authentication and RBAC
- Jobs and weighted competencies
- Candidate invitations
- Consent and privacy records
- Interview sessions and realtime events
- Transcript turns and optional audio
- Resume processing
- Evidence-based evaluations
- Recruiter recommendation overrides
- Billing and usage metering
- Notifications
- Audit logging
- Retention policies
- Provider webhook idempotency

This is a design draft for review. The backend team should confirm naming,
enum strategy, retention requirements, and provider-specific details before
writing production migrations.

---

## 2. Recommended table count

### Production-capable MVP: 28 tables

1. `organizations`
2. `users`
3. `organization_members`
4. `auth_sessions`
5. `email_verification_tokens`
6. `password_reset_tokens`
7. `plans`
8. `subscriptions`
9. `jobs`
10. `job_competencies`
11. `candidates`
12. `interview_links`
13. `interviews`
14. `interview_consents`
15. `interview_events`
16. `interview_turns`
17. `audio_assets`
18. `resumes`
19. `resume_facts`
20. `evaluations`
21. `evaluation_competencies`
22. `evaluation_evidence`
23. `recruiter_decisions`
24. `usage_ledger`
25. `notifications`
26. `audit_logs`
27. `retention_policies`
28. `provider_events`

### Minimum first vertical slice: 16 tables

The first end-to-end workflow can start with:

```text
organizations
users
organization_members
auth_sessions
jobs
job_competencies
candidates
interview_links
interviews
interview_consents
interview_events
interview_turns
evaluations
evaluation_competencies
evaluation_evidence
recruiter_decisions
```

The remaining tables should be added before production billing, resume
processing, retention automation, and operational hardening.

---

## 3. Database conventions

### Primary keys

Use UUID primary keys:

```sql
id UUID PRIMARY KEY
```

Do not expose sequential IDs in candidate links or public URLs.

### Timestamps

Mutable tables should include:

```sql
created_at TIMESTAMPTZ NOT NULL DEFAULT now()
updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
```

Immutable event tables generally need `created_at` only.

### Tenant ownership

Every tenant-owned table should include:

```sql
organization_id UUID NOT NULL REFERENCES organizations(id)
```

All repository queries must scope tenant-owned records by
`organization_id`.

### Sensitive files

Audio, resumes, reports, and logos should be stored in private,
S3-compatible object storage. PostgreSQL stores metadata and private storage
keys, not large binary files.

### JSONB

Use JSONB only for flexible provider payloads, configuration, source
references, feature flags, and optional metadata. Keep core relationships
relational.

### Deletion

Use `deleted_at` only where history or auditability requires soft deletion.
Privacy workflows may require hard deletion of sensitive content and object
storage assets.

---

## 4. Identity, organization, and authentication tables

### 4.1 `organizations`

**Purpose:** Customer workspace and tenant boundary.

| Column | Type | Reason |
|---|---|---|
| `id` | UUID | Primary key |
| `name` | VARCHAR(160) | Display name |
| `slug` | VARCHAR(100) | Unique URL-safe identifier |
| `status` | ENUM/VARCHAR | `active`, `suspended`, `deleted` |
| `plan_id` | UUID nullable | Default plan |
| `default_language` | VARCHAR(20) | Organization default |
| `timezone` | VARCHAR(64) | Dates and notifications |
| `logo_storage_key` | TEXT nullable | Private logo object |
| `created_at` | TIMESTAMPTZ | Creation time |
| `updated_at` | TIMESTAMPTZ | Last update |
| `deleted_at` | TIMESTAMPTZ nullable | Soft deletion |

**Constraints/indexes:**

- Unique `slug`
- Index `status`
- Foreign key to `plans` when plans are enabled

### 4.2 `users`

**Purpose:** Recruiter, administrator, owner, and system-user identities.

| Column | Type | Reason |
|---|---|---|
| `id` | UUID | Primary key |
| `email` | CITEXT/VARCHAR(320) | Login identity |
| `password_hash` | TEXT nullable | Argon2id hash |
| `full_name` | VARCHAR(160) | Display name |
| `status` | ENUM/VARCHAR | `active`, `invited`, `suspended`, `deleted` |
| `email_verified_at` | TIMESTAMPTZ nullable | Verification status |
| `last_login_at` | TIMESTAMPTZ nullable | Security/activity tracking |
| `mfa_enabled` | BOOLEAN | Future MFA support |
| `created_at` | TIMESTAMPTZ | Creation time |
| `updated_at` | TIMESTAMPTZ | Last update |
| `deleted_at` | TIMESTAMPTZ nullable | Soft deletion |

**Constraints/indexes:**

- Case-insensitive unique email
- Index `status`
- Never store plaintext passwords

### 4.3 `organization_members`

**Purpose:** Maps users to organizations and defines RBAC.

| Column | Type | Reason |
|---|---|---|
| `id` | UUID | Primary key |
| `organization_id` | UUID | Tenant |
| `user_id` | UUID | Member |
| `role` | ENUM/VARCHAR | `owner`, `admin`, `recruiter`, `viewer` |
| `status` | ENUM/VARCHAR | `active`, `invited`, `removed` |
| `invited_by_user_id` | UUID nullable | Inviting member |
| `joined_at` | TIMESTAMPTZ nullable | Acceptance time |
| `created_at` | TIMESTAMPTZ | Creation time |
| `updated_at` | TIMESTAMPTZ | Last update |

**Constraints/indexes:**

- Unique `(organization_id, user_id)`
- Index `(organization_id, role)`

### 4.4 `auth_sessions`

**Purpose:** Secure browser sessions or refresh-token sessions.

| Column | Type | Reason |
|---|---|---|
| `id` | UUID | Primary key |
| `user_id` | UUID | Session owner |
| `session_token_hash` | TEXT | Hash, never raw token |
| `ip_address` | INET nullable | Security context |
| `user_agent` | TEXT nullable | Device/browser |
| `expires_at` | TIMESTAMPTZ | Session expiry |
| `revoked_at` | TIMESTAMPTZ nullable | Logout/revocation |
| `last_seen_at` | TIMESTAMPTZ nullable | Activity |
| `created_at` | TIMESTAMPTZ | Creation time |

**Indexes:** `session_token_hash`, `(user_id, revoked_at)`.

### 4.5 `email_verification_tokens`

**Purpose:** One-time email verification.

| Column | Type | Reason |
|---|---|---|
| `id` | UUID | Primary key |
| `user_id` | UUID | User |
| `token_hash` | TEXT | Hashed one-time token |
| `expires_at` | TIMESTAMPTZ | Expiry |
| `used_at` | TIMESTAMPTZ nullable | Prevent reuse |
| `created_at` | TIMESTAMPTZ | Creation time |

### 4.6 `password_reset_tokens`

**Purpose:** One-time credential reset.

Use the same columns as `email_verification_tokens`, replacing the purpose
with password-reset semantics.

---

## 5. Billing tables

### 5.1 `plans`

**Purpose:** Subscription plan definitions and limits.

| Column | Type | Reason |
|---|---|---|
| `id` | UUID | Primary key |
| `name` | VARCHAR(80) | Display name |
| `provider_price_id` | VARCHAR nullable | Stripe price ID |
| `monthly_price` | NUMERIC(12,2) | Display/billing price |
| `currency` | CHAR(3) | Currency |
| `interview_limit` | INTEGER nullable | Monthly interview quota |
| `minute_limit` | INTEGER nullable | Monthly audio quota |
| `max_team_members` | INTEGER nullable | Team limit |
| `max_audio_retention_days` | INTEGER nullable | Plan retention limit |
| `features_json` | JSONB | Flexible features |
| `status` | ENUM/VARCHAR | `active`, `archived` |
| `created_at` | TIMESTAMPTZ | Creation time |
| `updated_at` | TIMESTAMPTZ | Last update |

### 5.2 `subscriptions`

**Purpose:** Current and historical organization subscriptions.

| Column | Type | Reason |
|---|---|---|
| `id` | UUID | Primary key |
| `organization_id` | UUID | Tenant |
| `plan_id` | UUID | Selected plan |
| `provider_customer_id` | VARCHAR | Stripe customer |
| `provider_subscription_id` | VARCHAR nullable | Stripe subscription |
| `status` | ENUM/VARCHAR | Trialing, active, past due, canceled |
| `current_period_start` | TIMESTAMPTZ | Billing period |
| `current_period_end` | TIMESTAMPTZ | Billing period |
| `cancel_at_period_end` | BOOLEAN | Cancellation state |
| `canceled_at` | TIMESTAMPTZ nullable | Cancellation time |
| `created_at` | TIMESTAMPTZ | Creation time |
| `updated_at` | TIMESTAMPTZ | Last update |

**Constraints:** Unique provider customer and subscription IDs where present.

---

## 6. Recruiting tables

### 6.1 `jobs`

**Purpose:** Recruiter-created job and interview configuration.

| Column | Type | Reason |
|---|---|---|
| `id` | UUID | Primary key |
| `organization_id` | UUID | Tenant |
| `created_by_user_id` | UUID | Creator |
| `title` | VARCHAR(200) | Job title |
| `description` | TEXT | Role description |
| `department` | VARCHAR(120) nullable | Department |
| `seniority_level` | VARCHAR(40) | Junior, mid, senior |
| `status` | ENUM/VARCHAR | `draft`, `published`, `archived` |
| `duration_seconds` | INTEGER | Interview duration |
| `max_questions` | INTEGER | Question limit |
| `min_questions` | INTEGER nullable | Minimum questions |
| `follow_up_enabled` | BOOLEAN | Adaptive follow-ups |
| `max_follow_ups` | INTEGER | Follow-up budget |
| `supported_languages` | JSONB/TEXT[] | English, Urdu, mixed |
| `resume_required` | BOOLEAN | Resume policy |
| `recording_enabled` | BOOLEAN | Audio policy |
| `config_json` | JSONB | Flexible configuration |
| `published_at` | TIMESTAMPTZ nullable | Publish time |
| `created_at` | TIMESTAMPTZ | Creation time |
| `updated_at` | TIMESTAMPTZ | Last update |
| `archived_at` | TIMESTAMPTZ nullable | Archive time |

### 6.2 `job_competencies`

**Purpose:** Weighted evaluation rubric for each job.

| Column | Type | Reason |
|---|---|---|
| `id` | UUID | Primary key |
| `organization_id` | UUID | Tenant |
| `job_id` | UUID | Job |
| `name` | VARCHAR(120) | Competency name |
| `description` | TEXT nullable | Explanation |
| `weight` | NUMERIC(6,4) | Decimal weight, e.g. `0.4000` |
| `target_level` | VARCHAR(40) | Beginner/intermediate/advanced |
| `rubric_json` | JSONB | Evidence criteria |
| `display_order` | INTEGER | UI ordering |
| `created_at` | TIMESTAMPTZ | Creation time |
| `updated_at` | TIMESTAMPTZ | Last update |

**Rules:**

- Unique competency name per job.
- Weight must be non-negative.
- Published job weights must total exactly `1.0000`.

### 6.3 `candidates`

**Purpose:** Candidate profile owned by an organization.

| Column | Type | Reason |
|---|---|---|
| `id` | UUID | Primary key |
| `organization_id` | UUID | Tenant |
| `created_by_user_id` | UUID nullable | Creating recruiter |
| `full_name` | VARCHAR(160) | Candidate name |
| `email` | VARCHAR(320) nullable | Contact email |
| `phone` | VARCHAR(40) nullable | Contact phone |
| `status` | ENUM/VARCHAR | `active`, `archived`, `deleted` |
| `metadata_json` | JSONB | Optional profile data |
| `created_at` | TIMESTAMPTZ | Creation time |
| `updated_at` | TIMESTAMPTZ | Last update |
| `deleted_at` | TIMESTAMPTZ nullable | Privacy deletion |

Do not make candidate email globally unique; the same person may apply to
different organizations.

### 6.4 `interview_links`

**Purpose:** Secure candidate invitation links.

| Column | Type | Reason |
|---|---|---|
| `id` | UUID | Primary key |
| `organization_id` | UUID | Tenant |
| `job_id` | UUID | Job |
| `candidate_id` | UUID | Candidate |
| `token_hash` | TEXT | Hash of opaque URL token |
| `expires_at` | TIMESTAMPTZ | Link expiry |
| `max_attempts` | INTEGER | Attempt limit |
| `attempt_count` | INTEGER | Attempts used |
| `status` | ENUM/VARCHAR | Active, expired, revoked, completed |
| `last_opened_at` | TIMESTAMPTZ nullable | Last access |
| `created_by_user_id` | UUID | Creating recruiter |
| `created_at` | TIMESTAMPTZ | Creation time |
| `revoked_at` | TIMESTAMPTZ nullable | Revocation |

**Security rules:**

- Store only the token hash.
- Use cryptographically random opaque tokens.
- Unique `token_hash`.
- Reject expired, revoked, and exhausted links.

---

## 7. Interview tables

### 7.1 `interviews`

**Purpose:** One actual interview attempt/session.

| Column | Type | Reason |
|---|---|---|
| `id` | UUID | Primary key |
| `organization_id` | UUID | Tenant |
| `job_id` | UUID | Job |
| `candidate_id` | UUID | Candidate |
| `interview_link_id` | UUID | Invitation used |
| `status` | ENUM/VARCHAR | Created, active, completed, failed |
| `language` | VARCHAR(20) | Selected language |
| `started_at` | TIMESTAMPTZ nullable | Start time |
| `completed_at` | TIMESTAMPTZ nullable | Completion time |
| `ended_reason` | VARCHAR(50) nullable | Completion/timeout/exit/failure |
| `config_snapshot_json` | JSONB | Immutable job config |
| `rubric_snapshot_json` | JSONB | Immutable competency rubric |
| `candidate_context_snapshot_json` | JSONB nullable | Resume/context snapshot |
| `provider_name` | VARCHAR(80) nullable | Realtime provider |
| `provider_session_id` | VARCHAR nullable | External session |
| `created_at` | TIMESTAMPTZ | Creation time |
| `updated_at` | TIMESTAMPTZ | Last update |

**Critical rule:** Copy the job configuration and rubric into immutable
snapshots when the interview starts. Later job edits must not change the
historical interview.

### 7.2 `interview_consents`

**Purpose:** Legal and product consent before AI processing or recording.

| Column | Type | Reason |
|---|---|---|
| `id` | UUID | Primary key |
| `organization_id` | UUID | Tenant |
| `interview_id` | UUID | Interview |
| `consent_type` | VARCHAR(50) | AI, transcript, recording |
| `consented` | BOOLEAN | Accepted/declined |
| `policy_version` | VARCHAR(80) | Policy shown |
| `language` | VARCHAR(20) | Consent language |
| `ip_address` | INET nullable | Compliance/security |
| `user_agent` | TEXT nullable | Browser |
| `consented_at` | TIMESTAMPTZ | Consent time |

### 7.3 `interview_events`

**Purpose:** Recovery, sequencing, audit, and provider event normalization.

| Column | Type | Reason |
|---|---|---|
| `id` | UUID | Primary key |
| `organization_id` | UUID | Tenant |
| `interview_id` | UUID | Interview |
| `event_id` | VARCHAR(120) | Idempotency identifier |
| `event_type` | VARCHAR(80) | Normalized event name |
| `sequence_no` | INTEGER | Event order |
| `producer` | VARCHAR(40) | Browser/backend/provider/worker |
| `payload_json` | JSONB | Event metadata |
| `provider_event_id` | VARCHAR nullable | Provider ID |
| `created_at` | TIMESTAMPTZ | Event time |

**Constraints:**

- Unique `(interview_id, event_id)`.
- Unique `(interview_id, sequence_no)` where sequence is authoritative.
- Index `(interview_id, created_at)`.

### 7.4 `interview_turns`

**Purpose:** Original and normalized interviewer/candidate transcript turns.

| Column | Type | Reason |
|---|---|---|
| `id` | UUID | Primary key |
| `organization_id` | UUID | Tenant |
| `interview_id` | UUID | Interview |
| `sequence_no` | INTEGER | Turn order |
| `speaker` | ENUM/VARCHAR | Interviewer, candidate, system |
| `text` | TEXT | Original transcript |
| `normalized_text` | TEXT nullable | Evaluation-normalized text |
| `language` | VARCHAR(20) nullable | Detected language |
| `is_final` | BOOLEAN | Final vs partial transcript |
| `section_name` | VARCHAR(120) nullable | Interview section |
| `competency_id` | UUID nullable | Related competency |
| `question_number` | INTEGER nullable | Question number |
| `started_at` | TIMESTAMPTZ nullable | Speech start |
| `ended_at` | TIMESTAMPTZ nullable | Speech end |
| `provider_event_id` | VARCHAR nullable | Provider transcript ID |
| `created_at` | TIMESTAMPTZ | Creation time |

**Constraints:** Unique `(interview_id, sequence_no)`.

### 7.5 `audio_assets`

**Purpose:** Metadata for optional recorded audio. The file remains in
private object storage.

| Column | Type | Reason |
|---|---|---|
| `id` | UUID | Primary key |
| `organization_id` | UUID | Tenant |
| `interview_id` | UUID | Interview |
| `turn_id` | UUID nullable | Related turn |
| `storage_key` | TEXT | Private object path |
| `mime_type` | VARCHAR(100) | Audio format |
| `duration_ms` | BIGINT | Duration |
| `size_bytes` | BIGINT | File size |
| `checksum` | VARCHAR(128) | Integrity |
| `status` | ENUM/VARCHAR | Uploading, ready, failed, deleted |
| `retention_expires_at` | TIMESTAMPTZ nullable | Automatic deletion |
| `created_at` | TIMESTAMPTZ | Creation time |
| `deleted_at` | TIMESTAMPTZ nullable | Deletion time |

---

## 8. Resume tables

### 8.1 `resumes`

**Purpose:** Uploaded resume metadata and processing state.

| Column | Type | Reason |
|---|---|---|
| `id` | UUID | Primary key |
| `organization_id` | UUID | Tenant |
| `candidate_id` | UUID | Candidate |
| `storage_key` | TEXT | Private file object |
| `original_filename` | VARCHAR(255) | Original name |
| `mime_type` | VARCHAR(100) | PDF/DOCX |
| `size_bytes` | BIGINT | File size |
| `checksum` | VARCHAR(128) | Integrity |
| `status` | ENUM/VARCHAR | Uploaded, scanning, parsing, ready, failed, deleted |
| `parsed_text` | TEXT nullable | Extracted text |
| `parser_version` | VARCHAR(80) nullable | Parser version |
| `failure_reason` | TEXT nullable | Processing failure |
| `created_at` | TIMESTAMPTZ | Upload time |
| `updated_at` | TIMESTAMPTZ | Processing update |
| `deleted_at` | TIMESTAMPTZ nullable | Deletion time |

### 8.2 `resume_facts`

**Purpose:** Traceable structured facts extracted from a resume.

| Column | Type | Reason |
|---|---|---|
| `id` | UUID | Primary key |
| `organization_id` | UUID | Tenant |
| `resume_id` | UUID | Resume |
| `fact_type` | VARCHAR(60) | Skill, experience, education, project |
| `value` | TEXT | Extracted value |
| `normalized_value` | TEXT nullable | Normalized/search value |
| `source_reference` | JSONB | Page/paragraph/character reference |
| `confidence` | NUMERIC(5,4) nullable | Extraction confidence |
| `created_at` | TIMESTAMPTZ | Creation time |

Resume content and facts are untrusted data. They must never be treated as
instructions by the AI prompt system.

---

## 9. Evaluation and human review tables

### 9.1 `evaluations`

**Purpose:** Versioned post-interview evaluation report.

| Column | Type | Reason |
|---|---|---|
| `id` | UUID | Primary key |
| `organization_id` | UUID | Tenant |
| `interview_id` | UUID | Interview |
| `evaluation_version` | INTEGER | Re-evaluation version |
| `model_name` | VARCHAR(120) | Model name |
| `model_version` | VARCHAR(120) nullable | Model version |
| `prompt_version` | VARCHAR(120) | Prompt version |
| `rubric_version` | VARCHAR(120) | Rubric version |
| `overall_score` | NUMERIC(6,2) | Backend-calculated 0–100 |
| `recommendation` | VARCHAR(40) | Strong proceed/proceed/review/do not proceed |
| `summary` | TEXT nullable | Report summary |
| `communication_score` | NUMERIC(5,2) nullable | Communication score |
| `status` | ENUM/VARCHAR | Pending, processing, ready, failed |
| `raw_model_output_json` | JSONB nullable | Controlled debug/audit data |
| `failure_reason` | TEXT nullable | Evaluation failure |
| `created_at` | TIMESTAMPTZ | Creation time |
| `updated_at` | TIMESTAMPTZ | Last update |

**Constraints:** Unique `(interview_id, evaluation_version)`.

### 9.2 `evaluation_competencies`

**Purpose:** Competency-level scores and findings.

| Column | Type | Reason |
|---|---|---|
| `id` | UUID | Primary key |
| `organization_id` | UUID | Tenant |
| `evaluation_id` | UUID | Evaluation |
| `competency_id` | UUID nullable | Original competency |
| `competency_name_snapshot` | VARCHAR(120) | Historical name |
| `score` | NUMERIC(5,2) | Usually 0–10 |
| `normalized_score` | NUMERIC(6,2) | 0–100 equivalent |
| `weight_snapshot` | NUMERIC(6,4) | Weight used |
| `strengths_json` | JSONB | Strength list |
| `gaps_json` | JSONB | Gap list |
| `created_at` | TIMESTAMPTZ | Creation time |

### 9.3 `evaluation_evidence`

**Purpose:** Links evaluation findings to exact transcript turns.

| Column | Type | Reason |
|---|---|---|
| `id` | UUID | Primary key |
| `organization_id` | UUID | Tenant |
| `evaluation_id` | UUID | Evaluation |
| `evaluation_competency_id` | UUID nullable | Related competency |
| `turn_id` | UUID | Evidence transcript turn |
| `evidence_type` | VARCHAR(40) | Supporting evidence or gap |
| `explanation` | TEXT nullable | Evidence explanation |
| `created_at` | TIMESTAMPTZ | Creation time |

The backend must verify that the referenced turn belongs to the same
interview as the evaluation.

### 9.4 `recruiter_decisions`

**Purpose:** Human review and recommendation overrides.

| Column | Type | Reason |
|---|---|---|
| `id` | UUID | Primary key |
| `organization_id` | UUID | Tenant |
| `interview_id` | UUID | Interview |
| `evaluation_id` | UUID | Evaluation reviewed |
| `reviewer_user_id` | UUID | Authorized reviewer |
| `decision` | VARCHAR(40) | Human decision |
| `reason` | TEXT | Required override reason |
| `notes` | TEXT nullable | Internal notes |
| `created_at` | TIMESTAMPTZ | Decision time |
| `updated_at` | TIMESTAMPTZ | Last update |

Never overwrite the AI recommendation. Display AI and human decisions
separately.

---

## 10. Operations and compliance tables

### 10.1 `usage_ledger`

**Purpose:** Append-only usage and cost accounting.

| Column | Type | Reason |
|---|---|---|
| `id` | UUID | Primary key |
| `organization_id` | UUID | Tenant |
| `subscription_id` | UUID nullable | Subscription |
| `interview_id` | UUID nullable | Related interview |
| `usage_type` | VARCHAR(60) | Interview, audio minute, token, TTS, storage |
| `quantity` | NUMERIC(14,4) | Amount |
| `unit` | VARCHAR(30) | Minutes, tokens, seconds, bytes |
| `provider` | VARCHAR(80) nullable | Provider |
| `model` | VARCHAR(120) nullable | Model |
| `unit_cost` | NUMERIC(14,8) nullable | Unit cost |
| `total_cost` | NUMERIC(14,6) nullable | Total cost |
| `billing_period_start` | TIMESTAMPTZ | Period start |
| `billing_period_end` | TIMESTAMPTZ | Period end |
| `metadata_json` | JSONB | Usage details |
| `created_at` | TIMESTAMPTZ | Ledger time |

Usage records should be append-only.

### 10.2 `notifications`

**Purpose:** Invitation, report, billing, and system notification delivery.

| Column | Type | Reason |
|---|---|---|
| `id` | UUID | Primary key |
| `organization_id` | UUID | Tenant |
| `recipient_user_id` | UUID nullable | Recruiter recipient |
| `candidate_id` | UUID nullable | Candidate context |
| `notification_type` | VARCHAR(60) | Notification type |
| `channel` | VARCHAR(30) | Email or in-app |
| `status` | ENUM/VARCHAR | Queued, sent, failed, canceled |
| `template_key` | VARCHAR(100) | Template |
| `payload_json` | JSONB | Safe template data |
| `provider_message_id` | VARCHAR nullable | Email provider ID |
| `failure_reason` | TEXT nullable | Delivery failure |
| `sent_at` | TIMESTAMPTZ nullable | Delivery time |
| `created_at` | TIMESTAMPTZ | Creation time |

Do not put raw transcript, resume contents, secrets, or signed URLs in
notification payloads.

### 10.3 `audit_logs`

**Purpose:** Append-only security, permission, evaluation, deletion, and
billing history.

| Column | Type | Reason |
|---|---|---|
| `id` | UUID | Primary key |
| `organization_id` | UUID nullable | Tenant |
| `actor_user_id` | UUID nullable | Acting user |
| `actor_type` | VARCHAR(30) | User, candidate, system, provider |
| `action` | VARCHAR(100) | Action name |
| `entity_type` | VARCHAR(80) | Entity type |
| `entity_id` | UUID nullable | Related record |
| `request_id` | VARCHAR(120) nullable | Trace ID |
| `ip_address` | INET nullable | Security context |
| `metadata_json` | JSONB | Non-sensitive details |
| `created_at` | TIMESTAMPTZ | Audit time |

Examples include job publishing, role changes, consent, report viewing,
recommendation overrides, deletion, and billing webhook processing.

### 10.4 `retention_policies`

**Purpose:** Organization-configurable retention settings.

| Column | Type | Reason |
|---|---|---|
| `id` | UUID | Primary key |
| `organization_id` | UUID | Tenant |
| `transcript_retention_days` | INTEGER nullable | Transcript policy |
| `audio_retention_days` | INTEGER nullable | Audio policy |
| `resume_retention_days` | INTEGER nullable | Resume policy |
| `report_retention_days` | INTEGER nullable | Report policy |
| `audit_retention_days` | INTEGER nullable | Audit policy |
| `delete_candidate_after_days` | INTEGER nullable | Candidate policy |
| `updated_by_user_id` | UUID | Last editor |
| `created_at` | TIMESTAMPTZ | Creation time |
| `updated_at` | TIMESTAMPTZ | Last update |

Use one active policy per organization. Retention values cannot be negative.

### 10.5 `provider_events`

**Purpose:** External provider webhook/event processing and idempotency.

| Column | Type | Reason |
|---|---|---|
| `id` | UUID | Primary key |
| `provider` | VARCHAR(80) | Stripe, AI, email, storage |
| `provider_event_id` | VARCHAR(200) | External event ID |
| `event_type` | VARCHAR(120) | Provider event |
| `payload_json` | JSONB | Sanitized provider payload |
| `status` | ENUM/VARCHAR | Received, processing, processed, failed |
| `attempt_count` | INTEGER | Retry count |
| `failure_reason` | TEXT nullable | Processing failure |
| `processed_at` | TIMESTAMPTZ nullable | Completion time |
| `created_at` | TIMESTAMPTZ | Receipt time |

**Constraints:** Unique `(provider, provider_event_id)`.

---

## 11. Standard enums

The backend should use PostgreSQL enums or validated application constants.
The exact choice is a backend-team decision, but values must remain
consistent with the frontend API contract.

```text
organization_status:
  active, suspended, deleted

member_role:
  owner, admin, recruiter, viewer

job_status:
  draft, published, archived

interview_status:
  created, consented, connecting, active, reconnecting,
  completing, completed, failed, report_pending, report_ready

interview_language:
  english, urdu, mixed

speaker:
  interviewer, candidate, system

recommendation:
  strong_proceed, proceed, review, do_not_proceed

evaluation_status:
  pending, processing, ready, failed
```

The frontend can convert machine values such as `strong_proceed` into display
labels such as `Strong Proceed`.

---

## 12. Critical database constraints

The backend must enforce these rules in the database or service layer:

1. Every tenant-owned query is scoped by `organization_id`.
2. Published job competency weights total exactly `1.0000`.
3. Candidate invitation tokens are stored only as hashes.
4. Expired, revoked, and exhausted links cannot start interviews.
5. Interview state transitions reject invalid transitions.
6. Duplicate interview events are ignored through idempotency constraints.
7. Transcript sequence numbers are unique per interview.
8. Evidence can reference only transcript turns from the same interview.
9. A recruiter override requires an authorized reviewer and a reason.
10. Billing provider events are processed once per provider event ID.
11. Usage ledger records are append-only.
12. Audit log records are append-only.
13. Historical interviews use immutable job/rubric snapshots.
14. Private objects are accessed only through short-lived signed URLs.

---

## 13. Frontend-to-database mapping

| Frontend workflow | Main tables |
|---|---|
| Organization and login | `organizations`, `users`, `organization_members`, `auth_sessions` |
| Job creation | `jobs`, `job_competencies` |
| Candidate invitation | `candidates`, `interview_links`, `notifications` |
| Candidate consent | `interviews`, `interview_consents`, `interview_events` |
| Voice interview | `interviews`, `interview_events`, `interview_turns`, `audio_assets` |
| Resume upload | `resumes`, `resume_facts` |
| Evaluation report | `evaluations`, `evaluation_competencies`, `evaluation_evidence` |
| Human review | `recruiter_decisions`, `audit_logs` |
| Billing/dashboard usage | `plans`, `subscriptions`, `usage_ledger` |
| Privacy/operations | `retention_policies`, `audit_logs`, `provider_events` |

---

## 14. Recommended migration order

### Migration 1: Foundation

```text
organizations
users
organization_members
plans
subscriptions
```

### Migration 2: Authentication

```text
auth_sessions
email_verification_tokens
password_reset_tokens
```

### Migration 3: Recruiting

```text
jobs
job_competencies
candidates
interview_links
```

### Migration 4: Interview engine

```text
interviews
interview_consents
interview_events
interview_turns
audio_assets
```

### Migration 5: Resume processing

```text
resumes
resume_facts
```

### Migration 6: Evaluation

```text
evaluations
evaluation_competencies
evaluation_evidence
recruiter_decisions
```

### Migration 7: Operations

```text
usage_ledger
notifications
audit_logs
retention_policies
provider_events
```

---

## 15. Optional future tables

These are not required for the first production-capable schema:

### `job_question_templates`

For recruiter-managed question libraries:

```text
id
organization_id
job_id nullable
competency_id nullable
question_text
language
difficulty
question_type
created_by_user_id
created_at
updated_at
```

### `candidate_notes`

For recruiter notes separated from the candidate profile:

```text
id
organization_id
candidate_id
author_user_id
note_text
created_at
updated_at
deleted_at
```

### `report_exports`

For CSV/PDF report exports:

```text
id
organization_id
requested_by_user_id
interview_id nullable
export_type
storage_key
status
expires_at
created_at
```

### `feature_flags`

For controlled rollout of Urdu support, recording, resume processing,
WebRTC, and alternative providers.

---

## 16. Backend review questions

Before finalizing migrations, confirm:

1. Will PostgreSQL enums or validated string constants be used?
2. Should candidate email be encrypted at rest or only protected by database
   and application access controls?
3. What are the default retention periods for audio, transcripts, resumes,
   reports, and audit logs?
4. Should one interview link allow multiple incomplete attempts?
5. Is recording independent consent required in every target jurisdiction?
6. Should partial transcript turns be persisted, or only final turns?
7. How long should raw model output be retained?
8. Should reports support multiple evaluations or only one current evaluation?
9. Which provider payloads are safe to persist?
10. Will billing be included in the first deployment?
11. Which fields need encryption or field-level access controls?
12. Which tables require row-level security in PostgreSQL?
13. What is the backup deletion window for privacy requests?
14. Which indexes should be validated against expected candidate/report query
    patterns?

---

## 17. Final recommendation

Use the 28-table production-capable design as the target schema, but implement
the first 16-table migration set to validate the core workflow:

```text
Recruiter creates job
→ Candidate receives invitation
→ Candidate gives consent
→ Interview session starts
→ Turns are stored
→ Evaluation is generated
→ Evidence is reviewed
→ Recruiter records a human decision
```

The most important architectural decision is immutable interview snapshots.
Without them, changing a job or rubric can silently change the meaning of
historical evaluations.
