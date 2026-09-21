"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import {
  BadgeCheck,
  ChevronRight,
  Download,
  LogOut,
  MapPin,
  MessageCircle,
  ReceiptText,
  RotateCcw,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { BRAND } from "@/lib/catalog";
import { DEMO_ADDRESS, useStore } from "@/lib/store";
import { firstName } from "@/lib/format";
import { TopBar } from "@/components/app/Shell";
import { Chip, Skeleton } from "@/components/ui/Primitives";
import { LogoMark } from "@/components/illustrations/Logo";
import { useToast } from "@/components/ui/Toast";

type InstallPromptEvent = Event & { prompt: () => Promise<void> };

export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const hydrated = useStore((s) => s.hydrated);
  const user = useStore((s) => s.user);
  const orders = useStore((s) => s.orders);
  const draft = useStore((s) => s.draft);
  const setUser = useStore((s) => s.setUser);
  const resetDemo = useStore((s) => s.resetDemo);
  const [installEvt, setInstallEvt] = useState<InstallPromptEvent | null>(null);
  const standalone = useSyncExternalStore(
    () => () => {},
    () => window.matchMedia("(display-mode: standalone)").matches,
    () => false,
  );

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setInstallEvt(e as InstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  const address = draft.address.street ? draft.address : DEMO_ADDRESS;

  const install = async () => {
    if (installEvt) {
      await installEvt.prompt();
      setInstallEvt(null);
      return;
    }
    toast({
      kind: "info",
      title: "Instalar o app",
      description: "No navegador, use “Adicionar à tela inicial”.",
    });
  };

  const signOut = () => {
    setUser(null);
    router.replace("/bem-vindo");
  };

  const reset = () => {
    resetDemo();
    toast({ kind: "success", title: "Demonstração reiniciada" });
    router.replace("/");
  };

  return (
    <main className="flex flex-1 flex-col pb-8">
      <TopBar title="Perfil" back={false} />

      {/* cartão do usuário */}
      <section className="mx-5 flex items-center gap-4 rounded-[22px] border border-line bg-surface p-4 shadow-card">
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gold font-display text-[26px] font-semibold text-leaf-ink">
          {hydrated ? (user ? firstName(user.name).charAt(0) : <UserRound size={26} />) : ""}
        </span>
        <div className="min-w-0 flex-1">
          {hydrated ? (
            <>
              <h2 className="truncate font-display text-[20px] font-semibold text-ink">{user?.name ?? "Visitante"}</h2>
              <p className="truncate text-[13.5px] text-ink-2">{user?.phone ?? "Explore sem compromisso"}</p>
              <div className="mt-1.5">
                <Chip tone={user?.mode === "account" ? "leaf" : "gold"}>
                  {user?.mode === "account" ? (
                    <>
                      <BadgeCheck size={12} strokeWidth={2.5} /> Conta verificada
                    </>
                  ) : (
                    "Modo demonstração"
                  )}
                </Chip>
              </div>
            </>
          ) : (
            <>
              <Skeleton className="h-6 w-40" />
              <Skeleton className="mt-2 h-4 w-28" />
            </>
          )}
        </div>
      </section>

      {/* endereço */}
      <section className="mx-5 mt-4 flex items-start gap-3 rounded-[20px] border border-line bg-surface p-4 shadow-card">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-leaf-soft text-leaf">
          <MapPin size={18} strokeWidth={2.2} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[12.5px] font-bold uppercase tracking-[0.1em] text-ink-3">Endereço de entrega</p>
          <p className="mt-0.5 text-[14.5px] font-semibold text-ink">
            {address.street}, {address.number}
            {address.complement ? ` · ${address.complement}` : ""}
          </p>
          <p className="text-[13px] text-ink-2">
            {address.district} · {address.city}
          </p>
        </div>
      </section>

      {/* lista */}
      <ul className="mx-5 mt-4 overflow-hidden rounded-[20px] border border-line bg-surface shadow-card">
        <Item icon={<ReceiptText size={18} />} label="Meus pedidos" sub={`${orders.length} ${orders.length === 1 ? "pedido" : "pedidos"}`} onClick={() => router.push("/pedidos")} />
        <Item icon={<MessageCircle size={18} />} label="Falar no WhatsApp" sub={BRAND.whatsapp} href={BRAND.whatsappLink} />
        <Item icon={<InstagramIcon />} label="Seguir no Instagram" sub={BRAND.instagram} href="https://instagram.com/granja.canaa._" />
        {!standalone && <Item icon={<Download size={18} />} label="Instalar o app" sub="Acesso rápido na tela inicial" onClick={install} />}
      </ul>

      {/* sobre */}
      <section className="mx-5 mt-4 flex items-center gap-4 rounded-[22px] bg-leaf p-4 text-cream">
        <LogoMark size={56} />
        <div className="min-w-0 flex-1">
          <p className="font-display text-[17px] font-semibold text-gold">Granja Canaã</p>
          <p className="text-[13px] leading-snug text-cream/85">
            {BRAND.city} – {BRAND.state}. Ovos de galinha caipira com inspeção {BRAND.sim}.
          </p>
        </div>
        <ShieldCheck size={22} className="shrink-0 text-gold" />
      </section>

      <div className="mx-5 mt-6 flex flex-col gap-2">
        {user?.mode === "account" && (
          <button
            type="button"
            onClick={signOut}
            className="pressable inline-flex h-12 items-center justify-center gap-2 rounded-[14px] border border-line-strong bg-surface text-[15px] font-semibold text-ink-2"
          >
            <LogOut size={17} /> Sair
          </button>
        )}
        <button
          type="button"
          onClick={reset}
          className="pressable inline-flex h-11 items-center justify-center gap-2 text-[13.5px] font-semibold text-ink-3"
        >
          <RotateCcw size={15} /> Reiniciar demonstração
        </button>
      </div>

      <p className="mt-6 text-center text-[12px] text-ink-3">Versão de apresentação · v0.1</p>
    </main>
  );
}

function Item({
  icon,
  label,
  sub,
  href,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  sub?: string;
  href?: string;
  onClick?: () => void;
}) {
  const inner = (
    <>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-2 text-ink-2">{icon}</span>
      <span className="min-w-0 flex-1 text-left">
        <span className="block text-[15px] font-semibold text-ink">{label}</span>
        {sub && <span className="block truncate text-[12.5px] text-ink-3">{sub}</span>}
      </span>
      <ChevronRight size={18} className="shrink-0 text-ink-3" />
    </>
  );
  const cls = "pressable flex w-full items-center gap-3 border-b border-line px-4 py-3 last:border-b-0 hover:bg-surface-2/60";
  return (
    <li>
      {href ? (
        <a href={href} target="_blank" rel="noreferrer" className={cls}>
          {inner}
        </a>
      ) : (
        <button type="button" onClick={onClick} className={cls}>
          {inner}
        </button>
      )}
    </li>
  );
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}
