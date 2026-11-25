/**
 * Real photos/videos (files live in /public). Photos are imported statically so next/image
 * knows their size and generates a blur placeholder; Next serves WebP first and keeps the JPG
 * as the fallback source.
 */
import { config } from "@/config";
import bank from "../../public/photos/fridge-bank-branch.jpg";
import hallway from "../../public/photos/fridge-hallway.jpg";
import lobby from "../../public/photos/fridge-office-lobby.jpg";
import university from "../../public/photos/fridge-university-top.jpg";

export type PhotoKey = "hallway" | "lobby" | "bank" | "university";

export const PHOTOS = { hallway, lobby, bank, university } as const;

/** Photos that show a client's name/branding need permission (see config.showClientPhotos). */
export const CLIENT_PHOTOS: PhotoKey[] = ["lobby", "bank", "university"];

export function isPhotoVisible(key: PhotoKey) {
  return config.showClientPhotos || !CLIENT_PHOTOS.includes(key);
}

export const GALLERY_ORDER: PhotoKey[] = ["hallway", "lobby", "bank", "university"];

export const VIDEO = {
  heroLoop: "/video/hello-hero-loop.mp4",
  demo: "/video/hello-demo-clean.mp4",
  poster: "/video/poster-fridge.jpg",
  stills: {
    scan: "/video/still-scan-qr.jpg",
    take: "/video/still-take-product.jpg",
    ai: "/video/still-ai-camera.jpg",
  },
} as const;
