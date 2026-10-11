// Latest build id, read by the freshness check in Layout.astro.
export function GET() {
  return new Response(JSON.stringify({ version: __BUILD_ID__ }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
