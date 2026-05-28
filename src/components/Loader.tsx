'use client';

import { useEffect, useState } from 'react';

export default function Loader() {
  const [progress, setProgress] = useState(0);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    let p = 0;
    const id = setInterval(() => {
      p += Math.random() * 8 + 3;
      if (p >= 100) {
        p = 100;
        setProgress(100);
        clearInterval(id);
        setTimeout(() => setGone(true), 450);
      } else {
        setProgress(p);
      }
    }, 80);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="fixed inset-0 z-[10001] flex flex-col items-center justify-center gap-7 bg-bg transition-[opacity,visibility] duration-700"
      style={{ opacity: gone ? 0 : 1, visibility: gone ? 'hidden' : 'visible' }}
    >
      <div className="font-mono text-[13px] tracking-[0.2em] uppercase text-ink-dim flex gap-2">
        {'KREA'.split('').map((c, i) => (
          <span key={i} className="loader-dot" style={{ animationDelay: `${i * 0.15}s` }}>{c}</span>
        ))}
      </div>
      <div className="font-mono text-[11px] tracking-[0.1em] text-ink-mute">
        {String(Math.floor(progress)).padStart(2, '0')}
      </div>
    </div>
  );
}
