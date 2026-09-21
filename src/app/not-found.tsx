import Link from "next/link";
import { Egg } from "@/components/illustrations/Egg";

export default function NotFound() {
  return (
    <main className="app-frame flex min-h-dvh flex-col items-center justify-center px-8 text-center">
      <Egg width={96} tone="cream" />
      <h1 className="mt-6 font-display text-[26px] font-semibold text-ink">Essa página não chocou</h1>
      <p className="mt-2 max-w-[28ch] text-[15px] text-ink-2">
        O endereço não existe ou mudou de lugar. Vamos voltar para o catálogo?
      </p>
      <Link
        href="/inicio"
        className="pressable mt-7 inline-flex h-14 items-center justify-center rounded-[18px] bg-gold px-8 text-[17px] font-semibold text-leaf-ink shadow-gold"
      >
        Ir para o início
      </Link>
    </main>
  );
}
