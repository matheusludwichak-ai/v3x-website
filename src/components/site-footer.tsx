import Link from "next/link";
import Image from "next/image";

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
    <footer className="bg-ink text-on-ink">
      <div className="mx-auto max-w-[1280px] px-6 py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Image
              src="/brand/logo-white.png"
              alt="V3X — Digital Product Studio"
              width={120}
              height={32}
              className="h-6 w-auto"
            />
            <p className="mt-6 max-w-[32ch] text-[15px] leading-relaxed text-dark-600">
              Unimos estratégia, design e tecnologia para transformar ideias em produtos digitais.
            </p>
            <a
              href="https://grupov3x.com.br"
              className="eyebrow mt-6 inline-block border-b border-dark-400 pb-1 text-dark-600 hover:text-on-ink"
            >
              grupov3x.com.br
            </a>
          </div>

          <div>
            <p className="eyebrow text-dark-600">Serviços</p>
            <ul className="mt-5 flex flex-col gap-3">
              {SERVICE_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[15px] text-dark-600 hover:text-on-ink">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow text-dark-600">Studio</p>
            <ul className="mt-5 flex flex-col gap-3">
              {SITE_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[15px] text-dark-600 hover:text-on-ink">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow text-dark-600">Legal</p>
            <ul className="mt-5 flex flex-col gap-3">
              {LEGAL_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[15px] text-dark-600 hover:text-on-ink">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-dark-border pt-6 md:flex-row md:items-center">
          <p className="numbering text-dark-400">
            © {year} V3X — Digital Product Studio. Todos os direitos reservados.
          </p>
          <p className="numbering text-dark-400">Estratégia · Design · Tecnologia</p>
        </div>
      </div>
    </footer>
  );
}
