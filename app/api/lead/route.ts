export const runtime = "nodejs";

export async function POST(req: Request) {
  const ct = req.headers.get("content-type") ?? "";
  if (!ct.includes("multipart/form-data")) {
    return new Response("Expected multipart/form-data", { status: 400 });
  }

  const form = await req.formData();

  const email = String(form.get("email") ?? "").trim();
  const docType = String(form.get("docType") ?? "").trim();
  const company = String(form.get("company") ?? "").trim();
  const notes = String(form.get("notes") ?? "").trim();
  const ua = req.headers.get("user-agent") ?? "";
  const ref = req.headers.get("referer") ?? "";
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "";

  const utm_source = String(form.get("utm_source") ?? "").trim();
  const utm_campaign = String(form.get("utm_campaign") ?? "").trim();
  const utm_medium = String(form.get("utm_medium") ?? "").trim();
  const utm_term = String(form.get("utm_term") ?? "").trim();
  const utm_content = String(form.get("utm_content") ?? "").trim();
  const gclid = String(form.get("gclid") ?? "").trim();

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return new Response("Invalid email", { status: 400 });
  }

  const file = form.get("file");
  const fileInfo =
    file instanceof File
      ? { name: file.name, type: file.type, size: file.size }
      : null;

  console.log(
    JSON.stringify(
      {
        type: "smoketest_lead",
        at: new Date().toISOString(),
        email,
        docType,
        company,
        notes,
        file: fileInfo,
        ua,
        ref,
        ip,
        utm_source,
        utm_campaign,
        utm_medium,
        utm_term,
        utm_content,
        gclid
      },
      null,
      2
    )
  );

  return new Response("ok", { status: 200 });
}
