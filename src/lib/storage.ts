// import type { Lead, Settings } from "./types";

// export { type Lead, type Settings };

// const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
// const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

// if (!REDIS_URL || !REDIS_TOKEN) {
//   throw new Error("Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN");
// }

// async function redis<T = unknown>([command, args]: [string, unknown[]]): Promise<T> {
//   const body = JSON.stringify({ command, args });
//   const res = await fetch(REDIS_URL!, {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${REDIS_TOKEN!}`,
//       "Content-Type": "application/json",
//     },
//     body,
//   });
//   const data = await res.json();
//   if (data.error) throw new Error(data.error);
//   return data.result;
// }

// const DEFAULT_SETTINGS: Settings = {
//   notifyTelegram: true,
//   autoReplyEnabled: false,
//   emailFooter: "KREA · studio@krea.studio",
//   updatedAt: new Date().toISOString(),
// };

// export async function getLeads(): Promise<Lead[]> {
//   const keys = await redis<string[]>(["KEYS", ["leads:*"]]);
//   if (!keys || keys.length === 0) return [];
//   const leads = await Promise.all(
//     (keys as string[]).map(async (key) => {
//       const json = await redis<string>(["GET", [key]]);
//       return JSON.parse(json) as Lead;
//     }),
//   );
//   return leads.sort((a: Lead, b: Lead) => b.createdAt.localeCompare(a.createdAt));
// }

// export async function addLead(
//   lead: Omit<Lead, "id" | "createdAt" | "status">,
// ): Promise<Lead> {
//   const newLead: Lead = {
//     ...lead,
//     id: crypto.randomUUID(),
//     createdAt: new Date().toISOString(),
//     status: "new",
//   };
//   await redis<void>(["SET", [`leads:${newLead.id}`, JSON.stringify(newLead)]]);
//   return newLead;
// }

// export async function updateLeadStatus(
//   id: string,
//   status: Lead["status"],
// ): Promise<Lead | null> {
//   const json = await redis<string | null>(["GET", [`leads:${id}`]]);
//   if (!json) return null;
//   const lead: Lead = JSON.parse(json);
//   lead.status = status;
//   await redis<void>(["SET", [`leads:${id}`, JSON.stringify(lead)]]);
//   return lead;
// }

// export async function deleteLead(id: string): Promise<boolean> {
//   const deleted = await redis<number>(["DEL", [`leads:${id}`]]);
//   return deleted > 0;
// }

// export async function getSettings(): Promise<Settings> {
//   const json = await redis<string | null>(["GET", ["settings"]]);
//   return json ? JSON.parse(json) : DEFAULT_SETTINGS;
// }

// export async function updateSettings(
//   patch: Partial<Settings>,
// ): Promise<Settings> {
//   const current = await getSettings();
//   const next: Settings = {
//     ...current,
//     ...patch,
//     updatedAt: new Date().toISOString(),
//   };
//   await redis<void>(["SET", ["settings", JSON.stringify(next)]]);
//   return next;
// }

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

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!REDIS_URL || !REDIS_TOKEN) {
  throw new Error("Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN");
}

async function redis(command: string[]) {
  const body = JSON.stringify(command);
  const res = await fetch(REDIS_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${REDIS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body,
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data.result;
}

const DEFAULT_SETTINGS: Settings = {
  notifyTelegram: true,
  autoReplyEnabled: false,
  emailFooter: "KREA · studio@krea.studio",
  updatedAt: new Date().toISOString(),
};

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
