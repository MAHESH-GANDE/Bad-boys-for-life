import type { CustomerSegment } from "@prisma/client";
import { prisma } from "./db";

export type MemberTier = {
  id: "member" | "premium" | "black";
  label: string;
  blurb: string;
  perks: string[];
};

export function resolveMemberTier(input: {
  segment: CustomerSegment;
  orderCount: number;
  totalSpent: number;
  loyaltyPoints: number;
}) {
  if (
    input.segment === "HIGH_VALUE" ||
    input.totalSpent >= 25000 ||
    input.loyaltyPoints >= 1000
  ) {
    return {
      id: "black" as const,
      label: "BLACK PREMIUM",
      blurb: "Top tier — private drops, express priority, stylist line.",
      perks: ["Early drop access", "Express shipping priority", "Dedicated support line", "Exclusive sale window"],
    };
  }
  if (input.segment === "REPEAT" || input.orderCount >= 2 || input.totalSpent >= 8000) {
    return {
      id: "premium" as const,
      label: "PREMIUM",
      blurb: "Repeat BADBOYS — faster service and member pricing.",
      perks: ["Member-only coupons", "Priority dispatch", "Free returns pickup", "Birthday reward"],
    };
  }
  return {
    id: "member" as const,
    label: "MEMBER",
    blurb: "Welcome in — complete your profile to unlock more.",
    perks: ["Wishlist sync", "Order tracking", "Referral rewards", "Size profile saved"],
  };
}

export function profileCompletion(user: {
  name: string | null;
  email: string | null;
  dateOfBirth: Date | null;
  addressCount: number;
}) {
  let score = 0;
  if (user.name?.trim()) score += 25;
  if (user.email?.trim()) score += 25;
  if (user.dateOfBirth) score += 25;
  if (user.addressCount > 0) score += 25;
  return score;
}

export async function getAccountDashboard(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      loyalty: true,
      addresses: { take: 1, orderBy: { isDefault: "desc" } },
      wishlist: { include: { _count: { select: { items: true } } } },
      orders: {
        where: { status: { not: "CANCELLED" } },
        orderBy: { createdAt: "desc" },
        take: 3,
        select: {
          id: true,
          number: true,
          status: true,
          grandTotal: true,
          createdAt: true,
        },
      },
      _count: {
        select: {
          orders: { where: { status: { not: "CANCELLED" } } },
          addresses: true,
        },
      },
    },
  });
  if (!user) return null;

  const totalSpent = await prisma.order.aggregate({
    where: { userId, status: { in: ["CONFIRMED", "SHIPPED", "DELIVERED"] } },
    _sum: { grandTotal: true },
  });

  const spent = Number(totalSpent._sum.grandTotal ?? 0);
  const orderCount = user._count.orders;
  const loyaltyPoints = user.loyalty?.points ?? 0;
  const tier = resolveMemberTier({
    segment: user.segment,
    orderCount,
    totalSpent: spent,
    loyaltyPoints,
  });

  return {
    user: {
      id: user.id,
      mobile: user.mobile,
      email: user.email,
      name: user.name,
      dateOfBirth: user.dateOfBirth,
      referralCode: user.referralCode,
      segment: user.segment,
      createdAt: user.createdAt,
    },
    tier,
    stats: {
      orderCount,
      wishlistCount: user.wishlist?._count.items ?? 0,
      addressCount: user._count.addresses,
      loyaltyPoints,
      totalSpent: spent,
      profileComplete: profileCompletion({
        name: user.name,
        email: user.email,
        dateOfBirth: user.dateOfBirth,
        addressCount: user._count.addresses,
      }),
    },
    recentOrders: user.orders,
    defaultAddress: user.addresses[0] ?? null,
  };
}

export type AccountDashboard = NonNullable<Awaited<ReturnType<typeof getAccountDashboard>>>;
