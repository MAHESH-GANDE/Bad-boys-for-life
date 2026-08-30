import Link from "next/link";
import { SkullMark, Wordmark } from "@/components/brand/mark";
import type { SiteConfig } from "@/lib/settings";

export function Footer({ config }: { config: SiteConfig }) {
  return (
    <footer className="mt-24 border-t border-bb-off/15 pb-24 md:pb-10">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 md:grid-cols-5">
        <div className="md:col-span-1">
          <SkullMark className="mb-4 h-10 w-8" />
          <Wordmark spaced={false} className="block text-xl" />
          <p className="mt-3 text-xs tracking-[0.2em] text-bb-off/50">FOR LIFE · MENSWEAR</p>
        </div>
        <Col
          title="SHOP"
          links={[
            ["/new-arrivals", "New Arrivals"],
            ["/category/t-shirts", "T-Shirts"],
            ["/category/shirts", "Shirts"],
            ["/category/cargos", "Cargos"],
            ["/category/jeans", "Jeans"],
            ["/category/jackets", "Jackets"],
            ["/category/hoodies", "Hoodies"],
            ["/bestsellers", "Best Sellers"],
            ["/sale", "Sale"],
          ]}
        />
        <Col
          title="HELP"
          links={[
            ["/contact", "Contact"],
            ["/faq", "FAQ"],
            ["/shipping-policy", "Shipping"],
            ["/returns", "Returns"],
            ["/track-order", "Track Order"],
            ["/size-guide", "Size Guide"],
          ]}
        />
        <Col
          title="ABOUT"
          links={[
            ["/about", "Our Story"],
            ["/contact", "Careers"],
          ]}
        />
        <Col
          title="LEGAL"
          links={[
            ["/privacy-policy", "Privacy"],
            ["/terms", "Terms"],
            ["/return-policy", "Refund"],
            ["/shipping-policy", "Shipping"],
            ["/cookie-policy", "Cookies"],
          ]}
        />
      </div>
      <div className="mx-auto flex max-w-7xl flex-col gap-4 border-t border-bb-off/10 px-4 py-6 text-[10px] tracking-[0.2em] uppercase text-bb-off/40 md:flex-row md:justify-between">
        <p>© {new Date().getFullYear()} {config.legalName || "BADBOYS"}</p>
        <div className="flex gap-6">
          <a href={config.instagram}>Instagram</a>
          <a href={config.facebook}>Facebook</a>
          <a href={config.youtube}>YouTube</a>
        </div>
      </div>
    </footer>
  );
}

function Col({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <p className="mb-4 text-[10px] tracking-[0.28em] text-bb-off/50">{title}</p>
      <ul className="space-y-2 text-sm text-bb-off/80">
        {links.map(([href, label]) => (
          <li key={href + label}>
            <Link href={href} className="hover:text-bb-off">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
