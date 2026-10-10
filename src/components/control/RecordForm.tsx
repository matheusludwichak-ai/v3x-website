"use client";

import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { ApiError } from "./lib/client";
import { Btn, Confirm, Drawer, Field, Select, TextArea, TextInput } from "./ui";

export type FieldDef = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "select" | "date" | "number" | "tags" | "url" | "email" | "checkbox" | "money";
  options?: { value: string; label: string }[];
  placeholder?: string;
  hint?: ReactNode;
  required?: boolean;
  /** Shown only in the "more details" step, to keep creation short. */
  advanced?: boolean;
  half?: boolean;
};

type Values = Record<string, unknown>;

const toForm = (f: FieldDef, v: unknown) => {
  if (f.type === "tags") return Array.isArray(v) ? (v as string[]).join(", ") : "";
  if (f.type === "money") return typeof v === "number" ? String(v / 100) : "";
  if (f.type === "checkbox") return Boolean(v);
  return v ?? "";
};

const fromForm = (f: FieldDef, v: unknown) => {
  if (f.type === "tags") return String(v ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  if (f.type === "number") return v === "" || v === null ? null : Number(v);
  if (f.type === "money") return v === "" || v === null ? null : Math.round(Number(String(v).replace(",", ".")) * 100);
  if (f.type === "checkbox") return Boolean(v);
  if (typeof v === "string") return v.trim() === "" ? null : v;
  return v;
};

/**
 * Create/edit drawer driven by a field list. Creation shows only essential fields;
 * "Mais detalhes" reveals the rest, so simple things stay quick.
 */
type FormProps = {
  open: boolean;
  title: string;
  subtitle?: ReactNode;
  fields: FieldDef[];
  initial?: Values | null;
  onSubmit: (values: Values) => Promise<unknown>;
  onDelete?: () => Promise<unknown>;
  onClose: () => void;
  readonly?: boolean;
  extra?: ReactNode;
  deleteText?: string;
};

/** Remounts the form each time it opens, so its state always starts from the current record. */
export function RecordForm(props: FormProps) {
  const [session, setSession] = useState(0);
  const [wasOpen, setWasOpen] = useState(props.open);
  if (props.open !== wasOpen) {
    setWasOpen(props.open);
    if (props.open) setSession((n) => n + 1);
  }
  return <RecordFormBody key={session} {...props} />;
}

function RecordFormBody({
  open,
  title,
  subtitle,
  fields,
  initial,
  onSubmit,
  onDelete,
  onClose,
  readonly,
  extra,
  deleteText = "Este registro será removido.",
}: FormProps) {
  const editing = Boolean(initial?.id);
  const [values, setValues] = useState<Values>(() => Object.fromEntries(fields.map((f) => [f.name, toForm(f, initial?.[f.name])])));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [more, setMore] = useState(editing);
  const [confirm, setConfirm] = useState(false);


  const submit = async () => {
    const missing = fields.filter((f) => f.required && !String(values[f.name] ?? "").trim());
    if (missing.length) {
      setErrors(Object.fromEntries(missing.map((f) => [f.name, "Campo obrigatório."])));
      return;
    }
    setSaving(true);
    setErrors({});
    try {
      const payload = Object.fromEntries(fields.filter((f) => editing || more || !f.advanced || values[f.name] !== "").map((f) => [f.name, fromForm(f, values[f.name])]));
      await onSubmit(payload);
      toast.success(editing ? "Alterações salvas" : "Criado com sucesso");
      onClose();
    } catch (e) {
      if (e instanceof ApiError && e.fields) {
        setErrors(e.fields);
        setMore(true);
      }
      toast.error((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const visible = fields.filter((f) => !f.advanced || more);
  const hasAdvanced = fields.some((f) => f.advanced);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      footer={
        <>
          {editing && onDelete && (
            <Btn variant="danger" className="mr-auto" icon={<Trash2 className="size-4" />} onClick={() => setConfirm(true)} disabled={readonly}>
              Excluir
            </Btn>
          )}
          <Btn variant="ghost" onClick={onClose}>
            Cancelar
          </Btn>
          <Btn variant="primary" loading={saving} onClick={submit} disabled={readonly}>
            {editing ? "Salvar" : "Criar"}
          </Btn>
        </>
      }
    >
      <form
        className="grid grid-cols-2 gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        {visible.map((f) => {
          const v = values[f.name];
          const set = (nv: unknown) => setValues((s) => ({ ...s, [f.name]: nv }));
          const err = errors[f.name];
          const span = f.half ? "col-span-2 sm:col-span-1" : "col-span-2";
          if (f.type === "checkbox")
            return (
              <label key={f.name} className={`${span} flex items-start gap-3 rounded-xl border border-white/8 p-3`}>
                <input type="checkbox" className="mt-0.5 size-4 accent-[#3882f6]" checked={Boolean(v)} onChange={(e) => set(e.target.checked)} />
                <span>
                  <span className="cx-label">{f.label}</span>
                  {f.hint && <span className="cx-hint mt-1 block">{f.hint}</span>}
                </span>
              </label>
            );
          return (
            <Field key={f.name} label={`${f.label}${f.required ? " *" : ""}`} error={err} hint={f.hint} className={span}>
              {f.type === "textarea" ? (
                <TextArea value={String(v ?? "")} onChange={(e) => set(e.target.value)} placeholder={f.placeholder} invalid={!!err} />
              ) : f.type === "select" ? (
                <Select value={String(v ?? "")} onChange={(e) => set(e.target.value)} options={f.options ?? []} placeholder={f.required ? undefined : "Não definido"} />
              ) : (
                <TextInput
                  type={f.type === "date" ? "date" : f.type === "number" || f.type === "money" ? "text" : f.type === "url" ? "url" : f.type === "email" ? "email" : "text"}
                  inputMode={f.type === "number" || f.type === "money" ? "decimal" : undefined}
                  value={String(v ?? "")}
                  onChange={(e) => set(e.target.value)}
                  placeholder={f.placeholder ?? (f.type === "tags" ? "Separe por vírgulas" : f.type === "url" ? "https://" : undefined)}
                  invalid={!!err}
                />
              )}
            </Field>
          );
        })}
        {hasAdvanced && !more && (
          <button type="button" className="col-span-2 text-left text-sm font-medium text-[#9cc2ff] hover:underline" onClick={() => setMore(true)}>
            + Mais detalhes (opcional)
          </button>
        )}
        <button type="submit" hidden />
      </form>
      {extra}
      {onDelete && <Confirm open={confirm} title="Confirmar exclusão" text={deleteText} confirmLabel="Excluir" tone="danger" onClose={() => setConfirm(false)} onConfirm={async () => { setConfirm(false); try { await onDelete(); toast.success("Removido"); onClose(); } catch (e) { toast.error((e as Error).message); } }} />}
    </Drawer>
  );
}
