import Link from "next/link";
import { fitModels } from "@/lib/fits";

export function FitModelsGrid() {
  const grouped = fitModels.reduce<Record<string, typeof fitModels>>((acc, fit) => {
    (acc[fit.category] ??= []).push(fit);
    return acc;
  }, {});

  return (
    <section className="border-y border-bb-off/15 py-14 md:py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] tracking-[0.32em] text-bb-off/50">RELAXED & BOXY SILHOUETTES</p>
            <h2 className="mt-2 font-display text-3xl tracking-[0.16em] md:text-5xl">SHOP BY FIT</h2>
            <p className="mt-3 max-w-xl text-sm text-bb-off/60">
              Matte textures only — waffle knit, dry twill, heavy loopknit. No neon, no gloss.
            </p>
          </div>
          <Link href="/shop" className="text-[10px] tracking-[0.22em] text-bb-off/50 hover:text-bb-off">
            ALL PRODUCTS →
          </Link>
        </div>

        <div className="space-y-10">
          {Object.entries(grouped).map(([category, models]) => (
            <div key={category}>
              <p className="mb-4 text-[10px] tracking-[0.28em] text-bb-off/45">{category.toUpperCase()}</p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {models.map((fit) => (
                  <Link
                    key={fit.slug}
                    href={fit.href}
                    className="group border border-bb-off/10 bg-neutral-950/50 p-5 transition hover:border-bb-off/30"
                  >
                    <p className="font-display text-lg tracking-[0.1em] group-hover:text-bb-off">{fit.name.toUpperCase()}</p>
                    <p className="mt-2 text-xs leading-relaxed text-bb-off/55">{fit.details}</p>
                    <span className="mt-4 inline-block text-[10px] tracking-[0.2em] text-bb-off/40 group-hover:text-bb-off">
                      SHOP →
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
