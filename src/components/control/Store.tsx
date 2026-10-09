"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { initialCollections, type Collections, type CollectionKey, type RecordItem } from "./data";
import { toast } from "sonner";

type Store = { data: Collections; update: (key: CollectionKey, item: RecordItem) => void; remove: (key: CollectionKey, id: string) => void };
const ControlContext = createContext<Store | null>(null);
export function ControlProvider({ children }: { children: ReactNode }) {
 const [data, setData] = useState<Collections>(initialCollections);
 const update = (key: CollectionKey, item: RecordItem) => {
  setData(old => ({ ...old, [key]: old[key].some(r => r.id === item.id) ? old[key].map(r => r.id === item.id ? item : r) : [...old[key], item] }));
  toast.success("Atualizado localmente", { description: "As alterações do protótipo duram enquanto esta página estiver aberta." });
 };
 const remove = (key: CollectionKey, id: string) => { setData(old => ({ ...old, [key]: old[key].filter(r => r.id !== id) })); toast.success("Removido desta demonstração"); };
 return <ControlContext.Provider value={{ data, update, remove }}>{children}</ControlContext.Provider>;
}
export function useControl() { const value = useContext(ControlContext); if (!value) throw new Error("Control provider missing"); return value; }
