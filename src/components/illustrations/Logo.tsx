"use client";

/* eslint-disable @next/next/no-img-element */

/**
 * Marca da Granja Canaã — a logo real (galinha + lettering) fornecida pela cliente,
 * recortada em círculo em /public/brand/logo-circle.png.
 */
export function LogoMark({
  size = 40,
  className = "",
  ring = true,
}: {
  size?: number;
  className?: string;
  ring?: boolean;
}) {
  return (
    <span
      className={`inline-block shrink-0 overflow-hidden rounded-full ${ring ? "ring-2 ring-cream/90 shadow-card" : ""} ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src={size > 160 ? "/brand/logo-circle.png" : "/brand/logo-circle-160.png"}
        alt="Granja Canaã"
        width={size}
        height={size}
        draggable={false}
        className="h-full w-full object-cover"
      />
    </span>
  );
}

export function Wordmark({
  className = "",
  size = 22,
  tone = "ink",
}: {
  className?: string;
  size?: number;
  tone?: "ink" | "cream" | "gold";
}) {
  const color = tone === "ink" ? "var(--ink)" : tone === "gold" ? "var(--gold)" : "var(--cream)";
  return (
    <span
      className={`font-display ${className}`}
      style={{
        fontWeight: 600,
        fontSize: size,
        letterSpacing: "0.01em",
        lineHeight: 1,
        color,
        display: "inline-flex",
        alignItems: "baseline",
        gap: "0.3em",
      }}
    >
      <span style={{ fontWeight: 500, opacity: 0.85 }}>Granja</span>
      <span>Canaã</span>
    </span>
  );
}

export function Logo({ size = 36, tone = "ink" }: { size?: number; tone?: "ink" | "cream" | "gold" }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark size={size} />
      <Wordmark size={size * 0.6} tone={tone} />
    </span>
  );
}
