'use client';

import { useEffect, useRef } from 'react';

export default function Philosophy({ t }: { t: any }) {
  const cvsRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cvs = cvsRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext('2d')!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0;
    const resize = () => {
      const r = cvs.getBoundingClientRect();
      w = cvs.width = r.width * dpr;
      h = cvs.height = r.height * dpr;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(cvs);

    let t0 = 0;
    let raf = 0;
    const colors = ['rgba(77, 200, 255, 0.18)', 'rgba(37, 150, 255, 0.12)', 'rgba(255, 122, 45, 0.08)'];
    const draw = () => {
      t0 += 0.005;
      ctx.fillStyle = 'rgba(5,9,15,0.3)';
      ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < 3; i++) {
        const cx = w * 0.5 + Math.sin(t0 * 0.7 + i * 2) * w * 0.3;
        const cy = h * 0.5 + Math.cos(t0 * 0.5 + i * 1.7) * h * 0.3;
        const r = (200 + Math.sin(t0 + i) * 100) * dpr;
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        g.addColorStop(0, colors[i]);
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return (
    <section className="px-5 md:px-10 py-32 md:py-48 text-center border-y border-line relative overflow-hidden" id="about">
      <canvas ref={cvsRef} className="absolute inset-0 z-0 opacity-60" />
      <p className="font-serif font-light text-[36px] md:text-[5.5vw] leading-[1.05] tracking-[-0.03em] max-w-[1400px] mx-auto relative z-[1] reveal"
         dangerouslySetInnerHTML={{ __html: t.quote }} />
      <div className="mt-12 font-mono text-[11px] text-ink-dim tracking-[0.16em] uppercase relative z-[1] reveal">
        {t.attr}
      </div>

      <style jsx>{`
        :global(em) { font-style: italic; color: var(--cyan); }
      `}</style>
    </section>
  );
}
