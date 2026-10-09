import type { Metadata } from "next";
import { HomeExperience } from "@/components/experience/HomeExperience";

export const metadata: Metadata = {
  title: "V3X — Digital Product Studio",
  description: "Criamos produtos digitais que fazem empresas avançarem: sites, motion design, sistemas sob medida e produtos digitais.",
};

export default function HomePage() {
  return <HomeExperience />;
}
