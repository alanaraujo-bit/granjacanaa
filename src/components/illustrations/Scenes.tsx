"use client";

import { useId } from "react";
import { EggDefs, EggShape, type EggTone } from "./Egg";
import type { ProductVisual } from "@/lib/catalog";

type SvgProps = { className?: string; width?: number | string };

const KRAFT = { light: "#DDBB90", mid: "#C9A57A", deep: "#A97F55", ink: "#6B4B2A" };
const PULP = { light: "#E7DCC8", mid: "#D6C8AF", deep: "#B9A88C", cup: "#A8977A" };
const WOOD = { light: "#D7AE7B", mid: "#C08F5C", deep: "#96683C", grain: "#8A5C33" };

function Ground({ cx = 160, cy = 224, rx = 120, id }: { cx?: number; cy?: number; rx?: number; id: string }) {
  return (
    <>
      <defs>
        <radialGradient id={`${id}-ground`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3a2a1b" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#3a2a1b" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx={cx} cy={cy} rx={rx} ry={rx * 0.11} fill={`url(#${id}-ground)`} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Caixa de ovos aberta (6 ou 12), vista 3/4                            */
/* ------------------------------------------------------------------ */
export function Carton({
  count = 12,
  tone = "brown",
  eggScale = 1,
  className,
  width = "100%",
}: SvgProps & { count?: 6 | 12; tone?: EggTone; eggScale?: number }) {
  const id = useId().replace(/:/g, "");
  const cols = count / 2;
  const cell = 38;
  const inner = cols * cell;
  const cx = 160;
  const left = cx - inner / 2;
  const right = cx + inner / 2;
  const pad = 12;

  const backScale = 0.34 * eggScale;
  const frontScale = 0.42 * eggScale;

  return (
    <svg viewBox="0 0 320 240" width={width} className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-lid`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={KRAFT.light} />
          <stop offset="100%" stopColor={KRAFT.mid} />
        </linearGradient>
        <linearGradient id={`${id}-front`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={KRAFT.mid} />
          <stop offset="100%" stopColor={KRAFT.deep} />
        </linearGradient>
        <linearGradient id={`${id}-top`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#B99066" />
          <stop offset="100%" stopColor={KRAFT.mid} />
        </linearGradient>
      </defs>
      <EggDefs id={`${id}-e`} tone={tone} />

      <Ground id={id} rx={inner / 2 + 40} cy={228} />

      {/* tampa aberta */}
      <polygon
        points={`${left - pad + 14},34 ${right + pad - 14},34 ${right + pad - 2},122 ${left - pad + 2},122`}
        fill={`url(#${id}-lid)`}
      />
      <polygon
        points={`${left - pad + 24},44 ${right + pad - 24},44 ${right + pad - 12},112 ${left - pad + 12},112`}
        fill="none"
        stroke={KRAFT.ink}
        strokeOpacity="0.18"
        strokeWidth="1.5"
        strokeDasharray="3 4"
      />
      <g fontFamily="var(--font-display), sans-serif" fontWeight="700" textAnchor="middle" fill={KRAFT.ink}>
        <text x={cx} y="72" fontSize="12" letterSpacing="1.5" opacity="0.85">
          GRANJA CANAÃ
        </text>
        <text x={cx} y="94" fontSize="17" opacity="0.9">
          {count} ovos caipiras
        </text>
      </g>

      {/* fileira de trás */}
      {Array.from({ length: cols }).map((_, i) => {
        const x = left + i * cell + (cell - 100 * backScale) / 2;
        return (
          <g key={`b${i}`} transform={`translate(${x} ${102}) scale(${backScale})`}>
            <EggShape tone={tone} seed={i + 3} shadow={false} defs={`${id}-e`} />
          </g>
        );
      })}

      {/* face superior */}
      <polygon
        points={`${left - pad + 6},134 ${right + pad - 6},134 ${right + pad},154 ${left - pad},154`}
        fill={`url(#${id}-top)`}
      />
      {Array.from({ length: cols }).map((_, i) => (
        <ellipse
          key={`c${i}`}
          cx={left + i * cell + cell / 2}
          cy={151}
          rx={cell / 2 - 3}
          ry={6}
          fill="#8F6A45"
          opacity="0.55"
        />
      ))}

      {/* fileira da frente */}
      {Array.from({ length: cols }).map((_, i) => {
        const x = left + i * cell + (cell - 100 * frontScale) / 2;
        return (
          <g key={`f${i}`} transform={`translate(${x} ${112}) scale(${frontScale})`}>
            <EggShape tone={tone} seed={i} shadow={false} defs={`${id}-e`} />
          </g>
        );
      })}

      {/* face frontal */}
      <path
        d={`M${left - pad} 154 H${right + pad} V214 Q${right + pad} 226 ${right + pad - 12} 226 H${left - pad + 12} Q${left - pad} 226 ${left - pad} 214 Z`}
        fill={`url(#${id}-front)`}
      />
      <line
        x1={left - pad + 10}
        y1="168"
        x2={right + pad - 10}
        y2="168"
        stroke="#FFF3E0"
        strokeOpacity="0.35"
        strokeWidth="1.5"
      />
      <text
        x={cx}
        y="200"
        textAnchor="middle"
        fontFamily="var(--font-display), sans-serif"
        fontWeight="700"
        fontSize="12"
        letterSpacing="2"
        fill="#FFF3E0"
        opacity="0.8"
      >
        OVOS CAIPIRAS
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Bandeja de 30 ovos (polpa moldada), vista 3/4 de cima                */
/* ------------------------------------------------------------------ */
export function Tray({
  tone = "brown",
  quail = false,
  rows = 5,
  cols = 6,
  className,
  width = "100%",
}: SvgProps & { tone?: EggTone; quail?: boolean; rows?: number; cols?: number }) {
  const id = useId().replace(/:/g, "");
  const eggTone: EggTone = quail ? "quail" : tone;
  const scaleMin = quail ? 0.16 : 0.22;
  const scaleMax = quail ? 0.21 : 0.3;

  const compact = cols < 6;
  const backHalf = quail ? 88 : compact ? 92 : 104;
  const frontHalf = quail ? 118 : compact ? 120 : 138;
  const top = rows < 5 ? 78 : 44;
  const bottom = 186;

  return (
    <svg viewBox="0 0 320 240" width={width} className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-tray`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={PULP.light} />
          <stop offset="100%" stopColor={PULP.mid} />
        </linearGradient>
        <linearGradient id={`${id}-edge`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={PULP.mid} />
          <stop offset="100%" stopColor={PULP.deep} />
        </linearGradient>
      </defs>
      <EggDefs id={`${id}-e`} tone={eggTone} />
      {!quail && <EggDefs id={`${id}-c`} tone="cream" />}

      <Ground id={id} rx={frontHalf + 24} cy={224} />

      {/* corpo da bandeja */}
      <polygon
        points={`${160 - backHalf},${top} ${160 + backHalf},${top} ${160 + frontHalf},${bottom} ${160 - frontHalf},${bottom}`}
        fill={`url(#${id}-tray)`}
      />
      {/* borda frontal */}
      <path
        d={`M${160 - frontHalf} ${bottom} H${160 + frontHalf} V${bottom + 12} Q${160 + frontHalf} ${bottom + 20} ${160 + frontHalf - 8} ${bottom + 20} H${160 - frontHalf + 8} Q${160 - frontHalf} ${bottom + 20} ${160 - frontHalf} ${bottom + 12} Z`}
        fill={`url(#${id}-edge)`}
      />

      {/* cavidades + ovos, de trás para frente */}
      {Array.from({ length: rows }).map((_, r) => {
        const t = r / (rows - 1);
        const s = scaleMin + (scaleMax - scaleMin) * t;
        const half = backHalf + (frontHalf - backHalf) * t - 10;
        const y = top + 4 + (bottom - top - 34) * t;
        const step = (half * 2) / cols;
        return (
          <g key={r}>
            {Array.from({ length: cols }).map((_, c) => {
              const cxE = 160 - half + step * c + step / 2;
              return (
                <ellipse
                  key={`cup${c}`}
                  cx={cxE}
                  cy={y + 100 * s * 0.78}
                  rx={step / 2 - 1.5}
                  ry={step * 0.16}
                  fill={PULP.cup}
                  opacity="0.75"
                />
              );
            })}
            {Array.from({ length: cols }).map((_, c) => {
              const cxE = 160 - half + step * c + step / 2;
              const useCream = !quail && (r * 7 + c * 3) % 5 === 0;
              return (
                <g
                  key={`egg${c}`}
                  transform={`translate(${cxE - 50 * s} ${y - 10 * s}) scale(${s})`}
                >
                  <EggShape
                    tone={useCream ? "cream" : eggTone}
                    seed={r * 6 + c}
                    shadow={false}
                    defs={useCream ? `${id}-c` : `${id}-e`}
                  />
                </g>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Caixote de madeira com bandejas (Kit Família)                        */
/* ------------------------------------------------------------------ */
export function Crate({ className, width = "100%", label = "KIT FAMÍLIA · 60" }: SvgProps & { label?: string }) {
  const id = useId().replace(/:/g, "");
  const left = 40;
  const right = 280;
  const s = 0.3;

  return (
    <svg viewBox="0 0 320 240" width={width} className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-slat`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={WOOD.light} />
          <stop offset="60%" stopColor={WOOD.mid} />
          <stop offset="100%" stopColor={WOOD.deep} />
        </linearGradient>
        <linearGradient id={`${id}-post`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={WOOD.deep} />
          <stop offset="100%" stopColor={WOOD.mid} />
        </linearGradient>
        <linearGradient id={`${id}-inner`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6B4A2B" />
          <stop offset="100%" stopColor="#3F2A16" />
        </linearGradient>
      </defs>
      <EggDefs id={`${id}-e`} tone="brown" />
      <EggDefs id={`${id}-c`} tone="cream" />

      <Ground id={id} rx={150} cy={228} />

      {/* interior escuro */}
      <polygon points={`${left + 8},96 ${right - 8},96 ${right - 2},120 ${left + 2},120`} fill={`url(#${id}-inner)`} />

      {/* fileira de trás */}
      {Array.from({ length: 6 }).map((_, i) => {
        const x = left + 22 + i * 37;
        return (
          <g key={`b${i}`} transform={`translate(${x} ${72}) scale(${s * 0.9})`}>
            <EggShape tone={i % 3 === 1 ? "cream" : "brown"} seed={i + 4} shadow={false} defs={i % 3 === 1 ? `${id}-c` : `${id}-e`} />
          </g>
        );
      })}
      {/* fileira da frente */}
      {Array.from({ length: 6 }).map((_, i) => {
        const x = left + 26 + i * 37;
        return (
          <g key={`f${i}`} transform={`translate(${x} ${84}) scale(${s})`}>
            <EggShape tone={i % 4 === 2 ? "cream" : "brown"} seed={i} shadow={false} defs={i % 4 === 2 ? `${id}-c` : `${id}-e`} />
          </g>
        );
      })}

      {/* ripas frontais */}
      {[122, 158, 194].map((y, i) => (
        <g key={y}>
          <rect x={left} y={y} width={right - left} height="30" rx="3" fill={`url(#${id}-slat)`} />
          <path
            d={`M${left + 20} ${y + 10} q40 -4 80 2 t90 -2 M${left + 60} ${y + 22} q50 -3 100 1`}
            stroke={WOOD.grain}
            strokeOpacity="0.28"
            strokeWidth="1.2"
            fill="none"
          />
          {i === 1 && (
            <g transform={`translate(${160} ${y + 15}) rotate(-2)`}>
              <rect x="-56" y="-12" width="112" height="26" rx="6" fill="#2f6b3a" />
              <text
                x="0"
                y="6"
                textAnchor="middle"
                fontFamily="var(--font-display), sans-serif"
                fontWeight="700"
                fontSize="14"
                fill="#FFF8EE"
                letterSpacing="0.5"
              >
                {label}
              </text>
            </g>
          )}
        </g>
      ))}
      {/* postes laterais */}
      <rect x={left - 8} y={112} width="16" height="114" rx="3" fill={`url(#${id}-post)`} />
      <rect x={right - 8} y={112} width="16" height="114" rx="3" fill={`url(#${id}-post)`} />
      {/* pregos */}
      {[122, 158, 194].map((y) => (
        <g key={`n${y}`} fill="#5B3D22" opacity="0.7">
          <circle cx={left} cy={y + 15} r="2" />
          <circle cx={right} cy={y + 15} r="2" />
        </g>
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Trio de ovos na palha — para banners                                 */
/* ------------------------------------------------------------------ */
export function EggCluster({ className, width = "100%" }: SvgProps) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 320 240" width={width} className={className} aria-hidden="true">
      <EggDefs id={`${id}-b`} tone="brown" />
      <EggDefs id={`${id}-c`} tone="cream" />
      <EggDefs id={`${id}-d`} tone="dark" />
      <Ground id={id} rx={130} cy={214} />
      {/* palha */}
      <g stroke="#E2B95A" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.9">
        <path d="M40 200 q60 -30 120 -8" />
        <path d="M60 214 q70 -40 150 -14" stroke="#D2A542" />
        <path d="M120 212 q60 -34 140 -6" />
        <path d="M30 186 q50 -10 90 6" stroke="#F0CB6E" />
        <path d="M180 206 q40 -30 100 -20" stroke="#C99934" />
        <path d="M90 222 q80 -20 170 -2" stroke="#F0CB6E" />
      </g>
      <g transform="translate(58 66) scale(0.92) rotate(-14 50 65)">
        <EggShape tone="cream" seed={2} defs={`${id}-c`} />
      </g>
      <g transform="translate(168 58) scale(0.98) rotate(12 50 65)">
        <EggShape tone="dark" seed={1} defs={`${id}-d`} />
      </g>
      <g transform="translate(110 84) scale(1.02)">
        <EggShape tone="brown" seed={0} defs={`${id}-b`} />
      </g>
      <g stroke="#E2B95A" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.9">
        <path d="M70 216 q50 -14 100 4" stroke="#D2A542" />
        <path d="M150 218 q60 -12 110 0" />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Mapeamento produto → cena                                            */
/* ------------------------------------------------------------------ */
export function ProductVisualScene({ visual, className, width }: SvgProps & { visual: ProductVisual }) {
  switch (visual) {
    case "half-dozen":
      return <Carton count={6} className={className} width={width} />;
    case "dozen":
      return <Carton count={12} className={className} width={width} />;
    case "fifteen":
      return <Tray rows={3} cols={5} className={className} width={width} />;
    case "tray":
      return <Tray className={className} width={width} />;
    case "family":
      return <Crate className={className} width={width} />;
    case "wholesale":
      return <Crate label="ATACADO · 300" className={className} width={width} />;
    default:
      return <EggCluster className={className} width={width} />;
  }
}
