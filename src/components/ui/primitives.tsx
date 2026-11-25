import { cva, type VariantProps } from "class-variance-authority";
import { Inbox } from "lucide-react";
import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/api/types";
import { ProductVisual } from "@/components/art/ProductVisual";
import { useLocale } from "next-intl";

export const buttonStyles = cva(
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 text-base font-semibold transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-primary text-on-primary hover:opacity-90",
        accent: "bg-accent text-navy hover:brightness-95",
        outline: "border border-border bg-surface text-foreground hover:bg-background",
        ghost: "text-foreground hover:bg-border/50",
        danger: "bg-brand-red text-white hover:brightness-95",
      },
      size: { md: "", lg: "min-h-14 px-8 text-lg" },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export function Button({
  className,
  variant,
  size,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonStyles>) {
  return <button className={cn(buttonStyles({ variant, size }), className)} {...props} />;
}

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-card border border-border bg-surface p-5 shadow-sm", className)}
      {...props}
    />
  );
}

const badgeStyles = cva(
  "inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium",
  {
    variants: {
      tone: {
        neutral: "bg-border/60 text-foreground",
        success: "bg-green-500/15 text-accent-strong",
        warning: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
        danger: "bg-red-500/15 text-red-700 dark:text-red-300",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

export function Badge({
  className,
  tone,
  ...props
}: HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeStyles>) {
  return <span className={cn(badgeStyles({ tone }), className)} {...props} />;
}

export function PriceTag({
  amount,
  unit,
  className,
}: {
  amount: number;
  unit?: string;
  className?: string;
}) {
  return (
    <span className={cn("font-display font-bold tabular-nums", className)}>
      {formatPrice(amount, unit)}
    </span>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("animate-pulse rounded-xl bg-border/70", className)}
    />
  );
}

export function EmptyState({
  title,
  text,
  action,
  icon,
}: {
  title: string;
  text?: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
      <div className="text-muted">{icon ?? <Inbox size={40} aria-hidden />}</div>
      <h3 className="font-display text-lg font-bold">{title}</h3>
      {text && <p className="max-w-sm text-muted">{text}</p>}
      {action}
    </div>
  );
}

export function ProductCard({
  product,
  qty,
  soldOutLabel,
  lowLabel,
  availableLabel,
  unit,
  className,
  priority,
}: {
  product: Product;
  qty?: number; // undefined = catalogue (no stock info)
  soldOutLabel: string;
  lowLabel: string;
  availableLabel?: string;
  unit?: string;
  className?: string;
  /** Above-the-fold cards: load the photo eagerly (LCP). */
  priority?: boolean;
}) {
  const locale = useLocale() as keyof Product["subtitle"];
  const subtitle = product.subtitle?.[locale] ?? product.subtitle?.uz;
  const soldOut = qty !== undefined && qty <= 0;
  const low = qty !== undefined && qty > 0 && qty <= 2;
  const ok = qty !== undefined && qty > 2;
  return (
    <Card className={cn("flex h-full flex-col gap-2 p-3 sm:p-4", className)}>
      <div className="relative flex aspect-square items-center justify-center rounded-xl bg-white">
        <ProductVisual product={product} priority={priority} className={cn("size-[85%]", soldOut && "opacity-40 grayscale")} />
        {qty !== undefined && (
          <Badge
            tone={soldOut ? "danger" : low ? "warning" : "success"}
            className={cn("absolute left-2 top-2 px-2 py-0.5 text-xs", ok && "bg-green-100")}
          >
            {soldOut ? soldOutLabel : low ? lowLabel : availableLabel}
          </Badge>
        )}
      </div>
      <div className="flex min-h-11 flex-col gap-0.5">
        <span className="text-sm font-semibold leading-tight sm:text-base">{product.name}</span>
        {subtitle && <span className="text-xs text-muted sm:text-sm">{subtitle}</span>}
      </div>
      {soldOut ? (
        <span className="font-display font-bold text-muted">{soldOutLabel}</span>
      ) : (
        <PriceTag amount={product.price} unit={unit} />
      )}
    </Card>
  );
}

export function StepIndicator({
  steps,
  current = -1,
}: {
  steps: string[];
  current?: number;
}) {
  return (
    <ol className="grid gap-4 sm:grid-cols-4">
      {steps.map((label, i) => (
        <li key={label} className="flex items-start gap-3">
          <span
            className={cn(
              "flex size-11 shrink-0 items-center justify-center rounded-full font-display font-bold",
              i <= current ? "bg-accent text-navy" : "bg-primary text-on-primary",
            )}
          >
            {i + 1}
          </span>
          <span className="pt-2 font-medium leading-snug">{label}</span>
        </li>
      ))}
    </ol>
  );
}
