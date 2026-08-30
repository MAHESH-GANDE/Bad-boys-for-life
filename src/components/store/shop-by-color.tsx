import Link from "next/link";
import Image from "next/image";
import { brandColors } from "@/lib/colors";

export function ShopByColor() {
  return (
    <section className="border-y border-bb-off/15 bg-bb-black py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] tracking-[0.32em] text-bb-off/50">SHOP BY COLOUR</p>
            <h2 className="mt-2 font-display text-3xl tracking-[0.16em] md:text-5xl">ALL COLOURS</h2>
          </div>
          <p className="max-w-md text-sm text-bb-off/60">
            Every BADBOYS piece in every shade we cut. Black to blood. Off-white to charcoal.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {brandColors.map((color) => (
            <Link
              key={color.slug}
              href={`/collections/color/${color.slug}`}
              className="group relative overflow-hidden border border-bb-off/15 bg-neutral-950"
            >
              <div className="relative aspect-[4/5]">
                <Image
                  src={color.image}
                  alt={`${color.name} collection`}
                  fill
                  className="object-cover opacity-80 transition duration-500 group-hover:scale-[1.03] group-hover:opacity-100"
                  sizes="(max-width: 768px) 50vw, 20vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bb-black via-bb-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <span
                    className="mb-3 inline-block h-5 w-5 border border-bb-off/30"
                    style={{ background: color.hex }}
                  />
                  <p className="font-display text-lg tracking-[0.12em]">{color.name.toUpperCase()}</p>
                  <p className="mt-1 text-[10px] tracking-[0.18em] text-bb-off/50">{color.tagline}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
