"use client";

import { forwardRef, useId } from "react";

/* Geometry of the official V3X X (same as XMark). */
const FRONT = "5,0 98,0 301,194 208,194";
const BACK = "228,0 315,0 94,194 0,194";

/**
 * Layered composition built from the official X, used only in the hero:
 * a technical outline layer, the two bars of the symbol as separate pieces
 * (so they can meet on entrance) and a light layer. The logo files are untouched.
 */
export const HeroMark = forwardRef<HTMLDivElement>(function HeroMark(_, ref) {
  const id = useId().replace(/:/g, "");
  return (
    <div ref={ref} className="hero-mark relative aspect-[331/211] w-full [transform-style:preserve-3d]">
      <div data-depth="-0.6" className="hm-layer hm-glow absolute inset-[-30%]" />

      <svg data-depth="1.5" viewBox="-8 -8 331 211" className="hm-layer absolute inset-0 h-full w-full overflow-visible" aria-hidden>
        <defs>
          <linearGradient id={`${id}-o`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#3882F6" />
            <stop offset="1" stopColor="#8856CF" />
          </linearGradient>
        </defs>
        <g className="hm-outline" transform="translate(26 18)">
          <polygon points={FRONT} fill="none" stroke={`url(#${id}-o)`} strokeWidth="0.9" pathLength={1} strokeLinejoin="round" />
          <polygon points={BACK} fill="none" stroke={`url(#${id}-o)`} strokeWidth="0.9" pathLength={1} strokeLinejoin="round" />
        </g>
        <g className="hm-ticks" stroke="#A0A0A0" strokeOpacity="0.45" strokeWidth="0.8">
          <path d="M-6 -6h12M-6 -6v12" fill="none" />
          <path d="M321 203h-12M321 203v-12" fill="none" />
        </g>
      </svg>

      <svg data-depth="1" viewBox="-8 -8 331 211" className="hm-layer absolute inset-0 h-full w-full overflow-visible" aria-hidden>
        <defs>
          <linearGradient id={`${id}-f`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#2F8BFF" />
            <stop offset="1" stopColor="#8B5CF6" />
          </linearGradient>
          <linearGradient id={`${id}-b`} x1="1" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#CDBBFF" />
            <stop offset="1" stopColor="#86B4FF" />
          </linearGradient>
          <mask id={`${id}-gap`} maskUnits="userSpaceOnUse" x="-30" y="-30" width="380" height="260">
            <rect x="-30" y="-30" width="380" height="260" fill="#fff" />
            <polygon points={FRONT} fill="#000" stroke="#000" strokeWidth="18" strokeLinejoin="round" />
          </mask>
        </defs>
        <g className="hm-back">
          <polygon mask={`url(#${id}-gap)`} points={BACK} fill={`url(#${id}-b)`} stroke={`url(#${id}-b)`} strokeWidth="8" strokeLinejoin="round" />
        </g>
        <g className="hm-front">
          <polygon points={FRONT} fill={`url(#${id}-f)`} stroke={`url(#${id}-f)`} strokeWidth="8" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
});
