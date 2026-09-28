import { listIncidents, listWorkspaces } from "../../../lib/supabase";

const RANK: Record<string, number> = { critical: 4, high: 3, medium: 2, low: 1 };

export const dynamic = "force-dynamic";

export async function GET() {
  let overall_status = "operational";
  let incident_count = 0;
  try {
    const workspaces = await listWorkspaces();
    if (workspaces.length > 0) {
      const wsId = process.env.NEXT_PUBLIC_STATUS_WORKSPACE_ID ?? workspaces[0].id;
      const incidents = await listIncidents(wsId, 100);
      const open = incidents.filter((i) => i.status !== "resolved");
      incident_count = open.length;
      const max = open.reduce((m, i) => Math.max(m, RANK[i.severity] ?? 0), 0);
      overall_status = max >= 4 ? "outage" : max >= 3 ? "degraded" : "operational";
    }
  } catch {
    overall_status = "operational";
  }
  const body: Record<string, unknown> = {
    generated_at: new Date().toISOString(),
    overall_status,
    incident_count,
  };
  if (process.env.OPTIONAL_DEBUG_FLAG === "true") {
    body.debug = { source: "atlas-status" };
  }
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
