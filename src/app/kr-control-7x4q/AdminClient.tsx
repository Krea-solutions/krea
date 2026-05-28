'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Lead, Settings } from '@/lib/storage';

type Tab = 'leads' | 'stats' | 'settings';

export default function AdminClient({ initialLeads, initialSettings, username }: { initialLeads: Lead[]; initialSettings: Settings; username: string }) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('leads');
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [settings, setSettings] = useState<Settings>(initialSettings);
  const [filter, setFilter] = useState<'all' | 'new' | 'read' | 'archived'>('all');
  const [selected, setSelected] = useState<Lead | null>(null);

  const filtered = useMemo(
    () => filter === 'all' ? leads : leads.filter(l => l.status === filter),
    [leads, filter]
  );

  const counts = useMemo(() => ({
    all: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    read: leads.filter(l => l.status === 'read').length,
    archived: leads.filter(l => l.status === 'archived').length
  }), [leads]);

  const reload = async () => {
    const res = await fetch('/api/leads');
    const data = await res.json();
    if (data.ok) setLeads(data.leads);
  };

  const updateStatus = async (id: string, status: Lead['status']) => {
    await fetch(`/api/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    setLeads(leads.map(l => l.id === id ? { ...l, status } : l));
    if (selected?.id === id) setSelected({ ...selected, status });
  };

  const removeLead = async (id: string) => {
    if (!confirm('Delete this lead?')) return;
    await fetch(`/api/leads/${id}`, { method: 'DELETE' });
    setLeads(leads.filter(l => l.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/kr-control-7x4q/login');
    router.refresh();
  };

  return (
    <div className="min-h-screen" style={{ background: '#05090f', cursor: 'auto' }}>
      {/* Header */}
      <header className="border-b border-line px-6 md:px-10 py-5 flex items-center justify-between sticky top-0 z-10" style={{ background: 'rgba(5,9,15,0.85)', backdropFilter: 'blur(20px)' }}>
        <div className="flex items-center gap-8">
          <div className="font-serif text-xl text-ink">KREA<span className="text-cyan">.</span> <span className="text-ink-mute text-sm">control</span></div>
          <nav className="flex gap-1">
            {(['leads', 'stats', 'settings'] as Tab[]).map(t => (
              <button key={t} onClick={() => setTab(t)}
                      className={`px-4 py-2 rounded-full font-mono text-[11px] tracking-[0.1em] uppercase transition ${tab === t ? 'bg-cyan/15 text-cyan' : 'text-ink-dim hover:text-ink'}`}>
                {t}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-5">
          <div className="font-mono text-[11px] text-ink-mute tracking-wide hidden md:block">↳ {username}</div>
          <button onClick={logout} className="font-mono text-[11px] tracking-[0.1em] text-ink-dim uppercase hover:text-accent transition border border-line-strong rounded-full px-4 py-2">
            Logout
          </button>
        </div>
      </header>

      <main className="px-6 md:px-10 py-10">
        {tab === 'leads' && (
          <LeadsView
            leads={filtered}
            allCounts={counts}
            filter={filter}
            setFilter={setFilter}
            selected={selected}
            setSelected={setSelected}
            updateStatus={updateStatus}
            removeLead={removeLead}
            reload={reload}
          />
        )}
        {tab === 'stats' && <StatsView />}
        {tab === 'settings' && <SettingsView settings={settings} setSettings={setSettings} />}
      </main>
    </div>
  );
}

/* ----------------------------- LEADS ----------------------------- */

function LeadsView({
  leads, allCounts, filter, setFilter, selected, setSelected, updateStatus, removeLead, reload
}: any) {
  return (
    <div className="grid lg:grid-cols-[1fr_500px] gap-6">
      <div>
        <div className="flex items-center justify-between mb-5">
          <h1 className="font-serif text-3xl text-ink">Leads</h1>
          <button onClick={reload} className="font-mono text-[11px] tracking-wide text-ink-dim hover:text-cyan transition">↻ Refresh</button>
        </div>

        <div className="flex gap-2 mb-5 flex-wrap">
          {(['all', 'new', 'read', 'archived'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
                    className={`px-3.5 py-1.5 rounded-full font-mono text-[10px] tracking-[0.1em] uppercase transition border ${filter === f ? 'border-cyan bg-cyan/15 text-cyan' : 'border-line text-ink-dim hover:border-line-strong'}`}>
              {f} <span className="opacity-50 ml-1">{allCounts[f]}</span>
            </button>
          ))}
        </div>

        <div className="border border-line rounded-xl overflow-hidden" style={{ background: 'rgba(10,18,32,0.3)' }}>
          {leads.length === 0 ? (
            <div className="p-10 text-center text-ink-dim text-sm font-mono">No leads yet.</div>
          ) : leads.map((l: Lead) => (
            <button
              key={l.id}
              onClick={() => setSelected(l)}
              className={`w-full text-left p-5 border-b border-line last:border-b-0 transition-colors hover:bg-bg-2/50 ${selected?.id === l.id ? 'bg-bg-2' : ''}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${l.status === 'new' ? 'bg-cyan shadow-[0_0_8px_var(--cyan)]' : l.status === 'read' ? 'bg-ink-mute' : 'bg-accent/50'}`} />
                    <span className="font-serif text-lg text-ink">{l.name}</span>
                    {l.company && <span className="font-mono text-[11px] text-ink-mute">· {l.company}</span>}
                  </div>
                  <div className="text-sm text-ink-dim truncate">{l.message}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-mono text-[10px] text-ink-mute tracking-wide">{new Date(l.createdAt).toLocaleDateString()}</div>
                  <div className="font-mono text-[10px] text-ink-mute mt-1">{l.budget || '—'}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Detail */}
      <aside className="lg:sticky lg:top-24 lg:self-start border border-line rounded-xl p-6 max-h-[calc(100vh-130px)] overflow-y-auto" style={{ background: 'rgba(10,18,32,0.3)' }}>
        {!selected ? (
          <div className="text-center text-ink-dim text-sm font-mono py-20">Select a lead to view detail.</div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className={`font-mono text-[10px] tracking-[0.16em] uppercase px-2.5 py-1 rounded-full border ${selected.status === 'new' ? 'border-cyan text-cyan' : selected.status === 'read' ? 'border-ink-mute text-ink-dim' : 'border-accent/40 text-accent'}`}>
                {selected.status}
              </div>
              <button onClick={() => removeLead(selected.id)} className="font-mono text-[10px] tracking-wide text-ink-mute hover:text-accent transition uppercase">Delete</button>
            </div>

            <h2 className="font-serif text-3xl text-ink mb-1">{selected.name}</h2>
            {selected.company && <div className="text-ink-dim text-sm mb-5">{selected.company}</div>}

            <div className="grid grid-cols-2 gap-4 mb-6 font-mono text-[11px]">
              <Info label="Contact" value={selected.contact} />
              <Info label="Budget" value={selected.budget || '—'} />
              <Info label="Locale" value={selected.locale.toUpperCase()} />
              <Info label="Received" value={new Date(selected.createdAt).toLocaleString()} />
            </div>

            <div className="border-t border-line pt-5 mb-6">
              <div className="font-mono text-[10px] tracking-[0.16em] text-cyan uppercase mb-3">Brief</div>
              <p className="font-serif text-lg text-ink leading-relaxed whitespace-pre-wrap">{selected.message}</p>
            </div>

            <div className="flex gap-2 flex-wrap">
              {selected.status !== 'read' && <button onClick={() => updateStatus(selected.id, 'read')} className="px-3.5 py-2 rounded-full font-mono text-[10px] tracking-wide border border-line-strong text-ink-dim hover:text-ink uppercase transition">Mark read</button>}
              {selected.status !== 'archived' && <button onClick={() => updateStatus(selected.id, 'archived')} className="px-3.5 py-2 rounded-full font-mono text-[10px] tracking-wide border border-line-strong text-ink-dim hover:text-ink uppercase transition">Archive</button>}
              {selected.status !== 'new' && <button onClick={() => updateStatus(selected.id, 'new')} className="px-3.5 py-2 rounded-full font-mono text-[10px] tracking-wide border border-cyan/40 text-cyan uppercase transition">Reopen</button>}
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-ink-mute tracking-[0.1em] uppercase mb-1">{label}</div>
      <div className="text-ink break-all">{value}</div>
    </div>
  );
}

/* ----------------------------- STATS ----------------------------- */

function StatsView() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch('/api/stats').then(r => r.json()).then(d => { if (d.ok) setStats(d.stats); });
  }, []);

  if (!stats) return <div className="text-ink-dim font-mono text-sm">Loading…</div>;

  const max = Math.max(...stats.timeline.map((b: any) => b.count), 1);

  return (
    <div>
      <h1 className="font-serif text-3xl text-ink mb-8">Statistics</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <Stat label="Total" value={stats.total} />
        <Stat label="Last 7 days" value={stats.last7} accent />
        <Stat label="Last 30 days" value={stats.last30} />
        <Stat label="New (unread)" value={stats.byStatus.new} accent />
      </div>

      <div className="border border-line rounded-xl p-6 mb-8" style={{ background: 'rgba(10,18,32,0.3)' }}>
        <div className="font-mono text-[11px] tracking-[0.16em] text-cyan uppercase mb-5">Last 14 days</div>
        <div className="flex items-end gap-1.5 h-40">
          {stats.timeline.map((b: any) => (
            <div key={b.date} className="flex-1 flex flex-col items-center gap-2 group">
              <div className="text-[10px] font-mono text-ink-mute opacity-0 group-hover:opacity-100 transition">{b.count}</div>
              <div
                className="w-full rounded-t transition-all"
                style={{
                  height: `${(b.count / max) * 100}%`,
                  minHeight: b.count > 0 ? '4px' : '1px',
                  background: b.count > 0 ? 'linear-gradient(to top, var(--azure), var(--cyan))' : 'var(--line)'
                }}
              />
              <div className="text-[9px] font-mono text-ink-mute">{b.date.slice(5)}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Breakdown title="By status" data={stats.byStatus} />
        <Breakdown title="By locale" data={stats.byLocale} />
      </div>

      <div className="mt-6">
        <Breakdown title="By budget" data={stats.byBudget} />
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="border border-line rounded-xl p-5" style={{ background: 'rgba(10,18,32,0.3)' }}>
      <div className={`font-serif text-5xl ${accent ? 'text-cyan' : 'text-ink'}`}>{value}</div>
      <div className="font-mono text-[10px] tracking-[0.1em] text-ink-mute uppercase mt-2">{label}</div>
    </div>
  );
}

function Breakdown({ title, data }: { title: string; data: Record<string, number> }) {
  const total = Object.values(data).reduce((a, b) => a + b, 0) || 1;
  const items = Object.entries(data).sort((a, b) => b[1] - a[1]);

  return (
    <div className="border border-line rounded-xl p-6" style={{ background: 'rgba(10,18,32,0.3)' }}>
      <div className="font-mono text-[11px] tracking-[0.16em] text-cyan uppercase mb-5">{title}</div>
      <div className="space-y-3">
        {items.map(([k, v]) => (
          <div key={k}>
            <div className="flex justify-between mb-1.5">
              <span className="text-sm text-ink">{k}</span>
              <span className="font-mono text-xs text-ink-dim">{v} · {Math.round((v / total) * 100)}%</span>
            </div>
            <div className="h-1 bg-line rounded overflow-hidden">
              <div className="h-full bg-cyan" style={{ width: `${(v / total) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ----------------------------- SETTINGS ----------------------------- */

function SettingsView({ settings, setSettings }: { settings: Settings; setSettings: (s: Settings) => void }) {
  const [local, setLocal] = useState(settings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const save = async () => {
    setSaving(true);
    setSaved(false);
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(local)
    });
    const data = await res.json();
    if (data.ok) {
      setSettings(data.settings);
      setLocal(data.settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
    setSaving(false);
  };

  return (
    <div className="max-w-2xl">
      <h1 className="font-serif text-3xl text-ink mb-8">Settings</h1>

      <div className="border border-line rounded-xl divide-y divide-line" style={{ background: 'rgba(10,18,32,0.3)' }}>
        <Toggle
          label="Telegram notifications"
          desc="Send a notification to the configured Telegram chat when a new lead is received."
          value={local.notifyTelegram}
          onChange={(v) => setLocal({ ...local, notifyTelegram: v })}
        />
        <Toggle
          label="Auto-reply"
          desc="Automatically email the requester an acknowledgment (requires email integration)."
          value={local.autoReplyEnabled}
          onChange={(v) => setLocal({ ...local, autoReplyEnabled: v })}
        />
        <div className="p-6">
          <div className="font-mono text-[10px] tracking-[0.16em] text-cyan uppercase mb-1">Email signature</div>
          <div className="text-xs text-ink-dim mb-3">Used as footer in auto-reply messages.</div>
          <textarea
            value={local.emailFooter}
            onChange={(e) => setLocal({ ...local, emailFooter: e.target.value })}
            rows={3}
            className="w-full bg-bg/50 border border-line rounded p-3 text-sm text-ink outline-none focus:border-cyan/40 resize-none"
          />
        </div>
      </div>

      <div className="mt-6 flex items-center gap-4">
        <button onClick={save} disabled={saving} className="px-6 py-2.5 rounded-full bg-cyan text-bg font-medium text-sm tracking-wide hover:bg-glow transition disabled:opacity-50">
          {saving ? 'Saving…' : 'Save changes'}
        </button>
        {saved && <span className="font-mono text-[11px] text-cyan tracking-wide">✓ Saved</span>}
        <span className="font-mono text-[10px] text-ink-mute tracking-wide ml-auto">
          Updated {new Date(settings.updatedAt).toLocaleString()}
        </span>
      </div>

      <div className="mt-10 p-5 border border-line rounded-xl" style={{ background: 'rgba(10,18,32,0.3)' }}>
        <div className="font-mono text-[11px] tracking-[0.16em] text-cyan uppercase mb-3">Environment</div>
        <div className="text-xs text-ink-dim space-y-1.5 font-mono">
          <div>TELEGRAM_BOT_TOKEN: <span className={process.env.NEXT_PUBLIC_TG_CONFIGURED ? 'text-cyan' : 'text-ink-mute'}>configured server-side</span></div>
          <div>TELEGRAM_CHAT_ID: <span className="text-ink-mute">configured server-side</span></div>
          <div>JWT_SECRET: <span className="text-ink-mute">configured server-side</span></div>
        </div>
        <div className="text-xs text-ink-mute mt-3">Configure in <code className="text-cyan">.env.local</code>.</div>
      </div>
    </div>
  );
}

function Toggle({ label, desc, value, onChange }: { label: string; desc: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="p-6 flex items-start justify-between gap-6">
      <div className="flex-1">
        <div className="text-ink font-medium mb-1">{label}</div>
        <div className="text-xs text-ink-dim leading-relaxed">{desc}</div>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`w-11 h-6 rounded-full relative transition-colors shrink-0 ${value ? 'bg-cyan' : 'bg-line-strong'}`}
        role="switch"
        aria-checked={value}
      >
        <span className={`block w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${value ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
      </button>
    </div>
  );
}
