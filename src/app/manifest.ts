import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Hello by Osonvend",
    short_name: "Hello",
    description: "Scan. Take. Go.",
    start_url: "/uz",
    display: "standalone",
    background_color: "#f5f7fa",
    theme_color: "#33384b",
    icons: [
      { src: "/brand/app-icon-32.png", sizes: "32x32", type: "image/png" },
      { src: "/brand/app-icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/app-icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
