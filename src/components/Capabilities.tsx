'use client';

import { useEffect, useRef, type ReactElement } from 'react';

const KEYS = ['brand', 'product', 'motion', 'ai', 'web', 'three'] as const;

const ICONS: Record<typeof KEYS[number], ReactElement> = {
  brand: <svg viewBox="0 0 50 50" fill="none"><circle cx="25" cy="25" r="24" stroke="currentColor" /><circle cx="25" cy="25" r="12" stroke="currentColor" /><circle cx="25" cy="25" r="2" fill="currentColor" /></svg>,
  product: <svg viewBox="0 0 50 50" fill="none"><rect x="6" y="6" width="38" height="28" rx="2" stroke="currentColor" /><rect x="6" y="38" width="38" height="6" rx="2" stroke="currentColor" /><circle cx="14" cy="20" r="2" fill="currentColor" /></svg>,
  motion: <svg viewBox="0 0 50 50" fill="none"><path d="M5 25 Q15 5, 25 25 T45 25" stroke="currentColor" fill="none" /><circle cx="5" cy="25" r="2" fill="currentColor" /><circle cx="45" cy="25" r="2" fill="currentColor" /></svg>,
  ai: <svg viewBox="0 0 50 50" fill="none"><polygon points="25,4 46,16 46,34 25,46 4,34 4,16" stroke="currentColor" fill="none" /><circle cx="25" cy="25" r="6" stroke="currentColor" /></svg>,
  web: <svg viewBox="0 0 50 50" fill="none"><circle cx="25" cy="25" r="22" stroke="currentColor" /><ellipse cx="25" cy="25" rx="22" ry="9" stroke="currentColor" /><path d="M25 3 V47" stroke="currentColor" /></svg>,
  three: <svg viewBox="0 0 50 50" fill="none"><path d="M25 5 L45 17 L45 33 L25 45 L5 33 L5 17 Z" stroke="currentColor" fill="none" /><path d="M25 5 L25 45 M5 17 L45 33 M45 17 L5 33" stroke="currentColor" /></svg>
};

export default function Capabilities({ t }: { t: any }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cards = ref.current?.querySelectorAll<HTMLElement>('[data-cap]') || [];
    const handlers: Array<{ el: HTMLElement; fn: (e: MouseEvent) => void }> = [];
    cards.forEach((card) => {
      const fn = (e: MouseEvent) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
        card.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
      };
      card.addEventListener('mousemove', fn);
      handlers.push({ el: card, fn });
    });
    return () => handlers.forEach(({ el, fn }) => el.removeEventListener('mousemove', fn));
  }, []);

  return (
    <section className="px-5 md:px-10 py-32 md:py-40 relative" id="services">
      <div className="grid md:grid-cols-3 gap-10 mb-16 md:mb-24 reveal">
        <div className="font-mono text-[11px] tracking-[0.16em] text-cyan uppercase flex items-start gap-2.5">
          <span className="w-1.5 h-1.5 mt-1 bg-cyan rounded-full shadow-[0_0_12px_var(--cyan)]" />
          {t.label}
        </div>
        <h2 className="md:col-span-2 font-serif font-light text-[40px] md:text-[6vw] leading-[0.95] tracking-[-0.03em]" dangerouslySetInnerHTML={{ __html: t.title }} />
      </div>

      <div ref={ref} className="grid md:grid-cols-2 gap-px bg-line border-y border-line">
        {KEYS.map((k, i) => (
          <div
            key={k}
            data-cap
            data-hover
            className="cap-card bg-bg p-10 md:p-14 min-h-[340px] flex flex-col justify-between relative overflow-hidden transition-colors duration-500 hover:bg-bg-2 reveal"
            style={{ '--mx': '50%', '--my': '50%' } as React.CSSProperties}
          >
            <span className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none cap-glow" />
            <div className="font-mono text-[11px] text-ink-mute tracking-wide">00{i + 1} / {k.toUpperCase()}</div>
            <div className="absolute top-10 right-10 w-12 h-12 text-cyan opacity-60 transition-all duration-700 hover:rotate-45 hover:scale-110 hover:opacity-100">
              {ICONS[k]}
            </div>
            <h3 className="font-serif font-light text-[32px] md:text-[3.2vw] tracking-[-0.02em] leading-none mt-auto mb-5 relative z-[1]"
                dangerouslySetInnerHTML={{ __html: t.items[k].title }} />
            <p className="text-sm leading-relaxed text-ink-dim max-w-[380px] relative z-[1]">{t.items[k].desc}</p>
          </div>
        ))}
      </div>

      <style jsx>{`
        .cap-card { cursor: none; }
        @media (max-width: 900px) { .cap-card { cursor: pointer; } }
        .cap-glow {
          background: radial-gradient(circle at var(--mx) var(--my), rgba(77,200,255,0.15), transparent 50%);
        }
        .cap-card:hover .cap-glow { opacity: 1; }
        :global(.cap-card em) { font-style: italic; color: var(--cyan); }
      `}</style>
    </section>
  );
}
