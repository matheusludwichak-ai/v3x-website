import Link from "next/link";

const products = [
  { href: "https://app.grupov3x.com.br", label: "V3X Diagnóstico", external: true },
  { href: "https://pipeline.grupov3x.com.br", label: "V3X Pipeline", external: true },
];

const content = [
  { href: "/blog", label: "Blog" },
  { href: "/guias", label: "Guias" },
  { href: "/faq", label: "FAQ" },
  { href: "/estudos-de-caso", label: "Estudos de Caso" },
];

const company = [
  { href: "/sobre", label: "Sobre a V3X" },
  { href: "/contato", label: "Contato" },
  { href: "/politica-de-privacidade", label: "Política de Privacidade" },
  { href: "/termos-de-uso", label: "Termos de Uso" },
];

export function Footer() {
  return (
    <footer className="bg-[#0B0B0B] border-t border-[#2A2A2A]">
      {/* CTA strip */}
      <div className="bg-[#F5C242]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-10 flex flex-col md:flex-row items-center justify-between gap-5 text-center md:text-left">
          <div>
            <p className="font-[family-name:var(--font-anton)] text-xl md:text-2xl text-[#0B0B0B] tracking-wide">
              Pronto para escalar sua empresa?
            </p>
            <p className="text-sm text-[#0B0B0B]/70 font-[family-name:var(--font-montserrat)] mt-1">
              Faça o diagnóstico gratuito e descubra onde estão seus gargalos.
            </p>
          </div>
          <Link
            href="https://app.grupov3x.com.br"
            target="_blank"
            className="group bg-[#0B0B0B] text-white font-[family-name:var(--font-montserrat)] font-semibold text-sm px-8 py-3 hover:bg-[#1A1A1A] transition-all duration-200 whitespace-nowrap hover:scale-[1.02] inline-flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            Começar Agora
            <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
          </Link>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <span className="font-[family-name:var(--font-anton)] text-3xl text-white tracking-wider">
            V3X
          </span>
          <p className="text-xs text-[#F5C242] font-[family-name:var(--font-montserrat)] font-semibold tracking-[0.2em] uppercase mt-1">
            Estratégia · Escala · Performance
          </p>
          <p className="text-sm text-[#F3F3F3]/60 font-[family-name:var(--font-inter)] mt-4 leading-relaxed">
            Ecossistema de ferramentas e metodologias para empresas que querem crescer com inteligência.
          </p>
          <p className="text-xs text-[#F3F3F3]/40 font-[family-name:var(--font-montserrat)] mt-4">
            R$ 4M+ gerados aplicando o método.
          </p>
        </div>

        {/* Produtos */}
        <div>
          <p className="text-xs font-[family-name:var(--font-montserrat)] font-semibold tracking-[0.15em] uppercase text-[#F5C242] mb-4">
            Produtos
          </p>
          <ul className="flex flex-col gap-3">
            {products.map((p) => (
              <li key={p.href}>
                <Link
                  href={p.href}
                  target={p.external ? "_blank" : undefined}
                  className="text-sm text-[#F3F3F3]/70 hover:text-white font-[family-name:var(--font-inter)] transition-colors"
                >
                  {p.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Conteúdo */}
        <div>
          <p className="text-xs font-[family-name:var(--font-montserrat)] font-semibold tracking-[0.15em] uppercase text-[#F5C242] mb-4">
            Conteúdo
          </p>
          <ul className="flex flex-col gap-3">
            {content.map((p) => (
              <li key={p.href}>
                <Link
                  href={p.href}
                  className="text-sm text-[#F3F3F3]/70 hover:text-white font-[family-name:var(--font-inter)] transition-colors"
                >
                  {p.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Empresa */}
        <div>
          <p className="text-xs font-[family-name:var(--font-montserrat)] font-semibold tracking-[0.15em] uppercase text-[#F5C242] mb-4">
            Empresa
          </p>
          <ul className="flex flex-col gap-3">
            {company.map((p) => (
              <li key={p.href}>
                <Link
                  href={p.href}
                  className="text-sm text-[#F3F3F3]/70 hover:text-white font-[family-name:var(--font-inter)] transition-colors"
                >
                  {p.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#2A2A2A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-[#F3F3F3]/40 font-[family-name:var(--font-inter)]">
            © {new Date().getFullYear()} V3X. Todos os direitos reservados.
          </p>
          <p className="text-xs text-[#F3F3F3]/40 font-[family-name:var(--font-inter)]">
            grupov3x.com.br
          </p>
        </div>
      </div>
    </footer>
  );
}
