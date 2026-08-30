import Link from "next/link";
import { AnnouncementBar } from "@/components/store/announcement";
import { Header } from "@/components/store/header";
import { Footer } from "@/components/store/footer";
import { MobileTabBar } from "@/components/store/mobile-tab-bar";
import { CartShell } from "@/components/store/cart-drawer";
import { getSiteConfig } from "@/lib/settings";
import { prisma } from "@/lib/db";

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const config = await getSiteConfig();
  const categories = await prisma.category.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" } });
  return (
    <CartShell>
      <div className="min-h-screen bg-bb-black">
        <Link href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-bb-off focus:px-3 focus:py-2 focus:text-bb-black">
          Skip to content
        </Link>
        <AnnouncementBar text={config.announcement} href={config.announcementHref} active={config.announcementActive} />
        <Header categories={categories} />
        <main id="main" className="pb-28 md:pb-0">{children}</main>
        <Footer config={config} />
        <MobileTabBar />
      </div>
    </CartShell>
  );
}
