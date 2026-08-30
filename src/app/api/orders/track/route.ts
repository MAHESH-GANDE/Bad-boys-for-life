import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const number = new URL(req.url).searchParams.get("number") || "";
  const order = await prisma.order.findUnique({
    where: { number },
    include: { shipment: true },
  });
  if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });
  return NextResponse.json({
    status: order.status,
    courier: order.shipment?.courier,
    trackingNumber: order.shipment?.trackingNumber,
    expectedDelivery: order.shipment?.expectedDelivery,
  });
}
