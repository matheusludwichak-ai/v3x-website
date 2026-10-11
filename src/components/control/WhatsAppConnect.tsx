"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Link2, LogOut, QrCode, RefreshCw } from "lucide-react";
import { Badge, Btn, Confirm } from "./ui";
import { api, type SessionInfo } from "./lib/client";

type Status = { configured: boolean; state: string | null };
const LABEL: Record<string, { text: string; tone: "success" | "warning" | "danger" | "muted" }> = {
  open: { text: "Conectado", tone: "success" },
  connecting: { text: "Aguardando leitura do QR", tone: "warning" },
  close: { text: "Desconectado", tone: "danger" },
};

/**
 * WhatsApp pairing for administrators (Evolution API): shows the QR code / pairing code
 * returned by /instance/connect and follows the connection state until it opens.
 */
export function WhatsAppConnect({ session }: { session: SessionInfo | null }) {
  const [status, setStatus] = useState<Status | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [qr, setQr] = useState<{ image: string | null; code: string | null } | null>(null);
  const [busy, setBusy] = useState<"connect" | "logout" | "webhook" | null>(null);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const polling = useRef<number | null>(null);
  const isAdmin = session?.mode === "local" || session?.user?.role === "admin";

  const refresh = async () => {
    try {
      const s = await api<Status>("/api/control/whatsapp/instance");
      setStatus(s);
      setError(null);
      return s;
    } catch (e) {
      setError((e as Error).message);
      return null;
    }
  };

  useEffect(() => {
    let alive = true;
    api<Status>("/api/control/whatsapp/instance").then(
      (s) => alive && setStatus(s),
      (e) => alive && setError((e as Error).message),
    );
    return () => {
      alive = false;
      if (polling.current) window.clearInterval(polling.current);
    };
  }, []);

  const stopPolling = () => {
    if (polling.current) window.clearInterval(polling.current);
    polling.current = null;
  };

  const act = async (action: "connect" | "logout" | "webhook") => {
    setBusy(action);
    setError(null);
    try {
      const res = await api<{ qr?: string | null; pairingCode?: string | null; ok?: boolean }>("/api/control/whatsapp/instance", { method: "POST", body: JSON.stringify({ action }) });
      if (action === "connect") {
        if (!res.qr && !res.pairingCode) {
          toast.info("A Evolution não devolveu QR Code. A instância pode já estar conectada.");
          await refresh();
          return;
        }
        setQr({ image: res.qr ?? null, code: res.pairingCode ?? null });
        stopPolling();
        let tries = 0;
        polling.current = window.setInterval(async () => {
          tries += 1;
          const s = await refresh();
          if (s?.state === "open") {
            stopPolling();
            setQr(null);
            toast.success("WhatsApp conectado");
          } else if (tries >= 40) {
            stopPolling();
            toast.info("O QR Code expirou. Gere um novo para tentar de novo.");
          }
        }, 3000);
      } else if (action === "logout") {
        setConfirmLogout(false);
        toast.success("WhatsApp desconectado");
        await refresh();
      } else {
        toast.success("Webhook cadastrado na Evolution");
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(null);
    }
  };

  if (!status?.configured) return null;
  const st = LABEL[status.state ?? ""] ?? { text: status.state ? `Estado: ${status.state}` : "Estado desconhecido", tone: "muted" as const };

  return (
    <div className="mt-4 rounded-xl border border-white/8 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold">Conexão do número</p>
        <Badge tone={st.tone} dot>{st.text}</Badge>
      </div>
      {error && <p role="alert" className="mt-2 text-xs text-[#f6a3af]">{error}</p>}
      {qr && (
        <div className="mt-3 flex flex-col items-center gap-2 rounded-lg bg-white p-3 text-center text-[#0b0d1a]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {qr.image && <img src={qr.image} alt="QR Code para conectar o WhatsApp" className="size-56" />}
          {qr.code && <p className="font-mono text-lg font-bold tracking-[0.2em]">{qr.code}</p>}
          <p className="text-xs">WhatsApp no celular → Aparelhos conectados → Conectar um aparelho.</p>
        </div>
      )}
      {isAdmin ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {status.state !== "open" && (
            <Btn size="sm" variant="primary" icon={qr ? <RefreshCw className="size-3.5" /> : <QrCode className="size-3.5" />} loading={busy === "connect"} onClick={() => act("connect")}>
              {qr ? "Gerar novo QR" : "Conectar WhatsApp"}
            </Btn>
          )}
          <Btn size="sm" icon={<Link2 className="size-3.5" />} loading={busy === "webhook"} onClick={() => act("webhook")}>Cadastrar webhook</Btn>
          {status.state === "open" && (
            <Btn size="sm" variant="danger" icon={<LogOut className="size-3.5" />} onClick={() => setConfirmLogout(true)}>Desconectar</Btn>
          )}
        </div>
      ) : (
        <p className="mt-2 text-xs text-[#a0a0a0]">Somente administradores conectam ou desconectam o número.</p>
      )}
      <Confirm
        open={confirmLogout}
        title="Desconectar o WhatsApp?"
        text="O número deixa de enviar e receber mensagens pelo Control até ser conectado de novo com um QR Code. As conversas já salvas continuam no Control."
        confirmLabel="Desconectar"
        tone="danger"
        loading={busy === "logout"}
        onConfirm={() => act("logout")}
        onClose={() => setConfirmLogout(false)}
      />
    </div>
  );
}
