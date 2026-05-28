import { NextResponse } from 'next/server';
import { verifyCredentials, createSession, setSessionCookie } from '@/lib/auth';

// Throttle login attempts per IP
const attempts = new Map<string, { count: number; ts: number }>();

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
  const rec = attempts.get(ip) || { count: 0, ts: Date.now() };
  if (Date.now() - rec.ts > 15 * 60_000) { rec.count = 0; rec.ts = Date.now(); }
  if (rec.count >= 8) {
    return NextResponse.json({ ok: false, error: 'Too many attempts' }, { status: 429 });
  }

  const { username, password } = await req.json().catch(() => ({}));
  const ok = await verifyCredentials(String(username || ''), String(password || ''));
  if (!ok) {
    rec.count += 1; attempts.set(ip, rec);
    // Constant-time-ish small delay
    await new Promise(r => setTimeout(r, 400));
    return NextResponse.json({ ok: false, error: 'Invalid credentials' }, { status: 401 });
  }

  const token = await createSession(String(username));
  await setSessionCookie(token);
  attempts.delete(ip);
  return NextResponse.json({ ok: true });
}
