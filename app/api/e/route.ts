export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as
    | { event?: unknown; props?: unknown }
    | null;

  const event = typeof body?.event === "string" ? body.event : "";
  const props =
    body?.props && typeof body.props === "object" && !Array.isArray(body.props)
      ? (body.props as Record<string, unknown>)
      : {};

  if (!event) {
    return new Response("Bad Request", { status: 400 });
  }

  const ua = req.headers.get("user-agent") ?? "";
  const ref = req.headers.get("referer") ?? "";
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "";

  console.log(
    JSON.stringify(
      {
        type: "smoketest_event",
        at: new Date().toISOString(),
        event,
        props,
        ip,
        ua,
        ref
      },
      null,
      2
    )
  );

  return new Response("ok", { status: 200 });
}
