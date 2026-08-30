import Image from "next/image";
import Link from "next/link";
import { brandColors, colorTiers, colorsByTier } from "@/lib/colors";

export function ColorCollectionsGrid() {
  return (
    <section className="border-y border-bb-off/15 py-14 md:py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] tracking-[0.32em] text-bb-off/50">MUTED PALETTE · QUIET LUXURY</p>
            <h2 className="mt-2 font-display text-3xl tracking-[0.16em] md:text-5xl">COLOUR COLLECTIONS</h2>
            <p className="mt-3 max-w-xl text-sm text-bb-off/60">
              Low-saturation, earthy tones — no neon, no gloss. Core neutrals, mineral earth, and muted accents.
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
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-4">
                  {colors.map((color) => (
                    <Link
                      key={color.slug}
                      href={`/collections/color/${color.slug}`}
                      className="group relative overflow-hidden border border-bb-off/10 bg-neutral-950"
                    >
                      <div className="relative aspect-[4/5]">
                        <Image
                          src={color.image}
                          alt={`${color.name} collection`}
                          fill
                          className="object-cover transition duration-500 group-hover:scale-[1.04]"
                          sizes="(max-width: 768px) 50vw, 25vw"
                        />
                        <div
                          className="absolute inset-0 opacity-30 mix-blend-multiply transition group-hover:opacity-20"
                          style={{ background: color.hex }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-bb-black via-bb-black/25 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <span
                            className="mb-2 inline-block h-4 w-4 border border-bb-off/30"
                            style={{ background: color.hex }}
                          />
                          <p className="font-display text-sm tracking-[0.1em] md:text-base">{color.name.toUpperCase()}</p>
                          <p className="mt-1 text-[9px] tracking-[0.16em] text-bb-off/55">{color.tagline}</p>
                        </div>
                      </div>
                    </Link>
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
