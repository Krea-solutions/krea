"use client";

import { useEffect } from "react";
import Cursor from "./Cursor";
import Loader from "./Loader";
import Nav from "./Nav";
import Hero from "./Hero";
import Marquee from "./Marquee";
import WorkList from "./WorkList";
import Capabilities from "./Capabilities";
import Philosophy from "./Philosophy";
import Process from "./Process";
import Metrics from "./Metrics";
import Testimonials from "./Testimonials";
import LeadForm from "./LeadForm";
import Footer from "./Footer";

type Project = {
  id: string; name: string; nameRu: string; desc: string; descRu: string;
  tag: string; tagRu: string; year: string; colors: [string, string];
};
type Testimonial = { id: string; quote: string; quoteRu: string; author: string; role: string };
type Metric = { id: string; value: string; label: string; labelRu: string };
type Visibility = {
  work: boolean; services: boolean; philosophy: boolean;
  process: boolean; metrics: boolean; testimonials: boolean;
};

type Props = {
  locale: string;
  messages: any;
  projects: Project[];
  testimonials: Testimonial[];
  metrics: Metric[];
  visibility: Visibility;
};

export default function HomeClient({
  locale, messages, projects, testimonials, metrics, visibility,
}: Props) {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "-40px" },
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const t = messages;

  return (
    <>
      <Loader />
      <Cursor />
      <Nav locale={locale} t={t.nav} />
      <Hero t={t.hero} />
      <Marquee />
      {visibility.work && <WorkList t={t.work} locale={locale} projects={projects} />}
      {visibility.services && <Capabilities t={t.services} />}
      {visibility.philosophy && <Philosophy t={t.philosophy} />}
      {visibility.process && <Process t={t.process} />}
      {visibility.metrics && <Metrics t={t.metrics} locale={locale} metrics={metrics} />}
      {visibility.testimonials && (
        <Testimonials t={t.testi} locale={locale} testimonials={testimonials} />
      )}
      <LeadForm t={t.form} locale={locale} />
      <Footer t={t.footer} />

      <style jsx global>{`
        @keyframes rise { from { transform: translateY(110%); } to { transform: translateY(0); } }
        @keyframes marq { to { transform: translateX(-50%); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 50% { opacity: 0.4; } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .reveal {
          opacity: 0; transform: translateY(40px);
          transition: opacity 1s cubic-bezier(0.22,1,0.36,1), transform 1s cubic-bezier(0.22,1,0.36,1);
        }
        .reveal.in { opacity: 1; transform: translateY(0); }
        .text-balance { text-wrap: balance; }
      `}</style>
    </>
  );
}
