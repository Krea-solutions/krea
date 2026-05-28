"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Lead = {
  id: string; createdAt: string; name: string; company: string;
  contact: string; budget: string; message: string; locale: string;
  status: "new" | "read" | "archived";
};
type Project = {
  id: string; name: string; nameRu: string; desc: string; descRu: string;
  tag: string; tagRu: string; year: string; colors: [string, string];
};
type Testimonial = { id: string; quote: string; quoteRu: string; author: string; role: string };
type Metric = { id: string; value: string; label: string; labelRu: string };
type Visibility = {
  work: boolean; services: boolean; philosophy: boolean;
  process: boolean; metrics: boolean; testimonials: boolean;
};
type Settings = {
  notifyTelegram: boolean; autoReplyEnabled: boolean; emailFooter: string;
  visibility: Visibility; yandexMetrikaId: string; yandexMetrikaToken: string;
  updatedAt: string;
};

type Tab = "leads" | "projects" | "metrics" | "testimonials" | "visibility" | "analytics" | "settings";

const uid = () => "temp-" + Math.random().toString(36).slice(2);

export default function AdminClient({
  initialLeads, initialProjects, initialTestimonials, initialMetrics,
  initialSettings, username,
}: {
  initialLeads: Lead[]; initialProjects: Project[]; initialTestimonials: Testimonial[];
  initialMetrics: Metric[]; initialSettings: Settings; username: string;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("leads");
  const [leads, setLeads] = useState(initialLeads);
  const [projects, setProjects] = useState(initialProjects);
  const [testimonials, setTestimonials] = useState(initialTestimonials);
  const [metrics, setMetrics] = useState(initialMetrics);
  const [settings, setSettings] = useState(initialSettings);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(null), 2200);
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/kr-control-7x4q/login");
    router.refresh();
  };

  const TABS: { id: Tab; label: string }[] = [
    { id: "leads", label: "Заявки" },
    { id: "projects", label: "Проекты" },
    { id: "metrics", label: "Цифры" },
    { id: "testimonials", label: "Отзывы" },
    { id: "visibility", label: "Блоки" },
    { id: "analytics", label: "Аналитика" },
    { id: "settings", label: "Настройки" },
  ];

  return (
    <div className="min-h-screen bg-bg text-ink" style={{ fontFamily: "'Inter',sans-serif" }}>
      <div className="border-b border-line px-5 md:px-8 py-5 flex justify-between items-center sticky top-0 bg-bg/90 backdrop-blur z-30">
        <div>
          <h1 className="font-serif text-2xl">KREA<span className="text-cyan">.</span></h1>
          <p className="text-ink-mute text-xs tracking-wide mt-0.5">Панель управления · {username}</p>
        </div>
        <button onClick={logout} className="px-4 py-2 border border-line-strong rounded-lg text-sm text-ink-dim hover:text-ink hover:border-cyan/50 transition-colors">
          Выйти
        </button>
      </div>

      <div className="border-b border-line flex overflow-x-auto sticky top-[73px] bg-bg/90 backdrop-blur z-20">
        {TABS.map((tb) => (
          <button key={tb.id} onClick={() => setTab(tb.id)}
            className={`px-5 py-4 border-b-2 font-mono text-xs tracking-wide whitespace-nowrap transition-colors ${tab === tb.id ? "border-cyan text-cyan" : "border-transparent text-ink-mute hover:text-ink"}`}>
            {tb.label}
          </button>
        ))}
      </div>

      <div className="p-5 md:p-8 max-w-6xl mx-auto">
        {tab === "leads" && <LeadsTab leads={leads} setLeads={setLeads} showToast={showToast} />}
        {tab === "projects" && <ProjectsTab projects={projects} setProjects={setProjects} showToast={showToast} />}
        {tab === "metrics" && <MetricsTab metrics={metrics} setMetrics={setMetrics} showToast={showToast} />}
        {tab === "testimonials" && <TestimonialsTab items={testimonials} setItems={setTestimonials} showToast={showToast} />}
        {tab === "visibility" && <VisibilityTab settings={settings} setSettings={setSettings} showToast={showToast} />}
        {tab === "analytics" && <AnalyticsTab settings={settings} />}
        {tab === "settings" && <SettingsTab settings={settings} setSettings={setSettings} showToast={showToast} />}
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-3 bg-cyan text-bg rounded-full text-sm font-medium shadow-lg z-50 animate-[fadeUp_0.3s_ease]">
          {toast}
        </div>
      )}
      <style jsx global>{`
        @keyframes fadeUp { from { opacity: 0; transform: translate(-50%, 10px); } to { opacity: 1; transform: translate(-50%, 0); } }
        .inp { width: 100%; padding: 10px 12px; background: #0a1220; border: 1px solid rgba(180,210,255,0.08); border-radius: 8px; font-size: 14px; color: #eaf2ff; outline: none; transition: border-color .2s; }
        .inp:focus { border-color: #4dc8ff; }
        .btn-primary { padding: 10px 18px; background: rgba(77,200,255,0.15); border: 1px solid #4dc8ff; border-radius: 8px; font-size: 14px; color: #4dc8ff; cursor: pointer; transition: background .2s; }
        .btn-primary:hover { background: rgba(77,200,255,0.25); }
        .btn-danger { padding: 10px 16px; background: rgba(239,68,68,0.12); border: 1px solid rgba(239,68,68,0.5); border-radius: 8px; font-size: 14px; color: #f87171; cursor: pointer; }
        .lbl { display: block; font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.12em; color: #4dc8ff; text-transform: uppercase; margin-bottom: 6px; }
        .card { padding: 16px; background: #0a1220; border: 1px solid rgba(180,210,255,0.08); border-radius: 12px; }
      `}</style>
    </div>
  );
}

