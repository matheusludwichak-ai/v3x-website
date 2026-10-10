import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { XMark } from "@/components/brand/XMark";

export default function NotFound() {
  return (
    <main className="hero-glow relative flex min-h-[100dvh] flex-col overflow-hidden px-6 md:px-12" data-page-not-found data-track-area="not_found">
      <header className="flex h-[72px] items-center">
        <Link href="/" aria-label="V3X, página inicial">
          <Logo className="w-[104px]" />
        </Link>
      </header>
      <XMark className="pointer-events-none absolute -right-32 top-1/2 hidden w-[620px] -translate-y-1/2 opacity-30 md:block" />
      <div className="relative flex flex-1 flex-col justify-center py-20">
        <p className="eyebrow">Erro 404</p>
        <h1 className="mt-6 max-w-[16ch] text-5xl font-semibold leading-[1.02] tracking-[-0.04em] md:text-7xl">
          Esta página <span className="text-gradient-x">não existe.</span>
        </h1>
        <p className="mt-6 max-w-[46ch] text-lg leading-relaxed text-muted-foreground">
          O endereço pode ter mudado ou sido digitado errado. Estes caminhos levam a algum lugar:
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link href="/" className="btn-primary">
            Ir para o início <ArrowUpRight className="size-5" />
          </Link>
          <Link href="/servicos" className="btn-outline">Serviços</Link>
          <Link href="/projetos" className="btn-outline">Projetos</Link>
          <Link href="/contato" className="btn-outline">Contato</Link>
        </div>
      </div>
    </main>
  );
}
