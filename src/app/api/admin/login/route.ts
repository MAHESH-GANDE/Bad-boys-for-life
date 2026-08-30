import { NextResponse } from "next/server";
import { loginAdmin, logoutAdmin } from "@/lib/auth";
import { clientKey, rateLimit } from "@/lib/security";

export async function POST(req: Request) {
  const rl = rateLimit(await clientKey("admin"), 10, 60_000);
  if (!rl.ok) return NextResponse.json({ error: "Slow down." }, { status: 429 });
  const { email, password, action } = (await req.json()) as { email?: string; password?: string; action?: string };
  if (action === "logout") {
    await logoutAdmin();
    return NextResponse.json({ ok: true });
  }
  try {
    await loginAdmin(email || "", password || "");
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Failed" }, { status: 401 });
  }
}
