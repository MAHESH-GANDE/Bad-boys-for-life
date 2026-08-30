import { listProducts } from "@/lib/catalog";
import type { SearchFilters } from "@/lib/search";
import { ProductGrid } from "@/components/store/product-card";
import { CatalogToolbar } from "@/components/store/catalog-toolbar";

export async function CatalogListing({
  title,
  filters,
}: {
  title: string;
  filters: SearchFilters;
}) {
  const products = await listProducts(filters);
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 pb-24">
      <p className="text-[10px] tracking-[0.28em] text-bb-off/50">MENSWEAR</p>
      <h1 className="mt-2 font-display text-4xl tracking-[0.16em] md:text-6xl">{title}</h1>
      <CatalogToolbar count={products.length} />
      {products.length === 0 ? (
        <div className="py-24 text-center">
          <p className="font-display text-4xl tracking-[0.12em]">NO RESULTS.</p>
          <p className="mt-3 text-bb-off/60">NOTHING HERE. BUT YOU CAN CHANGE THAT.</p>
        </div>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
}
