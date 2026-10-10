"use client";

import { useMemo } from "react";
import { useCollection } from "./client";

/** People, projects and clients used to fill selects and resolve names. */
export function useLookups() {
  const people = useCollection("org_members");
  const projects = useCollection("projects");
  const clients = useCollection("clients");
  return useMemo(() => {
    const activePeople = people.rows.filter((p) => p.active).sort((a, b) => a.sort - b.sort);
    return {
      loading: people.loading || projects.loading || clients.loading,
      people: activePeople,
      projects: projects.rows,
      clients: clients.rows,
      personName: (id?: string | null) => people.rows.find((p) => p.id === id)?.name ?? null,
      projectName: (id?: string | null) => projects.rows.find((p) => p.id === id)?.name ?? null,
      clientName: (id?: string | null) => clients.rows.find((c) => c.id === id)?.name ?? null,
      peopleOptions: activePeople.map((p) => ({ value: p.id, label: p.name })),
      projectOptions: projects.rows.map((p) => ({ value: p.id, label: p.name })),
      clientOptions: clients.rows.map((c) => ({ value: c.id, label: c.name })),
    };
  }, [people.rows, projects.rows, clients.rows, people.loading, projects.loading, clients.loading]);
}
