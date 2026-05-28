"use client";

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
  const isRu = locale === "ru";
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section
      className="px-5 md:px-10 py-20 md:py-40 border-b border-line"
      id="journal"
    >
      <div className="grid md:grid-cols-3 gap-6 md:gap-10 mb-10 md:mb-16 reveal">
        <div className="font-mono text-[11px] tracking-[0.16em] text-cyan uppercase flex items-start gap-2.5">
          <span className="w-1.5 h-1.5 mt-1 bg-cyan rounded-full shadow-[0_0_12px_var(--cyan)]" />
          {t.label}
        </div>
        <h2 className="md:col-span-2 font-serif font-light text-[32px] md:text-[6vw] leading-[1.0] md:leading-[0.95] tracking-[-0.02em] md:tracking-[-0.03em]">
          {t.title}
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-px bg-line border-y border-line">
        {testimonials.map((item) => (
          <div
            key={item.id}
            className="bg-bg p-7 md:p-12 flex flex-col gap-6 md:gap-7 min-h-[300px] md:min-h-[380px] reveal"
          >
            <p className="font-serif font-light text-[19px] md:text-[22px] leading-[1.4] tracking-[-0.01em] flex-1 before:content-['«'] before:text-cyan before:mr-1 after:content-['»'] after:text-cyan after:ml-1">
              {isRu ? item.quoteRu : item.quote}
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
