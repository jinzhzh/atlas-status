export interface Incident {
  id: string;
  workspace_id: string;
  title: string;
  severity: string;
  status: string;
  started_at: string;
  resolved_at: string | null;
}

export interface Workspace {
  id: string;
  name: string;
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

async function rest(path: string, params: Record<string, string> = {}) {
  const qs = new URLSearchParams(params).toString();
  const url = `${SUPABASE_URL}/rest/v1/${path}${qs ? `?${qs}` : ""}`;
  const res = await fetch(url, {
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`supabase rest ${res.status}`);
  return res.json();
}

export async function listWorkspaces(): Promise<Workspace[]> {
  return rest("workspaces", { select: "id,name", order: "created_at.asc", limit: "50" });
}

export async function listAllIncidents(limit = 100): Promise<Incident[]> {
  return rest("incidents", {
    select: "id,workspace_id,title,severity,status,started_at,resolved_at",
    order: "started_at.desc",
    limit: String(limit),
  });
}