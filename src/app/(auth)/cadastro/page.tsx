"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AtSign, LockKeyhole, Phone, Sparkles, UserRound } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { TopBar } from "@/components/app/Shell";
import { Egg } from "@/components/illustrations/Egg";
import { DEMO_USER, useStore } from "@/lib/store";
import { firstName, maskPhone } from "@/lib/format";
import { useToast } from "@/components/ui/Toast";


/** Leva o foco ao primeiro campo inválido após a validação. */
function focusFirstInvalid() {
  window.setTimeout(() => {
    const el = document.querySelector<HTMLElement>('[aria-invalid="true"]');
    el?.focus();
    el?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, 0);
}

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const setUser = useStore((s) => s.setUser);
  const completeOnboarding = useStore((s) => s.completeOnboarding);

  const [form, setForm] = useState({ name: "", phone: "", email: "", password: "" });
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: k === "phone" ? maskPhone(e.target.value) : e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Partial<typeof form> = {};
    if (form.name.trim().split(" ").length < 2) errs.name = "Digite seu nome e sobrenome.";
    if (form.phone.replace(/\D/g, "").length < 10) errs.phone = "Digite um celular com DDD.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Digite um e-mail válido.";
    if (form.password.length < 6) errs.password = "Use pelo menos 6 caracteres.";
    setErrors(errs);
    if (Object.keys(errs).length) {
      focusFirstInvalid();
      return;
    }

    setLoading(true);
    window.setTimeout(() => {
      setUser({ name: form.name.trim(), phone: form.phone, email: form.email, mode: "account" });
      completeOnboarding();
      toast({ kind: "success", title: `Conta criada, ${firstName(form.name)}!`, description: "Seu primeiro pedido está a poucos toques." });
      router.replace("/inicio");
    }, 1000);
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
              Criar sua conta
            </h1>
            <p className="mt-2 max-w-[28ch] text-[15px] text-ink-2">
              Leva menos de um minuto. Seus dados ficam salvos para os próximos pedidos.
            </p>
          </div>
          <Egg width={72} tone="cream" className="-mr-1 shrink-0" />
        </div>

        <form onSubmit={submit} className="mt-7 flex flex-col gap-4" noValidate>
          <Field label="Nome completo" placeholder="Como devemos te chamar?" autoComplete="name" value={form.name} onChange={set("name")} error={errors.name} icon={<UserRound size={18} />} />
          <Field label="Celular" placeholder="(94) 99999-9999" inputMode="tel" autoComplete="tel" value={form.phone} onChange={set("phone")} error={errors.phone} icon={<Phone size={18} />} />
          <Field label="E-mail" placeholder="voce@email.com" type="email" inputMode="email" autoComplete="email" value={form.email} onChange={set("email")} error={errors.email} icon={<AtSign size={18} />} />
          <Field label="Senha" placeholder="Crie uma senha" type="password" autoComplete="new-password" value={form.password} onChange={set("password")} error={errors.password} icon={<LockKeyhole size={18} />} hint="Pelo menos 6 caracteres." />
          <Button type="submit" loading={loading} full className="mt-2">
            Criar conta
          </Button>
        </form>

        <p className="mt-4 text-center text-[12.5px] leading-snug text-ink-3">
          Ao continuar, você concorda com os Termos de uso e a Política de privacidade.
        </p>

        <div className="my-5 flex items-center gap-3 text-[12.5px] font-bold uppercase tracking-[0.12em] text-ink-3">
          <span className="h-px flex-1 bg-line-strong" />
          ou
          <span className="h-px flex-1 bg-line-strong" />
        </div>

        <Button variant="secondary" onClick={explore} icon={<Sparkles size={18} />} full>
          Explorar sem login
        </Button>

        <p className="mt-auto pt-8 text-center text-[14px] text-ink-2">
          Já tem conta?{" "}
          <Link href="/entrar" className="font-bold text-gold-ink underline-offset-4 hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </main>
  );
}
