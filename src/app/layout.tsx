import type { Metadata, Viewport } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:43123"),
  title: {
    default: "BADBOYS — Premium Menswear. For Life.",
    template: "%s | BADBOYS",
  },
  description:
    "Premium contemporary menswear. Oversized tees, cargos, jackets. We don't follow. We wear our own.",
  applicationName: "BADBOYS",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icons/app-icon.png",
    apple: "/icons/app-icon.png",
  },
  openGraph: {
    type: "website",
    siteName: "BADBOYS",
    title: "BADBOYS — FOR LIFE",
    description: "Premium contemporary menswear.",
    images: ["/images/hero-menswear.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "BADBOYS — FOR LIFE",
    images: ["/images/hero-menswear.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${oswald.variable} antialiased bg-bb-black text-bb-off`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
