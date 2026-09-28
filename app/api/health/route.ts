export const dynamic = "force-dynamic";

export async function GET() {
  return new Response(JSON.stringify({ status: "ok" }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=60, s-maxage=300",
    },
  });
}
