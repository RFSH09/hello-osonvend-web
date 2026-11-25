import type { VariantProps } from "class-variance-authority";
import type { AnchorHTMLAttributes } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { buttonStyles } from "./primitives";

type Props = VariantProps<typeof buttonStyles> &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { href: string; external?: boolean };

/** Link styled as a button. Internal hrefs are locale-aware. */
export function ButtonLink({ href, external, variant, size, className, ...rest }: Props) {
  const cls = cn(buttonStyles({ variant, size }), className);
  if (external) return <a href={href} className={cls} target="_blank" rel="noopener noreferrer" {...rest} />;
  return <Link href={href as never} className={cls} {...rest} />;
}
