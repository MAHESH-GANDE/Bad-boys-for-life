import { NextResponse } from "next/server";
import { requestOtp, verifyOtp, logoutCustomer } from "@/lib/auth";
import { clientKey, rateLimit } from "@/lib/security";

export async function POST(req: Request) {
  const { mobile, action, code } = (await req.json()) as {
    mobile?: string;
    action?: string;
    code?: string;
  };
  if (action === "logout") {
    await logoutCustomer();
    return NextResponse.json({ ok: true });
  }
  const key = await clientKey("otp");
  const rl = rateLimit(key, 8, 60_000);
  if (!rl.ok) return NextResponse.json({ error: "Slow down." }, { status: 429 });
  try {
    if (action === "verify") {
      const user = await verifyOtp(mobile || "", code || "");
      return NextResponse.json({ ok: true, user: { id: user.id, mobile: user.mobile } });
    }
    const result = await requestOtp(mobile || "");
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Failed" }, { status: 400 });
  }
}