/* ---------- LEADS ---------- */
function LeadsTab({ leads, setLeads, showToast }: any) {
  const [filter, setFilter] = useState<"all" | "new" | "read" | "archived">("all");
  const [sel, setSel] = useState<Lead | null>(null);

  const counts = useMemo(() => ({
    all: leads.length,
    new: leads.filter((l: Lead) => l.status === "new").length,
    read: leads.filter((l: Lead) => l.status === "read").length,
    archived: leads.filter((l: Lead) => l.status === "archived").length,
  }), [leads]);

  const filtered = filter === "all" ? leads : leads.filter((l: Lead) => l.status === filter);

  const setStatus = async (id: string, status: Lead["status"]) => {
    await fetch(`/api/leads/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    setLeads(leads.map((l: Lead) => (l.id === id ? { ...l, status } : l)));
    if (sel?.id === id) setSel({ ...sel, status });
    showToast("Статус обновлён");
  };
  const remove = async (id: string) => {
    if (!confirm("Удалить заявку?")) return;
    await fetch(`/api/leads/${id}`, { method: "DELETE" });
    setLeads(leads.filter((l: Lead) => l.id !== id));
    if (sel?.id === id) setSel(null);
    showToast("Заявка удалена");
  };

  const statusRu: Record<string, string> = { new: "Новая", read: "Просмотрена", archived: "В архиве" };

  return (
    <div className="grid md:grid-cols-[220px_1fr] gap-6">
      <div className="flex md:flex-col gap-2 overflow-x-auto">
        {(["all", "new", "read", "archived"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`text-left px-4 py-2.5 rounded-lg text-sm whitespace-nowrap transition-colors ${filter === f ? "bg-cyan/15 text-cyan" : "text-ink-dim hover:text-ink"}`}>
            {f === "all" ? "Все" : statusRu[f]} <span className="opacity-50">({counts[f]})</span>
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.length === 0 && <div className="text-ink-mute text-sm py-8 text-center">Заявок нет</div>}
        {filtered.map((l: Lead) => (
          <div key={l.id} onClick={() => setSel(l)}
            className={`card cursor-pointer transition-colors ${sel?.id === l.id ? "border-cyan" : "hover:border-cyan/40"}`}>
            <div className="flex justify-between items-start gap-3">
              <div className="min-w-0">
                <div className="font-mono text-[11px] text-cyan mb-1">{new Date(l.createdAt).toLocaleString("ru")}</div>
                <div className="text-sm text-ink truncate">{l.name} · {l.contact}</div>
                {l.company && <div className="text-xs text-ink-dim truncate">{l.company}</div>}
              </div>
              <span className="shrink-0 text-[10px] font-mono px-2 py-1 rounded bg-white/5 text-ink-dim">{statusRu[l.status]}</span>
            </div>
          </div>
        ))}
      </div>

      {sel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSel(null)}>
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative card max-w-lg w-full max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-mono text-xs text-cyan uppercase tracking-wide">Заявка</h3>
              <button onClick={() => setSel(null)} className="text-ink-mute hover:text-ink">✕</button>
            </div>
            <div className="space-y-4 text-sm">
              <Row k="Имя" v={sel.name} />
              <Row k="Компания" v={sel.company || "—"} />
              <Row k="Контакт" v={sel.contact} />
              <Row k="Бюджет" v={sel.budget || "—"} />
              <Row k="Язык" v={sel.locale} />
              <div>
                <div className="lbl">Сообщение</div>
                <div className="text-ink whitespace-pre-wrap leading-relaxed">{sel.message}</div>
              </div>
            </div>
            <div className="flex gap-2 pt-5 mt-5 border-t border-line">
              <select value={sel.status} onChange={(e) => setStatus(sel.id, e.target.value as any)} className="inp flex-1">
                <option value="new">Новая</option>
                <option value="read">Просмотрена</option>
                <option value="archived">В архиве</option>
              </select>
              <button onClick={() => remove(sel.id)} className="btn-danger">Удалить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
function Row({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <div className="lbl">{k}</div>
      <div className="text-ink break-words">{v}</div>
    </div>
  );
}

/* ---------- PROJECTS ---------- */
function ProjectsTab({ projects, setProjects, showToast }: any) {
  const [edit, setEdit] = useState<Project | null>(null);

  const save = async (list: Project[]) => {
    await fetch("/api/projects", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(list) });
    setProjects(list);
  };
  const onSave = async () => {
    if (!edit) return;
    const isNew = edit.id.startsWith("temp-");
    const item = isNew ? { ...edit, id: uid().replace("temp-", "") } : edit;
    const list = isNew ? [...projects, item] : projects.map((p: Project) => (p.id === edit.id ? edit : p));
    await save(list);
    setEdit(null);
    showToast("Сохранено");
  };
  const onDelete = async (id: string) => {
    if (!confirm("Удалить проект?")) return;
    await save(projects.filter((p: Project) => p.id !== id));
    setEdit(null);
    showToast("Удалено");
  };

  return (
    <div className="space-y-4">
      <button className="btn-primary" onClick={() => setEdit({ id: uid(), name: "", nameRu: "", desc: "", descRu: "", tag: "", tagRu: "", year: new Date().getFullYear().toString(), colors: ["#4dc8ff", "#04101e"] })}>
        + Добавить проект
      </button>
      <div className="grid gap-3">
        {projects.map((p: Project) => (
          <div key={p.id} className="card flex justify-between items-center">
            <div className="min-w-0">
              <div className="text-sm text-ink truncate">{p.nameRu || p.name}</div>
              <div className="text-xs text-ink-dim mt-0.5">{p.year} · {p.tagRu || p.tag}</div>
            </div>
            <button onClick={() => setEdit(p)} className="text-xs text-cyan shrink-0 ml-3">Изменить</button>
          </div>
        ))}
        {projects.length === 0 && <div className="text-ink-mute text-sm py-6 text-center">Проектов нет</div>}
      </div>

      {edit && (
        <Modal title="Проект" onClose={() => setEdit(null)}>
          <div className="grid md:grid-cols-2 gap-3">
            <div><div className="lbl">Название (EN)</div><input className="inp" value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} /></div>
            <div><div className="lbl">Название (RU)</div><input className="inp" value={edit.nameRu} onChange={(e) => setEdit({ ...edit, nameRu: e.target.value })} /></div>
          </div>
          <div className="mt-3"><div className="lbl">Описание (EN)</div><textarea className="inp" rows={2} value={edit.desc} onChange={(e) => setEdit({ ...edit, desc: e.target.value })} /></div>
          <div className="mt-3"><div className="lbl">Описание (RU)</div><textarea className="inp" rows={2} value={edit.descRu} onChange={(e) => setEdit({ ...edit, descRu: e.target.value })} /></div>
          <div className="grid md:grid-cols-2 gap-3 mt-3">
            <div><div className="lbl">Теги (EN)</div><input className="inp" value={edit.tag} onChange={(e) => setEdit({ ...edit, tag: e.target.value })} /></div>
            <div><div className="lbl">Теги (RU)</div><input className="inp" value={edit.tagRu} onChange={(e) => setEdit({ ...edit, tagRu: e.target.value })} /></div>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-3">
            <div><div className="lbl">Год</div><input className="inp" value={edit.year} onChange={(e) => setEdit({ ...edit, year: e.target.value })} /></div>
            <div><div className="lbl">Цвет 1</div><input className="inp" type="color" value={edit.colors[0]} onChange={(e) => setEdit({ ...edit, colors: [e.target.value, edit.colors[1]] })} /></div>
            <div><div className="lbl">Цвет 2</div><input className="inp" type="color" value={edit.colors[1]} onChange={(e) => setEdit({ ...edit, colors: [edit.colors[0], e.target.value] })} /></div>
          </div>
          <div className="flex gap-2 pt-5 mt-5 border-t border-line">
            <button className="btn-primary flex-1" onClick={onSave}>Сохранить</button>
            {!edit.id.startsWith("temp-") && <button className="btn-danger" onClick={() => onDelete(edit.id)}>Удалить</button>}
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ---------- METRICS ---------- */
function MetricsTab({ metrics, setMetrics, showToast }: any) {
  const [edit, setEdit] = useState<Metric | null>(null);
  const save = async (list: Metric[]) => {
    await fetch("/api/metrics", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(list) });
    setMetrics(list);
  };
  const onSave = async () => {
    if (!edit) return;
    const isNew = edit.id.startsWith("temp-");
    const item = isNew ? { ...edit, id: uid().replace("temp-", "") } : edit;
    const list = isNew ? [...metrics, item] : metrics.map((m: Metric) => (m.id === edit.id ? edit : m));
    await save(list);
    setEdit(null);
    showToast("Сохранено");
  };
  const onDelete = async (id: string) => {
    if (!confirm("Удалить цифру?")) return;
    await save(metrics.filter((m: Metric) => m.id !== id));
    setEdit(null);
    showToast("Удалено");
  };
  return (
    <div className="space-y-4">
      <button className="btn-primary" onClick={() => setEdit({ id: uid(), value: "", label: "", labelRu: "" })}>+ Добавить цифру</button>
      <div className="grid md:grid-cols-2 gap-3">
        {metrics.map((m: Metric) => (
          <div key={m.id} className="card flex justify-between items-center">
            <div><span className="font-serif text-2xl">{m.value}</span><span className="text-xs text-ink-dim ml-3">{m.labelRu || m.label}</span></div>
            <button onClick={() => setEdit(m)} className="text-xs text-cyan shrink-0 ml-3">Изменить</button>
          </div>
        ))}
        {metrics.length === 0 && <div className="text-ink-mute text-sm py-6 text-center col-span-2">Цифр нет</div>}
      </div>
      {edit && (
        <Modal title="Цифра" onClose={() => setEdit(null)}>
          <div><div className="lbl">Значение (142, 98%, 100M+)</div><input className="inp" value={edit.value} onChange={(e) => setEdit({ ...edit, value: e.target.value })} /></div>
          <div className="mt-3"><div className="lbl">Подпись (EN)</div><input className="inp" value={edit.label} onChange={(e) => setEdit({ ...edit, label: e.target.value })} /></div>
          <div className="mt-3"><div className="lbl">Подпись (RU)</div><input className="inp" value={edit.labelRu} onChange={(e) => setEdit({ ...edit, labelRu: e.target.value })} /></div>
          <div className="flex gap-2 pt-5 mt-5 border-t border-line">
            <button className="btn-primary flex-1" onClick={onSave}>Сохранить</button>
            {!edit.id.startsWith("temp-") && <button className="btn-danger" onClick={() => onDelete(edit.id)}>Удалить</button>}
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ---------- TESTIMONIALS ---------- */
function TestimonialsTab({ items, setItems, showToast }: any) {
  const [edit, setEdit] = useState<Testimonial | null>(null);
  const save = async (list: Testimonial[]) => {
    await fetch("/api/testimonials", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(list) });
    setItems(list);
  };
  const onSave = async () => {
    if (!edit) return;
    const isNew = edit.id.startsWith("temp-");
    const item = isNew ? { ...edit, id: uid().replace("temp-", "") } : edit;
    const list = isNew ? [...items, item] : items.map((t: Testimonial) => (t.id === edit.id ? edit : t));
    await save(list);
    setEdit(null);
    showToast("Сохранено");
  };
  const onDelete = async (id: string) => {
    if (!confirm("Удалить отзыв?")) return;
    await save(items.filter((t: Testimonial) => t.id !== id));
    setEdit(null);
    showToast("Удалено");
  };
  return (
    <div className="space-y-4">
      <button className="btn-primary" onClick={() => setEdit({ id: uid(), quote: "", quoteRu: "", author: "", role: "" })}>+ Добавить отзыв</button>
      <div className="grid gap-3">
        {items.map((t: Testimonial) => (
          <div key={t.id} className="card">
            <div className="flex justify-between items-start gap-3">
              <p className="text-sm text-ink-dim italic line-clamp-2 flex-1">«{t.quoteRu || t.quote}»</p>
              <button onClick={() => setEdit(t)} className="text-xs text-cyan shrink-0">Изменить</button>
            </div>
            <div className="text-xs text-ink mt-2 font-mono">{t.author} · {t.role}</div>
          </div>
        ))}
        {items.length === 0 && <div className="text-ink-mute text-sm py-6 text-center">Отзывов нет</div>}
      </div>
      {edit && (
        <Modal title="Отзыв" onClose={() => setEdit(null)}>
          <div><div className="lbl">Цитата (EN)</div><textarea className="inp" rows={3} value={edit.quote} onChange={(e) => setEdit({ ...edit, quote: e.target.value })} /></div>
          <div className="mt-3"><div className="lbl">Цитата (RU)</div><textarea className="inp" rows={3} value={edit.quoteRu} onChange={(e) => setEdit({ ...edit, quoteRu: e.target.value })} /></div>
          <div className="grid md:grid-cols-2 gap-3 mt-3">
            <div><div className="lbl">Автор</div><input className="inp" value={edit.author} onChange={(e) => setEdit({ ...edit, author: e.target.value })} /></div>
            <div><div className="lbl">Роль / компания</div><input className="inp" value={edit.role} onChange={(e) => setEdit({ ...edit, role: e.target.value })} /></div>
          </div>
          <div className="flex gap-2 pt-5 mt-5 border-t border-line">
            <button className="btn-primary flex-1" onClick={onSave}>Сохранить</button>
            {!edit.id.startsWith("temp-") && <button className="btn-danger" onClick={() => onDelete(edit.id)}>Удалить</button>}
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ---------- VISIBILITY ---------- */
function VisibilityTab({ settings, setSettings, showToast }: any) {
  const labels: Record<keyof Visibility, string> = {
    work: "Работы", services: "Услуги", philosophy: "Философия",
    process: "Процесс", metrics: "Цифры", testimonials: "Отзывы",
  };
  const toggle = async (key: keyof Visibility) => {
    const visibility = { ...settings.visibility, [key]: !settings.visibility[key] };
    const next = { ...settings, visibility };
    setSettings(next);
    await fetch("/api/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ visibility }) });
    showToast("Сохранено");
  };
  return (
    <div className="space-y-3 max-w-lg">
      <p className="text-sm text-ink-dim mb-4">Включайте и выключайте блоки на главной странице.</p>
      {(Object.keys(labels) as (keyof Visibility)[]).map((key) => (
        <div key={key} className="card flex justify-between items-center">
          <span className="text-sm text-ink">{labels[key]}</span>
          <button onClick={() => toggle(key)}
            className={`relative w-12 h-6 rounded-full transition-colors ${settings.visibility[key] ? "bg-cyan" : "bg-white/10"}`}>
            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${settings.visibility[key] ? "left-[26px]" : "left-0.5"}`} />
          </button>
        </div>
      ))}
    </div>
  );
}

