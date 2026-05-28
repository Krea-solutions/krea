"use client";

import { useEffect, useRef, useState } from "react";

type Project = {
  id: string;
  name: string;
  nameRu: string;
  desc: string;
  descRu: string;
  tag: string;
  tagRu: string;
  year: string;
  colors: [string, string];
};

export default function WorkList({
  t,
  locale,
  projects,
}: {
  t: any;
  locale: string;
  projects: Project[];
}) {
  const [selected, setSelected] = useState<Project | null>(null);
  const isRu = locale === "ru";

  // lock scroll when modal open
  useEffect(() => {
    document.body.style.overflow = selected ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selected]);

  if (!projects || projects.length === 0) return null;

  return (
    <section
      id="work"
      className="px-5 md:px-10 py-24 md:py-40 border-b border-line"
    >
      <div className="grid md:grid-cols-3 gap-6 md:gap-10 mb-12 md:mb-20 reveal">
        <div className="font-mono text-[11px] tracking-[0.16em] text-cyan uppercase flex items-start gap-2.5">
          <span className="w-1.5 h-1.5 mt-1 bg-cyan rounded-full shadow-[0_0_12px_var(--cyan)]" />
          {t.label}
        </div>
        <h2 className="md:col-span-2 font-serif font-light text-[32px] md:text-[6vw] leading-[1.0] md:leading-[0.95] tracking-[-0.02em] md:tracking-[-0.03em]">
          {t.title}
        </h2>
      </div>

      <div className="flex flex-col reveal">
        {projects.map((proj, i) => (
          <button
            key={proj.id}
            onClick={() => setSelected(proj)}
            data-hover
            className="group text-left grid grid-cols-[auto_1fr_auto] md:grid-cols-[56px_1fr_auto_auto] gap-4 md:gap-8 items-center border-t border-line last:border-b py-6 md:py-10 transition-all hover:px-2 md:hover:px-4"
          >
            <span className="font-mono text-[11px] text-ink-mute">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="font-serif font-light text-[22px] md:text-[3.4vw] leading-[1.05] tracking-[-0.02em] flex items-center gap-3 md:gap-5 transition-transform duration-500 group-hover:translate-x-2 md:group-hover:translate-x-5">
              <span>{isRu ? proj.nameRu : proj.name}</span>
              <span className="text-cyan opacity-0 -translate-x-3 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0">
                ↗
              </span>
            </span>
            <span className="hidden md:block font-mono text-[11px] text-ink-dim uppercase tracking-wide text-right w-[180px]">
              {isRu ? proj.tagRu : proj.tag}
            </span>
            <span className="font-mono text-[11px] text-ink-dim text-right w-[48px]">
              {proj.year}
            </span>
          </button>
        ))}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-[200] flex items-end md:items-center justify-center p-0 md:p-6"
          onClick={() => setSelected(null)}
        >
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-[fadeIn_0.3s_ease]"
            aria-hidden
          />
          <div
            className="relative w-full md:max-w-3xl bg-bg-2 border border-line-strong md:rounded-2xl rounded-t-2xl overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
            style={{ boxShadow: "0 40px 100px rgba(0,0,0,0.7)" }}
          >
            <div
              className="relative h-40 md:h-56 shrink-0 overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${selected.colors[1]}, ${selected.colors[0]})`,
              }}
            >
              <ModalCanvas colors={selected.colors} />
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/30 backdrop-blur text-white flex items-center justify-center hover:bg-black/50 transition-colors"
                aria-label="Закрыть"
              >
                ✕
              </button>
            </div>

            <div className="p-6 md:p-10 overflow-y-auto">
              <div className="font-mono text-[11px] text-cyan uppercase tracking-[0.12em] mb-3">
                {isRu ? selected.tagRu : selected.tag} · {selected.year}
              </div>
              <h3 className="font-serif font-light text-[30px] md:text-[44px] leading-[1.05] tracking-[-0.02em] mb-5">
                {isRu ? selected.nameRu : selected.name}
              </h3>
              <p className="text-[15px] md:text-base leading-relaxed text-ink-dim max-w-xl">
                {isRu ? selected.descRu : selected.desc}
              </p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </section>
  );
}

function ModalCanvas({ colors }: { colors: [string, string] }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cvs = ref.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;
    const resize = () => {
      const r = cvs.getBoundingClientRect();
      cvs.width = r.width * dpr;
      cvs.height = r.height * dpr;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(cvs);
    let t = 0;
    const draw = () => {
      t += 0.01;
      const w = cvs.width,
        h = cvs.height;
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = colors[0];
      ctx.lineWidth = 1.5 * dpr;
      for (let j = 0; j < 6; j++) {
        ctx.globalAlpha = 0.15 + j * 0.08;
        ctx.beginPath();
        for (let x = 0; x < w; x += 3) {
          const y =
            h / 2 + Math.sin(x * 0.012 + t + j * 0.6) * h * 0.22 * (1 + j * 0.1);
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [colors]);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full" />;
}
