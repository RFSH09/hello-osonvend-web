import type { Product } from "@/lib/api/types";

/** Simple per-category product illustration, coloured per product. */
export function ProductArt({
  product,
  className,
}: {
  product: Pick<Product, "kind" | "color" | "accent">;
  className?: string;
}) {
  const { kind, color, accent } = product;
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden focusable="false">
      <ellipse cx="60" cy="110" rx="30" ry="5" fill="#0F1E3D" opacity="0.12" />
      {kind === "bottle" && (
        <g>
          <rect x="52" y="8" width="16" height="9" rx="2" fill={accent} />
          <path d="M53 17h14v14c0 6 13 10 13 24v47a6 6 0 0 1-6 6H46a6 6 0 0 1-6-6V55c0-14 13-18 13-24z" fill={color} />
          <rect x="40" y="62" width="40" height="26" fill={accent} />
          <circle cx="60" cy="75" r="6" fill="#fff" opacity="0.85" />
          <path d="M47 50c0-8 4-9 4-18" stroke="#fff" strokeOpacity="0.5" strokeWidth="3" strokeLinecap="round" fill="none" />
        </g>
      )}
      {kind === "can" && (
        <g>
          <rect x="36" y="14" width="48" height="94" rx="9" fill={color} />
          <rect x="36" y="14" width="48" height="10" rx="5" fill="#CBD5E1" />
          <rect x="36" y="98" width="48" height="10" rx="5" fill="#94A3B8" />
          <path d="M36 52 L84 38 V66 L36 80 Z" fill={accent} />
          <circle cx="60" cy="59" r="7" fill="#fff" opacity="0.85" />
          <rect x="41" y="20" width="4" height="82" rx="2" fill="#fff" opacity="0.25" />
        </g>
      )}
      {kind === "pack" && (
        <g>
          <path d="M30 18l6 5 6-5 6 5 6-5 6 5 6-5 6 5 6-5 6 5 6-5v78l-6 5-6-5-6 5-6-5-6 5-6-5-6 5-6-5-6 5-6-5-6 5z" fill={color} />
          <ellipse cx="60" cy="58" rx="22" ry="18" fill={accent} />
          <circle cx="60" cy="58" r="8" fill="#fff" opacity="0.85" />
          <rect x="34" y="84" width="52" height="5" rx="2.5" fill="#fff" opacity="0.4" />
        </g>
      )}
      {kind === "bar" && (
        <g>
          <path d="M14 42l8-5v-4l-8-5 0 0V42zm92 0l-8-5v-4l8-5z" fill={color} />
          <path d="M20 30l8 6v22l-8 6V30zm80 0l-8 6v22l8 6V30z" fill={color} />
          <rect x="26" y="26" width="68" height="44" rx="4" fill={color} />
          <path d="M26 54L94 36v14L26 68z" fill={accent} />
          <circle cx="42" cy="40" r="5" fill="#fff" opacity="0.8" />
          <rect x="26" y="26" width="68" height="6" fill="#fff" opacity="0.18" />
        </g>
      )}
    </svg>
  );
}
