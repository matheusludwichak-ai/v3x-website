import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Validate required fields
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
        timestamp: new Date().toISOString(),
      };

      await fetch(scriptUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      // Log locally while GOOGLE_SCRIPT_URL not configured
      console.log("[ANALISE LEAD]", JSON.stringify(data, null, 2));
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[ANALISE API ERROR]", err);
    return NextResponse.json({ ok: false, error: "Erro interno" }, { status: 500 });
  }
}
