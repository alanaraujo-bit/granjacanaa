"use client";

import { useId } from "react";

export type EggTone = "brown" | "cream" | "dark" | "quail";

const TONES: Record<
  EggTone,
  { light: string; mid: string; deep: string; rim: string; speck?: string }
> = {
  brown: { light: "#F6D9B4", mid: "#DBA26D", deep: "#A56D3C", rim: "#FAE6CC", speck: "#8E5A32" },
  cream: { light: "#FFFCF5", mid: "#F0DFC6", deep: "#C7AA88", rim: "#FFFFFF" },
  dark: { light: "#E8B78C", mid: "#C47A40", deep: "#874B20", rim: "#F3D0AA", speck: "#6E3C18" },
  quail: { light: "#FCF6EA", mid: "#EBDFC9", deep: "#C0AA8D", rim: "#FFFFFF", speck: "#4B3625" },
};

/** Caminho do ovo em um viewBox 0 0 100 130 (ponta para cima). */
export const EGG_PATH =
  "M50 3 C31 3 14 30 10 64 C6 100 26 127 50 127 C74 127 94 100 90 64 C86 30 69 3 50 3 Z";

/** Defs compartilháveis (gradientes + clip) para um tom. */
export function EggDefs({ id, tone }: { id: string; tone: EggTone }) {
  const t = TONES[tone];
  return (
    <defs>
      <radialGradient id={`${id}-body`} cx="38%" cy="30%" r="75%">
        <stop offset="0%" stopColor={t.light} />
        <stop offset="45%" stopColor={t.mid} />
        <stop offset="100%" stopColor={t.deep} />
      </radialGradient>
      <linearGradient id={`${id}-rim`} x1="0" y1="0" x2="0.3" y2="1">
        <stop offset="0%" stopColor={t.rim} stopOpacity="0" />
        <stop offset="70%" stopColor={t.rim} stopOpacity="0" />
        <stop offset="100%" stopColor={t.rim} stopOpacity="0.55" />
      </linearGradient>
      <radialGradient id={`${id}-hi`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
      </radialGradient>
      <radialGradient id={`${id}-shadow`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#3a2a1b" stopOpacity="0.28" />
        <stop offset="100%" stopColor="#3a2a1b" stopOpacity="0" />
      </radialGradient>
      <clipPath id={`${id}-clip`}>
        <path d={EGG_PATH} />
      </clipPath>
    </defs>
  );
}

interface EggShapeProps {
  tone?: EggTone;
  /** deslocamento para variar as pintas */
  seed?: number;
  /** aplica sombra de contato abaixo do ovo */
  shadow?: boolean;
  /** id de defs já renderizadas por <EggDefs>; quando ausente, renderiza as próprias */
  defs?: string;
}

/**
 * Ovo com volume: gradiente radial principal, luz de borda, brilho
 * especular difuso e pintas. Renderiza dentro de um <g> — o pai define
 * viewBox/transform. Ocupa 100×130.
 */
export function EggShape({ tone = "brown", seed = 0, shadow = true, defs }: EggShapeProps) {
  const ownId = useId().replace(/:/g, "");
  const id = defs ?? ownId;
  const t = TONES[tone];
  const specks = tone === "quail" ? quailSpecks(seed) : tone === "cream" ? [] : specksFor(seed);

  return (
    <g>
      {!defs && <EggDefs id={id} tone={tone} />}

      {shadow && <ellipse cx="52" cy="126" rx="40" ry="9" fill={`url(#${id}-shadow)`} />}

      <path d={EGG_PATH} fill={`url(#${id}-body)`} />

      <g clipPath={`url(#${id}-clip)`}>
        {specks.map((s, i) => (
          <ellipse
            key={i}
            cx={s[0]}
            cy={s[1]}
            rx={s[2]}
            ry={s[3]}
            fill={t.speck}
            opacity={s[4]}
            transform={`rotate(${s[5]} ${s[0]} ${s[1]})`}
          />
        ))}
        <path d={EGG_PATH} fill={`url(#${id}-rim)`} />
        <ellipse
          cx="34"
          cy="34"
          rx="16"
          ry="22"
          fill={`url(#${id}-hi)`}
          transform="rotate(-20 34 34)"
        />
        <ellipse
          cx="30"
          cy="26"
          rx="5"
          ry="8"
          fill="#fff"
          opacity="0.55"
          transform="rotate(-22 30 26)"
        />
      </g>
    </g>
  );
}

function specksFor(seed: number): [number, number, number, number, number, number][] {
  const base: [number, number, number, number, number, number][] = [
    [60, 45, 1.6, 1.1, 0.18, 20],
    [70, 72, 1.2, 0.9, 0.16, -15],
    [42, 88, 1.4, 1, 0.14, 40],
    [66, 100, 1.1, 0.8, 0.14, 0],
    [54, 62, 0.9, 0.7, 0.12, 60],
    [76, 88, 0.8, 0.6, 0.12, 0],
    [36, 70, 1, 0.7, 0.1, 30],
  ];
  const k = (seed % 5) * 4;
  return base.map(([x, y, rx, ry, o, r], i) => [
    x + ((i * 7 + k) % 9) - 4,
    y + ((i * 5 + k) % 7) - 3,
    rx,
    ry,
    o,
    r,
  ]);
}

function quailSpecks(seed: number): [number, number, number, number, number, number][] {
  const pts: [number, number, number, number, number, number][] = [];
  let s = seed * 9301 + 49297;
  const rnd = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  for (let i = 0; i < 16; i++) {
    const x = 18 + rnd() * 64;
    const y = 12 + rnd() * 105;
    const r = 2 + rnd() * 5;
    pts.push([x, y, r, r * (0.6 + rnd() * 0.5), 0.55 + rnd() * 0.3, rnd() * 180]);
  }
  return pts;
}

interface EggProps extends EggShapeProps {
  className?: string;
  width?: number | string;
}

/** Um ovo isolado, pronto para usar como imagem. */
export function Egg({ className, width = 96, ...rest }: EggProps) {
  return (
    <svg viewBox="0 0 104 136" width={width} className={className} aria-hidden="true">
      <g transform="translate(2 2)">
        <EggShape {...rest} />
      </g>
    </svg>
  );
}
