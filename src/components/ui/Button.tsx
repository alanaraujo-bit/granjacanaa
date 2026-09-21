"use client";

import { forwardRef } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "danger" | "leaf";
type Size = "lg" | "md" | "sm";

const VARIANT: Record<Variant, string> = {
  primary:
    "bg-gold text-leaf-ink shadow-gold hover:bg-gold-deep active:shadow-none disabled:bg-line-strong disabled:text-ink-3 disabled:shadow-none",
  secondary: "bg-leaf-soft text-leaf-deep hover:bg-[#d3e6d3] disabled:opacity-50",
  ghost: "bg-transparent text-ink-2 hover:bg-surface-2 disabled:opacity-50",
  outline:
    "bg-surface text-ink border border-line-strong hover:border-ink-3 disabled:opacity-50",
  danger: "bg-danger-soft text-danger hover:bg-[#f8d4cf] disabled:opacity-50",
  leaf: "bg-leaf text-cream hover:bg-leaf-deep disabled:opacity-50",
};

const SIZE: Record<Size, string> = {
  lg: "h-14 px-6 text-[17px] rounded-[18px] gap-2.5",
  md: "h-12 px-5 text-[15px] rounded-[14px] gap-2",
  sm: "h-10 px-4 text-[14px] rounded-xl gap-1.5",
};

interface BaseProps {
  variant?: Variant;
  size?: Size;
  full?: boolean;
  loading?: boolean;
  className?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
}

type ButtonProps = BaseProps & React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type LinkProps = BaseProps & { href: string; onClick?: () => void; disabled?: boolean };

function cls(p: BaseProps & { disabled?: boolean }) {
  return [
    "pressable inline-flex select-none items-center justify-center font-semibold tracking-[-0.01em] whitespace-nowrap",
    VARIANT[p.variant ?? "primary"],
    SIZE[p.size ?? "lg"],
    p.full ? "w-full" : "",
    p.disabled || p.loading ? "pointer-events-none" : "",
    p.className ?? "",
  ].join(" ");
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps | LinkProps>(function Button(
  props,
  ref,
) {
  const { variant, size, full, loading, className, children, icon, iconRight, ...rest } = props;
  const inner = (
    <>
      {loading ? <Loader2 className="animate-spin" size={20} /> : icon}
      <span>{children}</span>
      {iconRight}
    </>
  );

  if ("href" in props && props.href) {
    const { href, onClick, disabled } = props as LinkProps;
    return (
      <Link
        href={href}
        onClick={onClick}
        aria-disabled={disabled}
        className={cls({ variant, size, full, loading, className, children, disabled })}
      >
        {inner}
      </Link>
    );
  }

  const btnRest = rest as React.ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button
      ref={ref}
      type="button"
      {...btnRest}
      disabled={btnRest.disabled || loading}
      className={cls({ variant, size, full, loading, className, children, disabled: btnRest.disabled })}
    >
      {inner}
    </button>
  );
});

/** Botão redondo só com ícone (voltar, fechar, etc.). */
export function IconButton({
  label,
  className = "",
  tone = "surface",
  size = 44,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  tone?: "surface" | "ghost" | "cream";
  size?: number;
}) {
  const t =
    tone === "surface"
      ? "bg-surface text-ink shadow-card border border-line"
      : tone === "cream"
        ? "bg-cream/20 text-cream border border-cream/30"
        : "bg-transparent text-ink hover:bg-surface-2";
  return (
    <button
      type="button"
      aria-label={label}
      className={`pressable inline-flex shrink-0 items-center justify-center rounded-full ${t} ${className}`}
      style={{ width: size, height: size }}
      {...rest}
    />
  );
}
