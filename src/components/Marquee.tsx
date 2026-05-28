export default function Marquee() {
  const items = [
    'Creative Direction', 'Brand Systems', 'Product Design',
    'AI Experiences', 'Motion', 'Web Engineering', '3D / WebGL'
  ];
  const doubled = [...items, ...items];

  return (
    <div className="border-y border-line overflow-hidden py-6 relative z-[5] bg-bg">
      <div className="marquee-track flex whitespace-nowrap w-max" style={{ gap: '60px' }}>
        {doubled.map((item, i) => (
          <span key={i} className="font-serif italic font-light text-[42px] text-ink-dim tracking-tight flex items-center" style={{ gap: '60px' }}>
            {item}
            <span className="not-italic text-2xl text-cyan">✺</span>
          </span>
        ))}
      </div>
    </div>
  );
}
