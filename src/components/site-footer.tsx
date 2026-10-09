import Link from "next/link";
import { Logo } from "@/components/brand/Logo";

const SERVICE_LINKS = [
  { href: "/servicos/web-design", label: "Web Design & Development" },
  { href: "/servicos/motion-design", label: "Motion Design" },
  { href: "/servicos/software", label: "Software & Systems" },
  { href: "/servicos/produtos-digitais", label: "Digital Products" },
];

const SITE_LINKS = [
  { href: "/projetos", label: "Projetos" },
  { href: "/sobre", label: "Sobre" },
  { href: "/blog", label: "Blog" },
  { href: "/contato", label: "Contato" },
];

const LEGAL_LINKS = [
  { href: "/privacidade", label: "Política de privacidade" },
  { href: "/termos", label: "Termos de uso" },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface/60 text-foreground">
      <div className="mx-auto max-w-[1280px] px-6 py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo className="w-[150px]" />
            <p className="mt-3 text-[0.65rem] font-semibold uppercase tracking-[0.42em] text-foreground/80">Digital Product Studio</p>
            <p className="mt-6 max-w-[32ch] text-[15px] leading-relaxed text-muted-foreground">
              Unimos estratégia, design e tecnologia para transformar ideias em produtos digitais.
            </p>
            <a
              href="https://grupov3x.com.br"
              className="label-mono mt-6 inline-block border-b border-border pb-1 text-muted-foreground hover:text-foreground"
            >
              grupov3x.com.br
            </a>
          </div>

          <div>
            <p className="label-mono text-muted-foreground">Serviços</p>
            <ul className="mt-5 flex flex-col gap-3">
              {SERVICE_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[15px] text-muted-foreground hover:text-foreground">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="label-mono text-muted-foreground">Estúdio</p>
            <ul className="mt-5 flex flex-col gap-3">
              {SITE_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[15px] text-muted-foreground hover:text-foreground">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="label-mono text-muted-foreground">Legal</p>
            <ul className="mt-5 flex flex-col gap-3">
              {LEGAL_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[15px] text-muted-foreground hover:text-foreground">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 md:flex-row md:items-center">
          <p className="label-mono text-muted-foreground">
            © {year} V3X — Digital Product Studio. Todos os direitos reservados.
          </p>
          <p className="label-mono text-muted-foreground">Estratégia · Design · Tecnologia</p>
        </div>
      </div>
    </footer>
  );
}
