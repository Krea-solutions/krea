"use client";

import { useState, useRef, useEffect } from "react";

type Status = "idle" | "sending" | "success" | "error";

export default function LeadForm({ t, locale }: { t: any; locale: string }) {
  const [form, setForm] = useState({
    name: "",
    company: "",
    contact: "",
    budget: t.budgetOptions[4],
    message: "",
    website: "",
  });
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [budgetOpen, setBudgetOpen] = useState(false);
  const budgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (budgetRef.current && !budgetRef.current.contains(e.target as Node)) {
        setBudgetOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const onChange =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm({ ...form, [k]: e.target.value });
    };

  const isValidContact = (c: string): boolean => {
    if (!c) return false;
    if (c.startsWith("@") && c.length >= 3) return true;
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
    setStatus("sending");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, locale }),
      });
      const data = await res.json();
      if (data.ok) {
        setStatus("success");
        setForm({
          name: "",
          company: "",
          contact: "",
          budget: t.budgetOptions[4],
          message: "",
          website: "",
        });
      } else {
        setStatus("error");
        setError(data.error || t.error);
      }
    } catch {
      setStatus("error");
      setError(t.error);
    }
  };

  const reset = () => {
    setStatus("idle");
    setError(null);
  };

  return (
    <section
      id="contact"
      className="px-5 md:px-10 py-28 md:py-48 relative overflow-hidden"
    >
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] md:w-[1200px] h-[900px] md:h-[1200px] rounded-full pointer-events-none z-0 pulse-bg"
        style={{
          background:
            "radial-gradient(circle, rgba(77,200,255,0.14), rgba(255,122,45,0.06) 40%, transparent 70%)",
        }}
      />

      <div className="relative z-[1] max-w-3xl mx-auto">
        {status === "success" ? (
          <div className="text-center py-10 md:py-20 animate-[fadeUp_0.6s_ease]">
            <div className="inline-flex w-16 h-16 mb-8 rounded-full border border-cyan/40 items-center justify-center bg-cyan/5 backdrop-blur">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="text-cyan">
                <path d="M5 12L10 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="font-serif font-light text-[34px] md:text-[5vw] leading-[1.05] tracking-[-0.03em] mb-5">
              {t.successTitle}
            </h2>
            <p className="text-ink-dim max-w-md mx-auto leading-relaxed mb-10">
              {t.successText}
            </p>
            <button
              onClick={reset}
              data-hover
              className="font-mono text-[11px] tracking-[0.16em] text-cyan uppercase border-b border-cyan/40 pb-1 hover:border-cyan transition-colors"
            >
              {t.successAgain}
            </button>
          </div>
        ) : (
          <>
            <div className="text-center mb-12 md:mb-16">
              <div className="font-mono text-[11px] tracking-[0.16em] text-cyan uppercase mb-6 md:mb-8">
                ↳ {t.label}
              </div>
              <h2 className="font-serif font-light text-[40px] md:text-[7vw] leading-[0.95] tracking-[-0.03em] mb-6">
                {t.title}
              </h2>
              <p className="text-ink-dim max-w-md mx-auto leading-relaxed">
                {t.lead}
              </p>
            </div>

            <form onSubmit={submit} noValidate>
              <input
                type="text"
                name="website"
                value={form.website}
                onChange={onChange("website")}
                tabIndex={-1}
                autoComplete="off"
                className="absolute opacity-0 pointer-events-none w-0 h-0"
                aria-hidden
              />

              <div
                className="grid md:grid-cols-2 gap-px bg-line border border-line-strong rounded-2xl overflow-hidden"
                style={{ background: "rgba(10,18,32,0.4)", backdropFilter: "blur(20px)" }}
              >
                <Field label={t.name} req>
                  <input type="text" value={form.name} onChange={onChange("name")} placeholder={t.namePh} className="field-input" />
                </Field>
                <Field label={t.company}>
                  <input type="text" value={form.company} onChange={onChange("company")} placeholder={t.companyPh} className="field-input" />
                </Field>
                <Field label={t.contact} req>
                  <input type="text" value={form.contact} onChange={onChange("contact")} placeholder={t.contactPh} className="field-input" />
                </Field>

                <div className="bg-bg p-6 md:p-8 relative" ref={budgetRef}>
                  <label className="block font-mono text-[10px] tracking-[0.16em] text-cyan uppercase mb-3">
                    {t.budget}
                  </label>
                  <button
                    type="button"
                    onClick={() => setBudgetOpen((v) => !v)}
                    className="w-full flex items-center justify-between bg-transparent font-serif font-light text-[20px] md:text-[22px] text-ink text-left"
                  >
                    <span>{form.budget}</span>
                    <svg
                      width="14" height="9" viewBox="0 0 14 9" fill="none"
                      className={`text-cyan transition-transform duration-300 ${budgetOpen ? "rotate-180" : ""}`}
                    >
                      <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                  {budgetOpen && (
                    <div
                      className="absolute left-4 right-4 md:left-6 md:right-6 top-full mt-2 z-20 rounded-xl border border-line-strong overflow-hidden animate-[fadeIn_0.2s_ease]"
                      style={{ background: "rgba(10,18,32,0.96)", backdropFilter: "blur(24px)", boxShadow: "0 20px 50px rgba(0,0,0,0.6)" }}
                    >
                      {t.budgetOptions.map((opt: string) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            setForm({ ...form, budget: opt });
                            setBudgetOpen(false);
                          }}
                          className={`block w-full text-left px-5 py-3 font-serif text-[18px] transition-colors ${
                            form.budget === opt ? "bg-cyan/15 text-cyan" : "text-ink-dim hover:bg-white/5 hover:text-ink"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="md:col-span-2 bg-bg p-6 md:p-8 transition-colors hover:bg-bg-2">
                  <label className="block font-mono text-[10px] tracking-[0.16em] text-cyan uppercase mb-3">
                    {t.message} <span className="text-accent">*</span>
                  </label>
                  <textarea
                    value={form.message}
                    onChange={onChange("message")}
                    placeholder={t.messagePh}
                    rows={4}
                    className="w-full bg-transparent border-0 outline-none font-serif font-light text-[18px] md:text-[20px] text-ink placeholder:text-ink-mute resize-none leading-relaxed"
                  />
                </div>
              </div>

              {error && (
                <div className="mt-4 text-sm text-accent font-mono text-center">⚠ {error}</div>
              )}

              <div className="mt-8 md:mt-10 flex justify-center">
                <button
                  type="submit"
                  disabled={status === "sending"}
                  data-hover
                  className="group inline-flex items-center gap-4 pl-9 pr-3 py-5 border border-line-strong rounded-full text-ink text-sm tracking-wide transition-all relative overflow-hidden hover:border-cyan disabled:opacity-50 disabled:cursor-wait"
                  style={{ background: "rgba(10,18,32,0.5)", backdropFilter: "blur(20px)" }}
                >
                  <span className="absolute inset-0 -z-10 bg-cyan translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  <span className="relative z-[1]">{status === "sending" ? t.sending : t.submit}</span>
                  <span className="w-11 h-11 rounded-full bg-accent text-white flex items-center justify-center transition-transform group-hover:-rotate-45 relative z-[1]">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 13L13 3M13 3H6M13 3V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </span>
                </button>
              </div>
            </form>
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        :global(.field-input) {
          width: 100%;
          background: transparent;
          border: 0;
          outline: none;
          font-family: "Fraunces", serif;
          font-weight: 300;
          font-size: 22px;
          color: var(--ink);
          line-height: 1.3;
        }
        :global(.field-input::placeholder) { color: var(--ink-mute); }
      `}</style>
    </section>
  );
}

function Field({
  label,
  req,
  children,
}: {
  label: string;
  req?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-bg p-6 md:p-8 transition-colors hover:bg-bg-2">
      <label className="block font-mono text-[10px] tracking-[0.16em] text-cyan uppercase mb-3">
        {label} {req && <span className="text-accent">*</span>}
      </label>
      {children}
    </div>
  );
}
