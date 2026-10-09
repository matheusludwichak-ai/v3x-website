"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

const members = [
  { name: "Isabella Christina", role: "CTO & Co-founder", area: "Engenharia e tecnologia", initials: "IC" },
  { name: "Matheus Ludwichak", role: "CEO & Founder", area: "Estratégia e direção comercial", initials: "ML" },
  { name: "Emmanuelle Assanté", role: "CFO & Co-founder", area: "Finanças e gestão do negócio", initials: "EA" },
];

export function TeamView() {
  const [member, setMember] = useState<(typeof members)[number] | null>(null);
  return (
    <main className="p-5 md:p-8 lg:p-10">
      <span className="label-mono">O ESTÚDIO / PESSOAS</span>
      <h1 className="my-3 text-3xl">Equipe</h1>
      <p className="mb-8 text-xs text-muted-foreground">As pessoas por trás da V3X.</p>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/work/v3x-team.jpg" alt="Fundadores da V3X" className="concept-image max-h-[420px] w-full rounded-md object-cover object-top" />
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {members.map(m => (
          <div key={m.name} className="border-t border-border pt-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="grid size-10 place-items-center control-avatar rounded-full text-xs">{m.initials}</span>
              <Button variant="ghost" size="sm" onClick={() => setMember(m)}>Ver perfil</Button>
            </div>
            <h2 className="text-sm">{m.name}</h2>
            <p className="mt-2 text-xs text-muted-foreground">{m.role}</p>
            <p className="mt-5 text-[10px] text-muted-foreground">{m.area}</p>
          </div>
        ))}
      </div>
      <Dialog open={!!member} onOpenChange={o => !o && setMember(null)}>
        <DialogContent>
          {member && (
            <>
              <DialogTitle>{member.name}</DialogTitle>
              <DialogDescription>{member.role}</DialogDescription>
              <p className="py-6 text-sm">{member.area}</p>
              <p className="text-xs text-muted-foreground">Prévia do perfil. Segurança e permissões não são editáveis.</p>
            </>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}

export function SettingsView() {
  const [name, setName] = useState("Workspace V3X");
  const [animation, setAnimation] = useState(true);
  const [digest, setDigest] = useState(false);
  const [compact, setCompact] = useState(false);
  return (
    <main className="max-w-4xl p-5 md:p-8 lg:p-10">
      <span className="label-mono">WORKSPACE / PREFERÊNCIAS</span>
      <h1 className="my-3 text-3xl">Configurações</h1>
      <p className="mb-10 text-xs text-muted-foreground">Preferências de demonstração. Nenhuma alteração de conta ou segurança.</p>
      <section className="border-t border-border py-8">
        <h2 className="mb-6 text-sm">Geral</h2>
        <div className="max-w-md space-y-2">
          <Label htmlFor="workspace-name">Nome do workspace</Label>
          <Input id="workspace-name" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div className="mt-5 max-w-md space-y-2">
          <Label htmlFor="language">Idioma da interface</Label>
          <select id="language" className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm" defaultValue="Português">
            <option>Português</option>
            <option>English (prévia)</option>
          </select>
        </div>
      </section>
      <section className="border-t border-border py-8">
        <h2 className="mb-6 text-sm">Interface</h2>
        {[
          { id: "animation", label: "Efeitos de movimento", description: "Preferência de animação da interface", value: animation, set: setAnimation },
          { id: "compact", label: "Densidade compacta", description: "Listas mais densas", value: compact, set: setCompact },
          { id: "digest", label: "Resumo semanal", description: "Prévia: nenhum e-mail é enviado", value: digest, set: setDigest },
        ].map(s => (
          <div key={s.id} className="flex items-center justify-between border-b border-border py-5">
            <div>
              <Label htmlFor={s.id}>{s.label}</Label>
              <p className="mt-2 text-xs text-muted-foreground">{s.description}</p>
            </div>
            <Switch id={s.id} checked={s.value} onCheckedChange={s.set} />
          </div>
        ))}
      </section>
      <section className="border-t border-border py-8">
        <h2 className="mb-3 text-sm">Segurança e acesso</h2>
        <p className="mb-4 text-xs text-muted-foreground">Indisponível neste protótipo visual.</p>
        <Button variant="outline" disabled>Gerenciar permissões</Button>
      </section>
      <Button onClick={() => toast.success("Preferências aplicadas localmente", { description: "Nada foi salvo em servidor." })}>
        Aplicar preferências localmente
      </Button>
    </main>
  );
}
