import Link from "next/link";
import Image from "next/image";
import { brandColors, colorTiers, colorsByTier } from "@/lib/colors";

export default function AllColoursPage() {
  return (
    <div>
      <section className="relative min-h-[40vh] border-b border-bb-off/15">
        <Image src="/images/product-coord.jpg" alt="" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-bb-black/55" />
        <div className="relative z-10 mx-auto flex min-h-[40vh] max-w-7xl flex-col justify-end px-4 pb-12">
          <p className="text-[10px] tracking-[0.32em] text-bb-off/60">BADBOYS · MENSWEAR</p>
          <h1 className="mt-3 font-display text-5xl tracking-[0.16em] md:text-7xl">ALL COLOURS</h1>
          <p className="mt-4 max-w-xl text-sm text-bb-off/70">
            Muted, low-saturation tones — ecru, olive, terracotta, and ink navy. Matte fabrics only. No single shade leads.
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
                  <Link
                    key={color.slug}
                    href={`/collections/color/${color.slug}`}
                    className="group relative overflow-hidden border border-bb-off/10 bg-neutral-950"
                  >
                    <div className="relative aspect-[16/10]">
                      <Image
                        src={color.image}
                        alt={color.name}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-[1.03]"
                      />
                      <div
                        className="absolute inset-0 opacity-20 mix-blend-multiply"
                        style={{ background: color.hex }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-bb-black via-bb-black/20 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6">
                        <div>
                          <span className="mb-2 inline-block h-5 w-5 border border-bb-off/30" style={{ background: color.hex }} />
                          <p className="font-display text-2xl tracking-[0.12em]">{color.name.toUpperCase()}</p>
                          <p className="mt-1 text-[10px] tracking-[0.18em] text-bb-off/50">{color.tagline}</p>
                        </div>
                        <span className="text-[10px] tracking-[0.22em] text-bb-off/50 group-hover:text-bb-off">SHOP →</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
