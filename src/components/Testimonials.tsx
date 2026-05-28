"use client";

import { useEffect, useState } from "react";

type Testimonial = {
  id: string;
  quote: string;
  quoteRu: string;
  author: string;
  role: string;
};

export default function Testimonials({
  t,
  locale,
  testimonials,
}: {
  t: any;
  locale: string;
  testimonials: Testimonial[];
}) {
  const [items, setItems] = useState(testimonials);

  useEffect(() => {
    const fetch_testi = async () => {
      const res = await fetch("/api/testimonials");
      const data = await res.json();
      if (data.ok) setItems(data.testimonials);
    };
    fetch_testi();
  }, []);

  return (
    <section
      className="px-5 md:px-10 py-24 md:py-40 border-b border-line"
      id="journal"
    >
      <div className="grid md:grid-cols-3 gap-10 mb-16 reveal">
        <div className="font-mono text-[11px] tracking-[0.16em] text-cyan uppercase flex items-start gap-2.5">
          <span className="w-1.5 h-1.5 mt-1 bg-cyan rounded-full shadow-[0_0_12px_var(--cyan)]" />
          {t.label}
        </div>
        <h2
          className="md:col-span-2 font-serif font-light text-[40px] md:text-[6vw] leading-[0.95] tracking-[-0.03em]"
          dangerouslySetInnerHTML={{ __html: t.title }}
        />
      </div>

      <div className="grid md:grid-cols-3 gap-px bg-line border-y border-line">
        {items.map((item: Testimonial) => (
          <div
            key={item.id}
            className="bg-bg p-9 md:p-12 flex flex-col gap-7 min-h-[380px] reveal"
          >
            <p className="font-serif font-light text-[22px] leading-[1.35] tracking-[-0.01em] flex-1 relative">
              <span className="absolute -top-4 -left-2 text-[60px] text-cyan opacity-30 leading-none">
                „
              </span>
              <span className="relative">
                {locale === "ru" ? item.quoteRu : item.quote}
              </span>
            </p>
            <div className="border-t border-line pt-5 flex justify-between font-mono text-[11px] tracking-wide uppercase">
              <span className="text-ink">{item.author}</span>
              <span className="text-ink-dim">{item.role}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
