import Image from "next/image";
import Link from "next/link";
import type { BrandColor } from "@/lib/colors";
import { colorMutedTextClass, colorTextClass } from "@/lib/colors";

export function ColorCollectionHero({
  color,
  previewImage,
  productCount,
}: {
  color: BrandColor;
  previewImage?: string;
  productCount?: number;
}) {
  const text = colorTextClass(color.hex);
  const muted = colorMutedTextClass(color.hex);
  const heroImage = previewImage ?? color.image;

  return (
    <section className="border-b border-bb-off/15 md:grid md:min-h-[40vh] md:grid-cols-2">
      {/* Colour panel — shows the shade clearly */}
      <div
        className={`flex min-h-[32vh] flex-col justify-end px-4 py-10 md:min-h-0 md:px-10 md:py-12 ${text}`}
        style={{ backgroundColor: color.hex }}
      >
        <Link
          href="/collections/colours"
          className={`text-[10px] tracking-[0.28em] hover:opacity-100 ${muted}`}
        >
          ← ALL COLOURS
        </Link>
        <div className="mt-5 flex items-center gap-4">
          <span
            className="h-12 w-12 shrink-0 border border-black/15 shadow-md ring-2 ring-white/25"
            style={{ backgroundColor: color.hex }}
            aria-hidden
          />
          <div>
            <p className={`text-[10px] tracking-[0.28em] ${muted}`}>COLOUR COLLECTION</p>
            <h1 className="font-display text-4xl tracking-[0.14em] md:text-6xl">{color.name.toUpperCase()}</h1>
          </div>
        </div>
        <p className={`mt-4 max-w-md text-sm leading-relaxed ${muted}`}>{color.tagline}</p>
        {productCount !== undefined && (
          <p className={`mt-3 text-[10px] tracking-[0.22em] ${muted}`}>
            {productCount} {productCount === 1 ? "piece" : "pieces"} in {color.name}
          </p>
        )}
        <p className={`mt-2 text-[10px] tracking-[0.22em] ${muted}`}>
          {color.stockShare} tier · Matte fabrics only
        </p>
      </div>

      <div className="relative min-h-[28vh] md:min-h-0">
        <Image src={heroImage} alt={`${color.name} menswear`} fill className="object-cover" priority />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-color md:hidden"
          style={{ background: color.hex }}
        />
      </div>
    </section>
  );
}
