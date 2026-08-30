import Link from "next/link";
import { listProducts } from "@/lib/catalog";
import { ColorCollectionCard } from "@/components/store/color-collection-card";
import { colorTiers, colorsByTier } from "@/lib/colors";
import { colourPreviewImages } from "@/lib/product-colours";

export async function ColorCollectionsGrid() {
  const products = await listProducts();
  const previews = colourPreviewImages(products);

  return (
    <section className="border-y border-bb-off/15 py-14 md:py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] tracking-[0.32em] text-bb-off/50">MUTED PALETTE · QUIET LUXURY</p>
            <h2 className="mt-2 font-display text-3xl tracking-[0.16em] md:text-5xl">COLOUR COLLECTIONS</h2>
            <p className="mt-3 max-w-xl text-sm text-bb-off/60">
              One product, many colours — each card shows a real piece in that shade. Tap to shop the full collection.
            </p>
          </div>
          <Link href="/collections/colours" className="text-[10px] tracking-[0.22em] text-bb-off/50 hover:text-bb-off">
            VIEW ALL COLOURS →
          </Link>
        </div>

        <div className="space-y-12">
          {colorTiers.map((tier) => {
            const colors = colorsByTier(tier.id);
            return (
              <div key={tier.id}>
                <div className="mb-5 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <h3 className="font-display text-xl tracking-[0.12em] md:text-2xl">{tier.label.toUpperCase()}</h3>
                  <span className="text-[10px] tracking-[0.22em] text-bb-off/45">{tier.share} · {tier.blurb}</span>
                </div>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {colors.map((color) => (
                    <ColorCollectionCard
                      key={color.slug}
                      color={color}
                      previewImage={previews.get(color.slug)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
