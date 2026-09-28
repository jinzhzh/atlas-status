import { listIncidents, listWorkspaces } from "../lib/supabase";

const RANK: Record<string, number> = { critical: 4, high: 3, medium: 2, low: 1 };

function overallStatus(incidents: { severity: string; status: string }[]): string {
  const open = incidents.filter((i) => i.status !== "resolved");
  if (open.length === 0) return "operational";
  const max = open.reduce((m, i) => Math.max(m, RANK[i.severity] ?? 0), 0);
  return max >= 4 ? "outage" : max >= 3 ? "degraded" : "operational";
}

const STATUS_COLOR: Record<string, string> = {
  operational: "#22c55e",
  degraded: "#f59e0b",
  outage: "#ef4444",
};

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let incidents: { id: string; title: string; severity: string; status: string; started_at: string; resolved_at: string | null }[] = [];
  let error: string | null = null;
  try {
    const workspaces = await listWorkspaces();
    if (workspaces.length > 0) {
      const wsId = process.env.NEXT_PUBLIC_STATUS_WORKSPACE_ID ?? workspaces[0].id;
      incidents = await listIncidents(wsId, 10);
    }
  } catch (e) {
    error = "Unable to load incident data";
  }
  const overall = overallStatus(incidents);
  return (
    <div>
      <h1 style={{ fontSize: 28 }}>{process.env.PUBLIC_STATUS_LABEL ?? "Atlas Status v2"}</h1>
      <div
        style={{
          display: "inline-block",
          padding: "8px 16px",
          borderRadius: 8,
          background: STATUS_COLOR[overall] ?? "#64748b",
          color: "#0f172a",
          fontWeight: 700,
          textTransform: "capitalize",
        }}
      >
        {overall}
      </div>
      <h2 style={{ fontSize: 18, marginTop: 24 }}>Recent incidents</h2>
      {error ? (
        <p style={{ color: "#f87171" }}>{error}</p>
      ) : incidents.length === 0 ? (
        <p>No incidents recorded.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {incidents.map((i) => (
            <li key={i.id} style={{ padding: "10px 0", borderBottom: "1px solid #1e293b" }}>
              <strong>{i.title}</strong>
              <span style={{ color: "#94a3b8", marginLeft: 8, textTransform: "capitalize" }}>
                {i.severity} / {i.status}
              </span>
              <div style={{ color: "#64748b", fontSize: 13 }}>
                started {new Date(i.started_at).toISOString().slice(0, 10)}
                {i.resolved_at ? ` · resolved ${new Date(i.resolved_at).toISOString().slice(0, 10)}` : ""}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
