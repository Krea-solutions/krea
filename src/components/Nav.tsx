'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Props = { locale: string; t: any };

export default function Nav({ locale, t }: Props) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const setLang = (next: 'en' | 'ru') => {
    document.cookie = `krea_locale=${next}; path=/; max-age=${60 * 60 * 24 * 365}`;
    window.location.reload();
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-5 md:px-10 mix-blend-difference transition-all duration-300"
      style={{ padding: scrolled ? '18px 40px' : '24px 40px' }}
    >
      <Link href="/" className="flex items-center gap-2.5 font-serif text-[22px] font-normal tracking-tight text-white no-underline">
        <span className="w-6 h-6 inline-block">
          <svg viewBox="0 0 24 24" fill="none" className="spin-slow w-full h-full">
            <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="1" />
            <path d="M12 1 L12 23 M1 12 L23 12" stroke="currentColor" strokeWidth="0.5" />
          </svg>
        </span>
        KREA<span className="text-cyan">.</span>
      </Link>

      <ul className="hidden md:flex gap-9 list-none">
        {[
          { href: '#work', label: t.work },
          { href: '#services', label: t.services },
          { href: '#about', label: t.studio },
          { href: '#journal', label: t.journal },
          { href: '#contact', label: t.contact }
        ].map((l) => (
          <li key={l.href}>
            <a
              href={l.href}
              className="text-white text-[13px] tracking-[0.02em] relative py-1.5 inline-block hover-line"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-5">
        <div className="font-mono text-[11px] tracking-[0.08em] text-white flex gap-0.5">
          <button onClick={() => setLang('en')} className={`px-2 py-1.5 ${locale === 'en' ? 'opacity-100' : 'opacity-40'}`}>EN</button>
          <span className="px-0 py-1.5 opacity-30">/</span>
          <button onClick={() => setLang('ru')} className={`px-2 py-1.5 ${locale === 'ru' ? 'opacity-100' : 'opacity-40'}`}>RU</button>
        </div>
        <a
          href="#contact"
          className="hidden sm:flex items-center gap-2 border border-white/25 px-4 py-2.5 rounded-full text-white text-xs tracking-wide hover:bg-white hover:text-black hover:border-white transition-colors"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-cyan pulse-dot shadow-[0_0_8px_var(--cyan)]" />
          {t.cta}
        </a>
      </div>

      <style jsx>{`
        .hover-line::before {
          content: '';
          position: absolute;
          left: 0; bottom: 0;
          width: 0; height: 1px;
          background: currentColor;
          transition: width .4s cubic-bezier(.22,1,.36,1);
        }
        .hover-line:hover::before { width: 100%; }
      `}</style>
    </nav>
  );
}
