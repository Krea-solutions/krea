export type Lead = {
  id: string;
  createdAt: string;
  name: string;
  company: string;
  contact: string;
  budget: string;
  message: string;
  locale: string;
  ip?: string;
  status: "new" | "read" | "archived";
};

export type Settings = {
  notifyTelegram: boolean;
  autoReplyEnabled: boolean;
  emailFooter: string;
  updatedAt: string;
};

export type Project = {
  id: string;
  name: string;
  nameRu: string;
  desc: string;
  descRu: string;
  tag: string;
  tagRu: string;
  year: string;
  colors: [string, string];
};

export type Testimonial = {
  id: string;
  quote: string;
  quoteRu: string;
  author: string;
  role: string;
};

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!REDIS_URL || !REDIS_TOKEN) {
  throw new Error("Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN");
}

async function redis(command: string[]) {
  const res = await fetch(REDIS_URL!, {
    method: "POST",
    headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
    body: JSON.stringify(command),
  });

  if (!res.ok) {
    throw new Error(`Redis error: ${res.status}`);
  }

  const data = await res.json();

  if ("error" in data) {
    throw new Error(data.error);
  }

  return data.result;
}

const DEFAULT_SETTINGS: Settings = {
  notifyTelegram: true,
  autoReplyEnabled: false,
  emailFooter: "KREA · studio@krea.studio",
  updatedAt: new Date().toISOString(),
};

// LEADS
export async function getLeads(): Promise<Lead[]> {
  const keys = await redis(["KEYS", "leads:*"]);
  if (!keys || keys.length === 0) return [];
  const leads = await Promise.all(
    (keys as string[]).map(async (key) => {
      const json = await redis(["GET", key]);
      return JSON.parse(json) as Lead;
    }),
  );
  return leads.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function addLead(
  lead: Omit<Lead, "id" | "createdAt" | "status">,
): Promise<Lead> {
  const newLead: Lead = {
    ...lead,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    status: "new",
  };
  await redis(["SET", `leads:${newLead.id}`, JSON.stringify(newLead)]);
  return newLead;
}

export async function updateLeadStatus(
  id: string,
  status: Lead["status"],
): Promise<Lead | null> {
  const json = await redis(["GET", `leads:${id}`]);
  if (!json) return null;
  const lead: Lead = JSON.parse(json);
  lead.status = status;
  await redis(["SET", `leads:${id}`, JSON.stringify(lead)]);
  return lead;
}

export async function deleteLead(id: string): Promise<boolean> {
  const deleted = await redis(["DEL", `leads:${id}`]);
  return (deleted as number) > 0;
}

// SETTINGS
export async function getSettings(): Promise<Settings> {
  const json = await redis(["GET", "settings"]);
  return json ? JSON.parse(json) : DEFAULT_SETTINGS;
}

export async function updateSettings(
  patch: Partial<Settings>,
): Promise<Settings> {
  const current = await getSettings();
  const next: Settings = {
    ...current,
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  await redis(["SET", "settings", JSON.stringify(next)]);
  return next;
}

// PROJECTS
export async function getProjects(): Promise<Project[]> {
  const json = await redis(["GET", "projects"]);
  if (!json) return [];
  return JSON.parse(json);
}

export async function updateProjects(projects: Project[]): Promise<void> {
  await redis(["SET", "projects", JSON.stringify(projects)]);
}

// TESTIMONIALS
export async function getTestimonials(): Promise<Testimonial[]> {
  const json = await redis(["GET", "testimonials"]);
  if (!json) return [];
  return JSON.parse(json);
}

export async function updateTestimonials(
  testimonials: Testimonial[],
): Promise<void> {
  await redis(["SET", "testimonials", JSON.stringify(testimonials)]);
}
