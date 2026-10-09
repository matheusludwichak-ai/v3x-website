import { useId } from "react";

/** Official V3X "X" symbol (same geometry as the brand presentation). */
export function XMark({ className, title }: { className?: string; title?: string }) {
  const id = useId().replace(/:/g, "");
  const front = `${id}-front`;
  const back = `${id}-back`;
  const gap = `${id}-gap`;
  return (
    <svg viewBox="-8 -8 331 211" className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true}>
      {title && <title>{title}</title>}
      <defs>
        <linearGradient id={front} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2F8BFF" />
          <stop offset="1" stopColor="#8B5CF6" />
        </linearGradient>
        <linearGradient id={back} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#CDBBFF" />
          <stop offset="1" stopColor="#86B4FF" />
        </linearGradient>
        <mask id={gap} maskUnits="userSpaceOnUse" x="-30" y="-30" width="380" height="260">
          <rect x="-30" y="-30" width="380" height="260" fill="#fff" />
          <polygon points="5,0 98,0 301,194 208,194" fill="#000" stroke="#000" strokeWidth="18" strokeLinejoin="round" />
        </mask>
      </defs>
      <polygon mask={`url(#${gap})`} points="228,0 315,0 94,194 0,194" fill={`url(#${back})`} stroke={`url(#${back})`} strokeWidth="8" strokeLinejoin="round" />
      <polygon points="5,0 98,0 301,194 208,194" fill={`url(#${front})`} stroke={`url(#${front})`} strokeWidth="8" strokeLinejoin="round" />
    </svg>
  );
}
