import { NextResponse } from 'next/server';
import { getLeads } from '@/lib/storage';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ ok: false }, { status: 401 });

  const leads = await getLeads();
  const now = Date.now();
  const DAY = 86_400_000;

  const last7 = leads.filter(l => now - new Date(l.createdAt).getTime() < 7 * DAY);
  const last30 = leads.filter(l => now - new Date(l.createdAt).getTime() < 30 * DAY);

  // 14-day timeline
  const buckets: { date: string; count: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now - i * DAY);
    const key = d.toISOString().slice(0, 10);
    buckets.push({ date: key, count: 0 });
  }
  for (const lead of last30) {
    const key = lead.createdAt.slice(0, 10);
    const bucket = buckets.find(b => b.date === key);
    if (bucket) bucket.count += 1;
  }

  const byStatus = {
    new: leads.filter(l => l.status === 'new').length,
    read: leads.filter(l => l.status === 'read').length,
    archived: leads.filter(l => l.status === 'archived').length
  };

  const byLocale: Record<string, number> = {};
  for (const lead of leads) {
    byLocale[lead.locale] = (byLocale[lead.locale] || 0) + 1;
  }

  const byBudget: Record<string, number> = {};
  for (const lead of leads) {
    const k = lead.budget || '—';
    byBudget[k] = (byBudget[k] || 0) + 1;
  }

  return NextResponse.json({
    ok: true,
    stats: {
      total: leads.length,
      last7: last7.length,
      last30: last30.length,
      byStatus,
      byLocale,
      byBudget,
      timeline: buckets
    }
  });
}
