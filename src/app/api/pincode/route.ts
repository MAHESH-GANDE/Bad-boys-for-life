import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { pincodeSchema } from "@/lib/validations";

export async function GET(req: Request) {
  const pincode = new URL(req.url).searchParams.get("pincode") || "";
  const parsed = pincodeSchema.safeParse(pincode);
  if (!parsed.success) return NextResponse.json({ serviceable: false, error: "Invalid pincode" }, { status: 400 });
  const row = await prisma.pincodeService.findUnique({ where: { pincode: parsed.data } });
  if (!row) {
    return NextResponse.json({
      serviceable: true,
      cod: true,
      express: false,
      etaDays: 6,
      city: null,
      estimated: true,
    });
  }
  return NextResponse.json(row);
}
