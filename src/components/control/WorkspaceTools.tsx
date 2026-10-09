"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, Search, UserRound, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useControl } from "./Store";

export function WorkspaceTools() {
  const { data } = useControl();
  const [search, setSearch] = useState(false);
  const [query, setQuery] = useState("");
  const results = query.trim() ? Object.entries(data).flatMap(([section, items]) => items.filter(item => `${item.title} ${item.client}`.toLowerCase().includes(query.trim().toLowerCase())).map(item => ({ ...item, section }))).slice(0, 12) : [];
  return <div className="flex items-center gap-1 md:gap-3">
    <Button variant="ghost" size="icon" aria-label="Buscar no workspace" onClick={() => setSearch(true)}><Search /></Button>
    <DropdownMenu><DropdownMenuTrigger render={<Button variant="ghost" size="icon" aria-label="Notificações" />}><Bell /></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-72"><DropdownMenuLabel>Notificações · exemplo</DropdownMenuLabel><DropdownMenuSeparator /><div className="space-y-4 p-3 text-xs"><p>O Orbit está pronto para revisão de design.<span className="mt-1 block text-muted-foreground">Há 12 minutos · demonstração</span></p><p>O Monolith tem um prazo próximo.<span className="mt-1 block text-muted-foreground">Hoje · demonstração</span></p></div></DropdownMenuContent></DropdownMenu>
    <DropdownMenu><DropdownMenuTrigger render={<Button variant="secondary" size="icon" aria-label="Menu do perfil" className="rounded-full" />}><UserRound /></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuLabel>V3X · perfil de demonstração</DropdownMenuLabel><DropdownMenuSeparator /><DropdownMenuItem render={<Link href="/control/team" />}><UserRound />Equipe</DropdownMenuItem><DropdownMenuItem render={<Link href="/control/settings" />}><Settings />Configurações</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem render={<Link href="/login" />}><LogOut />Voltar ao login</DropdownMenuItem></DropdownMenuContent></DropdownMenu>
    <Dialog open={search} onOpenChange={setSearch}><DialogContent className="max-h-[85svh] overflow-y-auto"><DialogTitle>Buscar no workspace</DialogTitle><DialogDescription>Busque projetos, tarefas, clientes e conteúdos ilustrativos.</DialogDescription><Input autoFocus aria-label="Buscar em todos os registros" placeholder="Buscar por nome ou cliente…" value={query} onChange={e => setQuery(e.target.value)} /><div className="min-h-24">{!query.trim() ? <p className="py-6 text-center text-xs text-muted-foreground">Digite o nome de um projeto, tarefa ou cliente.</p> : results.length === 0 ? <p className="py-6 text-center text-xs text-muted-foreground">Nenhum registro encontrado.</p> : results.map(item => <Button key={`${item.section}-${item.id}`} variant="ghost" render={<Link href={`/control/${item.section}`} onClick={() => { setSearch(false); setQuery(""); }} />} nativeButton={false} className="h-auto w-full justify-between whitespace-normal border-b border-border py-3 text-left"><span className="min-w-0"><span className="block text-xs">{item.title}</span><span className="mt-1 block text-[10px] text-muted-foreground">{item.client}</span></span><span className="label-mono ml-3">{item.section}</span></Button>)}</div></DialogContent></Dialog>
  </div>;
}
