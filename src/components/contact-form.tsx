"use client";

import { useState, type FormEvent } from "react";
import { services } from "@/data/services";

type Status = "idle" | "submitting" | "success" | "error";

const inputClass =
  "w-full rounded-[4px] border border-neutral-200 bg-white px-4 py-3 text-base text-ink placeholder:text-neutral-600 focus-visible:border-accent focus-visible:shadow-[0_0_0_3px_rgba(59,110,255,0.18)] focus-visible:outline-none";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    if (!data.nome || !data.email || !data.descricao) return;

    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();

      if (!res.ok || !json.ok) {
        setStatus("error");
        setErrorMsg(json.error || "Não foi possível enviar. Tente novamente.");
        return;
      }

      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
      setErrorMsg("Não foi possível enviar. Verifique sua conexão e tente novamente.");
    }
  }

  if (status === "success") {
    return (
      <div className="border-t border-neutral-200 pt-8">
        <p className="eyebrow text-accent">Recebemos sua mensagem</p>
        <p className="mt-4 max-w-[48ch] text-lg leading-relaxed text-ink">
          Obrigado pelo contato. Vamos ler com calma e responder em até 1 dia útil no e-mail
          informado.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field label="Nome" htmlFor="nome">
          <input
            id="nome"
            name="nome"
            type="text"
            required
            autoComplete="name"
            className={inputClass}
          />
        </Field>
        <Field label="Empresa" htmlFor="empresa" optional>
          <input id="empresa" name="empresa" type="text" autoComplete="organization" className={inputClass} />
        </Field>
      </div>

      <Field label="E-mail" htmlFor="email">
        <input id="email" name="email" type="email" required autoComplete="email" className={inputClass} />
      </Field>

      <Field label="Serviço de interesse" htmlFor="servico" optional>
        <select id="servico" name="servico" className={inputClass} defaultValue="">
          <option value="">Selecione (opcional)</option>
          {services.map((s) => (
            <option key={s.slug} value={s.name}>
              {s.name}
            </option>
          ))}
          <option value="Outro">Outro</option>
        </select>
      </Field>

      <Field label="Descreva o projeto" htmlFor="descricao">
        <textarea
          id="descricao"
          name="descricao"
          required
          rows={5}
          className={`${inputClass} resize-none`}
          placeholder="O que você está construindo? Qual problema quer resolver?"
        />
      </Field>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field label="Faixa de investimento" htmlFor="investimento" optional>
          <input id="investimento" name="investimento" type="text" className={inputClass} placeholder="Ex: R$ 15k – 30k" />
        </Field>
        <Field label="Prazo desejado" htmlFor="prazo" optional>
          <input id="prazo" name="prazo" type="text" className={inputClass} placeholder="Ex: 2 meses" />
        </Field>
      </div>

      {status === "error" && <p className="text-[14px] text-red-700">{errorMsg}</p>}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-2 inline-flex h-12 w-fit items-center rounded-[4px] border border-ink bg-ink px-8 text-[16px] font-semibold text-on-ink transition-all hover:-translate-y-px hover:bg-neutral-800 disabled:opacity-50"
      >
        {status === "submitting" ? "Enviando…" : "Enviar mensagem"}
      </button>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  optional,
  children,
}: {
  label: string;
  htmlFor: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={htmlFor} className="eyebrow text-neutral-600">
        {label} {optional && <span className="normal-case text-neutral-400">(opcional)</span>}
      </label>
      {children}
    </div>
  );
}
