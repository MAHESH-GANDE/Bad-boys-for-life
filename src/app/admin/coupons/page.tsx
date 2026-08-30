import { AdminShell } from "@/components/admin/shell";
import { prisma } from "@/lib/db";

export default async function Page() {
  const coupons = await prisma.coupon.findMany({ orderBy: { startsAt: "desc" } });
  return (
    <AdminShell>
      <div className="p-8">
        <h1 className="font-display text-3xl tracking-[0.16em]">COUPONS</h1>
        <ul className="mt-8 space-y-3">
          {coupons.map((c) => (
            <li key={c.id} className="border border-bb-off/15 p-4">
              <p className="tracking-[0.2em]">{c.code}</p>
              <p className="text-xs text-bb-off/50">
                {c.type} {c.value} · used {c.usageCount}/{c.usageLimit ?? "∞"}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </AdminShell>
  );
}
