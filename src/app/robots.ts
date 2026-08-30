import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:43123";
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api/", "/account"] },
    sitemap: `${base}/sitemap.xml`,
  };
}
