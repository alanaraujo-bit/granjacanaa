"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/illustrations/Logo";
import { Carton, EggCluster, Tray } from "@/components/illustrations/Scenes";
import { DEMO_USER, useStore } from "@/lib/store";

const SLIDES = [
  {
    title: "Ovos caipiras de verdade",
    text: "Galinhas soltas no pasto, ovos colhidos de manhã e embalados no mesmo dia.",
    art: <EggCluster />,
  },
  {
    title: "Peça em poucos toques",
    text: "Escolha a dúzia ou a bandeja, ajuste a quantidade e confirme. Sem complicação.",
    art: <Carton count={12} />,
  },
  {
    title: "Acompanhe até a sua porta",
    text: "Você vê cada etapa: recebido, em preparo, saiu para entrega e entregue.",
    art: <Tray />,
  },
];

export default function WelcomePage() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const scroller = useRef<HTMLDivElement>(null);
  const setUser = useStore((s) => s.setUser);
  const completeOnboarding = useStore((s) => s.completeOnboarding);

  const onScroll = () => {
    const el = scroller.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (i !== index) setIndex(i);
  };

  const goTo = (i: number) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };

  const explore = () => {
    setUser(DEMO_USER);
    completeOnboarding();
    router.push("/inicio");
  };

  return (
    <main className="flex min-h-dvh flex-col" style={{ paddingTop: "var(--safe-top)" }}>
      <div className="flex items-center justify-between px-5 pt-5">
        <Logo size={36} />
        <button
          type="button"
          onClick={explore}
          className="pressable rounded-full px-3 py-1.5 text-[14px] font-semibold text-ink-2 hover:bg-surface-2"
        >
          Pular
        </button>
      </div>

      {/* slides */}
      <div
        ref={scroller}
        onScroll={onScroll}
        className="mt-2 flex flex-1 snap-x snap-mandatory overflow-x-auto overscroll-x-contain"
        style={{ scrollbarWidth: "none" }}
      >
        {SLIDES.map((s, i) => (
          <section key={i} className="flex w-full shrink-0 snap-center flex-col px-5">
            <div
              className="relative mx-auto mt-2 w-full max-w-[360px] overflow-hidden rounded-[28px]"
              style={{
                background:
                  "radial-gradient(110% 85% at 50% 100%, #ecdfc8 0%, #f6f1e4 55%, #fbf7ee 100%)",
              }}
            >
              <div className="awning awning-edge absolute inset-x-0 top-0 h-7" />
              <div className="px-4 pb-2 pt-10">{s.art}</div>
            </div>
            <motion.div
              initial={false}
              animate={{ opacity: index === i ? 1 : 0.35, y: index === i ? 0 : 6 }}
              transition={{ duration: 0.3 }}
              className="mt-7 text-center"
            >
              <h1 className="font-display text-[28px] font-bold leading-[1.08] tracking-[-0.03em] text-ink">
                {s.title}
              </h1>
              <p className="mx-auto mt-3 max-w-[30ch] text-[16px] leading-relaxed text-ink-2">{s.text}</p>
            </motion.div>
          </section>
        ))}
      </div>

      {/* pontos */}
      <div className="mt-2 flex items-center justify-center gap-2" role="tablist" aria-label="Slides">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={index === i}
            aria-label={`Slide ${i + 1}`}
            onClick={() => goTo(i)}
            className="h-2 rounded-full transition-all duration-300"
            style={{
              width: index === i ? 24 : 8,
              background: index === i ? "var(--leaf)" : "var(--line-strong)",
            }}
          />
        ))}
      </div>

      {/* ações */}
      <div className="flex flex-col gap-3 px-5 pb-6 pt-6" style={{ paddingBottom: "calc(24px + var(--safe-bottom))" }}>
        <Button onClick={explore} icon={<Sparkles size={20} />} full>
          Explorar o app
        </Button>
        <Button href="/entrar" variant="outline" full iconRight={<ArrowRight size={18} />}>
          Já tenho conta
        </Button>
        <p className="text-center text-[14px] text-ink-2">
          Primeira vez por aqui?{" "}
          <a href="/cadastro" className="font-bold text-gold-ink underline-offset-4 hover:underline">
            Criar conta
          </a>
        </p>
      </div>
    </main>
  );
}
