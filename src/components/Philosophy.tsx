"use client";

import { useEffect, useRef } from "react";

export default function Philosophy({ t }: { t: any }) {
  const cvsRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cvs = cvsRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0,
      h = 0;
    let animationFrameId = 0;
    let isVisible = true;

    const resize = () => {
      const r = cvs.getBoundingClientRect();
      w = cvs.width = r.width * dpr;
      h = cvs.height = r.height * dpr;
    };
    resize();

    const observer = new IntersectionObserver((entries) => {
      isVisible = entries[0].isIntersecting;
      if (isVisible && animationFrameId === 0) animate();
    });
    observer.observe(cvs);

    const ro = new ResizeObserver(resize);
    ro.observe(cvs);

    let t0 = 0;
    const colors = [
      "rgba(77, 200, 255, 0.16)",
      "rgba(37, 150, 255, 0.10)",
      "rgba(255, 122, 45, 0.07)",
    ];

    const animate = () => {
      if (!isVisible) {
        animationFrameId = 0;
        return;
      }
      t0 += 0.005;
      ctx.fillStyle = "rgba(5,9,15,0.3)";
      ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < 3; i++) {
        const cx = w * 0.5 + Math.sin(t0 * 0.7 + i * 2) * w * 0.3;
        const cy = h * 0.5 + Math.cos(t0 * 0.5 + i * 1.7) * h * 0.3;
        const r = (200 + Math.sin(t0 + i) * 100) * dpr;
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        g.addColorStop(0, colors[i]);
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      ro.disconnect();
      observer.disconnect();
    };
  }, []);

  return (
    <section
      className="px-5 md:px-10 py-28 md:py-48 text-center border-y border-line relative overflow-hidden"
      id="about"
    >
      <canvas
        ref={cvsRef}
        className="absolute inset-0 w-full h-full z-0 opacity-50 pointer-events-none"
      />
      <div className="relative z-[1] max-w-[16ch] md:max-w-[20ch] mx-auto reveal">
        <p
          className="font-serif font-light text-[28px] md:text-[3.4vw] leading-[1.25] tracking-[-0.01em] text-balance"
          dangerouslySetInnerHTML={{ __html: t.quote }}
        />
        <div className="mt-8 md:mt-12 font-mono text-[10px] md:text-[11px] tracking-[0.16em] text-ink-dim uppercase">
          {t.attr}
        </div>
      </div>
    </section>
  );
}
