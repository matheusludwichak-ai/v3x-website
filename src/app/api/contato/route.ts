import { NextResponse } from "next/server";
import { getSystemStore } from "@/lib/control/store";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ATTRIBUTION_KEYS = ["landing_page", "referrer", "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "utm_id"];
const FORMS = ["contato_pagina", "contato_modal"];

const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/** Only known attribution keys, short strings. */
function cleanAttribution(raw: unknown, form: string): Record<string, string> {
  const out: Record<string, string> = {};
  if (raw && typeof raw === "object") {
    for (const key of ATTRIBUTION_KEYS) {
      const value = text((raw as Record<string, unknown>)[key], 200);
      if (value) out[key] = value;
    }
  }
  out.form = form;
  return out;
}

/** Local calendar date in Brazil (YYYY-MM-DD). */
const todayBR = () => new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" }).format(new Date());

/** Saves the lead in the Control pipeline (Supabase, service role on the server). */
async function saveToControl(lead: { nome: string; empresa: string; email: string; servico: string; descricao: string; investimento: string; prazo: string; form: string; attribution: Record<string, string> }) {
  const store = getSystemStore();
  if (!store || store.readonly) return false;
  try {
    const notes = [
      `Mensagem: ${lead.descricao}`,
      lead.investimento && `Investimento: ${lead.investimento}`,
      lead.prazo && `Prazo: ${lead.prazo}`,
      `Recebido pelo formulário do site (${lead.form === "contato_modal" ? "janela da página inicial" : "página de contato"}).`,
    ]
      .filter(Boolean)
      .join("\n");
    const row = await store.insert("leads", {
      company: (lead.empresa || lead.nome).slice(0, 160),
      contact: lead.nome.slice(0, 160),
      email: lead.email,
      service: lead.servico || null,
      stage: "new",
      next_action: "Responder o contato do site",
      next_action_date: todayBR(),
      notes: notes.slice(0, 4000),
      origin: "site_form",
      attribution: lead.attribution,
    });
    try {
      await store.insert("activity_log", { entity: "leads", entity_id: row.id, action: "created", summary: `Novo lead do site: ${String(row.company).slice(0, 120)}`, actor: "Site" });
    } catch {
      // History is best effort.
    }
    return true;
  } catch (err) {
    // Never log the lead itself (personal data), only the failure.
    console.error("[CONTATO] Falha ao salvar no Control:", err instanceof Error ? err.message : "erro desconhecido");
    return false;
  }
}

/** Forwards the lead to the existing Google Sheet (Apps Script). */
async function saveToSheet(payload: Record<string, string>) {
  const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
  if (!scriptUrl) return false;
  try {
    const res = await fetch(`${scriptUrl}?${new URLSearchParams(payload).toString()}`, { method: "GET", redirect: "follow" });
    if (!res.ok) console.error("[CONTATO] Planilha recusou o envio. Status:", res.status);
    return res.ok;
  } catch {
    console.error("[CONTATO] Planilha indisponível.");
    return false;
  }
}

export async function POST(request: Request) {
  let data: Record<string, unknown>;
  try {
    data = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Requisição inválida." }, { status: 400 });
  }

  const nome = text(data.nome, 160);
  const email = text(data.email, 200).toLowerCase();
  const descricao = text(data.descricao, 4000);
  if (!nome || !email || !descricao) return NextResponse.json({ ok: false, error: "Preencha nome, e-mail e a descrição do projeto." }, { status: 400 });
  if (!EMAIL.test(email)) return NextResponse.json({ ok: false, error: "Informe um e-mail válido." }, { status: 400 });

  // Honeypot filled: answer like a success, store nothing.
  if (text(data.website, 200)) return NextResponse.json({ ok: true });

  const form = FORMS.includes(text(data.formulario, 40)) ? text(data.formulario, 40) : "contato_pagina";
  const lead = {
    nome,
    empresa: text(data.empresa, 160),
    email,
    servico: text(data.servico, 120),
    descricao,
    investimento: text(data.investimento, 120),
    prazo: text(data.prazo, 120),
    form,
    attribution: cleanAttribution(data.atribuicao, form),
  };

  const [sheet, control] = await Promise.all([
    saveToSheet({
      origem: "site-contato",
      nome: lead.nome,
      empresa: lead.empresa,
      email: lead.email,
      servico: lead.servico,
      descricao: lead.descricao,
      investimento: lead.investimento,
      prazo: lead.prazo,
      timestamp: new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }),
    }),
    saveToControl(lead),
  ]);

  // Success only when at least one destination really stored the lead.
  if (!sheet && !control) {
    return NextResponse.json({ ok: false, error: "Não foi possível enviar agora. Tente novamente ou fale pelo WhatsApp." }, { status: 503 });
  }
  return NextResponse.json({ ok: true });
}
