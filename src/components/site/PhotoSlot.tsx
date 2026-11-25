import Image, { type StaticImageData } from "next/image";
import { cn } from "@/lib/cn";

/** A real photo (static import: size + blur placeholder known at build time), rounded 24px. */
export function PhotoSlot({
  src,
  alt,
  className,
  sizes = "(max-width: 1024px) 100vw, 600px",
  priority,
}: {
  src: StaticImageData;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <div className={cn("relative overflow-hidden rounded-[24px] bg-border shadow-xl", className)}>
      <Image src={src} alt={alt} fill sizes={sizes} placeholder="blur" priority={priority} className="object-cover" />
    </div>
  );
}
