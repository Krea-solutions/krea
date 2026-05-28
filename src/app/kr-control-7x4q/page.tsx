import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import {
  getLeads,
  getSettings,
  getProjects,
  getTestimonials,
} from "@/lib/storage";
import AdminClient from "./AdminClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getSession();
  if (!session) redirect("/kr-control-7x4q/login");

  const [leads, settings, projects, testimonials] = await Promise.all([
    getLeads(),
    getSettings(),
    getProjects(),
    getTestimonials(),
  ]);

  return (
    <AdminClient
      initialLeads={leads}
      initialProjects={projects}
      initialTestimonials={testimonials}
      initialSettings={settings}
      username={session.username}
    />
  );
}
