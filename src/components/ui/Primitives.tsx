"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { moneyParts } from "@/lib/format";

/* ------------------------------------------------------------------ */
/* Placa de preço pintada à mão                                         */
/* ------------------------------------------------------------------ */
export function PriceSign({
  value,
  size = "md",
  swing = false,
  className = "",
}: {
  value: number;
  size?: "sm" | "md" | "lg";
  swing?: boolean;
  className?: string;
}) {
  const { int, cents } = moneyParts(value);
  const fs = size === "lg" ? 30 : size === "md" ? 20 : 16;
  const Tag = swing ? motion.span : "span";
  const motionProps = swing
    ? {
        initial: { rotate: -9, opacity: 0, y: -4 },
        animate: { rotate: -2.5, opacity: 1, y: 0 },
        transition: { type: "spring" as const, stiffness: 260, damping: 12, delay: 0.15 },
        style: { transformOrigin: "8px 8px" },
      }
    : {};
  return (
    <Tag className={`sign-tag tabular ${className}`} {...motionProps}>
      <span style={{ fontSize: Math.max(11, fs * 0.55), marginRight: 2, color: "var(--gold)" }}>R$</span>
      <span style={{ fontSize: fs }}>{int}</span>
      <span style={{ fontSize: fs * 0.62, opacity: 0.9 }}>,{cents}</span>
    </Tag>
  );
}

/** Preço em texto corrido (sem placa), para totais e linhas. */
export function Price({
  value,
  className = "",
  size = 16,
  strike = false,
}: {
  value: number;
  className?: string;
  size?: number;
  strike?: boolean;
}) {
  const { int, cents } = moneyParts(value);
  return (
    <span
      className={`tabular inline-flex items-baseline font-display font-bold tracking-[-0.01em] ${
        strike ? "text-ink-3 line-through decoration-ink-3/70" : ""
      } ${className}`}
      style={{ fontSize: size }}
    >
      <span style={{ fontSize: size * 0.7, marginRight: 2 }}>R$</span>
      {int}
      <span style={{ fontSize: size * 0.8 }}>,{cents}</span>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Controle de quantidade                                               */
/* ------------------------------------------------------------------ */
export function QtyStepper({
  value,
  onChange,
  min = 0,
  max = 20,
  size = "md",
  allowRemove = false,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  allowRemove?: boolean;
}) {
  const h = size === "lg" ? 52 : size === "md" ? 48 : 44;
  const isMin = value <= min;
  return (
    <div
      className="inline-flex items-center rounded-full border border-line-strong bg-surface p-0.5 shadow-card"
      style={{ height: h }}
    >
      <button
        type="button"
        aria-label={allowRemove && value === 1 ? "Remover" : "Diminuir"}
        disabled={isMin && !allowRemove}
        onClick={() => onChange(value - 1)}
        className="pressable flex aspect-square h-full items-center justify-center rounded-full text-ink-2 hover:bg-surface-2 disabled:opacity-30"
      >
        {allowRemove && value === 1 ? <Trash2 size={h * 0.4} /> : <Minus size={h * 0.42} strokeWidth={2.5} />}
      </button>
      <motion.span
        key={value}
        initial={{ scale: 0.7, opacity: 0.4 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 22 }}
        className="tabular min-w-[2ch] px-1 text-center font-display font-bold text-ink"
        style={{ fontSize: h * 0.42 }}
      >
        {value}
      </motion.span>
      <button
        type="button"
        aria-label="Aumentar"
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
        className="pressable flex aspect-square h-full items-center justify-center rounded-full bg-leaf text-cream hover:bg-leaf-deep disabled:opacity-30"
      >
        <Plus size={h * 0.42} strokeWidth={2.75} />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Etiquetas                                                            */
/* ------------------------------------------------------------------ */
export function Chip({
  children,
  tone = "neutral",
  className = "",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "gold" | "leaf" | "egg" | "danger";
  className?: string;
}) {
  const t = {
    neutral: "bg-surface-2 text-ink-2",
    gold: "bg-gold-soft text-gold-ink",
    leaf: "bg-leaf-soft text-leaf-deep",
    egg: "bg-egg-soft text-[#7a4b22]",
    danger: "bg-danger-soft text-danger",
  }[tone];
  return (
    <span
      className={`inline-flex h-6 items-center gap-1 rounded-full px-2.5 text-[12px] font-bold tracking-[0.01em] ${t} ${className}`}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Esqueletos                                                           */
/* ------------------------------------------------------------------ */
export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`skeleton ${className}`} aria-hidden="true" />;
}

/* ------------------------------------------------------------------ */
/* Cabeçalho de seção                                                   */
/* ------------------------------------------------------------------ */
export function SectionTitle({
  children,
  action,
  className = "",
}: {
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-end justify-between px-5 ${className}`}>
      <h2 className="font-display text-[20px] font-bold tracking-[-0.02em] text-ink">{children}</h2>
      {action}
    </div>
  );
}
