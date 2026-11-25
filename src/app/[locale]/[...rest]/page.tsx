import { notFound } from "next/navigation";

// Unknown URLs under a locale render the branded [locale]/not-found.tsx
export default function CatchAll() {
  notFound();
}
