'use client';

import { useEffect, useRef } from 'react';

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (reduceMotion) {
      // For reduced motion, just render a simple static cursor (no effects)
      return;
    }

    // Enable custom cursor
    document.body.classList.add('cursor-ready');

    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
      }
    };
    const tick = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
      }
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(tick);

    const enter = () => {
      dotRef.current?.classList.add('expand');
      ringRef.current?.classList.add('hidden');
    };
    const leave = () => {
      dotRef.current?.classList.remove('expand');
      ringRef.current?.classList.remove('hidden');
    };
    const els = document.querySelectorAll('a, button, [data-magnetic], [data-hover]');
    els.forEach((el) => {
      el.addEventListener('mouseenter', enter);
      el.addEventListener('mouseleave', leave);
    });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      els.forEach((el) => {
        el.removeEventListener('mouseenter', enter);
        el.removeEventListener('mouseleave', leave);
      });
      document.body.classList.remove('cursor-ready');
    };
  }, []);

  if (reduceMotion) {
    // Simple static cursor without animation
    return <div className="w-2 h-2 rounded-full bg-ink" style={{ position: 'fixed', pointerEvents: 'none', zIndex: 10000 }} />;
  }

  return (
    <>
      <div ref={dotRef} className="cursor" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}
