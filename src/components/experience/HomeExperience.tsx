"use client";

import { useEffect, useState } from "react";
import { Hero } from "./Hero";
import { Pillars } from "./Pillars";
import { Works } from "./Works";
import { Founders, Closing, ContactDialog } from "./Closing";
import { AmbientLight } from "./AmbientLight";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { scrollToTarget } from "@/lib/motion";

/** Section anchors from the previous version of the site, still present in old links and history. */
const LEGACY_ANCHORS: Record<string, string> = { pillars: "servicos", work: "projetos", people: "fundadores" };

export function HomeExperience() {
  const [contact, setContact] = useState(false);

  useEffect(() => {
    const clean = () => window.history.replaceState(null, "", window.location.pathname + window.location.search);

    const followHash = () => {
      const hash = window.location.hash.slice(1);
      if (!hash) return;
      const target = LEGACY_ANCHORS[hash] ?? hash;
      clean();
      setTimeout(() => scrollToTarget(document.getElementById(target)), 350);
    };
    followHash();
    window.addEventListener("hashchange", followHash);

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element | null)?.closest?.("a[href^='#']");
      if (!link) return;
      const id = link.getAttribute("href")!.slice(1);
      const target = id ? document.getElementById(id) : null;
      if (id && !target) return;
      e.preventDefault();
      scrollToTarget(target);
      clean();
    };
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("hashchange", followHash);
    };
  }, []);

  return (
    <>
      <SiteHeader />
      <AmbientLight />
      <main className="w-full max-w-full overflow-x-clip">
        <Hero onContact={() => setContact(true)} />
        <Pillars />
        <Works />
        <Founders />
        <Closing onContact={() => setContact(true)} />
      </main>
      <SiteFooter />
      <ContactDialog open={contact} onOpenChange={setContact} />
    </>
  );
}
