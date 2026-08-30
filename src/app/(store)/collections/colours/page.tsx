import Image from "next/image";
import { listProducts } from "@/lib/catalog";
import { ColorCollectionCard } from "@/components/store/color-collection-card";
import { colorTiers, colorsByTier } from "@/lib/colors";
import { colourPreviewImages } from "@/lib/product-colours";

export default async function AllColoursPage() {
  const products = await listProducts();
  const previews = colourPreviewImages(products);

  return (
    <div>
      <section className="relative min-h-[36vh] border-b border-bb-off/15 md:grid md:min-h-[40vh] md:grid-cols-2">
        <div className="relative min-h-[28vh] md:min-h-0">
          <Image src="/images/product-coord.jpg" alt="" fill className="object-cover" priority />
        </div>
        <div className="flex flex-col justify-end bg-neutral-900 px-4 py-10 md:px-10 md:py-12">
          <p className="text-[10px] tracking-[0.32em] text-bb-off/50">BADBOYS · MENSWEAR</p>
          <h1 className="mt-3 font-display text-4xl tracking-[0.16em] md:text-6xl">ALL COLOURS</h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-bb-off/70">
            Every colour is a collection. Products come in multiple shades — pick a colour to see that version with the right image.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-14 px-4 py-14 md:py-16">
        {colorTiers.map((tier) => {
          const colors = colorsByTier(tier.id);
          return (
            <div key={tier.id}>
              <div className="mb-6 border-b border-bb-off/10 pb-4">
                <p className="text-[10px] tracking-[0.28em] text-bb-off/45">{tier.share} OF STOCK</p>
                <h2 className="mt-2 font-display text-2xl tracking-[0.12em] md:text-3xl">{tier.label.toUpperCase()}</h2>
                <p className="mt-2 text-sm text-bb-off/60">{tier.blurb}</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {colors.map((color) => (
                  <ColorCollectionCard
                    key={color.slug}
                    color={color}
                    variant="landscape"
                    previewImage={previews.get(color.slug)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
