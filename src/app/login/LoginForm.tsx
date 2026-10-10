"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Eye, EyeOff, LockKeyhole } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { GridField } from "@/components/experience/GridField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { supabaseBrowser } from "@/lib/control/browser";
import { SITE_URL } from "@/config/site";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Real sign-in with Supabase Auth when it is configured. Accounts are created by
 * an administrator in Supabase (no public sign-up). Without Supabase, the page
 * explains that the Control runs in demonstration mode instead of faking a login.
 */
export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next")?.startsWith("/control") ? params.get("next")! : "/control";
  const supabase = supabaseBrowser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [recovery, setRecovery] = useState(false);
  const [recoveryState, setRecoveryState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});
  const [entering, setEntering] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const nextErrors = {
      email: !email.trim() ? "Informe seu e-mail." : !EMAIL.test(email.trim()) ? "Informe um e-mail válido." : undefined,
      password: !password ? "Informe sua senha." : undefined,
    };
    setErrors(nextErrors);
    if (nextErrors.email || nextErrors.password || !supabase) return;
    setEntering(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) {
      setEntering(false);
      setErrors({ form: error.status === 400 ? "E-mail ou senha incorretos." : "Não foi possível entrar agora. Tente novamente." });
      return;
    }
    router.replace(next);
    router.refresh();
  };

  const recover = async () => {
    if (!supabase || !EMAIL.test(email.trim())) return setErrors({ email: "Informe seu e-mail acima para receber o link." });
    setRecoveryState("sending");
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/login` });
    setRecoveryState(error ? "error" : "sent");
  };

  return (
    <main className="relative isolate flex min-h-svh flex-col overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-50"><GridField /></div>
      <header className="flex items-center justify-between border-b border-border px-6 py-6 md:px-12">
        <a href={SITE_URL} aria-label="Voltar ao site da V3X"><Logo className="w-[96px]" /></a>
        <Button render={<a href={SITE_URL} />} nativeButton={false} variant="ghost" className="text-muted-foreground"><ArrowLeft /> Site</Button>
      </header>
      <div className="mx-auto grid w-full max-w-[1400px] flex-1 items-center gap-8 px-6 py-9 md:grid-cols-2 md:gap-20 md:px-12 md:py-24">
        <section className="login-enter self-center">
          <span className="label-mono">V3X / WORKSPACE INTERNO</span>
          <h1 className="mt-4 text-5xl font-medium leading-none md:mt-6 md:text-7xl xl:text-8xl">Control<span className="text-brand-violet">.</span></h1>
          <p className="mt-4 max-w-sm text-base leading-relaxed text-muted-foreground md:mt-6 md:text-xl">O centro de operações da V3X: projetos, tarefas, conteúdo e atendimento.</p>
        </section>
        <section className="login-enter w-full max-w-md md:justify-self-end">
          <div className="mb-5 flex items-center gap-3 md:mb-8"><LockKeyhole className="size-4 text-muted-foreground" /><span className="label-mono">ACESSO AO WORKSPACE</span></div>
          {supabase ? (
            <>
              <h2 className="text-2xl font-medium">Entrar no Control</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Acesso restrito à equipe da V3X. Contas são criadas por um administrador.</p>
              <form onSubmit={submit} noValidate className="mt-6 space-y-5 md:mt-9 md:space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="login-email">E-mail</Label>
                  <Input id="login-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-12 rounded-sm bg-surface" aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} />
                  {errors.email && <p id="email-error" role="alert" className="text-xs text-[#f6a3af]">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Senha</Label>
                  <div className="relative">
                    <Input id="login-password" type={visible ? "text" : "password"} autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-12 rounded-sm bg-surface pr-12" aria-invalid={!!errors.password} aria-describedby={errors.password ? "password-error" : undefined} />
                    <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1.5 text-muted-foreground" aria-label={visible ? "Ocultar senha" : "Mostrar senha"} onClick={() => setVisible((v) => !v)}>{visible ? <EyeOff /> : <Eye />}</Button>
                  </div>
                  {errors.password && <p id="password-error" role="alert" className="text-xs text-[#f6a3af]">{errors.password}</p>}
                </div>
                {errors.form && <p role="alert" className="rounded-md border border-[#f05a6e]/30 bg-[#f05a6e]/10 px-3 py-2 text-sm text-[#f6c0c8]">{errors.form}</p>}
                <div className="flex justify-end"><Button type="button" variant="link" className="h-auto p-0 text-xs text-muted-foreground" onClick={() => { setRecovery(true); setRecoveryState("idle"); }}>Esqueci minha senha</Button></div>
                <Button type="submit" disabled={entering} className="h-12 w-full justify-between rounded-sm px-5">{entering ? "Entrando…" : "Entrar"}<ArrowUpRight /></Button>
              </form>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-medium">Login ainda não configurado</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">O banco de dados e a autenticação (Supabase) ainda não foram conectados. Até lá, o Control abre em modo demonstração: dados de exemplo identificados, nada é salvo e a IA fica desativada.</p>
              <Button render={<Link href="/control" />} nativeButton={false} className="mt-8 h-12 w-full justify-between rounded-sm px-5">Abrir demonstração<ArrowUpRight /></Button>
            </>
          )}
        </section>
      </div>
      <footer className="flex flex-wrap justify-between gap-3 border-t border-border px-6 py-5 md:px-12"><span className="label-mono">V3X DIGITAL PRODUCT STUDIO</span><span className="label-mono">CONTROL</span></footer>
      <Dialog open={recovery} onOpenChange={setRecovery}>
        <DialogContent>
          <DialogTitle>Recuperar senha</DialogTitle>
          <DialogDescription>
            {recoveryState === "sent" ? "Se o e-mail tiver acesso ao Control, você receberá um link para criar uma nova senha." : recoveryState === "error" ? "Não foi possível enviar agora. Tente novamente em instantes." : `Enviaremos um link de recuperação para ${email || "o e-mail informado no formulário"}.`}
          </DialogDescription>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setRecovery(false)}>Fechar</Button>
            {recoveryState !== "sent" && <Button onClick={recover} disabled={recoveryState === "sending"}>{recoveryState === "sending" ? "Enviando…" : "Enviar link"}</Button>}
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
