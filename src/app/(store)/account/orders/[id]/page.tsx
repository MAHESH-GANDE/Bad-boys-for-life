import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { formatInr } from "@/lib/utils";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) redirect("/account");
  const order = await prisma.order.findFirst({
    where: { id: (await params).id, userId: user.id },
    include: { items: true, shipment: true, payments: true },
  });
  if (!order) notFound();
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="font-display text-4xl tracking-[0.14em]">{order.number}</h1>
      <p className="mt-2 text-sm text-bb-off/50">{order.status}</p>
      <ul className="mt-8 space-y-3 text-sm">
        {order.items.map((i) => (
          <li key={i.id} className="flex justify-between">
            <span>
              {i.name} · {i.size}
            </span>
            <span>{formatInr(i.unitPrice * i.quantity)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-6">Total {formatInr(order.grandTotal)}</p>
      <p className="mt-2 text-xs text-bb-off/50">Invoice {order.invoiceNumber}</p>
    </div>
  );
}
