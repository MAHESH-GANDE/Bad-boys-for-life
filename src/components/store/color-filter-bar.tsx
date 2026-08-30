import Link from "next/link";
import { brandColors } from "@/lib/colors";

/** Zara / H&M style colour filter — equal weight, no single-colour push. */
export function ColorFilterBar({ compact }: { compact?: boolean }) {
  return (
    <section className={compact ? "py-8" : "border-y border-bb-off/15 py-12 md:py-14"}>
      <div className="mx-auto max-w-7xl px-4">
        {!compact && (
          <p className="mb-6 text-[10px] tracking-[0.28em] text-bb-off/50">FILTER BY COLOUR</p>
        )}
        <div className="flex flex-wrap items-center gap-3 md:gap-4">
          <Link
            href="/shop"
            className="border border-bb-off/30 px-4 py-2 text-[10px] tracking-[0.2em] text-bb-off transition hover:border-bb-off"
          >
            ALL
          </Link>
          {brandColors.map((color) => (
            <Link
              key={color.slug}
              href={`/shop?colour=${encodeURIComponent(color.name)}`}
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
    </section>
  );
}
