"use client";

import { useEffect, useState, type ReactNode, type SelectHTMLAttributes } from "react";
import Link from "next/link";
import { Dialog as D } from "@base-ui/react/dialog";
import { AlertTriangle, Loader2, RefreshCw, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Tone } from "./lib/labels";
import type { SessionInfo } from "./lib/client";

/* ---------------- Layout ---------------- */

export function Page({ children, className }: { children: ReactNode; className?: string }) {
  return <main className={cn("cx-page", className)}>{children}</main>;
}

export function PageHeader({ eyebrow, title, description, actions }: { eyebrow?: string; title: string; description?: ReactNode; actions?: ReactNode }) {
  return (
    <header className="cx-header">
      <div className="min-w-0">
        {eyebrow && <p className="cx-eyebrow">{eyebrow}</p>}
        <h1 className="cx-title">{title}</h1>
        {description && <p className="cx-desc">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}

export function Card({ title, action, children, className, footer, id }: { title?: ReactNode; action?: ReactNode; children: ReactNode; className?: string; footer?: ReactNode; id?: string }) {
  return (
    <section id={id} className={cn("cx-card", className)}>
      {(title || action) && (
        <div className="cx-card-head">
          {title && <h2 className="cx-card-title">{title}</h2>}
          {action}
        </div>
      )}
      {children}
      {footer && <div className="cx-card-foot">{footer}</div>}
    </section>
  );
}

export function Badge({ tone = "neutral", children, className, dot = false }: { tone?: Tone; children: ReactNode; className?: string; dot?: boolean }) {
  return (
    <span className={cn("cx-badge", `cx-tone-${tone}`, className)}>
      {dot && <i className="cx-dot" />}
      {children}
    </span>
  );
}

/** Marks where data comes from, so demo content is never mistaken for real data. */
export function SourceTag({ kind }: { kind: "real" | "demo" | "ai" | "external" | "manual" }) {
  const map = { real: ["Dados do Control", "blue"], demo: ["Demonstração", "warning"], ai: ["Gerado por IA", "violet"], external: ["Verificação externa", "success"], manual: ["Informado manualmente", "muted"] } as const;
  const [text, tone] = map[kind];
  return <Badge tone={tone}>{text}</Badge>;
}

/* ---------------- Buttons ---------------- */

type BtnProps = { variant?: "primary" | "secondary" | "ghost" | "danger" | "ai"; size?: "sm" | "md"; loading?: boolean; icon?: ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>;
export function Btn({ variant = "secondary", size = "md", loading, icon, children, className, disabled, ...rest }: BtnProps) {
  return (
    <button {...rest} disabled={disabled || loading} className={cn("cx-btn", `cx-btn-${variant}`, size === "sm" && "cx-btn-sm", className)}>
      {loading ? <Loader2 className="size-4 animate-spin" /> : icon}
      {children}
    </button>
  );
}

/** AI action button: disabled with an explanation when the AI is not available. */
export function AIBtn({ session, children = "Gerar com IA", ...rest }: BtnProps & { session: SessionInfo | null }) {
  const reason = !session ? "Carregando…" : !session.ai.configured ? "IA não configurada (GEMINI_API_KEY ausente)." : !session.canUseAI ? session.reason ?? "Sem permissão para usar a IA." : undefined;
  return (
    <Btn variant="ai" icon={<Sparkles className="size-4" />} {...rest} disabled={!!reason || rest.disabled} title={reason ?? rest.title}>
      {children}
    </Btn>
  );
}

/* ---------------- States ---------------- */

export function Empty({ icon, title, text, action }: { icon?: ReactNode; title: string; text?: ReactNode; action?: ReactNode }) {
  return (
    <div className="cx-empty">
      {icon && <div className="cx-empty-icon">{icon}</div>}
      <p className="cx-empty-title">{title}</p>
      {text && <p className="cx-empty-text">{text}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function ErrorBox({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="cx-error">
      <AlertTriangle className="size-4 shrink-0" />
      <span className="flex-1">{message}</span>
      {onRetry && (
        <Btn size="sm" variant="ghost" onClick={onRetry} icon={<RefreshCw className="size-3.5" />}>
          Tentar de novo
        </Btn>
      )}
    </div>
  );
}

export function Skeleton({ rows = 3, className }: { rows?: number; className?: string }) {
  return (
    <div className={cn("space-y-3", className)} aria-busy="true" aria-label="Carregando">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="cx-skeleton" style={{ width: `${92 - i * 9}%` }} />
      ))}
    </div>
  );
}

export function ModeBanner({ session }: { session: SessionInfo | null }) {
  if (!session || session.mode === "supabase") return null;
  return session.mode === "demo" ? (
    <div className="cx-banner cx-banner-warning">
      <strong>Modo demonstração.</strong> O banco de dados ainda não foi conectado: os registros marcados como “Exemplo” são fictícios, nada é salvo e a IA fica desativada. Veja <Link href="/control/integracoes">Integrações</Link>.
    </div>
  ) : (
    <div className="cx-banner">
      <strong>Desenvolvimento local.</strong> Dados salvos em <code>.data/control.json</code> neste computador. Em produção, o Control usa o Supabase com login.
    </div>
  );
}

/* ---------------- Form fields ---------------- */

export function Field({ label, error, hint, children, className }: { label: string; error?: string; hint?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <label className={cn("cx-field", className)}>
      <span className="cx-label">{label}</span>
      {children}
      {error ? <span className="cx-field-error" role="alert">{error}</span> : hint ? <span className="cx-hint">{hint}</span> : null}
    </label>
  );
}

export function TextInput({ invalid, className, ...rest }: React.ComponentProps<"input"> & { invalid?: boolean }) {
  return <input {...rest} aria-invalid={invalid || undefined} className={cn("cx-input", className)} />;
}

export function TextArea({ invalid, className, ...rest }: React.ComponentProps<"textarea"> & { invalid?: boolean }) {
  return <textarea {...rest} aria-invalid={invalid || undefined} className={cn("cx-input cx-textarea", className)} />;
}

export function Select({ options, placeholder, className, ...rest }: SelectHTMLAttributes<HTMLSelectElement> & { options: { value: string; label: string }[]; placeholder?: string }) {
  return (
    <select {...rest} className={cn("cx-input cx-select", className)}>
      {placeholder !== undefined && <option value="">{placeholder}</option>}
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export const optionsOf = (map: Record<string, string>) => Object.entries(map).map(([value, label]) => ({ value, label }));

/* ---------------- Overlays ---------------- */

export function Drawer({ open, onClose, title, subtitle, children, footer, wide }: { open: boolean; onClose: () => void; title: string; subtitle?: ReactNode; children: ReactNode; footer?: ReactNode; wide?: boolean }) {
  return (
    <D.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <D.Portal>
        <D.Backdrop className="cx-backdrop" />
        <D.Popup className={cn("cx-drawer", wide && "cx-drawer-wide")} data-lenis-prevent>
          <div className="cx-drawer-head">
            <div className="min-w-0">
              <D.Title className="cx-drawer-title">{title}</D.Title>
              {subtitle && <D.Description className="cx-desc mt-1">{subtitle}</D.Description>}
            </div>
            <D.Close className="cx-icon-btn" aria-label="Fechar">
              <X className="size-4" />
            </D.Close>
          </div>
          <div className="cx-drawer-body">{children}</div>
          {footer && <div className="cx-drawer-foot">{footer}</div>}
        </D.Popup>
      </D.Portal>
    </D.Root>
  );
}

export function Confirm({ open, title, text, confirmLabel, tone = "primary", onConfirm, onClose, loading }: { open: boolean; title: string; text: ReactNode; confirmLabel: string; tone?: "primary" | "danger"; onConfirm: () => void; onClose: () => void; loading?: boolean }) {
  return (
    <D.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <D.Portal>
        <D.Backdrop className="cx-backdrop" />
        <D.Popup className="cx-modal" role="alertdialog">
          <D.Title className="cx-drawer-title">{title}</D.Title>
          <D.Description className="cx-desc mt-2">{text}</D.Description>
          <div className="mt-6 flex justify-end gap-2">
            <Btn variant="ghost" onClick={onClose}>
              Cancelar
            </Btn>
            <Btn variant={tone === "danger" ? "danger" : "primary"} loading={loading} onClick={onConfirm}>
              {confirmLabel}
            </Btn>
          </div>
        </D.Popup>
      </D.Portal>
    </D.Root>
  );
}

/* ---------------- Misc ---------------- */

export function Tabs<T extends string>({ value, onChange, items }: { value: T; onChange: (v: T) => void; items: { value: T; label: string; count?: number }[] }) {
  return (
    <div className="cx-tabs" role="tablist">
      {items.map((it) => (
        <button key={it.value} role="tab" aria-selected={value === it.value} onClick={() => onChange(it.value)} className={cn("cx-tab", value === it.value && "is-active")}>
          {it.label}
          {it.count !== undefined && <span className="cx-tab-count">{it.count}</span>}
        </button>
      ))}
    </div>
  );
}

export function Progress({ value, className }: { value: number; className?: string }) {
  const v = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className={cn("cx-progress", className)} role="progressbar" aria-valuenow={v} aria-valuemin={0} aria-valuemax={100}>
      <span style={{ width: `${v}%` }} />
    </div>
  );
}

export function Avatar({ name, className }: { name?: string | null; className?: string }) {
  const initials = (name ?? "?").split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]!.toUpperCase()).join("");
  return (
    <span className={cn("cx-avatar", className)} title={name ?? undefined} aria-hidden={!name}>
      {initials || "?"}
    </span>
  );
}

/** Debounced value for search inputs. */
export function useDebounced<T>(value: T, ms = 200) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}
