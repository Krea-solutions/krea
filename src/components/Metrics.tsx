'use client';

import { useEffect, useRef } from 'react';

type Item = { num: number; suffix?: string; label: string };

export default function Metrics({ t }: { t: any }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const els = ref.current?.querySelectorAll<HTMLElement>('[data-counter]') || [];
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          const el = en.target as HTMLElement;
          const target = parseInt(el.dataset.counter || '0');
          const dur = 1800;
          const start = performance.now();
          const step = (now: number) => {
            const p = Math.min((now - start) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = String(Math.floor(eased * target));
            if (p < 1) requestAnimationFrame(step);
            else el.textContent = String(target);
          };
          requestAnimationFrame(step);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const items: Item[] = [
    { num: 142, label: t.projects.label },
    { num: 37, label: t.awards.label },
    { num: 98, suffix: '%', label: t.retention.label },
    { num: 100, suffix: 'M+', label: t.reach.label }
  ];

  return (
    <section ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-10 px-5 md:px-10 py-24 md:py-32 border-b border-line">
      {items.map((m, i) => (
        <div key={i} className="border-l border-line pl-6 reveal">
          <div className="font-serif font-light text-[60px] md:text-[7vw] leading-none tracking-[-0.04em]">
            <span data-counter={m.num}>0</span>
            {m.suffix && <span className="text-[0.5em] text-ink-dim">{m.suffix}</span>}
          </div>
          <div className="mt-4 font-mono text-[11px] tracking-wide text-ink-dim uppercase max-w-[200px] leading-relaxed"
               dangerouslySetInnerHTML={{ __html: m.label }} />
        </div>
      ))}
    </section>
  );
}
