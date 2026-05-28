const NUMS = ['01 / NORTH', '02 / FRAME', '03 / FORM', '04 / BUILD', '05 / ORBIT'];

export default function Process({ t }: { t: any }) {
  return (
    <section className="px-5 md:px-10 py-32 md:py-40">
      <div className="grid md:grid-cols-3 gap-10 mb-16 md:mb-24 reveal">
        <div className="font-mono text-[11px] tracking-[0.16em] text-cyan uppercase flex items-start gap-2.5">
          <span className="w-1.5 h-1.5 mt-1 bg-cyan rounded-full shadow-[0_0_12px_var(--cyan)]" />
          {t.label}
        </div>
        <h2 className="md:col-span-2 font-serif font-light text-[40px] md:text-[6vw] leading-[0.95] tracking-[-0.03em]" dangerouslySetInnerHTML={{ __html: t.title }} />
      </div>

      <div className="flex flex-col">
        {t.steps.map((step: any, i: number) => (
          <div key={i} className="grid grid-cols-[60px_1fr] md:grid-cols-[100px_1fr_1fr] py-8 md:py-12 border-t border-line last:border-b items-start reveal" style={{ gap: '60px' }}>
            <div className="font-mono text-[13px] text-cyan tracking-wide">{NUMS[i]}</div>
            <h3 className="font-serif font-light text-[28px] md:text-[3.5vw] tracking-[-0.02em] leading-none"
                dangerouslySetInnerHTML={{ __html: step.name }} />
            <p className="text-[15px] leading-relaxed text-ink-dim max-w-[480px] col-start-2 md:col-start-3">{step.desc}</p>
          </div>
        ))}
      </div>

      <style jsx>{`
        :global(em) { font-style: italic; color: var(--cyan); }
      `}</style>
    </section>
  );
}
