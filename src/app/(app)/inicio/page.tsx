"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Leaf, MapPin, Sunrise, Truck } from "lucide-react";
import { CATEGORIES, PRODUCTS, type Category } from "@/lib/catalog";
import { useStore } from "@/lib/store";
import { firstName, greeting } from "@/lib/format";
import { ProductCard, ProductRowCard } from "@/components/app/ProductCard";
import { EggCluster } from "@/components/illustrations/Scenes";
import { LogoMark } from "@/components/illustrations/Logo";
import { SectionTitle, Skeleton } from "@/components/ui/Primitives";

const TRUST = [
  { Icon: Leaf, title: "Galinhas soltas", text: "criadas no pasto" },
  { Icon: Sunrise, title: "Colheita do dia", text: "embalados hoje" },
  { Icon: Truck, title: "Hora marcada", text: "você escolhe" },
];

export default function HomePage() {
  const hydrated = useStore((s) => s.hydrated);
  const user = useStore((s) => s.user);
  const [category, setCategory] = useState<Category | "todos">("todos");

  const list = useMemo(
    () => (category === "todos" ? PRODUCTS : PRODUCTS.filter((p) => p.category === category)),
    [category],
  );
  const popular = PRODUCTS.filter((p) => p.badge);

  return (
    <main className="flex flex-col pb-24">
      {/* toldo da banca */}
      <div className="awning awning-edge h-[calc(40px+var(--safe-top))] w-full" />

      {/* saudação */}
      <header className="flex items-center justify-between gap-3 px-5 pt-3">
        <Link href="/perfil" className="pressable flex min-w-0 items-center gap-3" aria-label="Seu perfil">
          <LogoMark size={46} />
          <div className="min-w-0">
            {hydrated ? (
              <>
                <p className="text-[13.5px] font-semibold leading-tight text-ink-2">{greeting()},</p>
                <h1 className="truncate font-display text-[24px] font-bold leading-[1.05] tracking-[-0.01em] text-ink">
                  {user ? firstName(user.name) : "visitante"}
                </h1>
              </>
            ) : (
              <>
                <Skeleton className="h-4 w-20" />
                <Skeleton className="mt-2 h-6 w-32" />
              </>
            )}
          </div>
        </Link>
        <Link
          href="/perfil"
          className="pressable flex h-11 shrink-0 items-center gap-1.5 rounded-full border border-line bg-surface pl-3 pr-3.5 shadow-card"
          aria-label="Endereço de entrega"
        >
          <MapPin size={15} className="text-leaf" />
          <span className="text-[13px] font-semibold text-ink-2">Novo Horizonte</span>
        </Link>
      </header>

      {/* banner herói */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="relative mx-5 mt-5 overflow-hidden rounded-[26px] bg-leaf text-cream shadow-float"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(80% 70% at 100% 100%, rgba(242,193,78,0.28) 0%, rgba(43,106,63,0) 60%)",
          }}
        />
        <div className="relative flex items-stretch">
          <div className="flex flex-1 flex-col justify-between py-5 pl-5">
            <div>
              <p className="text-[12.5px] font-bold uppercase tracking-[0.12em] text-cream/80">
                Colhidos hoje
              </p>
              <h2 className="mt-1 font-display text-[26px] font-bold leading-[1.05] tracking-[-0.01em] text-gold">
                Da granja
                <br />
                pra sua mesa
              </h2>
              <p className="mt-2 max-w-[20ch] text-[13.5px] leading-snug text-cream/90">
                Entrega hoje até 19h em Canaã dos Carajás.
              </p>
            </div>
            <Link
              href="/produto/caixa-12"
              className="pressable mt-4 inline-flex h-10 w-fit items-center gap-1.5 rounded-full bg-gold pl-4 pr-3 text-[14px] font-bold text-leaf-ink"
            >
              Ver a caixa de 12
              <ArrowRight size={16} strokeWidth={2.5} />
            </Link>
          </div>
          <div className="relative w-[46%] shrink-0">
            <div className="absolute -bottom-3 -right-4 w-[118%]">
              <EggCluster />
            </div>
          </div>
        </div>
      </motion.section>

      {/* confiança */}
      <ul className="mx-5 mt-4 grid grid-cols-3 gap-2">
        {TRUST.map(({ Icon, title, text }) => (
          <li key={title} className="flex flex-col items-center rounded-2xl border border-line bg-surface px-2 py-3 text-center shadow-card">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-leaf-soft text-leaf">
              <Icon size={18} strokeWidth={2.2} />
            </span>
            <p className="mt-2 text-[12.5px] font-bold leading-tight text-ink">{title}</p>
            <p className="text-[11.5px] leading-tight text-ink-3">{text}</p>
          </li>
        ))}
      </ul>

      {/* mais pedidos */}
      <SectionTitle className="mt-8">Mais pedidos</SectionTitle>
      <div className="mt-3 flex gap-3 overflow-x-auto px-5 pb-1" style={{ scrollbarWidth: "none" }}>
        {popular.map((p) => (
          <ProductRowCard key={p.id} product={p} />
        ))}
      </div>

      {/* catálogo */}
      <SectionTitle className="mt-8">Nosso catálogo</SectionTitle>
      <div className="mt-3 flex gap-2 overflow-x-auto px-5 pb-1" style={{ scrollbarWidth: "none" }} role="tablist">
        {CATEGORIES.map((c) => {
          const active = category === c.id;
          return (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setCategory(c.id)}
              className={`pressable h-9 shrink-0 rounded-full border px-4 text-[14px] font-semibold transition-colors ${
                active
                  ? "border-leaf bg-leaf text-cream"
                  : "border-line-strong bg-surface text-ink-2 hover:bg-surface-2"
              }`}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      {hydrated ? (
        <div key={category} className="mt-4 grid grid-cols-2 gap-3 px-5">
          {list.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-3 px-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-[22px] border border-line bg-surface">
              <Skeleton className="aspect-[4/3] rounded-none" />
              <div className="p-3.5">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="mt-2 h-3 w-1/2" />
                <Skeleton className="mt-4 h-8 w-20" />
              </div>
            </div>
          ))}
        </div>
      )}

      <footer className="mt-10 flex flex-col items-center gap-2 px-5 text-center">
        <LogoMark size={26} />
        <p className="text-[12.5px] leading-snug text-ink-3">
          Granja Canaã · Canaã dos Carajás, PA · S.I.M. 027
          <br />
          Feito com carinho, do galinheiro até você.
        </p>
      </footer>
    </main>
  );
}
