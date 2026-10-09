import { notFound } from "next/navigation";
import { CollectionView } from "@/components/control/CollectionView";
import { TeamView, SettingsView } from "@/components/control/TeamSettings";
import type { CollectionKey } from "@/components/control/data";

const COLLECTION_KEYS: CollectionKey[] = ["projects", "tasks", "clients", "pipeline", "portfolio", "motion-library", "blog"];

export function generateStaticParams() {
  return [...COLLECTION_KEYS, "team", "settings"].map((section) => ({ section }));
}

interface Props {
  params: Promise<{ section: string }>;
}

export default async function ControlSectionPage({ params }: Props) {
  const { section } = await params;

  if (section === "team") return <TeamView />;
  if (section === "settings") return <SettingsView />;
  if ((COLLECTION_KEYS as string[]).includes(section)) {
    return <CollectionView collection={section as CollectionKey} />;
  }
  notFound();
}
