import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!data.nome || !data.email || !data.descricao) {
      return NextResponse.json(
        { ok: false, error: "Campos obrigatórios faltando" },
        { status: 400 }
      );
    }

    const scriptUrl = process.env.GOOGLE_SCRIPT_URL;

    if (!scriptUrl) {
      // Never log the lead itself (name, e-mail and message are personal data).
      console.error("[CONTATO] GOOGLE_SCRIPT_URL não configurado; envio recusado.");
      return NextResponse.json(
        { ok: false, error: "Envio indisponível no momento. Tente novamente por e-mail." },
        { status: 503 }
      );
    }

    const payload = {
      origem: "site-contato",
      nome: data.nome,
      empresa: data.empresa || "",
      email: data.email,
      servico: data.servico || "",
      descricao: data.descricao,
      investimento: data.investimento || "",
      prazo: data.prazo || "",
      timestamp: new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }),
    };

    const params = new URLSearchParams(payload as Record<string, string>);
    const getUrl = `${scriptUrl}?${params.toString()}`;

    const res = await fetch(getUrl, { method: "GET", redirect: "follow" });
    if (!res.ok) {
      // Only report success when the lead was really accepted (analytics counts generate_lead on ok).
      console.error("[CONTATO] Planilha recusou o envio. Status:", res.status);
      return NextResponse.json({ ok: false, error: "Não foi possível enviar agora. Tente novamente ou fale pelo WhatsApp." }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[CONTATO API ERROR]", err);
    return NextResponse.json({ ok: false, error: "Erro ao enviar. Tente novamente." }, { status: 500 });
  }
}
