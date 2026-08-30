import { AdminShell } from "@/components/admin/shell";
import { prisma } from "@/lib/db";

export default async function Page() {
  const rows = await prisma.inventory.findMany({
    include: { variant: { include: { product: true } } },
    orderBy: { available: "asc" },
    take: 80,
  });
  return (
    <AdminShell>
      <div className="overflow-x-auto p-8">
        <h1 className="font-display text-3xl tracking-[0.16em]">INVENTORY</h1>
        <table className="mt-8 w-full text-left text-sm">
          <thead className="text-[10px] tracking-[0.16em] text-bb-off/50">
            <tr>
              <th className="py-2">SKU</th>
              <th>Product</th>
              <th>Avail</th>
              <th>Res</th>
              <th>Sold</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-bb-off/10">
                <td className="py-2">{r.variant.sku}</td>
                <td>
                  {r.variant.product.name} {r.variant.colour}/{r.variant.size}
                </td>
                <td className={r.available <= r.lowStockAt ? "text-bb-red" : ""}>{r.available}</td>
                <td>{r.reserved}</td>
                <td>{r.sold}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
