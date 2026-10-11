"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MARKETING_TOOLS, isPrivatePath } from "@/lib/analytics/config";
import { OPEN_PREFERENCES_EVENT, readConsent, saveConsent } from "@/lib/analytics/consent";
import { cn } from "@/lib/utils";

function Toggle({ id, checked, disabled, onChange, label }: { id: string; checked: boolean; disabled?: boolean; onChange?: (v: boolean) => void; label: string }) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={cn("relative h-6 w-11 shrink-0 rounded-full border transition-colors disabled:cursor-not-allowed disabled:opacity-60", checked ? "border-transparent bg-[#3882F6]" : "border-white/20 bg-white/10")}
    >
      <span className={cn("absolute top-1/2 size-4 -translate-y-1/2 rounded-full bg-white transition-[left]", checked ? "left-[22px]" : "left-[3px]")} />
    </button>
  );
}

/**
 * Cookie notice (LGPD). Accept and reject have the same weight; nothing non-essential runs
 * until the visitor chooses. "Preferências de cookies" in the footer reopens it.
 */
export function ConsentBanner() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [custom, setCustom] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const show = (fromUser: boolean) => {
      const current = readConsent();
      setAnalytics(current?.analytics ?? false);
      setMarketing(current?.marketing ?? false);
      setCustom(fromUser);
      setOpen(true);
      if (fromUser) requestAnimationFrame(() => panel.current?.querySelector<HTMLElement>("button")?.focus());
    };
    const timer = readConsent() ? null : window.setTimeout(() => show(false), 600);
    const onOpen = () => show(true);
    window.addEventListener(OPEN_PREFERENCES_EVENT, onOpen);
    return () => {
      if (timer) window.clearTimeout(timer);
      window.removeEventListener(OPEN_PREFERENCES_EVENT, onOpen);
    };
  }, []);

  if (!open || isPrivatePath(path)) return null;

  const choose = (choice: { analytics: boolean; marketing: boolean }) => {
    saveConsent(choice);
    setOpen(false);
  };

  return (
    <div
      ref={panel}
      role="dialog"
      aria-modal="false"
      aria-labelledby="consent-title"
      aria-describedby="consent-text"
      data-lenis-prevent
      className="consent-panel fixed inset-x-3 bottom-3 z-[60] max-h-[85svh] overflow-y-auto rounded-2xl border border-white/12 bg-[#0b0d1a]/95 p-5 shadow-[0_30px_80px_-30px_rgb(0_0_0/0.9)] backdrop-blur-md sm:inset-x-auto sm:bottom-5 sm:left-5 sm:w-[min(440px,calc(100vw-2.5rem))] sm:p-6"
    >
      <p id="consent-title" className="text-base font-semibold">Cookies e privacidade</p>
      <p id="consent-text" className="mt-2 text-sm leading-relaxed text-muted-foreground">
        A V3X usa cookies de análise do Google Analytics para entender como o site é usado e melhorá-lo, somente se você permitir. Os essenciais mantêm o site funcionando. Você pode mudar sua escolha quando quiser em “Preferências de cookies”, no rodapé.{" "}
        <Link href="/privacidade" className="text-foreground underline underline-offset-4">Política de privacidade e cookies</Link>
      </p>

      {custom && (
        <ul className="mt-5 space-y-4 border-t border-white/10 pt-5 text-sm">
          <li className="flex items-start justify-between gap-4">
            <span><span className="font-medium">Essenciais</span><span className="mt-1 block text-xs text-muted-foreground">Funcionamento do site e esta escolha. Sempre ativos.</span></span>
            <Toggle id="consent-essential" checked disabled label="Cookies essenciais, sempre ativos" />
          </li>
          <li className="flex items-start justify-between gap-4">
            <span><span className="font-medium">Análise</span><span className="mt-1 block text-xs text-muted-foreground">Google Analytics: páginas visitadas, origem do acesso e cliques, de forma pseudonimizada. Sem nome, e-mail ou mensagens. Os dados são tratados pelo Google e podem ser processados fora do Brasil.</span></span>
            <Toggle id="consent-analytics" checked={analytics} onChange={setAnalytics} label="Cookies de análise" />
          </li>
          {MARKETING_TOOLS && <li className="flex items-start justify-between gap-4">
            <span><span className="font-medium">Marketing</span><span className="mt-1 block text-xs text-muted-foreground">Medição de anúncios. Hoje o site não usa nenhuma ferramenta de publicidade.</span></span>
            <Toggle id="consent-marketing" checked={marketing} onChange={setMarketing} label="Cookies de marketing" />
          </li>}
        </ul>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        {custom ? (
          <>
            <button type="button" className="consent-btn consent-btn-primary" onClick={() => choose({ analytics, marketing: MARKETING_TOOLS && marketing })}>Salvar preferências</button>
            <button type="button" className="consent-btn" onClick={() => choose({ analytics: true, marketing: MARKETING_TOOLS })}>Aceitar todos</button>
          </>
        ) : (
          <>
            <button type="button" className="consent-btn consent-btn-primary" onClick={() => choose({ analytics: true, marketing: MARKETING_TOOLS })}>Aceitar</button>
            <button type="button" className="consent-btn" onClick={() => choose({ analytics: false, marketing: false })}>Recusar</button>
            <button type="button" className="consent-btn consent-btn-ghost" onClick={() => setCustom(true)}>Personalizar</button>
          </>
        )}
      </div>
    </div>
  );
}
