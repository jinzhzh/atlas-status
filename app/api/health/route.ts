export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({ status: "ok" }, {
    headers: {
      "Cache-Control": "public, max-age=60, s-maxage=300",
      "CDN-Cache-Control": "public, max-age=300",
    },
  });
}
