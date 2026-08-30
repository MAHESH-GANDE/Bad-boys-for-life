import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BADBOYS",
    short_name: "BADBOYS",
    description: "Premium menswear. For life.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
    icons: [
      { src: "/icons/app-icon.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/app-icon.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
