import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const form = await req.formData();
  await prisma.supportTicket.create({
    data: {
      topic: String(form.get("topic") || "Other"),
      message: String(form.get("message") || ""),
      mobile: String(form.get("mobile") || ""),
    },
  });
  return NextResponse.redirect(new URL("/contact", req.url), 303);
}
