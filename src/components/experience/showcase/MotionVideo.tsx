"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";

const SRC = "/work/v3x-motion.mp4";
const POSTER = "/work/v3x-motion-poster.jpg";

/** V3X institutional motion piece: loads only near the viewport, plays muted while visible, pauses when it leaves. */
export function MotionVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [failed, setFailed] = useState(false);
  const userPaused = useRef(false);
  const visible = useRef(false);
  const reduce = useRef(false);

  const autoplay = () => {
    const video = ref.current;
    if (video && visible.current && !reduce.current && !userPaused.current) video.play().catch(() => undefined);
  };

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) setNear(true);
        visible.current = entry.intersectionRatio >= 0.45;
        if (visible.current) autoplay();
        if (entry.intersectionRatio < 0.2) video.pause();
      },
      { threshold: [0, 0.2, 0.45, 0.8], rootMargin: "200px 0px" },
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

  const toggle = () => {
    const video = ref.current;
    if (!video) return;
    if (video.paused) {
      userPaused.current = false;
      video.play().catch(() => undefined);
    } else {
      userPaused.current = true;
      video.pause();
    }
  };

  return (
    <div className="phone relative aspect-[9/16] w-full max-w-[340px]" data-cursor={failed ? undefined : playing ? "Pausar" : "Assistir"}>
      <div className="phone-screen bg-black">
        {failed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={POSTER} alt="V3X em movimento, quadro do vídeo institucional" className="h-full w-full object-cover" />
        ) : (
          <video
            ref={ref}
            className="h-full w-full object-cover"
            poster={POSTER}
            src={near ? SRC : undefined}
            preload={near ? "metadata" : "none"}
            muted={muted}
            loop
            playsInline
            onClick={toggle}
            onCanPlay={autoplay}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onError={() => setFailed(true)}
            aria-label="Vídeo institucional da V3X em motion design"
          />
        )}
      </div>
      {!failed && (
        <div className="absolute inset-x-5 bottom-5 flex justify-between">
          <button type="button" onClick={toggle} aria-label={playing ? "Pausar vídeo" : "Reproduzir vídeo"} className="grid size-11 place-items-center rounded-full bg-black/55 text-white backdrop-blur transition-transform hover:scale-105 active:scale-95">
            {playing ? <Pause className="size-4" /> : <Play className="size-4 translate-x-px" />}
          </button>
          <button type="button" onClick={() => setMuted((m) => !m)} aria-label={muted ? "Ativar som" : "Desativar som"} className="grid size-11 place-items-center rounded-full bg-black/55 text-white backdrop-blur transition-transform hover:scale-105 active:scale-95">
            {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
          </button>
        </div>
      )}
    </div>
  );
}
