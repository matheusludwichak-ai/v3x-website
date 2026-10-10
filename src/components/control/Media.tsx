"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ExternalLink, Film, Globe, Images, Lock, Play, Plus, ShieldCheck } from "lucide-react";
import type { MotionItem, PortfolioItem } from "@/lib/control/schema";
import { Badge, Btn, Confirm, Drawer, Empty, ErrorBox, ModeBanner, Page, PageHeader, Skeleton, Tabs, optionsOf } from "./ui";
import { RecordForm, type FieldDef } from "./RecordForm";
import { api, fmtDate, useCollection, useSession } from "./lib/client";
import { MOTION_CATEGORY_LABEL, PORTFOLIO_CATEGORY_LABEL, PORTFOLIO_STATUS_LABEL, PORTFOLIO_STATUS_TONE, label } from "./lib/labels";

/* Media is referenced by URL (Supabase Storage, Vercel Blob, YouTube, Vimeo...). Files are never stored in the database. */
const isVideoFile = (url?: string | null) => !!url && /\.(mp4|webm|mov)(\?|$)/i.test(url);
const embedUrl = (url?: string | null) => {
  if (!url) return null;
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/);
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}`;
  const vm = url.match(/vimeo\.com\/(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`;
  return null;
};

function Cover({ image, video, alt, icon }: { image?: string | null; video?: string | null; alt: string; icon: React.ReactNode }) {
  return (
    <div className="cx-media">
      {isVideoFile(video) ? (
        <video src={video!} poster={image ?? undefined} muted loop playsInline preload="metadata" onMouseEnter={(e) => e.currentTarget.play().catch(() => undefined)} onMouseLeave={(e) => e.currentTarget.pause()} aria-label={alt} />
      ) : image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt={alt} loading="lazy" />
      ) : (
        <div className="cx-media-placeholder">
          <div className="flex flex-col items-center gap-2 text-xs">
            {icon}
            Sem pré-visualização
          </div>
        </div>
      )}
      {video && !isVideoFile(video) && (
        <span className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-black/60 text-white backdrop-blur"><Play className="size-4" /></span>
      )}
    </div>
  );
}

/* ---------------- Portfolio ---------------- */

