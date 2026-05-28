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

function drawThumb(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  colors: [string, string],
  time: number,
) {
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, colors[1]);
  g.addColorStop(1, colors[0] + "40");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = colors[0];
  ctx.lineWidth = 1;
  for (let j = 0; j < 5; j++) {
    ctx.globalAlpha = 0.3 + j * 0.1;
    ctx.beginPath();
    for (let x = 0; x < w; x += 2) {
      const y =
        h / 2 + Math.sin(x * 0.02 + time + j * 0.5) * h * 0.2 * (1 + j * 0.1);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

export default function WorkList({
  t,
  locale,
  projects,
}: {
  t: any;
  locale: string;
  projects: Project[];
}) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const [activeProj, setActiveProj] = useState<Project | null>(null);
  const [selectedProj, setSelectedProj] = useState<Project | null>(null);

  const thumbCanvases = useRef<
    Array<{ cvs: HTMLCanvasElement; proj: Project }>
  >([]);

  useEffect(() => {
    const thumbCanvases_local: Array<{
      cvs: HTMLCanvasElement;
      proj: Project;
    }> = [];
    const containers = document.querySelectorAll("[data-thumb]");
    containers.forEach((container, idx) => {
      if (idx < projects.length) {
        const cvs = container as HTMLCanvasElement;
        cvs.width = 64 * dpr;
        cvs.height = 40 * dpr;
        thumbCanvases_local.push({ cvs, proj: projects[idx] });
      }
    });
    thumbCanvases.current = thumbCanvases_local;
  }, [projects, dpr]);

  useEffect(() => {
    const prevCvs = document.getElementById("prev-cvs") as HTMLCanvasElement;
    if (!prevCvs) return;
    prevCvs.width = 380 * dpr;
    prevCvs.height = 240 * dpr;

    let raf = 0;
    const animLoop = () => {
      const t = performance.now() * 0.001;
      thumbCanvases.current.forEach(({ cvs, proj }) => {
        const c = cvs.getContext("2d");
        if (c) drawThumb(c, cvs.width, cvs.height, proj.colors, t);
      });
      if (activeProj && prevCvs) {
        const c = prevCvs.getContext("2d");
        if (c)
          drawThumb(c, prevCvs.width, prevCvs.height, activeProj.colors, t);
      }
      raf = requestAnimationFrame(animLoop);
    };
    raf = requestAnimationFrame(animLoop);
    return () => cancelAnimationFrame(raf);
  }, [activeProj, dpr]);

  return (
    <section className="px-5 md:px-10 py-32 md:py-40 relative" id="work">
      <div className="grid md:grid-cols-3 gap-10 mb-16 md:mb-24 reveal">
        <div className="font-mono text-[11px] tracking-[0.16em] text-cyan uppercase flex items-start gap-2.5">
          <span className="w-1.5 h-1.5 mt-1 bg-cyan rounded-full shadow-[0_0_12px_var(--cyan)]" />
          {t.label}
        </div>
        <h2
          className="md:col-span-2 font-serif font-light text-[40px] md:text-[6vw] leading-[0.95] tracking-[-0.03em]"
          dangerouslySetInnerHTML={{ __html: t.title }}
        />
      </div>

      <div className="flex flex-col reveal">
        {projects.map((proj, i) => (
          <div
            key={proj.id}
            onClick={() => setSelectedProj(proj)}
            onMouseEnter={() => setActiveProj(proj)}
            onMouseLeave={() => setActiveProj(null)}
            onMouseMove={(e) => {
              const pv = document.getElementById("preview");
              if (pv) {
                pv.style.left = e.clientX + "px";
                pv.style.top = e.clientY + "px";
              }
            }}
            className="group work-item grid grid-cols-[1fr_auto] md:grid-cols-[48px_1fr_160px_80px] gap-6 md:gap-8 items-center border-t border-line py-8 md:py-12 cursor-pointer relative transition-all hover:py-10 md:hover:py-14"
          >
            <span className="hidden md:block font-mono text-[11px] text-ink-mute">
              {String(i + 1).padStart(2, "0")}
            </span>

            <h3 className="font-serif font-light text-[24px] md:text-[3.5vw] leading-tight tracking-[-0.02em] flex items-center gap-3 md:gap-5 transition-transform group-hover:translate-x-5">
              <span
                dangerouslySetInnerHTML={{
                  __html: locale === "ru" ? proj.nameRu : proj.name,
                }}
              />
              <span className="text-cyan opacity-0 transform -translate-x-3 transition-all group-hover:opacity-100 group-hover:translate-x-0">
                ↗
              </span>
            </h3>

            <span className="hidden md:block font-mono text-[11px] text-ink-dim uppercase">
              {locale === "ru" ? proj.tagRu : proj.tag}
            </span>
            <span className="hidden md:block font-mono text-[11px] text-ink-dim">
              {proj.year}
            </span>

            <canvas
              data-thumb
              className="w-16 h-10 md:w-[80px] md:h-12 rounded"
            />
          </div>
        ))}
        {projects.length === 0 && (
          <div className="border-t border-line py-8 text-center text-ink-dim">
            Проекты ещё не добавлены
          </div>
        )}
      </div>

      <div
        id="preview"
        className="fixed w-[380px] h-[240px] rounded-xl overflow-hidden pointer-events-none z-99 opacity-0 transform -translate-x-1/2 -translate-y-1/2 scale-85 transition-all duration-300"
        style={{ boxShadow: "0 30px 80px rgba(0,0,0,0.7)" }}
      >
        <canvas id="prev-cvs" className="w-full h-full" />
      </div>

      {selectedProj && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedProj(null)}
        >
          <div
            className="bg-bg border border-line rounded-lg max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 md:px-10 py-8 border-b border-line flex justify-between items-start">
              <div>
                <h3 className="font-serif font-light text-[32px] md:text-[4vw] leading-tight tracking-[-0.02em] mb-2">
                  {locale === "ru" ? selectedProj.nameRu : selectedProj.name}
                </h3>
                <p className="font-mono text-[11px] text-cyan uppercase">
                  {locale === "ru" ? selectedProj.tagRu : selectedProj.tag} ·{" "}
                  {selectedProj.year}
                </p>
              </div>
              <button
                onClick={() => setSelectedProj(null)}
                className="text-ink-mute hover:text-ink"
              >
                ✕
              </button>
            </div>
            <div className="px-6 md:px-10 py-8">
              <p className="text-base leading-relaxed text-ink-dim">
                {locale === "ru" ? selectedProj.descRu : selectedProj.desc}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
