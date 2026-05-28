import { NextResponse } from 'next/server';
import { getSettings, updateSettings } from '@/lib/storage';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ ok: false }, { status: 401 });
  return NextResponse.json({ ok: true, settings: await getSettings() });
}

export async function PUT(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ ok: false }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const patch: any = {};
  if (typeof body.notifyTelegram === 'boolean') patch.notifyTelegram = body.notifyTelegram;
  if (typeof body.autoReplyEnabled === 'boolean') patch.autoReplyEnabled = body.autoReplyEnabled;
  if (typeof body.emailFooter === 'string') patch.emailFooter = body.emailFooter.slice(0, 500);
  const settings = await updateSettings(patch);
  return NextResponse.json({ ok: true, settings });
}
