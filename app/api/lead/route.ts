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
        file: fileInfo
      },
      null,
      2
    )
  );

  return new Response("ok", { status: 200 });
}
