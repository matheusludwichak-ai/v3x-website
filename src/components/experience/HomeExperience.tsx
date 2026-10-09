"use client";

import { useState } from "react";
import { Hero } from "./Hero";
import { Pillars } from "./Pillars";
import { Works } from "./Works";
import { Founders, Closing, ContactDialog } from "./Closing";

export function HomeExperience() {
  const [contact, setContact] = useState(false);
  return (
    <>
      <Hero onContact={() => setContact(true)} />
      <Pillars />
      <Works />
      <Founders />
      <Closing onContact={() => setContact(true)} />
      <ContactDialog open={contact} onOpenChange={setContact} />
    </>
  );
}
