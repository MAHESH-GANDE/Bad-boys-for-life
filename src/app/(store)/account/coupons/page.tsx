import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function Page() {
  const user = await getSessionUser();
  if (!user) redirect("/account");
  const coupons = await prisma.coupon.findMany({ where: { active: true } });
  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <h1 className="font-display text-4xl tracking-[0.14em]">COUPONS</h1>
      <ul className="mt-8 space-y-3">
        {coupons.map((c) => (
          <li key={c.id} className="border border-bb-off/15 p-4">
            <p className="tracking-[0.2em]">{c.code}</p>
            <p className="text-xs text-bb-off/50">
              {c.type} {c.value} · min {c.minOrder}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
