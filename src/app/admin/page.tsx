import { AdminShell } from "@/components/admin/shell";
import { prisma } from "@/lib/db";
import { formatInr } from "@/lib/utils";

export default async function AdminHome() {
  const [orders, customers, revenue] = await Promise.all([
    prisma.order.count(),
    prisma.user.count(),
    prisma.order.aggregate({ _sum: { grandTotal: true }, where: { status: { in: ["CONFIRMED", "PACKED", "SHIPPED", "DELIVERED"] } } }),
  ]);
  const paid = await prisma.order.findMany({
    where: { status: { in: ["CONFIRMED", "DELIVERED", "SHIPPED"] } },
    select: { grandTotal: true },
  });
  const aov = paid.length ? Math.round(paid.reduce((s, o) => s + o.grandTotal, 0) / paid.length) : 0;
  return (
    <AdminShell>
      <div className="p-8">
        <h1 className="font-display text-3xl tracking-[0.16em]">DASHBOARD</h1>
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <Card label="Revenue" value={formatInr(revenue._sum.grandTotal || 0)} />
          <Card label="Orders" value={String(orders)} />
          <Card label="Customers" value={String(customers)} />
          <Card label="AOV" value={formatInr(aov)} />
        </div>
        <p className="mt-8 text-sm text-bb-off/50">Conversion, refunds, and funnels populate from AnalyticsEvent as traffic arrives. No fake metrics.</p>
      </div>
    </AdminShell>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-bb-off/15 p-5">
      <p className="text-[10px] tracking-[0.2em] text-bb-off/50">{label.toUpperCase()}</p>
      <p className="mt-2 font-display text-3xl">{value}</p>
    </div>
  );
}
