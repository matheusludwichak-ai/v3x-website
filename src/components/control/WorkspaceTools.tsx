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
    <Button variant="ghost" size="icon" aria-label="Search workspace" onClick={() => setSearch(true)}><Search /></Button>
    <DropdownMenu><DropdownMenuTrigger render={<Button variant="ghost" size="icon" aria-label="Notifications" />}><Bell /></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-72"><DropdownMenuLabel>Notifications · Sample</DropdownMenuLabel><DropdownMenuSeparator /><div className="space-y-4 p-3 text-xs"><p>Orbit is ready for a design review.<span className="mt-1 block text-muted-foreground">12 minutes ago · Demonstration</span></p><p>Monolith has an upcoming deadline.<span className="mt-1 block text-muted-foreground">Today · Demonstration</span></p></div></DropdownMenuContent></DropdownMenu>
    <DropdownMenu><DropdownMenuTrigger render={<Button variant="secondary" size="icon" aria-label="Profile menu" className="rounded-full" />}><UserRound /></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuLabel>V3X · Demo profile</DropdownMenuLabel><DropdownMenuSeparator /><DropdownMenuItem render={<Link href="/control/team" />}><UserRound />Team</DropdownMenuItem><DropdownMenuItem render={<Link href="/control/settings" />}><Settings />Settings</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem render={<Link href="/login" />}><LogOut />Return to login</DropdownMenuItem></DropdownMenuContent></DropdownMenu>
    <Dialog open={search} onOpenChange={setSearch}><DialogContent className="max-h-[85svh] overflow-y-auto"><DialogTitle>Search workspace</DialogTitle><DialogDescription>Search illustrative projects, tasks, clients and content.</DialogDescription><Input autoFocus aria-label="Search all records" placeholder="Search by name or client…" value={query} onChange={e => setQuery(e.target.value)} /><div className="min-h-24">{!query.trim() ? <p className="py-6 text-center text-xs text-muted-foreground">Enter a project, task or client name.</p> : results.length === 0 ? <p className="py-6 text-center text-xs text-muted-foreground">No matching records.</p> : results.map(item => <Button key={`${item.section}-${item.id}`} variant="ghost" render={<Link href={`/control/${item.section}`} onClick={() => { setSearch(false); setQuery(""); }} />} nativeButton={false} className="h-auto w-full justify-between whitespace-normal border-b border-border py-3 text-left"><span className="min-w-0"><span className="block text-xs">{item.title}</span><span className="mt-1 block text-[10px] text-muted-foreground">{item.client}</span></span><span className="label-mono ml-3">{item.section}</span></Button>)}</div></DialogContent></Dialog>
  </div>;
}
