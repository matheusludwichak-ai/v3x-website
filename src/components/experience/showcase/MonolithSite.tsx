import { useId } from "react";

function SlabArt({ className }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 400 520" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden>
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b9bec6" />
          <stop offset="0.62" stopColor="#e4e5e3" />
          <stop offset="1" stopColor="#d3d4d1" />
        </linearGradient>
        <linearGradient id={`${id}-face`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#3b3d42" />
          <stop offset="1" stopColor="#1a1b1e" />
        </linearGradient>
        <linearGradient id={`${id}-side`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#141517" />
          <stop offset="1" stopColor="#0b0c0d" />
        </linearGradient>
        <linearGradient id={`${id}-shadow`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity="0.32" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="400" height="520" fill={`url(#${id}-sky)`} />
      <rect y="420" width="400" height="100" fill="#cfd0cd" />
      <polygon points="150,428 400,470 400,500 150,440" fill={`url(#${id}-shadow)`} />
      <polygon points="96,96 196,80 196,430 96,440" fill={`url(#${id}-face)`} />
      <polygon points="196,80 232,92 232,424 196,430" fill={`url(#${id}-side)`} />
      <polygon points="250,250 304,244 304,426 250,430" fill={`url(#${id}-face)`} opacity="0.85" />
      <polygon points="304,244 322,250 322,423 304,426" fill={`url(#${id}-side)`} opacity="0.85" />
      <rect x="62" y="418" width="2" height="16" fill="#1a1b1e" />
      <circle cx="63" cy="414" r="3" fill="#1a1b1e" />
    </svg>
  );
}

function DesktopPage() {
  return (
    <div className="h-full bg-[#eeefec] px-12 pt-8 text-[#0e0f10]">
      <div className="flex items-center justify-between text-[12.5px]">
        <span className="text-[14px] font-bold tracking-[0.42em]">MONOLITH</span>
        <span className="flex gap-9 text-[#55575c]"><span>Estúdio</span><span>Projetos</span><span>Processo</span><span>Contato</span></span>
        <span className="rounded-full bg-[#0e0f10] px-4 py-2 text-[11.5px] font-medium text-[#eeefec]">Agendar visita</span>
      </div>

      <div className="mt-10 grid grid-cols-[1.15fr_1fr] gap-12">
        <div className="flex flex-col">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#55575c]">Estúdio de arquitetura</p>
          <h4 className="mono-title mt-5 text-[86px] font-extrabold leading-[0.92] tracking-[-0.055em]">
            Arquitetura
            <br />
            que permanece.
          </h4>
          <p className="mt-7 max-w-[380px] text-[14px] leading-relaxed text-[#55575c]">
            Projetos residenciais e comerciais desenhados para durar décadas, com materiais honestos e luz natural.
          </p>
          <div className="mt-7 flex items-center gap-6 text-[13px] font-medium">
            <span className="rounded-full bg-[#0e0f10] px-5 py-2.5 text-[#eeefec]">Ver projetos</span>
            <span className="border-b border-[#0e0f10] pb-0.5">Nosso processo</span>
          </div>
          <div className="mt-auto grid grid-cols-3 gap-6 border-t border-[#0e0f10]/15 pt-5 text-[12px]">
            {[["01", "Residencial"], ["02", "Comercial"], ["03", "Interiores"]].map(([n, t]) => (
              <div key={n}>
                <p className="text-[#8a8c90]">{n}</p>
                <p className="mt-1 font-semibold">{t}</p>
              </div>
            ))}
          </div>
        </div>
        <figure>
          <div className="h-[470px] overflow-hidden rounded-[4px]">
            <SlabArt className="mono-art h-full w-full" />
          </div>
          <figcaption className="mt-3 flex justify-between text-[11px] text-[#55575c]">
            <span>Casa Basalto</span>
            <span>Conceito, 2026</span>
          </figcaption>
        </figure>
      </div>
    </div>
  );
}

function MobilePage() {
  return (
    <div className="h-full bg-[#eeefec] px-5 pt-12 text-[#0e0f10]">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold tracking-[0.4em]">MONOLITH</span>
        <span className="flex flex-col gap-[5px]"><i className="h-[2px] w-5 bg-[#0e0f10]" /><i className="h-[2px] w-5 bg-[#0e0f10]" /></span>
      </div>
      <h4 className="mt-7 text-[33px] font-extrabold leading-[0.95] tracking-[-0.05em]">
        Arquitetura que permanece.
      </h4>
      <SlabArt className="mt-5 h-[210px] w-full rounded-[4px]" />
      <span className="mt-5 inline-block rounded-full bg-[#0e0f10] px-5 py-2.5 text-[12px] font-medium text-[#eeefec]">Ver projetos</span>
    </div>
  );
}

/** Editorial site concept, desktop + mobile, built in code (base canvas 1180x760). */
export function MonolithSite() {
  return (
    <div className="relative h-[760px] w-[1180px]">
      <div className="mono-desk browser absolute left-0 top-0 h-[700px] w-[1040px]">
        <div className="browser-bar"><i /><i /><i /><u>monolith.arq.br</u></div>
        <div className="h-[670px]"><DesktopPage /></div>
      </div>
      <div className="mono-phone absolute bottom-0 right-0 h-[520px] w-[250px]">
        <div className="phone h-full"><div className="phone-island" /><div className="phone-screen"><MobilePage /></div></div>
      </div>
    </div>
  );
}