/* ---------- ANALYTICS ---------- */
function AnalyticsTab({ settings }: { settings: Settings }) {
  const [data, setData] = useState<any>(null);
  const [state, setState] = useState<"loading" | "ok" | "none" | "error">("loading");

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) { setData(d.data); setState("ok"); }
        else if (d.error === "not_configured") setState("none");
        else setState("error");
      })
      .catch(() => setState("error"));
  }, []);

  if (state === "none")
    return <div className="card max-w-lg"><p className="text-sm text-ink-dim">Яндекс.Метрика не подключена. Добавьте ID счётчика и OAuth-токен на вкладке «Настройки».</p></div>;
  if (state === "loading") return <div className="text-ink-mute text-sm">Загрузка статистики…</div>;
  if (state === "error") return <div className="card max-w-lg"><p className="text-sm text-red-400">Не удалось получить данные. Проверьте ID и токен.</p></div>;

  const stat = [
    { label: "Визиты (7 дней)", value: Math.round(data.visits) },
    { label: "Посетители", value: Math.round(data.users) },
    { label: "Просмотры", value: Math.round(data.pageviews) },
    { label: "Отказы, %", value: data.bounceRate?.toFixed(1) },
    { label: "Сред. время, сек", value: Math.round(data.avgDuration) },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {stat.map((s) => (
        <div key={s.label} className="card">
          <div className="font-serif text-3xl text-ink">{s.value}</div>
          <div className="text-xs text-ink-dim mt-1">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

/* ---------- SETTINGS ---------- */
function SettingsTab({ settings, setSettings, showToast }: any) {
  const [local, setLocal] = useState(settings);
  const save = async () => {
    await fetch("/api/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(local) });
    setSettings(local);
    showToast("Настройки сохранены");
  };
  return (
    <div className="space-y-5 max-w-lg">
      <div className="card flex justify-between items-center">
        <span className="text-sm text-ink">Уведомления в Telegram</span>
        <button onClick={() => setLocal({ ...local, notifyTelegram: !local.notifyTelegram })}
          className={`relative w-12 h-6 rounded-full transition-colors ${local.notifyTelegram ? "bg-cyan" : "bg-white/10"}`}>
          <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${local.notifyTelegram ? "left-[26px]" : "left-0.5"}`} />
        </button>
      </div>
      <div className="card">
        <div className="lbl">Подпись в письмах</div>
        <input className="inp" value={local.emailFooter} onChange={(e) => setLocal({ ...local, emailFooter: e.target.value })} />
      </div>
      <div className="card space-y-3">
        <div className="text-sm text-ink font-medium">Яндекс.Метрика</div>
        <div><div className="lbl">ID счётчика</div><input className="inp" placeholder="12345678" value={local.yandexMetrikaId} onChange={(e) => setLocal({ ...local, yandexMetrikaId: e.target.value })} /></div>
        <div><div className="lbl">OAuth-токен (для статистики)</div><input className="inp" type="password" placeholder="y0_AgAA..." value={local.yandexMetrikaToken} onChange={(e) => setLocal({ ...local, yandexMetrikaToken: e.target.value })} /></div>
        <p className="text-xs text-ink-mute leading-relaxed">ID — для счётчика на сайте. Токен — чтобы видеть статистику во вкладке «Аналитика». Получить токен: oauth.yandex.ru → создать приложение с доступом к API Метрики.</p>
      </div>
      <button className="btn-primary" onClick={save}>Сохранить настройки</button>
    </div>
  );
}

/* ---------- MODAL ---------- */
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative card max-w-2xl w-full max-h-[88vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-mono text-xs text-cyan uppercase tracking-wide">{title}</h3>
          <button onClick={onClose} className="text-ink-mute hover:text-ink">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}
