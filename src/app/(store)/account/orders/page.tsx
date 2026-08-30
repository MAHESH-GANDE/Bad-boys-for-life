import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Page() {
  const user = await getSessionUser();
  if (!user) redirect("/account");
  const orders = await prisma.order.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" } });
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-display text-4xl tracking-[0.14em]">ORDERS</h1>
      <ul className="mt-8 divide-y divide-bb-off/15">
        {orders.map((o) => (
          <li key={o.id} className="py-4">
            <Link href={`/account/orders/${o.id}`} className="flex justify-between">
              <span>{o.number}</span>
              <span className="text-bb-off/50">{o.status}</span>
            </Link>
          </li>
        ))}
      </ul>
      {orders.length === 0 && <p className="mt-8 text-bb-off/50">No orders yet.</p>}
    </div>
  );
}
