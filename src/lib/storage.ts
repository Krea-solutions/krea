import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

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
  status: 'new' | 'read' | 'archived';
};

export type Settings = {
  notifyTelegram: boolean;
  autoReplyEnabled: boolean;
  emailFooter: string;
  updatedAt: string;
};

const DEFAULT_SETTINGS: Settings = {
  notifyTelegram: true,
  autoReplyEnabled: false,
  emailFooter: 'KREA · studio@krea.studio',
  updatedAt: new Date().toISOString()
};

async function ensureDir() {
  try { await fs.mkdir(DATA_DIR, { recursive: true }); } catch {}
}

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    await ensureDir();
    const buf = await fs.readFile(file, 'utf-8');
    return JSON.parse(buf) as T;
  } catch {
    return fallback;
  }
}

async function writeJson(file: string, data: unknown) {
  await ensureDir();
  await fs.writeFile(file, JSON.stringify(data, null, 2), 'utf-8');
}

export async function getLeads(): Promise<Lead[]> {
  const leads = await readJson<Lead[]>(LEADS_FILE, []);
  return leads.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function addLead(lead: Omit<Lead, 'id' | 'createdAt' | 'status'>): Promise<Lead> {
  const leads = await getLeads();
  const newLead: Lead = {
    ...lead,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    status: 'new'
  };
  leads.unshift(newLead);
  await writeJson(LEADS_FILE, leads);
  return newLead;
}

export async function updateLeadStatus(id: string, status: Lead['status']): Promise<Lead | null> {
  const leads = await getLeads();
  const i = leads.findIndex(l => l.id === id);
  if (i === -1) return null;
  leads[i].status = status;
  await writeJson(LEADS_FILE, leads);
  return leads[i];
}

export async function deleteLead(id: string): Promise<boolean> {
  const leads = await getLeads();
  const next = leads.filter(l => l.id !== id);
  if (next.length === leads.length) return false;
  await writeJson(LEADS_FILE, next);
  return true;
}

export async function getSettings(): Promise<Settings> {
  return readJson<Settings>(SETTINGS_FILE, DEFAULT_SETTINGS);
}

export async function updateSettings(patch: Partial<Settings>): Promise<Settings> {
  const current = await getSettings();
  const next: Settings = { ...current, ...patch, updatedAt: new Date().toISOString() };
  await writeJson(SETTINGS_FILE, next);
  return next;
}
