import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { getLeads, getSettings } from '@/lib/storage';
import AdminClient from './AdminClient';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const session = await getSession();
  if (!session) redirect('/kr-control-7x4q/login');

  const [leads, settings] = await Promise.all([getLeads(), getSettings()]);

  return <AdminClient initialLeads={leads} initialSettings={settings} username={session.username} />;
}
