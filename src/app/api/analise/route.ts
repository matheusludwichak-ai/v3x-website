import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!data.nome || !data.whatsapp || !data.empresa) {
      return NextResponse.json({ ok: false, error: "Campos obrigatórios faltando" }, { status: 400 });
    }

    const scriptUrl = process.env.GOOGLE_SCRIPT_URL;

    if (scriptUrl) {
      const payload = {
        nome: data.nome,
        whatsapp: data.whatsapp,
        empresa: data.empresa,
        faturamento: data.faturamento || "",
        colaboradores: data.colaboradores || "",
        areaFoco: data.areaFoco || "",
        crescimento: data.crescimento || "",
        origem: data.origem || "direto",
        timestamp: new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }),
      };

      // Google Apps Script expects the data as URL params via GET OR as POST body
      // Using GET with params is the most reliable approach
      const params = new URLSearchParams(payload as Record<string, string>);
      const getUrl = `${scriptUrl}?${params.toString()}`;

      const res = await fetch(getUrl, {
        method: "GET",
        redirect: "follow",
      });

      console.log("[ANALISE] Script response status:", res.status);
    } else {
      console.log("[ANALISE LEAD - NO SCRIPT URL]", JSON.stringify(data, null, 2));
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[ANALISE API ERROR]", err);
    // Still return ok so user gets redirected to obrigado
    return NextResponse.json({ ok: true });
  }
}
