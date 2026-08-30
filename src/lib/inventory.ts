import { prisma } from "./db";

export class InventoryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InventoryError";
  }
}

export async function reserveStock(input: {
  variantId: string;
  quantity: number;
  cartId?: string;
  orderId?: string;
  minutes?: number;
}) {
  const minutes = input.minutes ?? 15;
  return prisma.$transaction(async (tx) => {
    const inv = await tx.inventory.findUnique({ where: { variantId: input.variantId } });
    if (!inv || inv.available < input.quantity) {
      throw new InventoryError("That size just sold out.");
    }
    await tx.inventory.update({
      where: { variantId: input.variantId },
      data: { available: { decrement: input.quantity }, reserved: { increment: input.quantity } },
    });
    return tx.inventoryReservation.create({
      data: {
        variantId: input.variantId,
        quantity: input.quantity,
        cartId: input.cartId,
        orderId: input.orderId,
        expiresAt: new Date(Date.now() + minutes * 60_000),
      },
    });
  });
}

export async function releaseExpiredReservations() {
  const expired = await prisma.inventoryReservation.findMany({
    where: { status: "ACTIVE", expiresAt: { lt: new Date() } },
  });
  for (const res of expired) {
    await prisma.$transaction([
      prisma.inventory.update({
        where: { variantId: res.variantId },
        data: { available: { increment: res.quantity }, reserved: { decrement: res.quantity } },
      }),
      prisma.inventoryReservation.update({
        where: { id: res.id },
        data: { status: "EXPIRED" },
      }),
    ]);
  }
}

export async function consumeReservationsForOrder(orderId: string) {
  const rows = await prisma.inventoryReservation.findMany({
    where: { orderId, status: "ACTIVE" },
  });
  for (const res of rows) {
    await prisma.$transaction([
      prisma.inventory.update({
        where: { variantId: res.variantId },
        data: { reserved: { decrement: res.quantity }, sold: { increment: res.quantity } },
      }),
      prisma.inventoryReservation.update({
        where: { id: res.id },
        data: { status: "CONSUMED" },
      }),
    ]);
  }
}

export async function releaseReservationsForOrder(orderId: string) {
  const rows = await prisma.inventoryReservation.findMany({
    where: { orderId, status: "ACTIVE" },
  });
  for (const res of rows) {
    await prisma.$transaction([
      prisma.inventory.update({
        where: { variantId: res.variantId },
        data: { available: { increment: res.quantity }, reserved: { decrement: res.quantity } },
      }),
      prisma.inventoryReservation.update({
        where: { id: res.id },
        data: { status: "RELEASED" },
      }),
    ]);
  }
}
