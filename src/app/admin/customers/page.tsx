import { AdminShell } from "@/components/admin/shell";
import { prisma } from "@/lib/db";

export default async function Page() {
  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" }, take: 50, include: { _count: { select: { orders: true } } } });
  return (
    <AdminShell>
      <div className="p-8">
        <h1 className="font-display text-3xl tracking-[0.16em]">CUSTOMERS</h1>
        <ul className="mt-8 space-y-3 text-sm">
          {users.map((u) => (
            <li key={u.id} className="flex justify-between border-b border-bb-off/10 py-3">
              <span>
                {u.mobile} · {u.segment}
              </span>
              <span className="text-bb-off/50">{u._count.orders} orders</span>
            </li>
          ))}
        </ul>
      </div>
    </AdminShell>
  );
}
