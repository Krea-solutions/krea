import HomeClient from "@/components/HomeClient";
import { getLocale, getMessages } from "next-intl/server";
import {
  getProjects,
  getTestimonials,
  getMetrics,
  getSettings,
} from "@/lib/storage";

export const dynamic = "force-dynamic";

export default async function Home() {
  const locale = await getLocale();
  const messages = await getMessages();
  const [projects, testimonials, metrics, settings] = await Promise.all([
    getProjects(),
    getTestimonials(),
    getMetrics(),
    getSettings(),
  ]);

  return (
    <HomeClient
      locale={locale}
      messages={messages as any}
      projects={projects}
      testimonials={testimonials}
      metrics={metrics}
      visibility={settings.visibility}
    />
  );
}
