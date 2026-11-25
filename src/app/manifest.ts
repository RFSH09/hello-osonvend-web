import type { MetadataRoute } from "next";
import { asset } from "@/lib/asset";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Hello by Osonvend",
    short_name: "Hello",
    description: "Scan. Take. Go.",
    start_url: asset("/uz/"),
    display: "standalone",
    background_color: "#f5f7fa",
    theme_color: "#33384b",
    icons: [
      { src: asset("/brand/app-icon-32.png"), sizes: "32x32", type: "image/png" },
      { src: asset("/brand/app-icon-192.png"), sizes: "192x192", type: "image/png" },
      { src: asset("/brand/app-icon-512.png"), sizes: "512x512", type: "image/png" },
    ],
  };
}