export function Portfolio() {
  const session = useSession();
  const items = useCollection("portfolio_items");
  const [editing, setEditing] = useState<PortfolioItem | "new" | null>(null);
  const [viewing, setViewing] = useState<PortfolioItem | null>(null);
  const [filter, setFilter] = useState<"all" | "public" | "pending" | PortfolioItem["status"]>("all");
  const [confirm, setConfirm] = useState<{ item: PortfolioItem; makePublic: boolean } | null>(null);
  const [busy, setBusy] = useState(false);

  const fields: FieldDef[] = [
    { name: "name", label: "Nome do projeto", required: true },
    { name: "category", label: "Categoria", type: "select", options: optionsOf(PORTFOLIO_CATEGORY_LABEL), required: true, half: true },
    { name: "status", label: "Situação", type: "select", options: optionsOf(PORTFOLIO_STATUS_LABEL), required: true, half: true },
    { name: "client_name", label: "Cliente", half: true, hint: "Opcional. Nunca é exibido no site público." },
    { name: "public_url", label: "URL pública", type: "url", half: true },
    { name: "description", label: "Descrição", type: "textarea", advanced: true },
    { name: "cover_url", label: "Imagem de capa (URL)", type: "url", advanced: true, hint: "Use a imagem real do projeto. Sem imagem, o card mostra um placeholder." },
    { name: "technologies", label: "Tecnologias", type: "tags", half: true, advanced: true },
    { name: "services", label: "Serviços executados", type: "tags", half: true, advanced: true },
    { name: "period_start", label: "Início", type: "date", half: true, advanced: true },
    { name: "period_end", label: "Fim", type: "date", half: true, advanced: true },
    { name: "demo_url", label: "Demonstração (quando autorizada)", type: "url", advanced: true },
    { name: "featured", label: "Destaque no portfólio", type: "checkbox", advanced: true, hint: "Só tem efeito quando o item for aprovado para exibição pública." },
    { name: "internal_notes", label: "Observações internas", type: "textarea", advanced: true, hint: "Visível apenas no Control." },
  ];

  const list = useMemo(
    () =>
      items.rows.filter((i) => {
        if (filter === "public") return i.public_approved;
        if (filter === "pending") return !i.public_approved;
        if (filter === "all") return true;
        return i.status === filter;
      }),
    [items.rows, filter],
  );

  const toggleVisibility = async () => {
    if (!confirm) return;
    setBusy(true);
    try {
      const res = await api<{ data: PortfolioItem }>(`/api/control/portfolio/${confirm.item.id}/visibility`, { method: "POST", body: JSON.stringify({ public: confirm.makePublic, confirm: true }) });
      items.replace(res.data);
      setViewing((v) => (v?.id === res.data.id ? res.data : v));
      toast.success(confirm.makePublic ? "Aprovado para exibição pública" : "Retirado da exibição pública");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
      setConfirm(null);
    }
  };

  return (
    <Page>
      <ModeBanner session={session} />
      <PageHeader
        eyebrow="Conteúdo"
        title="Portfólio"
        description="Catálogo das entregas da V3X: sites, sistemas, apps e SaaS. Tudo fica interno até uma aprovação explícita para exibição pública."
        actions={<Btn variant="primary" icon={<Plus className="size-4" />} onClick={() => setEditing("new")} disabled={items.readonly}>Adicionar projeto</Btn>}
      />
      <div className="mb-5">
        <Tabs
          value={filter}
          onChange={setFilter}
          items={[
            { value: "all", label: "Todos", count: items.rows.length },
            { value: "in_progress", label: "Em desenvolvimento" },
            { value: "done", label: "Concluídos" },
            { value: "internal", label: "Internos" },
            { value: "public", label: "Aprovados para o site", count: items.rows.filter((i) => i.public_approved).length },
            { value: "pending", label: "Não autorizados" },
          ]}
        />
      </div>
      {items.error && <ErrorBox message={items.error} onRetry={items.reload} />}
      {items.loading ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{[0, 1, 2].map((i) => <div key={i} className="cx-card"><Skeleton rows={5} /></div>)}</div>
      ) : list.length === 0 ? (
        <Empty icon={<Images className="size-5" />} title={items.rows.length ? "Nada neste filtro" : "Portfólio vazio"} text="Cadastre os trabalhos reais da V3X. O cadastro começa com nome e categoria; o resto pode vir depois." action={!items.readonly && <Btn onClick={() => setEditing("new")}>Adicionar projeto</Btn>} />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {list.map((i) => (
            <button key={i.id} onClick={() => setViewing(i)} className="cx-card group !p-3 text-left">
              <Cover image={i.cover_url} alt={i.name} icon={<Images className="size-6" />} />
              <div className="px-2 pb-1 pt-4">
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge tone="neutral">{label(PORTFOLIO_CATEGORY_LABEL, i.category)}</Badge>
                  <Badge tone={PORTFOLIO_STATUS_TONE[i.status]}>{label(PORTFOLIO_STATUS_LABEL, i.status)}</Badge>
                  {i.public_approved ? <Badge tone="success"><Globe className="size-3" /> Público</Badge> : <Badge tone="muted"><Lock className="size-3" /> Interno</Badge>}
                </div>
                <h2 className="mt-3 text-base font-semibold">{i.name}</h2>
                <p className="mt-1 line-clamp-2 text-sm text-[#a0a0a0]">{i.description || "Sem descrição."}</p>
                {i.technologies.length > 0 && <p className="mt-3 truncate text-xs text-[#6e6e76]">{i.technologies.join(" · ")}</p>}
              </div>
            </button>
          ))}
        </div>
      )}

      <Drawer
        open={!!viewing}
        onClose={() => setViewing(null)}
        wide
        title={viewing?.name ?? ""}
        subtitle={viewing ? `${label(PORTFOLIO_CATEGORY_LABEL, viewing.category)} · ${label(PORTFOLIO_STATUS_LABEL, viewing.status)}` : undefined}
        footer={
          viewing && (
            <>
              {viewing.public_approved ? (
                <Btn variant="ghost" icon={<Lock className="size-4" />} onClick={() => setConfirm({ item: viewing, makePublic: false })} disabled={items.readonly} className="mr-auto">Retirar do site</Btn>
              ) : (
                <Btn variant="secondary" icon={<ShieldCheck className="size-4" />} onClick={() => setConfirm({ item: viewing, makePublic: true })} disabled={items.readonly} className="mr-auto">Aprovar para o site</Btn>
              )}
              <Btn onClick={() => { setEditing(viewing); setViewing(null); }} disabled={items.readonly}>Editar</Btn>
            </>
          )
        }
      >
        {viewing && (
          <div className="space-y-5">
            <Cover image={viewing.cover_url} alt={viewing.name} icon={<Images className="size-8" />} />
            {viewing.gallery.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {viewing.gallery.map((g) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={g} src={g} alt="" className="aspect-video w-full rounded-lg object-cover" loading="lazy" />
                ))}
              </div>
            )}
            <p className="text-sm leading-relaxed text-[#d6d6da]">{viewing.description || "Sem descrição."}</p>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div><dt className="text-xs text-[#a0a0a0]">Cliente (interno)</dt><dd>{viewing.client_name || "—"}</dd></div>
              <div><dt className="text-xs text-[#a0a0a0]">Período</dt><dd>{viewing.period_start ? `${fmtDate(viewing.period_start)} a ${fmtDate(viewing.period_end)}` : "—"}</dd></div>
              <div><dt className="text-xs text-[#a0a0a0]">Tecnologias</dt><dd>{viewing.technologies.join(", ") || "—"}</dd></div>
              <div><dt className="text-xs text-[#a0a0a0]">Serviços</dt><dd>{viewing.services.join(", ") || "—"}</dd></div>
            </dl>
            <div className="flex flex-wrap gap-2">
              {viewing.public_url && <a className="cx-btn cx-btn-secondary cx-btn-sm" href={viewing.public_url} target="_blank" rel="noreferrer">Site <ExternalLink className="size-3.5" /></a>}
              {viewing.demo_url && <a className="cx-btn cx-btn-secondary cx-btn-sm" href={viewing.demo_url} target="_blank" rel="noreferrer">Demonstração <ExternalLink className="size-3.5" /></a>}
            </div>
            {viewing.internal_notes && <div className="rounded-xl border border-white/8 p-3 text-sm"><p className="cx-label mb-1">Observações internas</p>{viewing.internal_notes}</div>}
            <p className="text-xs text-[#a0a0a0]">Exibição pública exige: situação Concluído, descrição e imagem de capa. Cliente e observações internas nunca vão para o site.</p>
          </div>
        )}
      </Drawer>

      <RecordForm open={editing !== null} title={editing === "new" ? "Adicionar ao portfólio" : "Editar projeto do portfólio"} fields={fields} initial={editing === "new" ? { category: "site", status: "in_progress" } : (editing as unknown as Record<string, unknown>)} readonly={items.readonly} onClose={() => setEditing(null)} onSubmit={(v) => (editing === "new" ? items.create(v) : items.update((editing as PortfolioItem).id, v))} onDelete={editing && editing !== "new" ? () => items.remove(editing.id) : undefined} />
      <Confirm
        open={!!confirm}
        title={confirm?.makePublic ? "Aprovar para exibição pública?" : "Retirar do portfólio público?"}
        text={confirm?.makePublic ? "Confirme que o cliente autorizou a divulgação e que as informações estão corretas. Apenas nome, categoria, descrição, imagens, tecnologias, serviços e links públicos ficam disponíveis para o site." : "O projeto volta a ser apenas interno."}
        confirmLabel={confirm?.makePublic ? "Aprovar" : "Retirar"}
        loading={busy}
        onClose={() => setConfirm(null)}
        onConfirm={toggleVisibility}
      />
    </Page>
  );
}

