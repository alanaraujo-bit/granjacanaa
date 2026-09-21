"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { LogoMark, Wordmark } from "@/components/illustrations/Logo";
import { useStore } from "@/lib/store";

export default function SplashPage() {
  const router = useRouter();
  const hydrated = useStore((s) => s.hydrated);
  const user = useStore((s) => s.user);
  const onboardingDone = useStore((s) => s.onboardingDone);

  useEffect(() => {
    if (!hydrated) return;
    const target = user && onboardingDone ? "/inicio" : "/bem-vindo";
    router.prefetch(target);
    const t = window.setTimeout(() => router.replace(target), 1700);
    return () => window.clearTimeout(t);
  }, [hydrated, user, onboardingDone, router]);

  return (
    <main className="app-frame relative flex min-h-dvh flex-col items-center justify-center overflow-hidden text-cream" style={{ background: "var(--leaf)" }}>
      {/* luz da manhã */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 40% at 50% 38%, rgba(242,193,78,0.22) 0%, rgba(30,77,44,0) 70%)",
        }}
      />
      {/* toldo no rodapé */}
      <div aria-hidden className="awning awning-edge absolute inset-x-0 bottom-0 h-16" />
      <div aria-hidden className="absolute inset-x-0 bottom-16 h-2 bg-cream/80" />

      <motion.div
        initial={{ scale: 0.7, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 18 }}
        className="relative"
      >
        <LogoMark size={148} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mt-6 flex flex-col items-center gap-2"
      >
        <Wordmark size={34} tone="gold" />
        <p className="text-[15px] font-medium text-cream/85">Sabor e qualidade direto da roça</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="absolute bottom-28 flex gap-1.5"
        aria-label="Carregando"
      >
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-2 w-2 rounded-full bg-cream"
            animate={{ opacity: [0.35, 1, 0.35], y: [0, -3, 0] }}
            transition={{ repeat: Infinity, duration: 1.1, delay: i * 0.15 }}
          />
        ))}
      </motion.div>
    </main>
  );
}
