import type { Metadata } from "next";
import { HomeExperience } from "@/components/experience/HomeExperience";

export const metadata: Metadata = {
  title: "V3X — Digital Product Studio",
  description: "We turn ideas into digital products. Design, technology and motion, built to move businesses forward.",
};

export default function HomePage() {
  return <HomeExperience />;
}
