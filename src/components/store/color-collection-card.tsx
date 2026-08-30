import Image from "next/image";
import Link from "next/link";
import type { BrandColor } from "@/lib/colors";
import { colorMutedTextClass, colorTextClass, colourPreviewBase, colourTintOpacity } from "@/lib/colors";

type Variant = "portrait" | "landscape";

export function ColorCollectionCard({
  color,
  variant = "portrait",
}: {
  color: BrandColor;
  variant?: Variant;
}) {
  const text = colorTextClass(color.hex);
  const muted = colorMutedTextClass(color.hex);
  const aspect = variant === "landscape" ? "aspect-[16/11]" : "aspect-[4/5]";
  const imageSrc = colourPreviewBase(color);
  const tint = colourTintOpacity(color);

  return (
    <Link
      href={`/collections/color/${color.slug}`}
      className="group block overflow-hidden border border-bb-off/15 bg-neutral-900 transition hover:border-bb-off/35"
    >
      <div className={`relative flex flex-col ${aspect}`}>
        {/* Product preview — kept clear, no heavy black wash */}
        <div className="relative min-h-0 flex-1 overflow-hidden">
          <Image
            src={imageSrc}
            alt={`${color.name} collection`}
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
            sizes={variant === "landscape" ? "(max-width: 768px) 100vw, 33vw" : "(max-width: 768px) 50vw, 25vw"}
          />
          <div
            className="pointer-events-none absolute inset-0 mix-blend-color"
            style={{ background: color.hex, opacity: tint }}
          />
        </div>

        {/* Colour band — the collection identity, not a black footer */}
        <div
          className={`relative shrink-0 border-t border-black/10 px-4 py-3 md:px-5 md:py-4 ${text}`}
          style={{ backgroundColor: color.hex }}
        >
          <div className="flex items-center gap-3">
            <span
              className="h-8 w-8 shrink-0 border border-black/15 shadow-sm ring-1 ring-white/20"
              style={{ backgroundColor: color.hex }}
              aria-hidden
            />
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-sm tracking-[0.12em] md:text-base">
                {color.name.toUpperCase()} COLLECTION
              </p>
              <p className={`mt-0.5 truncate text-[9px] tracking-[0.16em] md:text-[10px] ${muted}`}>
                {color.tagline}
              </p>
            </div>
            <span className={`shrink-0 text-[9px] tracking-[0.2em] opacity-70 group-hover:opacity-100 md:text-[10px] ${muted}`}>
              SHOP →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
