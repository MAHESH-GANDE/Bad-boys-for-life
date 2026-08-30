import { AdminShell } from "@/components/admin/shell";
import { prisma } from "@/lib/db";
import { formatInr } from "@/lib/utils";

export default async function Page() {
  const products = await prisma.product.findMany({ include: { variants: true, category: true }, orderBy: { createdAt: "desc" } });
  return (
    <AdminShell>
      <div className="p-8">
        <h1 className="font-display text-3xl tracking-[0.16em]">PRODUCTS</h1>
        <table className="mt-8 w-full text-left text-sm">
          <thead className="text-[10px] tracking-[0.16em] text-bb-off/50">
            <tr>
              <th className="py-2">Name</th>
              <th>SKU</th>
              <th>Category</th>
              <th>Price</th>
              <th>Pub</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-bb-off/10">
                <td className="py-3">{p.name}</td>
                <td>{p.sku}</td>
                <td>{p.category.name}</td>
                <td>{formatInr(Math.min(...p.variants.map((v) => v.price)))}</td>
                <td>{p.published ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
