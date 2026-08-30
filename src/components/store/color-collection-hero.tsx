import Image from "next/image";
import Link from "next/link";
import type { BrandColor } from "@/lib/colors";

export function ColorCollectionHero({ color }: { color: BrandColor }) {
  return (
    <section className="relative min-h-[36vh] border-b border-bb-off/15">
      <Image src={color.image} alt={color.name} fill className="object-cover" priority />
      <div className="absolute inset-0 bg-bb-black/50" />
      <div
        className="absolute inset-0 opacity-25 mix-blend-multiply"
        style={{ background: color.hex }}
      />
      <div className="relative z-10 mx-auto flex min-h-[36vh] max-w-7xl flex-col justify-end px-4 pb-10">
        <Link href="/collections/colours" className="text-[10px] tracking-[0.28em] text-bb-off/60 hover:text-bb-off">
          ← ALL COLOURS
        </Link>
        <div className="mt-4 flex items-center gap-3">
          <span className="h-6 w-6 border border-bb-off/40" style={{ background: color.hex }} />
          <h1 className="font-display text-4xl tracking-[0.14em] md:text-6xl">{color.name.toUpperCase()}</h1>
        </div>
        <p className="mt-3 max-w-lg text-sm text-bb-off/75">{color.tagline}</p>
      </div>
    </section>
  );
}
