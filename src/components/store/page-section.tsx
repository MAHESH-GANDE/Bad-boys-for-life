import Link from "next/link";
import { cn } from "@/lib/utils";

/** Consistent vertical rhythm — prevents mixed / overlapping page layouts. */
export function PageSection({
  children,
  className,
  bleed = false,
}: {
  children: React.ReactNode;
  className?: string;
  bleed?: boolean;
}) {
  return (
    <section className={cn("py-12 md:py-16", bleed && "border-y border-bb-off/10", className)}>
      <div className="mx-auto w-full max-w-7xl px-4">{children}</div>
    </section>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <header className="mb-8 md:mb-10">
      {eyebrow && <p className="text-[10px] tracking-[0.32em] text-bb-off/50">{eyebrow}</p>}
      <h1 className="mt-2 font-display text-3xl tracking-[0.14em] md:text-5xl">{title}</h1>
      {description && <p className="mt-3 max-w-2xl text-sm leading-relaxed text-bb-off/65">{description}</p>}
    </header>
  );
}

export function SectionHead({
  title,
  href,
  label = "VIEW ALL",
}: {
  title: string;
  href: string;
  label?: string;
}) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <h2 className="font-display text-2xl tracking-[0.14em] md:text-4xl">{title}</h2>
      <Link href={href} className="shrink-0 text-[10px] tracking-[0.22em] text-bb-off/50 hover:text-bb-off">
        {label}
      </Link>
    </div>
  );
}
