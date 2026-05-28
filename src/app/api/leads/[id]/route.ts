import { NextResponse } from 'next/server';
import { updateLeadStatus, deleteLead, type Lead } from '@/lib/storage';
import { requireAdmin } from '@/lib/auth';

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ ok: false }, { status: 401 });
  const { id } = await ctx.params;
  const body = await req.json().catch(() => ({}));
  const status = body.status as Lead['status'];
  if (!['new', 'read', 'archived'].includes(status)) {
    return NextResponse.json({ ok: false, error: 'Bad status' }, { status: 400 });
  }
  const lead = await updateLeadStatus(id, status);
  if (!lead) return NextResponse.json({ ok: false }, { status: 404 });
  return NextResponse.json({ ok: true, lead });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ ok: false }, { status: 401 });
  const { id } = await ctx.params;
  const ok = await deleteLead(id);
  return NextResponse.json({ ok });
}
