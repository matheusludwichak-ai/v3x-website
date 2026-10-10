"use client";

import { useState, type FormEvent } from "react";
import { services } from "@/data/services";
import { useLeadFormTracking, type LeadFormError } from "@/lib/analytics/forms";

type Status = "idle" | "submitting" | "success" | "error";

const inputClass =
  "w-full rounded-xl border border-white/12 bg-[#0b0d1a] px-4 py-3 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 hover:border-white/25 focus-visible:border-[#3882F6] focus-visible:ring-3 focus-visible:ring-[#3882F6]/25";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const lead = useLeadFormTracking("contato_pagina");

  const fail = (type: LeadFormError, message: string) => {
    setStatus("error");
    setErrorMsg(message);
    lead.failed(type);
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    if (!String(data.nome ?? "").trim() || !String(data.email ?? "").trim() || !String(data.descricao ?? "").trim()) {
      fail("validation", "Preencha nome, e-mail e a descrição do projeto.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.email).trim())) {
      fail("validation", "Informe um e-mail válido.");
      return;
    }

    lead.submitted();
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
        fail(res.status === 503 ? "unavailable" : res.status === 400 ? "validation" : "server", json.error || "Não foi possível enviar. Tente novamente.");
        return;
      }

      lead.succeeded(String(data.servico ?? ""));
      setStatus("success");
      form.reset();
    } catch {
      fail("network", "Não foi possível enviar. Verifique sua conexão e tente novamente.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-[28px] border border-white/10 bg-[#07080f] p-10" role="status">
        <p className="eyebrow">Recebemos sua mensagem</p>
        <p className="mt-5 max-w-[48ch] text-lg leading-relaxed text-foreground">
          Obrigado pelo contato. Vamos ler com calma e responder em até 1 dia útil no e-mail
          informado.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} onFocusCapture={lead.onFocusCapture} className="flex flex-col gap-6" noValidate>
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
          <input id="investimento" name="investimento" type="text" className={inputClass} placeholder="Ex.: R$ 15 mil a 30 mil" />
        </Field>
        <Field label="Prazo desejado" htmlFor="prazo" optional>
          <input id="prazo" name="prazo" type="text" className={inputClass} placeholder="Ex.: 2 meses" />
        </Field>
      </div>

      {status === "error" && <p role="alert" className="text-sm text-[#c4b5fd]">{errorMsg}</p>}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="btn-primary mt-2 w-fit disabled:opacity-50"
      >
        {status === "submitting" ? "Enviando..." : "Enviar mensagem"}
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
      <label htmlFor={htmlFor} className="text-sm font-medium text-foreground/90">
        {label} {optional && <span className="font-normal text-muted-foreground">(opcional)</span>}
      </label>
      {children}
    </div>
  );
}
