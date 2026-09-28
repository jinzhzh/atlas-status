# atlas-status

Atlas status page — a small Next.js application that reads incident data from a
Supabase project and renders overall status plus recent incidents.

## Pages

- `/` — overall status banner + recent incident list (server-side, reads Supabase)
- `/health` — liveness probe, returns `{"status":"ok"}`
- `/api/status` — aggregated JSON: `{generated_at, overall_status, incident_count}`

## Environment variables

| Key | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | yes | Supabase project URL (https://<ref>.supabase.co) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | yes | Supabase anon key; RLS keeps data isolated per workspace |
| `NEXT_PUBLIC_STATUS_WORKSPACE_ID` | no | workspace id to scope the incident list (defaults to first workspace) |
| `PUBLIC_STATUS_LABEL` | no | Display label, defaults to "Atlas Status" |
| `STATUS_API_BASE_URL` | no | External API base URL (informational) |
| `DATABASE_URL` | no | Supabase connection string (informational, not used by the app) |
| `WEBHOOK_SIGNING_KEY` | no | Webhook signing key (not used by the app) |
| `OPTIONAL_DEBUG_FLAG` | no | Set to "true" to include debug details in /api/status |

## Deploy

Deployed to Vercel from this repository. `main` builds to production;
any other branch / pull request gets a preview deployment.
