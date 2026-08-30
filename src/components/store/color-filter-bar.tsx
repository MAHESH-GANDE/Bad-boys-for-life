import Link from "next/link";
import { colorTiers, colorsByTier } from "@/lib/colors";

/** Quick colour filter for shop — grouped by stocking tier. */
export function ColorFilterBar({ compact }: { compact?: boolean }) {
  return (
    <section className={compact ? "py-8" : "border-y border-bb-off/15 py-12 md:py-14"}>
      <div className="mx-auto max-w-7xl px-4">
        {!compact && (
          <div className="mb-6 flex items-end justify-between">
            <p className="text-[10px] tracking-[0.28em] text-bb-off/50">FILTER BY COLOUR</p>
            <Link href="/collections/colours" className="text-[10px] tracking-[0.2em] text-bb-off/50 hover:text-bb-off">
              ALL COLOUR COLLECTIONS →
            </Link>
          </div>
        )}
        <div className="mb-4">
          <Link
            href="/shop"
            className="inline-block border border-bb-off/30 px-4 py-2 text-[10px] tracking-[0.2em] text-bb-off transition hover:border-bb-off"
          >
            ALL
          </Link>
        </div>
        <div className="space-y-5">
          {colorTiers.map((tier) => (
            <div key={tier.id}>
              <p className="mb-2 text-[9px] tracking-[0.2em] text-bb-off/40">
                {tier.label.toUpperCase()} · {tier.share}
              </p>
              <div className="flex flex-wrap items-center gap-2 md:gap-3">
                {colorsByTier(tier.id).map((color) => (
                  <Link
                    key={color.slug}
                    href={`/collections/color/${color.slug}`}
                    className="group flex items-center gap-2 border border-bb-off/15 px-3 py-2 transition hover:border-bb-off/40"
                    title={color.name}
                  >
                    <span
                      className="h-4 w-4 shrink-0 border border-bb-off/25"
                      style={{ background: color.hex }}
                    />
                    <span className="text-[10px] tracking-[0.16em] text-bb-off/70 group-hover:text-bb-off">
                      {color.name.toUpperCase()}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
