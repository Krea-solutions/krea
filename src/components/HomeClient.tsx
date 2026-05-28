'use client';

import { useEffect } from 'react';
import Cursor from './Cursor';
import Loader from './Loader';
import Nav from './Nav';
import Hero from './Hero';
import Marquee from './Marquee';
import WorkList from './WorkList';
import Capabilities from './Capabilities';
import Philosophy from './Philosophy';
import Process from './Process';
import Metrics from './Metrics';
import Testimonials from './Testimonials';
import LeadForm from './LeadForm';
import Footer from './Footer';

type Props = { locale: string; messages: any };

export default function HomeClient({ locale, messages }: Props) {
  useEffect(() => {
    // Scroll reveal
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '-40px' }
    );
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const t = messages;

  return (
    <>
      <Loader />
      <Nav locale={locale} t={t.nav} />
      <Hero t={t.hero} />
      <Marquee />
      <WorkList t={t.work} locale={locale} />
      <Capabilities t={t.services} />
      <Philosophy t={t.philosophy} />
      <Process t={t.process} />
      <Metrics t={t.metrics} />
      <Testimonials t={t.testi} />
      <LeadForm t={t.form} locale={locale} />
      <Footer t={t.footer} />
    </>
  );
}