/* ---------------- Motion library ---------------- */

export function MotionLibrary() {
  const session = useSession();
  const items = useCollection("motion_items");
  const [editing, setEditing] = useState<MotionItem | "new" | null>(null);
  const [viewing, setViewing] = useState<MotionItem | null>(null);
  const [category, setCategory] = useState<"all" | MotionItem["category"]>("all");

  const fields: FieldDef[] = [
    { name: "title", label: "Título", required: true },
    { name: "category", label: "Categoria", type: "select", options: optionsOf(MOTION_CATEGORY_LABEL), required: true, half: true },
    { name: "date", label: "Data", type: "date", half: true },
    { name: "video_url", label: "Vídeo (URL do arquivo .mp4/.webm, YouTube ou Vimeo)", type: "url", hint: "Hospede o arquivo no Storage ou numa plataforma de vídeo. O banco guarda só o link." },
    { name: "thumbnail_url", label: "Miniatura (URL)", type: "url", advanced: true },
    { name: "project", label: "Cliente ou projeto relacionado", advanced: true },
    { name: "tags", label: "Tags", type: "tags", advanced: true },
    { name: "source_url", label: "Arquivo de origem ou referência", type: "url", advanced: true },
    { name: "description", label: "Descrição", type: "textarea", advanced: true },
  ];

  const counts = Object.fromEntries(Object.keys(MOTION_CATEGORY_LABEL).map((k) => [k, items.rows.filter((i) => i.category === k).length]));
  const list = items.rows.filter((i) => category === "all" || i.category === category).sort((a, b) => (b.date ?? b.created_at).localeCompare(a.date ?? a.created_at));
  const embed = embedUrl(viewing?.video_url);

  return (
    <Page>
      <ModeBanner session={session} />
      <PageHeader eyebrow="Conteúdo" title="Biblioteca de motion" description="Peças, animações e referências da V3X. A própria peça é o destaque do card: passe o mouse para ver o vídeo." actions={<Btn variant="primary" icon={<Plus className="size-4" />} onClick={() => setEditing("new")} disabled={items.readonly}>Adicionar peça</Btn>} />
      <div className="mb-5">
        <Tabs value={category} onChange={setCategory} items={[{ value: "all", label: "Todas", count: items.rows.length }, ...Object.entries(MOTION_CATEGORY_LABEL).filter(([k]) => counts[k]).map(([value, text]) => ({ value: value as MotionItem["category"], label: text, count: counts[value] }))]} />
      </div>
      {items.error && <ErrorBox message={items.error} onRetry={items.reload} />}
      {items.loading ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{[0, 1, 2].map((i) => <div key={i} className="cx-card"><Skeleton rows={4} /></div>)}</div>
      ) : list.length === 0 ? (
        <Empty icon={<Film className="size-5" />} title="Biblioteca vazia" text="Adicione a primeira peça com o link do vídeo. Ex.: o vídeo institucional em /work/v3x-motion.mp4 do site." action={!items.readonly && <Btn onClick={() => setEditing("new")}>Adicionar peça</Btn>} />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((i) => (
            <button key={i.id} className="cx-card group !p-3 text-left" onClick={() => setViewing(i)}>
              <Cover image={i.thumbnail_url} video={i.video_url} alt={i.title} icon={<Film className="size-6" />} />
              <div className="px-2 pb-1 pt-4">
                <div className="flex items-center justify-between gap-2">
                  <Badge tone="violet">{label(MOTION_CATEGORY_LABEL, i.category)}</Badge>
                  <span className="text-xs text-[#a0a0a0]">{fmtDate(i.date)}</span>
                </div>
                <h2 className="mt-3 font-semibold">{i.title}</h2>
                {i.project && <p className="mt-1 text-xs text-[#a0a0a0]">{i.project}</p>}
                {i.tags.length > 0 && <p className="mt-2 truncate text-xs text-[#6e6e76]">#{i.tags.join(" #")}</p>}
              </div>
            </button>
          ))}
        </div>
      )}
      <Drawer open={!!viewing} onClose={() => setViewing(null)} wide title={viewing?.title ?? ""} subtitle={viewing ? `${label(MOTION_CATEGORY_LABEL, viewing.category)} · ${fmtDate(viewing.date)}` : undefined} footer={viewing && <Btn onClick={() => { setEditing(viewing); setViewing(null); }} disabled={items.readonly}>Editar</Btn>}>
        {viewing && (
          <div className="space-y-4">
            {isVideoFile(viewing.video_url) ? (
              <video src={viewing.video_url!} poster={viewing.thumbnail_url ?? undefined} controls playsInline className="w-full rounded-xl bg-black" />
            ) : embed ? (
              <iframe src={embed} title={viewing.title} className="aspect-video w-full rounded-xl" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
            ) : (
              <Cover image={viewing.thumbnail_url} alt={viewing.title} icon={<Film className="size-8" />} />
            )}
            {viewing.description && <p className="text-sm leading-relaxed text-[#d6d6da]">{viewing.description}</p>}
            <div className="flex flex-wrap gap-2">
              {viewing.video_url && <a className="cx-btn cx-btn-secondary cx-btn-sm" href={viewing.video_url} target="_blank" rel="noreferrer">Abrir vídeo <ExternalLink className="size-3.5" /></a>}
              {viewing.source_url && <a className="cx-btn cx-btn-secondary cx-btn-sm" href={viewing.source_url} target="_blank" rel="noreferrer">Arquivo de origem <ExternalLink className="size-3.5" /></a>}
            </div>
          </div>
        )}
      </Drawer>
      <RecordForm open={editing !== null} title={editing === "new" ? "Adicionar peça" : "Editar peça"} fields={fields} initial={editing === "new" ? { category: "brand" } : (editing as unknown as Record<string, unknown>)} readonly={items.readonly} onClose={() => setEditing(null)} onSubmit={(v) => (editing === "new" ? items.create(v) : items.update((editing as MotionItem).id, v))} onDelete={editing && editing !== "new" ? () => items.remove(editing.id) : undefined} />
    </Page>
  );
}
