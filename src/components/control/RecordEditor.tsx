"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { type RecordItem, type CollectionKey, projectStatuses, leadStatuses } from "./data";
import { useControl } from "./Store";

export const statusesFor = (key: CollectionKey) => key === "projects" ? projectStatuses : key === "pipeline" ? leadStatuses : key === "tasks" ? ["To Do", "In Progress", "Completed"] : key === "clients" ? ["Active", "Prospect", "Archived"] : ["Draft", "Published"];

export function RecordEditor({ item, collection, open, onClose }: { item: RecordItem | null; collection: CollectionKey; open: boolean; onClose: () => void }) {
 const { update } = useControl();
 const [draft, setDraft] = useState<RecordItem>({ id: "", title: "", client: "", category: "", owner: "Isabella", status: "Draft", priority: "Medium", deadline: "2026-10-16" });
 useEffect(() => { if (open) setDraft(item ?? { id: crypto.randomUUID(), title: "", client: "Example: ", category: "Design", owner: "Isabella", status: statusesFor(collection)[0] ?? "Draft", priority: "Medium", deadline: "2026-10-16" }); }, [item, collection, open]);
 const set = (field: keyof RecordItem, value: string) => setDraft(d => ({ ...d, [field]: value }));
 const submit = (e: FormEvent) => { e.preventDefault(); update(collection, draft); onClose(); };
 const field = (name: keyof RecordItem, label: string, type = "text") => <div className="space-y-2"><Label htmlFor={"edit-" + name}>{label}</Label><Input id={"edit-" + name} value={draft[name] ?? ""} type={type} required={name === "title"} onChange={e => set(name, e.target.value)} /></div>;
 return <Dialog open={open} onOpenChange={o => !o && onClose()}><DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-xl"><DialogTitle>{item ? "Edit" : "New"} {collection === "blog" ? "article" : collection === "tasks" ? "task" : collection === "clients" ? "client" : collection === "pipeline" ? "opportunity" : collection === "motion-library" ? "motion" : "project"}</DialogTitle><DialogDescription>Illustrative prototype. Changes are local to this session.</DialogDescription><form onSubmit={submit} className="space-y-5">{field("title", collection === "blog" ? "Article title" : "Name")}
 {collection === "blog" ? <>{field("slug", "Slug")}<div className="space-y-2"><Label htmlFor="summary">Summary</Label><Textarea id="summary" value={draft.summary ?? ""} onChange={e => set("summary", e.target.value)} /></div><div className="space-y-2"><Label htmlFor="content">Content</Label><Textarea id="content" rows={6} value={draft.content ?? ""} onChange={e => set("content", e.target.value)} /></div>{field("seo", "SEO title / metadata")}</> : field("client", collection === "tasks" ? "Related project" : "Company / client")}
 <div className="grid grid-cols-2 gap-4">{field("category", "Category")}<div className="space-y-2"><Label htmlFor="edit-owner">Owner / author</Label><select id="edit-owner" value={draft.owner} onChange={e => set("owner", e.target.value)} className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm">{["Isabella", "Matheus", "Emmanuelle", "V3X"].map(v => <option key={v}>{v}</option>)}</select></div></div>
 <div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label htmlFor="edit-status">Status</Label><select id="edit-status" value={draft.status} onChange={e => set("status", e.target.value)} className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm">{statusesFor(collection).map(v => <option key={v}>{v}</option>)}</select></div>{field("deadline", collection === "clients" ? "Last activity" : "Deadline", "date")}</div>
 {collection === "pipeline" && field("value", "Illustrative estimate")}
 <div className="space-y-2"><Label htmlFor="edit-priority">Priority</Label><select id="edit-priority" value={draft.priority} onChange={e => set("priority", e.target.value)} className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm">{["Low", "Medium", "High"].map(v => <option key={v}>{v}</option>)}</select></div>
 <div className="flex justify-end gap-2 border-t border-border pt-4"><Button variant="ghost" type="button" onClick={onClose}>Cancel</Button><Button type="submit">Apply locally</Button></div></form></DialogContent></Dialog>;
}
