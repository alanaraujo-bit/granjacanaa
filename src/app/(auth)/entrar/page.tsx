"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LockKeyhole, Phone, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { TopBar } from "@/components/app/Shell";
import { Logo } from "@/components/illustrations/Logo";
import { Egg } from "@/components/illustrations/Egg";
import { DEMO_USER, useStore } from "@/lib/store";
import { maskPhone } from "@/lib/format";
import { useToast } from "@/components/ui/Toast";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const setUser = useStore((s) => s.setUser);
  const completeOnboarding = useStore((s) => s.completeOnboarding);

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ phone?: string; password?: string }>({});

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: typeof errors = {};
    if (phone.replace(/\D/g, "").length < 10) errs.phone = "Digite um celular com DDD.";
    if (password.length < 6) errs.password = "A senha tem pelo menos 6 caracteres.";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    window.setTimeout(() => {
      setUser({ ...DEMO_USER, phone, mode: "account" });
      completeOnboarding();
      toast({ kind: "success", title: "Bem-vinda de volta, Mariana!" });
      router.replace("/inicio");
    }, 900);
  };

  const explore = () => {
    setUser(DEMO_USER);
    completeOnboarding();
    router.replace("/inicio");
  };

  return (
    <main className="flex min-h-dvh flex-col">
      <TopBar back backHref="/bem-vindo" transparent />
      <div className="flex flex-1 flex-col px-5 pb-8">
        <div className="mt-1 flex items-center justify-between">
          <div>
            <h1 className="font-display text-[30px] font-bold leading-[1.05] tracking-[-0.03em] text-ink">
              Que bom te ver
              <br />
              de novo
            </h1>
            <p className="mt-2 text-[15px] text-ink-2">Entre para repetir seu pedido em segundos.</p>
          </div>
          <Egg width={78} tone="brown" className="-mr-1 shrink-0" />
        </div>

        <form onSubmit={submit} className="mt-8 flex flex-col gap-4" noValidate>
          <Field
            label="Celular"
            placeholder="(94) 99999-9999"
            inputMode="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(maskPhone(e.target.value))}
            error={errors.phone}
            icon={<Phone size={18} />}
          />
          <Field
            label="Senha"
            placeholder="Sua senha"
            type={show ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            icon={<LockKeyhole size={18} />}
            suffix={
              <button
                type="button"
                aria-label={show ? "Ocultar senha" : "Mostrar senha"}
                onClick={() => setShow((v) => !v)}
                className="pressable -mr-1 flex h-9 w-9 items-center justify-center rounded-full text-ink-3 hover:bg-surface-2"
              >
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
          />
          <div className="-mt-1 text-right">
            <button
              type="button"
              className="text-[13.5px] font-semibold text-ink-2 underline-offset-4 hover:underline"
              onClick={() => toast({ kind: "info", title: "Enviamos um link de recuperação", description: "Confira seu WhatsApp." })}
            >
              Esqueci minha senha
            </button>
          </div>
          <Button type="submit" loading={loading} full className="mt-2">
            Entrar
          </Button>
        </form>

        <div className="my-6 flex items-center gap-3 text-[12.5px] font-bold uppercase tracking-[0.12em] text-ink-3">
          <span className="h-px flex-1 bg-line-strong" />
          ou
          <span className="h-px flex-1 bg-line-strong" />
        </div>

        <Button variant="secondary" onClick={explore} icon={<Sparkles size={18} />} full>
          Explorar sem login
        </Button>

        <p className="mt-auto pt-8 text-center text-[14px] text-ink-2">
          Ainda não tem conta?{" "}
          <Link href="/cadastro" className="font-bold text-gold-ink underline-offset-4 hover:underline">
            Criar conta
          </Link>
        </p>

        <div className="mt-6 flex items-center justify-center opacity-60">
          <Logo size={26} />
        </div>
      </div>
    </main>
  );
}
