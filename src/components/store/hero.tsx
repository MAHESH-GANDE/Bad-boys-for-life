"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { SkullMark, Wordmark } from "@/components/brand/mark";

export function Hero({
  title,
  subtitle,
  body,
  image,
  ctaLabel,
  ctaHref,
  secondaryLabel,
  secondaryHref,
}: {
  title: string;
  subtitle: string;
  body: string;
  image: string;
  ctaLabel: string;
  ctaHref: string;
  secondaryLabel: string;
  secondaryHref: string;
}) {
  return (
    <section className="relative min-h-[88vh] overflow-hidden">
      <Image src={image} alt="BADBOYS campaign" fill priority className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-bb-black via-bb-black/40 to-black/20" />
      <div className="relative z-10 flex min-h-[88vh] flex-col items-center justify-end px-4 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <SkullMark className="mx-auto mb-6 h-12 w-10 text-bb-off" />
          <Wordmark className="block text-5xl md:text-8xl" />
          <p className="mt-4 font-display text-xl tracking-[0.42em] md:text-3xl">{subtitle}</p>
          <p className="mt-2 text-[11px] tracking-[0.4em] text-bb-off/70">{body}</p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href={ctaHref} className="min-w-44 bg-bb-off px-8 py-3 text-xs tracking-[0.28em] text-bb-black">
              {ctaLabel}
            </Link>
            <Link href={secondaryHref} className="min-w-44 border border-bb-off px-8 py-3 text-xs tracking-[0.28em]">
              {secondaryLabel}
            </Link>
          </div>
          <p className="mt-16 text-[10px] tracking-[0.4em] text-bb-off/40">{title}</p>
        </motion.div>
      </div>
    </section>
  );
}
