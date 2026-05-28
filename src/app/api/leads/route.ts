import { NextResponse } from 'next/server';
import { addLead, getLeads } from '@/lib/storage';
import { sendLeadToTelegram } from '@/lib/telegram';
import { requireAdmin } from '@/lib/auth';
import { headers } from 'next/headers';

// Naive in-memory rate limit (per IP, sliding window)
const buckets = new Map<string, number[]>();
function checkRate(ip: string, max = 5, windowMs = 60_000): boolean {
  const now = Date.now();
  const arr = (buckets.get(ip) || []).filter(t => now - t < windowMs);
  if (arr.length >= max) { buckets.set(ip, arr); return false; }
  arr.push(now); buckets.set(ip, arr);
  return true;
}

function clean(s: unknown, max = 2000): string {
  if (typeof s !== 'string') return '';
  return s.trim().slice(0, max);
}

function isValidContact(contact: string): boolean {
  if (!contact) return false;
  if (contact.startsWith('@') && contact.length >= 3) return true;
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)) return true;
  if (/^\+?[\d\s\-()]{6,}$/.test(contact)) return true;
  return false;
}

export async function POST(req: Request) {
  try {
    const h = await headers();
    const ip = h.get('x-forwarded-for')?.split(',')[0].trim()
            || h.get('x-real-ip')
            || 'unknown';

    if (!checkRate(ip)) {
      return NextResponse.json({ ok: false, error: 'Too many requests' }, { status: 429 });
    }

    const body = await req.json().catch(() => ({}));

    // Honeypot
    if (body.website) return NextResponse.json({ ok: true });

    const name = clean(body.name, 120);
    const company = clean(body.company, 200);
    const contact = clean(body.contact, 200);
    const budget = clean(body.budget, 80);
    const message = clean(body.message, 4000);
    const locale = clean(body.locale, 8) || 'en';

    if (!name || !contact || !message) {
      return NextResponse.json({ ok: false, error: 'Missing required fields' }, { status: 400 });
    }
    if (!isValidContact(contact)) {
      return NextResponse.json({ ok: false, error: 'Invalid contact' }, { status: 400 });
    }

    const lead = await addLead({ name, company, contact, budget, message, locale, ip });

    // Fire and forget (await for visibility, but don't fail the lead if TG fails)
    const tg = await sendLeadToTelegram(lead);
    if (!tg.ok) {
      console.error('Telegram send failed:', tg.error);
    }

    return NextResponse.json({ ok: true, id: lead.id });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ ok: false, error: 'Server error' }, { status: 500 });
  }
}

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ ok: false }, { status: 401 });
  const leads = await getLeads();
  return NextResponse.json({ ok: true, leads });
}
