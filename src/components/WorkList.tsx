'use client';

import { useEffect } from 'react';

type Project = { id: number; name: string; nameRu: string; tag: string; tagRu: string; year: string; colors: [string, string]; shape: 'wave' | 'grid' | 'circles' };

const PROJECTS: Project[] = [
  { id: 0, name: 'Aurora <em>Protocol</em>', nameRu: 'Протокол <em>Aurora</em>', tag: 'Brand · Product · AI', tagRu: 'Бренд · Продукт · ИИ', year: '2025', colors: ['#4dc8ff', '#04101e'], shape: 'wave' },
  { id: 1, name: 'Nokto <em>Studio</em>', nameRu: 'Студия <em>Nokto</em>', tag: 'Identity · Web · Motion', tagRu: 'Идентика · Веб · Motion', year: '2025', colors: ['#2596ff', '#040820'], shape: 'grid' },
  { id: 2, name: 'Forma <em>Index</em>', nameRu: 'Индекс <em>Forma</em>', tag: 'Editorial · 3D', tagRu: 'Редактура · 3D', year: '2024', colors: ['#9dd9ff', '#06121f'], shape: 'circles' },
  { id: 3, name: 'Halcyon <em>Bank</em>', nameRu: 'Банк <em>Halcyon</em>', tag: 'Brand · Product System', tagRu: 'Бренд · Продукт', year: '2024', colors: ['#ff7a2d', '#1a0a05'], shape: 'wave' },
  { id: 4, name: 'Voltra <em>EV</em>', nameRu: '<em>Voltra</em> EV', tag: 'Web · WebGL', tagRu: 'Веб · WebGL', year: '2024', colors: ['#4dc8ff', '#02071a'], shape: 'grid' },
  { id: 5, name: 'Cinder <em>Press</em>', nameRu: 'Издательство <em>Cinder</em>', tag: 'Editorial · Type', tagRu: 'Редактура · Типографика', year: '2023', colors: ['#ff7a2d', '#0a0a14'], shape: 'circles' }
];

function drawThumb(ctx: CanvasRenderingContext2D, w: number, h: number, p: Project, time: number) {
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, p.colors[1]);
  g.addColorStop(1, p.colors[0] + '40');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = p.colors[0];
  ctx.fillStyle = p.colors[0];
  ctx.lineWidth = 1;

  if (p.shape === 'wave') {
    for (let j = 0; j < 5; j++) {
      ctx.globalAlpha = 0.3 + j * 0.1;
      ctx.beginPath();
      for (let x = 0; x < w; x += 2) {
        const y = h / 2 + Math.sin(x * 0.02 + time + j * 0.5) * h * 0.2 * (1 + j * 0.1);
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  } else if (p.shape === 'grid') {
    const step = 12;
    for (let x = 0; x < w; x += step) {
      for (let y = 0; y < h; y += step) {
        const d = Math.sin(x * 0.05 + y * 0.05 + time) * 0.5 + 0.5;
        ctx.globalAlpha = d * 0.7;
        ctx.fillRect(x, y, 2, 2);
      }
    }
  } else {
    for (let j = 0; j < 8; j++) {
      const r = (j * 8 + (time * 30) % 40);
      ctx.globalAlpha = (1 - r / 100) * 0.6;
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, r, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
  ctx.globalAlpha = 1;
}

export default function WorkList({ t, locale }: { t: any; locale: string }) {

  // thumbnails
  useEffect(() => {
    const cvs = document.querySelectorAll<HTMLCanvasElement>('[data-thumb]');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;

    const loop = () => {
      const time = performance.now() * 0.001;
      cvs.forEach((c, i) => {
        const r = c.getBoundingClientRect();
        if (c.width !== r.width * dpr) { c.width = r.width * dpr; c.height = r.height * dpr; }
        const ctx = c.getContext('2d')!;
        drawThumb(ctx, c.width, c.height, PROJECTS[i], time);
      });

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section className="px-5 md:px-10 py-32 md:py-40 relative" id="work">
      <div className="grid md:grid-cols-3 gap-10 mb-16 md:mb-24 reveal">
        <div className="md:col-span-1 font-mono text-[11px] tracking-[0.16em] text-cyan uppercase flex items-start gap-2.5">
          <span className="w-1.5 h-1.5 mt-1 bg-cyan rounded-full shadow-[0_0_12px_var(--cyan)]" />
          {t.label}
        </div>
        <h2 className="md:col-span-2 font-serif font-light text-[40px] md:text-[6vw] leading-[0.95] tracking-[-0.03em]" dangerouslySetInnerHTML={{ __html: t.title }} />
      </div>

      <div className="flex flex-col">
        {PROJECTS.map((p) => (
          <a
            key={p.id}
            href="#"
            className="group grid grid-cols-[40px_1fr_60px] md:grid-cols-[60px_1fr_200px_120px_100px] gap-4 md:gap-10 items-center border-t border-line py-6 md:py-10 last:border-b relative transition-all duration-500 hover:py-7 md:hover:py-12 reveal no-underline"
          >
            <span className="absolute left-0 right-0 top-0 h-px bg-ink origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
            <span className="font-mono text-[11px] text-ink-mute tracking-wide">{String(p.id + 1).padStart(2, '0')}</span>
            <span className="font-serif font-light text-[28px] md:text-[4vw] tracking-[-0.02em] leading-none flex items-center gap-6 transition-transform duration-500 group-hover:translate-x-5">
              <span dangerouslySetInnerHTML={{ __html: locale === 'ru' ? p.nameRu : p.name }} className="[&_em]:italic [&_em]:text-cyan" />
              <span className="text-cyan opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">↗</span>
            </span>
            <span className="hidden md:block font-mono text-[11px] tracking-wide text-ink-dim uppercase">
              {locale === 'ru' ? p.tagRu : p.tag}
            </span>
            <span className="hidden md:block font-mono text-[11px] tracking-wide text-ink-dim">{p.year}</span>
            <span className="w-12 h-8 md:w-20 md:h-12 bg-bg-2 rounded overflow-hidden relative">
              <canvas data-thumb className="w-full h-full block" />
            </span>
          </a>
        ))}
      </div>


      <style jsx>{`
        :global(em) { font-style: italic; color: var(--cyan); }
      `}</style>
    </section>
  );
}
