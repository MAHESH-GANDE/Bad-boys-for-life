import { prisma } from "./db";
import { defaultShipping, type ShippingConfig } from "./shipping";

export type SiteConfig = {
  brandName: string;
  tagline: string;
  legalName: string;
  gstin: string;
  supportEmail: string;
  supportMobile: string;
  whatsapp: string;
  instagram: string;
  facebook: string;
  youtube: string;
  currency: string;
  announcement: string;
  announcementHref: string;
  announcementActive: boolean;
  ga4Id: string;
  metaPixelId: string;
  shipping: ShippingConfig;
  giftWrapFee: number;
  giftWrapEnabled: boolean;
  invoicePrefix: string;
  seoTitle: string;
  seoDescription: string;
};

export const defaultSiteConfig: SiteConfig = {
  brandName: "BADBOYS",
  tagline: "FOR LIFE",
  legalName: "BADBOYS Menswear Pvt. Ltd.",
  gstin: "",
  supportEmail: "support@badboys.store",
  supportMobile: "1800123456",
  whatsapp: "https://wa.me/910000000000",
  instagram: "https://instagram.com",
  facebook: "https://facebook.com",
  youtube: "https://youtube.com",
  currency: "INR",
  announcement: "NEW DROP LIVE  ·  FREE SHIPPING ABOVE ₹999",
  announcementHref: "/new-arrivals",
  announcementActive: true,
  ga4Id: process.env.NEXT_PUBLIC_GA4_ID ?? "",
  metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "",
  shipping: defaultShipping,
  giftWrapFee: 49,
  giftWrapEnabled: true,
  invoicePrefix: "BB-INV",
  seoTitle: "BADBOYS — Premium Menswear. For Life.",
  seoDescription:
    "Premium contemporary menswear. Oversized tees, cargos, jackets. We don't follow. We wear our own.",
};

export async function getSiteConfig(): Promise<SiteConfig> {
  const row = await prisma.siteSetting.findUnique({ where: { id: "default" } });
  if (!row) return defaultSiteConfig;
  return { ...defaultSiteConfig, ...(row.data as Partial<SiteConfig>) };
}
