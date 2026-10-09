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
      console.log("[CONTATO LEAD — SEM GOOGLE_SCRIPT_URL CONFIGURADO]", JSON.stringify(data, null, 2));
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
    console.log("[CONTATO] Script response status:", res.status);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[CONTATO API ERROR]", err);
    return NextResponse.json({ ok: false, error: "Erro ao enviar. Tente novamente." }, { status: 500 });
  }
}
