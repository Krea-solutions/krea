export default function Footer({ t }: { t: any }) {
  return (
    <>
      <div className="font-serif font-light italic text-[120px] md:text-[25vw] leading-[0.85] tracking-[-0.06em] text-center py-12 border-t border-line text-ink overflow-hidden whitespace-nowrap">
        KREA<span className="text-cyan">.</span>
      </div>

      <footer className="border-t border-line px-5 md:px-10 pt-16 pb-8">
        <div className="grid md:grid-cols-[2fr_1fr_1fr_1fr] gap-10 md:gap-16 pb-16">
          <div className="font-serif font-light text-[40px] md:text-[6vw] leading-[0.9] tracking-[-0.04em]"
               dangerouslySetInnerHTML={{ __html: t.brand }} />
          <FooterCol title={t.studio}>
            <a href="#">{t.about}</a>
            <a href="#">{t.careers}</a>
            <a href="#">{t.journal}</a>
            <a href="#">{t.press}</a>
          </FooterCol>
          <FooterCol title={t.connect}>
            <a href="#">Instagram</a>
            <a href="#">LinkedIn</a>
            <a href="#">Are.na</a>
            <a href="#">X / Twitter</a>
          </FooterCol>
          <FooterCol title={t.locations}>
            <p>{t.loc1}</p>
            <p>{t.loc2}</p>
            <p>{t.loc3}</p>
          </FooterCol>
        </div>

        <div className="border-t border-line pt-6 flex flex-col md:flex-row md:justify-between md:items-center gap-3 font-mono text-[11px] text-ink-mute tracking-wide">
          <div>© 2026 KREA STUDIO · {t.rights}</div>
          <div className="flex gap-6"><span>v4.7.2</span><span>{t.built}</span></div>
        </div>
      </footer>

      <style jsx>{`
        :global(.footer-brand em) { font-style: italic; color: var(--ink-dim); }
        :global(footer em) { font-style: italic; color: var(--ink-dim); }
      `}</style>
    </>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="font-mono text-[11px] tracking-[0.16em] text-ink-mute uppercase mb-5 font-normal">{title}</h4>
      <div className="flex flex-col gap-1 [&_a]:text-ink-dim [&_a]:no-underline [&_a]:text-sm [&_a]:leading-[2] [&_a]:transition-colors [&_a:hover]:text-ink [&_p]:text-ink-dim [&_p]:text-sm [&_p]:leading-[2]">
        {children}
      </div>
    </div>
  );
}
