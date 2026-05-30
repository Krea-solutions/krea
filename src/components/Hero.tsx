"use client";

import { useEffect, useRef, useState } from "react";

export default function Hero({ t }: { t: any }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const [tickerIdx, setTickerIdx] = useState(0);

  const tickers = [
    t.ticker,
    "ИДЕНТИКА · МОУШН · 3D",
    "ИИ · ВЕБ · ИНФРАСТРУКТУРА",
    "СТРАТЕГИЯ · ДИЗАЙН · КОД",
  ];

  useEffect(() => {
    const i = setInterval(
      () => setTickerIdx((v) => (v + 1) % tickers.length),
      3000,
    );
    return () => clearInterval(i);
  }, [tickers.length]);

  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d")!;
    let w = 0,
      h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let animationFrameId = 0;
    let isVisible = true;

    const resize = () => {
      w = cvs.width = window.innerWidth * dpr;
      h = cvs.height = window.innerHeight * dpr;
      cvs.style.width = window.innerWidth + "px";
      cvs.style.height = window.innerHeight + "px";
    };
    resize();
    window.addEventListener("resize", resize);

    const observer = new IntersectionObserver((entries) => {
      isVisible = entries[0].isIntersecting;
      if (isVisible && animationFrameId === 0) {
        animate();
      }
    });
    observer.observe(cvs);

    const PCOUNT = 110;
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
    const animate = () => {
      if (!isVisible) {
        animationFrameId = 0;
        return;
      }
      t += 0.004;
      ctx.fillStyle = "rgba(5,9,15,.18)";
      ctx.fillRect(0, 0, w, h);

      const g = ctx.createRadialGradient(
        mx * w,
        my * h,
        0,
        mx * w,
        my * h,
        w * 0.55,
      );
      g.addColorStop(0, "rgba(37,150,255,.18)");
      g.addColorStop(0.5, "rgba(11,58,122,.08)");
      g.addColorStop(1, "rgba(5,9,15,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = "rgba(77,200,255,.55)";
      ctx.lineWidth = 1 * dpr;
      for (const p of particles) {
        const nx = Math.sin(p.x * 0.003 + t) + Math.cos(p.y * 0.004 + t * 0.7);
        const ny =
          Math.cos(p.x * 0.004 - t * 0.5) + Math.sin(p.y * 0.003 + t * 0.3);
        const ox = p.x,
          oy = p.y;
        p.x += nx * 0.8 * p.z;
        p.y += ny * 0.8 * p.z;
        p.life += 0.005;
        ctx.globalAlpha = Math.min(1, p.z * 0.7);
        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
        if (p.x < 0 || p.x > w || p.y < 0 || p.y > h || p.life > 1) {
          p.x = Math.random() * w;
          p.y = Math.random() * h;
          p.life = 0;
        }
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "screen";
      const ob = ctx.createRadialGradient(
        (1 - mx) * w * 0.7 + w * 0.15,
        (1 - my) * h * 0.6 + h * 0.2,
        0,
        (1 - mx) * w * 0.7 + w * 0.15,
        (1 - my) * h * 0.6 + h * 0.2,
        220 * dpr,
      );
      ob.addColorStop(0, "rgba(255,122,45,.16)");
      ob.addColorStop(1, "rgba(255,122,45,0)");
      ctx.fillStyle = ob;
      ctx.fillRect(0, 0, w, h);

      const cg = ctx.createRadialGradient(
        mx * w,
        my * h,
        0,
        mx * w,
        my * h,
        300 * dpr,
      );
      cg.addColorStop(0, "rgba(157,217,255,.22)");
      cg.addColorStop(1, "rgba(157,217,255,0)");
      ctx.fillStyle = cg;
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "source-over";
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
      observer.disconnect();
    };
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-end px-5 md:px-10 pb-14 md:pb-16 overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-[1]"
      />

      <div className="relative z-[2]">
        <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-end mb-10 md:mb-16 font-mono text-[10px] md:text-[11px] tracking-[0.08em] text-ink-dim uppercase">
          <div className="flex flex-col">
            <small className="text-ink-mute mb-1">{t.metaLeft}</small>
            {t.metaLeftSub}
          </div>
          <div className="md:text-right flex flex-col">
            <small className="text-ink-mute mb-1">{t.metaRight}</small>
            <div
              className="transition-opacity duration-500"
              style={{ opacity: 1 }}
            >
              {tickers[tickerIdx]}
            </div>
          </div>
        </div>

        <h1 className="font-serif font-light text-[clamp(40px,13vw,200px)] md:text-[13vw] leading-[1.0] md:leading-[0.9] tracking-[-0.01em] md:tracking-[-0.03em] mb-12 md:mb-16">
          {[t.title1, t.title2, t.title3, t.title4].map((word, i) => {
            const isCyan = i === 1;
            const isOrange = i === 3;
            return (
              <span key={i} className="word-mask block md:inline-block md:mr-[0.22em]">
                <span
                  className={`inline-block ${isCyan ? "text-cyan italic pr-[0.08em]" : isOrange ? "text-accent italic pr-[0.08em]" : ""}`}
                  style={{ animationDelay: `${0.2 + i * 0.12}s` }}
                >
                  {word}
                </span>
              </span>
            );
          })}
        </h1>

        <div className="grid md:grid-cols-3 gap-8 md:gap-16">
          <p className="font-light text-sm leading-relaxed text-ink-dim max-w-xs">
            {t.lead}
          </p>
          <div />
          <a
            href="#work"
            ref={ctaRef}
            className="justify-self-start md:justify-self-end self-start md:self-end inline-flex items-center gap-3.5 pl-7 pr-2.5 py-4 border border-line-strong rounded-full text-ink text-sm transition-all relative overflow-hidden hover:border-cyan group"
            style={{
              background: "rgba(10,18,32,0.4)",
              backdropFilter: "blur(20px)",
            }}
          >
            <span className="absolute inset-0 -z-10 bg-cyan translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <span className="relative z-[1]">{t.cta}</span>
            <span className="w-9 h-9 rounded-full bg-ink text-bg flex items-center justify-center transition-transform group-hover:-rotate-45 relative z-[1]">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 13L13 3M13 3H6M13 3V10"
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
