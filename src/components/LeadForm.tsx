'use client';

import { useState } from 'react';

type Status = 'idle' | 'sending' | 'success' | 'error';

export default function LeadForm({ t, locale }: { t: any; locale: string }) {
  const [form, setForm] = useState({
    name: '', company: '', contact: '', budget: t.budgetOptions[4], message: '', website: ''
  });
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  const onChange = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [k]: e.target.value });
  };

  const isValidContact = (c: string): boolean => {
    if (!c) return false;
    if (c.startsWith('@') && c.length >= 3) return true;
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c)) return true;
    if (/^\+?[\d\s\-()]{6,}$/.test(c)) return true;
    return false;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.name.trim() || !form.contact.trim() || !form.message.trim()) {
      setError(t.required);
      return;
    }
    if (!isValidContact(form.contact)) {
      setError(t.invalidContact);
      return;
    }

    setStatus('sending');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, locale })
      });
      const data = await res.json();
      if (data.ok) {
        setStatus('success');
        setForm({ name: '', company: '', contact: '', budget: t.budgetOptions[4], message: '', website: '' });
      } else {
        setStatus('error');
        setError(data.error || t.error);
      }
    } catch {
      setStatus('error');
      setError(t.error);
    }
  };

  return (
    <section id="contact" className="px-5 md:px-10 py-32 md:py-48 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] rounded-full pointer-events-none z-0 pulse-bg"
           style={{ background: 'radial-gradient(circle, rgba(77,200,255,0.16), rgba(255,122,45,0.06) 40%, transparent 70%)' }} />

      <div className="relative z-[1] max-w-6xl mx-auto">
        <div className="text-center mb-16 reveal">
          <div className="font-mono text-[11px] tracking-[0.16em] text-cyan uppercase mb-8">↳ {t.label}</div>
          <h2 className="font-serif font-light text-[48px] md:text-[10vw] leading-[0.9] tracking-[-0.04em]"
              dangerouslySetInnerHTML={{ __html: t.title }} />
          <p className="mt-8 text-ink-dim max-w-md mx-auto">{t.lead}</p>
        </div>

        {status === 'success' ? (
          <div className="reveal max-w-2xl mx-auto p-10 border border-cyan/30 rounded-2xl text-center" style={{ background: 'rgba(77,200,255,0.05)', backdropFilter: 'blur(20px)' }}>
            <div className="w-14 h-14 rounded-full bg-cyan/15 border border-cyan/40 mx-auto mb-6 flex items-center justify-center text-cyan">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M5 12L10 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            <p className="font-serif font-light text-2xl leading-snug">{t.success}</p>
            <button onClick={() => setStatus('idle')} className="mt-8 font-mono text-[11px] tracking-[0.16em] text-cyan uppercase border-b border-cyan/40 pb-1 hover:border-cyan transition">
              ↻ {locale === 'ru' ? 'Отправить ещё одну' : 'Send another'}
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="reveal max-w-3xl mx-auto" noValidate>
            <input type="text" name="website" value={form.website} onChange={onChange('website')} tabIndex={-1} autoComplete="off"
                   className="absolute opacity-0 pointer-events-none w-0 h-0" aria-hidden="true" />

            <div className="grid md:grid-cols-2 gap-px bg-line border border-line rounded-2xl overflow-hidden backdrop-blur-xl" style={{ background: 'rgba(10,18,32,0.4)' }}>
              <Field label={t.name} value={form.name} onChange={onChange('name')} placeholder={t.namePh} required />
              <Field label={t.company} value={form.company} onChange={onChange('company')} placeholder={t.companyPh} />
              <Field label={t.contact} value={form.contact} onChange={onChange('contact')} placeholder={t.contactPh} required />
              <SelectField label={t.budget} value={form.budget} onChange={onChange('budget')} options={t.budgetOptions} />
              <div className="md:col-span-2">
                <TextareaField label={t.message} value={form.message} onChange={onChange('message')} placeholder={t.messagePh} required />
              </div>
            </div>

            {error && <div className="mt-5 text-sm text-accent font-mono">⚠ {error}</div>}

            <div className="mt-10 flex justify-center">
              <button
                type="submit"
                disabled={status === 'sending'}
                data-magnetic
                className="group inline-flex items-center gap-4 pl-9 pr-3 py-5 border border-line-strong rounded-full text-ink text-sm tracking-wide transition-all relative overflow-hidden hover:border-cyan disabled:opacity-50 disabled:cursor-wait"
                style={{ background: 'rgba(10,18,32,0.5)', backdropFilter: 'blur(20px)' }}
              >
                <span className="absolute inset-0 -z-10 bg-cyan translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                {status === 'sending' ? t.sending : t.submit}
                <span className="w-11 h-11 rounded-full bg-accent text-white flex items-center justify-center transition-transform group-hover:-rotate-45">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 13L13 3M13 3H6M13 3V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </span>
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

function Field({ label, value, onChange, placeholder, required }: { label: string; value: string; onChange: any; placeholder: string; required?: boolean }) {
  return (
    <label className="block bg-bg p-7 md:p-9 transition-colors hover:bg-bg-2">
      <div className="font-mono text-[10px] tracking-[0.16em] text-cyan uppercase mb-3">{label}{required && <span className="text-accent ml-1">*</span>}</div>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full bg-transparent border-0 outline-none font-serif font-light text-[22px] md:text-[26px] text-ink placeholder:text-ink-mute"
      />
    </label>
  );
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: any; options: string[] }) {
  return (
    <label className="block bg-bg p-7 md:p-9 transition-colors hover:bg-bg-2">
      <div className="font-mono text-[10px] tracking-[0.16em] text-cyan uppercase mb-3">{label}</div>
      <select
        value={value}
        onChange={onChange}
        className="w-full bg-transparent border-0 outline-none font-serif font-light text-[22px] md:text-[26px] text-ink appearance-none cursor-pointer"
        style={{ backgroundImage: 'url("data:image/svg+xml;utf8,<svg viewBox=\'0 0 12 8\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M1 1L6 6L11 1\' stroke=\'%234dc8ff\' stroke-width=\'1.5\' fill=\'none\'/></svg>")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right center', backgroundSize: '12px', paddingRight: '20px' }}
      >
        {options.map((o) => <option key={o} value={o} className="bg-bg text-ink">{o}</option>)}
      </select>
    </label>
  );
}

function TextareaField({ label, value, onChange, placeholder, required }: { label: string; value: string; onChange: any; placeholder: string; required?: boolean }) {
  return (
    <label className="block bg-bg p-7 md:p-9 transition-colors hover:bg-bg-2">
      <div className="font-mono text-[10px] tracking-[0.16em] text-cyan uppercase mb-3">{label}{required && <span className="text-accent ml-1">*</span>}</div>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={4}
        className="w-full bg-transparent border-0 outline-none font-serif font-light text-[18px] md:text-[22px] text-ink placeholder:text-ink-mute resize-none leading-relaxed"
      />
    </label>
  );
}
