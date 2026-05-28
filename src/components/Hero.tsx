"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Navigator {
    deviceMemory?: number;
    hardwareConcurrency?: number;
  }
}

export default function Hero({ t }: { t: any }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const [tickerIdx, setTickerIdx] = useState(0);

  const tickers = [
    t.ticker,
    "IDENTITY · MOTION · 3D",
    "AI · WEB · INFRASTRUCTURE",
    "STRATEGY · DESIGN · CODE",
  ];

  useEffect(() => {
    const i = setInterval(
      () => setTickerIdx((v) => (v + 1) % tickers.length),
      3000,
    );
    return () => clearInterval(i);
  }, [tickers.length]);

  // Flow-field canvas (cyan with subtle accent glow)
  useEffect(() => {
    // Check for reduced motion preference
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) {
      // Render a simple static background instead of heavy animation
      const cvs = canvasRef.current;
      if (!cvs) return;
      const ctx = cvs.getContext("2d")!;
      let w = 0,
        h = 0;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5); // Cap lower for reduced motion
      const resize = () => {
        w = cvs.width = window.innerWidth * dpr;
        h = cvs.height = window.innerHeight * dpr;
        cvs.style.width = window.innerWidth + "px";
        cvs.style.height = window.innerHeight + "px";
      };
      resize();
      window.addEventListener("resize", resize);

      // Draw a simple static gradient
      const drawStatic = () => {
        ctx.clearRect(0, 0, w, h);
        // Background gradient
        const grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, "rgba(5,9,15,1)");
        grad.addColorStop(0.5, "rgba(10,18,32,0.8)");
        grad.addColorStop(1, "rgba(5,9,15,1)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
        // Optional subtle cyan glow
        ctx.globalCompositeOperation = "screen";
        const glow = ctx.createRadialGradient(
          w * 0.5,
          h * 0.5,
          0,
          w * 0.5,
          h * 0.5,
          w * 0.5,
        );
        glow.addColorStop(0, "rgba(77,200,255,0.1)");
        glow.addColorStop(1, "rgba(77,200,255,0)");
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, w, h);
        ctx.globalCompositeOperation = "source-over";
      };
      drawStatic();

      return () => {
        window.removeEventListener("resize", resize);
      };
    }

    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d")!;
    let w = 0,
      h = 0;
    // Cap DPR to 1.5 for performance, but allow up to 2 on high-end devices
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const resize = () => {
      w = cvs.width = window.innerWidth * dpr;
      h = cvs.height = window.innerHeight * dpr;
      cvs.style.width = window.innerWidth + "px";
      cvs.style.height = window.innerHeight + "px";
    };
    resize();
    window.addEventListener("resize", resize);

    // Adaptive particle count based on device capabilities
    let baseCount = 80;
    if (navigator.deviceMemory && navigator.deviceMemory < 4) {
      baseCount = 50;
    } else if (
      navigator.hardwareConcurrency &&
      navigator.hardwareConcurrency < 4
    ) {
      baseCount = 60;
    }
    const PCOUNT = baseCount;

    const particles = Array.from({ length: PCOUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      z: Math.random() * 1 + 0.2,
      life: Math.random(),
    }));

    let mx = 0.5,
      my = 0.5;
    const onMove = (e: MouseEvent) => {
      mx = e.clientX / window.innerWidth;
      my = e.clientY / window.innerHeight;
    };
    window.addEventListener("mousemove", onMove);

    let t = 0;
    let raf = 0;
    const draw = () => {
      t += 0.004;

      // Trail fade
      ctx.fillStyle = "rgba(5,9,15,0.18)";
      ctx.fillRect(0, 0, w, h);

      // Background bloom
      const g = ctx.createRadialGradient(
        mx * w,
        my * h,
        0,
        mx * w,
        my * h,
        w * 0.55,
      );
      g.addColorStop(0, "rgba(37, 150, 255, 0.18)");
      g.addColorStop(0.5, "rgba(11, 58, 122, 0.08)");
      g.addColorStop(1, "rgba(5,9,15,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      // Flow lines (cyan) - simplified math
      ctx.strokeStyle = "rgba(77, 200, 255, 0.55)";
      ctx.lineWidth = 1 * dpr;
      for (const p of particles) {
        // Reduced trigonometric operations
        const nx =
          Math.sin(p.x * 0.003 + t * 0.5) + Math.cos(p.y * 0.003 + t * 0.5);
        const ny =
          Math.cos(p.x * 0.003 - t * 0.4) + Math.sin(p.y * 0.003 + t * 0.4);
        const vx = nx * 0.6 * p.z;
        const vy = ny * 0.6 * p.z;
        const px = p.x,
          py = p.y;
        p.x += vx;
        p.y += vy;
        p.life += 0.003; // Slower life decay

        ctx.globalAlpha = Math.min(1, p.z * 0.6);
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();

        if (p.x < 0 || p.x > w || p.y < 0 || p.y > h || p.life > 1) {
          p.x = Math.random() * w;
          p.y = Math.random() * h;
          p.life = 0;
        }
      }
      ctx.globalAlpha = 1;

      // Orange accent blob (small, subtle)
      ctx.globalCompositeOperation = "screen";
      const orange = ctx.createRadialGradient(
        (1 - mx) * w * 0.7 + w * 0.15,
        (1 - my) * h * 0.6 + h * 0.2,
        0,
        (1 - mx) * w * 0.7 + w * 0.15,
        (1 - my) * h * 0.6 + h * 0.2,
        180 * dpr,
      );
      orange.addColorStop(0, "rgba(255, 122, 45, 0.12)");
      orange.addColorStop(1, "rgba(255, 122, 45, 0)");
      ctx.fillStyle = orange;
      ctx.fillRect(0, 0, w, h);

      // Cursor glow (cyan)
      const blob = ctx.createRadialGradient(
        mx * w,
        my * h,
        0,
        mx * w,
        my * h,
        240 * dpr,
      );
      blob.addColorStop(0, "rgba(157, 217, 255, 0.18)");
      blob.addColorStop(1, "rgba(157, 217, 255, 0)");
      ctx.fillStyle = blob;
      ctx.fillRect(0, 0, w, h);

      ctx.globalCompositeOperation = "source-over";
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  // Magnetic CTA
  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
    };
    const leave = () => {
      el.style.transform = "";
    };
    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", leave);
    return () => {
      el.removeEventListener("mousemove", move);
      el.removeEventListener("mouseleave", leave);
    };
  }, []);

  const words = [t.title1, t.title2, t.title3, t.title4];

  return (
    <section className="relative min-h-screen px-5 md:px-10 flex flex-col justify-end overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-[1]"
      />

      <div className="relative z-[2] pb-14">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-5 mb-10 font-mono text-[11px] tracking-[0.1em] text-ink-dim uppercase">
          <div className="flex flex-col gap-1.5 min-h-[3.5rem]">
            <div className="text-ink-mute">{t.metaLeft}</div>
            <div>{t.metaLeftSub}</div>
          </div>
          <div className="flex flex-col gap-1.5 md:text-right min-h-[3.5rem]">
            <div className="text-ink-mute">{t.metaRight}</div>
            <div className="transition-opacity duration-500">
              {tickers[tickerIdx]}
            </div>
          </div>
        </div>

        <h1 className="font-serif font-light text-[64px] md:text-[12vw] lg:text-[14vw] leading-[0.88] tracking-[-0.04em]">
          {words.map((word, i) => (
            <span key={i} className="word-mask mr-[0.08em]">
              <span
                style={{ animationDelay: `${0.2 + i * 0.12}s` }}
                className={
                  i === 1
                    ? "italic text-cyan"
                    : i === 3
                      ? "italic text-accent"
                      : ""
                }
              >
                {word}
              </span>
            </span>
          ))}
        </h1>

        <div className="grid md:grid-cols-3 gap-10 mt-14 items-end fade-up">
          <p className="text-sm leading-relaxed text-ink-dim max-w-[340px]">
            {t.lead}
          </p>

          <div className="flex flex-col gap-3.5 font-mono text-[11px] tracking-[0.08em] text-ink-dim uppercase">
            <div className="flex justify-between border-t border-line pt-2.5">
              <span>{t.stats.projects}</span>
              <span className="text-ink">142</span>
            </div>
            <div className="flex justify-between border-t border-line pt-2.5">
              <span>{t.stats.awards}</span>
              <span className="text-ink">37</span>
            </div>
            <div className="flex justify-between border-t border-line pt-2.5">
              <span>{t.stats.clients}</span>
              <span className="text-ink">68</span>
            </div>
          </div>

          <a
            ref={ctaRef}
            href="#work"
            data-magnetic
            className="justify-self-start md:justify-self-end inline-flex items-center gap-3.5 pl-7 pr-2 py-4 border border-line-strong rounded-full text-ink no-underline text-[13px] tracking-wide transition-all duration-500 relative overflow-hidden hover:border-cyan group"
            style={{
              background: "rgba(10,18,32,0.4)",
              backdropFilter: "blur(20px)",
            }}
          >
            <span className="absolute inset-0 -z-10 bg-cyan translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            {t.cta}
            <span className="w-9 h-9 rounded-full bg-ink text-bg flex items-center justify-center transition-transform duration-500 group-hover:translate-x-1 group-hover:-rotate-45">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M3 11L11 3M11 3H5M11 3V9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
