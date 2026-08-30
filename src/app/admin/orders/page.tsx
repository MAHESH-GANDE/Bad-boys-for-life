import { AdminShell } from "@/components/admin/shell";
import { prisma } from "@/lib/db";
import { formatInr } from "@/lib/utils";

export default async function Page() {
  const orders = await prisma.order.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return (
    <AdminShell>
      <div className="overflow-x-auto p-8">
        <h1 className="font-display text-3xl tracking-[0.16em]">ORDERS</h1>
        <table className="mt-8 w-full text-left text-sm">
          <thead className="text-[10px] tracking-[0.16em] text-bb-off/50">
            <tr>
              <th className="py-2">Order</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Pay</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t border-bb-off/10">
                <td className="py-2">{o.number}</td>
                <td>{o.user.mobile}</td>
                <td>{o.status}</td>
                <td>{o.paymentMethod}</td>
                <td>{formatInr(o.grandTotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
