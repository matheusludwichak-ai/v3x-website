import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { WhatsAppIcon } from "@/components/site/whatsapp-icon";
import { CookiePreferencesButton } from "@/components/analytics/CookiePreferencesButton";
import { CONTACT_EMAIL, CONTACT_EMAIL_HREF, WHATSAPP_DISPLAY, whatsappHref } from "@/config/contact";

const COLUMNS = [
  {
    title: "Serviços",
    links: [
      { href: "/servicos/web-design", label: "Web Design e Desenvolvimento" },
      { href: "/servicos/motion-design", label: "Motion Design" },
      { href: "/servicos/software", label: "Software e Sistemas" },
      { href: "/servicos/produtos-digitais", label: "Produtos Digitais" },
    ],
  },
  {
    title: "Estúdio",
    links: [
      { href: "/projetos", label: "Projetos" },
      { href: "/sobre", label: "Sobre" },
      { href: "/blog", label: "Blog" },
      { href: "/contato", label: "Contato" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacidade", label: "Política de privacidade" },
      { href: "/termos", label: "Termos de uso" },
    ],
  },
];

export function SiteFooter() {
  const wa = whatsappHref();
  return (
    <footer className="border-t border-border bg-[#07080f]" data-track-area="footer">
      <div className="container-v3x py-16 md:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo className="w-[150px]" />
            <p className="mt-3 text-[0.65rem] font-semibold uppercase tracking-[0.42em] text-foreground/80">Digital Product Studio</p>
            <p className="mt-6 max-w-[34ch] text-[15px] leading-relaxed text-muted-foreground">
              Unimos estratégia, design e tecnologia para transformar ideias em produtos digitais.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              <li>
                <a href={CONTACT_EMAIL_HREF} className="link-underline text-foreground">
                  {CONTACT_EMAIL}
                </a>
              </li>
              {wa && (
                <li>
                  <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-foreground/85 transition-colors hover:text-foreground">
                    <WhatsAppIcon className="size-4" />
                    WhatsApp {WHATSAPP_DISPLAY}
                  </a>
                </li>
              )}
            </ul>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{col.title}</p>
              <ul className="mt-5 flex flex-col gap-3">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-[15px] text-foreground/80 transition-colors hover:text-foreground">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row md:items-center">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <p>© 2026 V3X. Todos os direitos reservados.</p>
            <CookiePreferencesButton className="underline-offset-4 transition-colors hover:text-foreground hover:underline" />
          </div>
          <p className="uppercase tracking-[0.3em]">Design · Tecnologia · Produtos digitais</p>
        </div>
      </div>
    </footer>
  );
}
