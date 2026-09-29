import { listAllIncidents, listWorkspaces } from "../../../lib/supabase";

const RANK: Record<string, number> = { critical: 4, high: 3, medium: 2, low: 1 };

export const dynamic = "force-dynamic";

export async function GET() {
  let overall_status = "operational";
  let incident_count = 0;
  let workspaces = 0;
  try {
    const [ws, incidents] = await Promise.all([listWorkspaces(), listAllIncidents(500)]);
    workspaces = ws.length;
    const open = incidents.filter((i) => i.status !== "resolved");
    incident_count = open.length;
    const max = open.reduce((m, i) => Math.max(m, RANK[i.severity] ?? 0), 0);
    overall_status = max >= 4 ? "outage" : max >= 3 ? "degraded" : "operational";
    return new Response(
      JSON.stringify({
        generated_at: new Date().toISOString(),
        overall_status,
        workspace_count: workspaces,
        incident_count,
        open_by_workspace: open.reduce<Record<string, number>>((acc, i) => {
          acc[i.workspace_id] = (acc[i.workspace_id] ?? 0) + 1;
          return acc;
        }, {}),
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch {
    return new Response(
      JSON.stringify({
        generated_at: new Date().toISOString(),
        overall_status: "unknown",
        incident_count: 0,
        workspace_count: 0,
        error: "failed to load",
      }),
      { headers: { "Content-Type": "application/json" }, status: 500 }
    );
  }
}