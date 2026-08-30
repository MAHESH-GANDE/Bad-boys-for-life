import { NextResponse } from "next/server";
import { z } from "zod";
import { requestOtp, verifyOtp, logoutCustomer } from "@/lib/auth";
import { clientKey, rateLimit } from "@/lib/security";

function apiError(error: unknown, status = 400) {
  if (error instanceof z.ZodError) {
    return NextResponse.json({ error: error.issues[0]?.message || "Invalid input." }, { status });
  }
  if (error instanceof Error) {
    return NextResponse.json({ error: error.message }, { status });
  }
  return NextResponse.json({ error: "Something went wrong." }, { status });
}

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
  if (!rl.ok) return NextResponse.json({ error: "Slow down. Try again in a minute." }, { status: 429 });
  try {
    if (action === "verify") {
      const user = await verifyOtp(mobile || "", code || "");
      return NextResponse.json({ ok: true, user: { id: user.id, mobile: user.mobile } });
    }
    const result = await requestOtp(mobile || "");
    return NextResponse.json(result);
  } catch (e) {
    return apiError(e);
  }
}
