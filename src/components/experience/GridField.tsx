"use client";

import { useEffect, useRef } from "react";

/**
 * Canvas background: a technical dot-grid that bends around the cursor,
 * plus slow drifting scan lines. Pauses when off-screen; static under
 * reduced motion; cursor effects disabled on coarse pointers.
 */
export function GridField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const styles = getComputedStyle(canvas);
    const token = (name: string) => styles.getPropertyValue(name).trim();
    const colors = { dot: token('--field-dot'), highlight: token('--field-highlight'), transparent: token('--field-transparent'), line: token('--field-line'), lineHighlight: token('--field-line-highlight'), ring: token('--field-ring') };
    let w = 0, h = 0, dpr = 1, raf = 0, visible = true;
    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
    const gap = 44;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.tx = e.clientX - r.left; mouse.ty = e.clientY - r.top;
    };
    if (fine) window.addEventListener("pointermove", onMove);

    const io = new IntersectionObserver(([e]) => {
      visible = e?.isIntersecting ?? false;
      if (visible && !reduce) loop(performance.now());
    });
    io.observe(canvas);

    const draw = (t: number) => {
      mouse.x += (mouse.tx - mouse.x) * 0.08;
      mouse.y += (mouse.ty - mouse.y) * 0.08;
      ctx.clearRect(0, 0, w, h);
      const R = 180;
      // dots
      for (let y = gap / 2; y < h; y += gap) {
        for (let x = gap / 2; x < w; x += gap) {
          const dx = x - mouse.x, dy = y - mouse.y;
          const d = Math.hypot(dx, dy);
          let px = x, py = y, s = 1;
          if (d < R) {
            const f = (1 - d / R) ** 2;
            px += (dx / (d || 1)) * f * 18;
            py += (dy / (d || 1)) * f * 18;
            s = 1 + f * 1.2;
          }
          ctx.fillStyle = d < R ? colors.highlight : colors.dot;
          ctx.fillRect(px - s / 2, py - s / 2, s, s);
        }
      }
      // drifting lines
      ctx.lineWidth = 1;
      for (let i = 0; i < 5; i++) {
        const base = ((t * 0.012 * (i + 1) * 0.35 + i * 260) % (h + 200)) - 100;
        const tilt = (mouse.x > 0 ? (mouse.x / w - 0.5) * 40 : 0) * (i % 2 ? 1 : -1);
        const g = ctx.createLinearGradient(0, 0, w, 0);
        g.addColorStop(0, colors.transparent);
        g.addColorStop(0.5, i === 2 ? colors.lineHighlight : colors.line);
        g.addColorStop(1, colors.transparent);
        ctx.strokeStyle = g;
        ctx.beginPath();
        ctx.moveTo(0, base - tilt);
        ctx.lineTo(w, base + tilt);
        ctx.stroke();
      }
      // cursor ring
      if (mouse.x > 0) {
        ctx.strokeStyle = colors.ring;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 64, 0, Math.PI * 2);
        ctx.stroke();
      }
    };

    const loop = (t: number) => {
      cancelAnimationFrame(raf);
      draw(t);
      if (visible && !reduce) raf = requestAnimationFrame(loop);
    };
    loop(0);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="absolute inset-0 h-full w-full" />;
}
