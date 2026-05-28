"use client";

import { useState } from "react";

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

  const onChange =
    (k: keyof typeof form) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
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
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        setStatus("error");
        setError(data.error || t.error);
      }
    } catch {
      setStatus("error");
      setError(t.error);
    }
  };

  if (status === "success") {
    return (
      <section
        id="contact"
        className="px-5 md:px-10 py-32 md:py-48 relative overflow-hidden text-center"
      >
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] rounded-full pointer-events-none z-0 pulse-bg"
          style={{
            background:
              "radial-gradient(circle, rgba(77,200,255,0.16), rgba(255,122,45,0.06) 40%, transparent 70%)",
          }}
        />
        <div className="max-w-2xl mx-auto relative z-[1]">
          <div
            className="inline-block mb-8 p-4 border border-cyan/30 rounded-full"
            style={{
              background: "rgba(77,200,255,0.05)",
              backdropFilter: "blur(20px)",
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="text-cyan"
            >
              <path
                d="M5 12L10 17L19 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2 className="font-serif font-light text-[42px] md:text-[5vw] leading-[1.1] tracking-[-0.03em] text-ink mb-4">
            {t.success}
          </h2>
          <p className="text-ink-dim text-base">studio@krea.studio</p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="contact"
      className="px-5 md:px-10 py-32 md:py-48 relative overflow-hidden"
    >
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] rounded-full pointer-events-none z-0 pulse-bg"
        style={{
          background:
            "radial-gradient(circle, rgba(77,200,255,0.14), rgba(255,122,45,0.06) 40%, transparent 70%)",
        }}
      />

      <div className="relative z-[1] max-w-6xl mx-auto">
        <div className="text-center mb-16 reveal">
          <div className="font-mono text-[11px] tracking-[0.16em] text-cyan uppercase mb-8">
            ↳ {t.label}
          </div>
          <h2
            className="font-serif font-light text-[48px] md:text-[10vw] leading-[0.9] tracking-[-0.04em]"
            dangerouslySetInnerHTML={{ __html: t.title }}
          />
          <p className="mt-8 text-ink-dim max-w-md mx-auto">{t.lead}</p>
        </div>

        <form onSubmit={submit} className="reveal max-w-3xl mx-auto" noValidate>
          <input
            type="text"
            name="website"
            value={form.website}
            onChange={onChange("website")}
            tabIndex={-1}
            autoComplete="off"
            className="absolute opacity-0 pointer-events-none w-0 h-0"
            aria-hidden="true"
          />

          <div
            className="grid md:grid-cols-2 gap-px bg-line border border-line rounded-2xl overflow-hidden backdrop-blur-xl"
            style={{ background: "rgba(10,18,32,0.4)" }}
          >
            <div className="bg-bg p-7 md:p-9 transition-colors hover:bg-bg-2">
              <label className="block font-family-mono text-[10px] tracking-[0.16em] text-cyan uppercase mb-3">
                {t.name} <span className="text-acc">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={onChange("name")}
                placeholder={t.namePh}
                required
                className="w-full bg-transparent border-0 outline-none font-serif font-light text-[26px] text-ink placeholder:text-ink-mute"
              />
            </div>
            <div className="bg-bg p-7 md:p-9 transition-colors hover:bg-bg-2 border-l border-line">
              <label className="block font-family-mono text-[10px] tracking-[0.16em] text-cyan uppercase mb-3">
                {t.company}
              </label>
              <input
                type="text"
                value={form.company}
                onChange={onChange("company")}
                placeholder={t.companyPh}
                className="w-full bg-transparent border-0 outline-none font-serif font-light text-[26px] text-ink placeholder:text-ink-mute"
              />
            </div>
            <div className="bg-bg p-7 md:p-9 transition-colors hover:bg-bg-2 border-t border-line">
              <label className="block font-family-mono text-[10px] tracking-[0.16em] text-cyan uppercase mb-3">
                {t.contact} <span className="text-acc">*</span>
              </label>
              <input
                type="text"
                value={form.contact}
                onChange={onChange("contact")}
                placeholder={t.contactPh}
                required
                className="w-full bg-transparent border-0 outline-none font-serif font-light text-[26px] text-ink placeholder:text-ink-mute"
              />
            </div>
            <div className="bg-bg p-7 md:p-9 transition-colors hover:bg-bg-2 border-t border-line border-l">
              <label className="block font-family-mono text-[10px] tracking-[0.16em] text-cyan uppercase mb-3">
                {t.budget}
              </label>
              <select
                value={form.budget}
                onChange={onChange("budget")}
                className="w-full bg-transparent border-0 outline-none font-serif font-light text-[20px] text-ink appearance-none cursor-pointer"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 12 8' xmlns='http://www.w3.org/2000/svg'><path d='M1 1L6 6L11 1' stroke='%234dc8ff' stroke-width='1.5' fill='none'/></svg>\")",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 0",
                  backgroundSize: "12px",
                  paddingRight: "20px",
                }}
              >
                {t.budgetOptions.map((o: string) => (
                  <option key={o} value={o} className="bg-bg-2 text-ink">
                    {o}
                  </option>
                ))}
              </select>
            </div>
            <div className="bg-bg p-7 md:p-9 transition-colors hover:bg-bg-2 border-t border-line md:col-span-2">
              <label className="block font-family-mono text-[10px] tracking-[0.16em] text-cyan uppercase mb-3">
                {t.message} <span className="text-acc">*</span>
              </label>
              <textarea
                value={form.message}
                onChange={onChange("message")}
                placeholder={t.messagePh}
                required
                rows={4}
                className="w-full bg-transparent border-0 outline-none font-serif font-light text-[20px] text-ink placeholder:text-ink-mute resize-none leading-relaxed"
              />
            </div>
          </div>

          {error && (
            <div className="mt-4 text-sm text-acc font-mono">⚠ {error}</div>
          )}

          <div className="mt-10 flex justify-center">
            <button
              type="submit"
              disabled={status === "sending"}
              className="group inline-flex items-center gap-4 pl-9 pr-3 py-5 border border-line-strong rounded-full text-ink text-sm tracking-wide transition-all relative overflow-hidden hover:border-cyan disabled:opacity-50 disabled:cursor-wait"
              style={{
                background: "rgba(10,18,32,0.5)",
                backdropFilter: "blur(20px)",
              }}
            >
              <span className="absolute inset-0 -z-10 bg-cyan translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              {status === "sending" ? t.sending : t.submit}
              <span className="w-11 h-11 rounded-full bg-acc text-white flex items-center justify-center transition-transform group-hover:-rotate-45 relative z-1">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3 13L13 3M13 3H6M13 3V10"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
