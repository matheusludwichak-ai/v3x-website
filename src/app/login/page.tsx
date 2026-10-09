"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Eye, EyeOff, LockKeyhole } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { GridField } from "@/components/experience/GridField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [recovery, setRecovery] = useState(false);
  const [errors, setErrors] = useState<{ email?: string | undefined; password?: string | undefined }>({});
  const [entering, setEntering] = useState(false);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const next = {
      email: !email.trim() ? "Informe seu e-mail." : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ? "Informe um e-mail válido." : undefined,
      password: !password ? "Informe uma senha para a demonstração." : undefined,
    };
    setErrors(next);
    if (next.email || next.password) return;
    setEntering(true);
    window.setTimeout(() => { router.push("/control"); }, 450);
  };

  return (
    <main className="relative isolate flex min-h-svh flex-col overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-50"><GridField /></div>
      <header className="flex items-center justify-between border-b border-border px-6 py-6 md:px-12">
        <Link href="/" aria-label="V3X Studio"><Logo className="text-3xl" /></Link>
        <Button render={<Link href="/" />} nativeButton={false} variant="ghost" className="text-muted-foreground"><ArrowLeft /> Studio</Button>
      </header>
      <div className="mx-auto grid w-full max-w-[1400px] flex-1 items-center gap-8 px-6 py-9 md:grid-cols-2 md:gap-20 md:px-12 md:py-24">
        <section className="login-enter self-center">
          <span className="label-mono">V3X / INTERNAL WORKSPACE</span>
          <h1 className="mt-4 text-5xl font-medium leading-none md:mt-6 md:text-7xl xl:text-8xl">Control<span className="text-brand-violet">.</span></h1>
          <p className="mt-4 max-w-sm text-base leading-relaxed text-muted-foreground md:mt-6 md:text-xl">Um estúdio.<br />Todas as possibilidades.</p>
          <div aria-hidden className="login-graphic mt-12 hidden h-56 max-w-md items-center justify-center md:flex">
            <div className="login-grid-frame"><span /><span /><span /><span /></div>
            <span className="label-mono absolute bottom-4 left-4">DESIGN / MOTION / SYSTEMS</span>
            <span className="label-mono absolute right-4 top-4">01—04</span>
          </div>
        </section>
        <section className="login-enter w-full max-w-md md:justify-self-end">
          <div className="mb-5 flex items-center gap-3 md:mb-8"><LockKeyhole className="size-4 text-muted-foreground" /><span className="label-mono">ACESSO AO WORKSPACE</span></div>
          <h2 className="text-2xl font-medium">Bem-vindo ao Control.</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Demonstração visual. Nenhuma conta ou sessão é criada.</p>
          <form onSubmit={submit} noValidate className="mt-6 space-y-5 md:mt-9 md:space-y-6">
            <div className="space-y-2">
              <Label htmlFor="login-email">E-mail</Label>
              <Input id="login-email" type="email" autoComplete="off" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} className="h-12 rounded-sm bg-surface" aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} />
              {errors.email && <p id="email-error" role="alert" className="text-xs text-foreground">{errors.email}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="login-password">Senha</Label>
              <div className="relative">
                <Input id="login-password" type={visible ? "text" : "password"} autoComplete="off" placeholder="Senha de demonstração" value={password} onChange={e => setPassword(e.target.value)} className="h-12 rounded-sm bg-surface pr-12" aria-invalid={!!errors.password} aria-describedby={errors.password ? "password-error" : undefined} />
                <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1.5 text-muted-foreground" aria-label={visible ? "Ocultar senha" : "Mostrar senha"} onClick={() => setVisible(v => !v)}>{visible ? <EyeOff /> : <Eye />}</Button>
              </div>
              {errors.password && <p id="password-error" role="alert" className="text-xs text-foreground">{errors.password}</p>}
            </div>
            <div className="flex justify-end"><Button type="button" variant="link" className="h-auto p-0 text-xs text-muted-foreground" onClick={() => setRecovery(true)}>Esqueci minha senha</Button></div>
            <Button type="submit" disabled={entering} className="h-12 w-full justify-between rounded-sm px-5">{entering ? "Abrindo demonstração…" : "Acessar demonstração"}<ArrowUpRight /></Button>
            <p className="text-xs leading-relaxed text-muted-foreground">Use dados fictícios. As informações não são verificadas, salvas ou enviadas.</p>
          </form>
        </section>
      </div>
      <footer className="flex flex-wrap justify-between gap-3 border-t border-border px-6 py-5 md:px-12"><span className="label-mono">V3X DIGITAL PRODUCT STUDIO</span><span className="label-mono">CONTROL / DEMONSTRAÇÃO · 2026</span></footer>
      <Dialog open={recovery} onOpenChange={setRecovery}><DialogContent><DialogTitle>Recuperação de senha</DialogTitle><DialogDescription>Esta opção é apenas demonstrativa. Nenhum e-mail será enviado e nenhuma senha será alterada.</DialogDescription><Button onClick={() => setRecovery(false)} className="mt-4">Voltar ao login</Button></DialogContent></Dialog>
    </main>
  );
}
