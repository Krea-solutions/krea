"use client";

import { useEffect, useRef } from "react";

type Metric = { id: string; value: string; label: string; labelRu: string };

export default function Metrics({
  t,
  locale,
  metrics,
}: {
  t: any;
  locale: string;
  metrics: Metric[];
}) {
  const ref = useRef<HTMLElement>(null);
  const isRu = locale === "ru";

  useEffect(() => {
    const els = ref.current?.querySelectorAll<HTMLElement>("[data-counter]") || [];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            const el = en.target as HTMLElement;
            const raw = el.dataset.counter || "0";
            const num = parseInt(raw.replace(/\D/g, "")) || 0;
            const suffix = raw.replace(/[0-9]/g, "");
            const dur = 1600;
            const start = performance.now();
            const step = (now: number) => {
              const p = Math.min((now - start) / dur, 1);
              const eased = 1 - Math.pow(1 - p, 3);
              el.textContent = Math.floor(eased * num) + suffix;
              if (p < 1) requestAnimationFrame(step);
              else el.textContent = raw;
            };
            requestAnimationFrame(step);
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.5 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [metrics]);

  if (!metrics || metrics.length === 0) return null;

  return (
    <section
      ref={ref}
      className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12 md:gap-10 px-5 md:px-10 py-20 md:py-32 border-b border-line"
    >
      {metrics.map((m) => (
        <div key={m.id} className="border-l border-line pl-4 md:pl-6 reveal">
          <div className="font-serif font-light text-[48px] md:text-[7vw] leading-none tracking-[-0.04em]">
            <span data-counter={m.value}>0</span>
          </div>
          <div className="mt-3 md:mt-4 font-mono text-[10px] md:text-[11px] tracking-[0.04em] text-ink-dim uppercase max-w-[200px] leading-relaxed">
            {isRu ? m.labelRu : m.label}
          </div>
        </div>
      ))}
    </section>
  );
}
