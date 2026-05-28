"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Lead, Project, Testimonial } from "@/lib/storage";

type Tab = "leads" | "projects" | "testimonials" | "settings";

export default function AdminClient({
  initialLeads,
  initialProjects,
  initialTestimonials,
  initialSettings,
  username,
}: {
  initialLeads: Lead[];
  initialProjects: Project[];
  initialTestimonials: Testimonial[];
  initialSettings: any;
  username: string;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("leads");
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [testimonials, setTestimonials] =
    useState<Testimonial[]>(initialTestimonials);
  const [settings, setSettings] = useState(initialSettings);
  const [filter, setFilter] = useState<"all" | "new" | "read" | "archived">(
    "all",
  );
  const [selected, setSelected] = useState<Lead | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingTestimonial, setEditingTestimonial] =
    useState<Testimonial | null>(null);

  const filtered = useMemo(
    () => (filter === "all" ? leads : leads.filter((l) => l.status === filter)),
    [leads, filter],
  );

  const counts = useMemo(
    () => ({
      all: leads.length,
      new: leads.filter((l) => l.status === "new").length,
      read: leads.filter((l) => l.status === "read").length,
      archived: leads.filter((l) => l.status === "archived").length,
    }),
    [leads],
  );

  const updateStatus = async (id: string, status: Lead["status"]) => {
    await fetch(`/api/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setLeads(leads.map((l) => (l.id === id ? { ...l, status } : l)));
    if (selected?.id === id) setSelected({ ...selected, status });
  };

  const removeLead = async (id: string) => {
    if (!confirm("Удалить заявку?")) return;
    await fetch(`/api/leads/${id}`, { method: "DELETE" });
    setLeads(leads.filter((l) => l.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const saveProject = async () => {
    if (!editingProject) return;
    const newProjects = editingProject.id.startsWith("temp-")
      ? [...projects, { ...editingProject, id: crypto.randomUUID() }]
      : projects.map((p) => (p.id === editingProject.id ? editingProject : p));
    await fetch("/api/projects", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProjects),
    });
    setProjects(newProjects);
    setEditingProject(null);
  };

  const deleteProject = async (id: string) => {
    if (!confirm("Удалить проект?")) return;
    const newProjects = projects.filter((p) => p.id !== id);
    await fetch("/api/projects", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProjects),
    });
    setProjects(newProjects);
  };

  const saveTestimonial = async () => {
    if (!editingTestimonial) return;
    const newTestimonials = editingTestimonial.id.startsWith("temp-")
      ? [...testimonials, { ...editingTestimonial, id: crypto.randomUUID() }]
      : testimonials.map((t) =>
          t.id === editingTestimonial.id ? editingTestimonial : t,
        );
    await fetch("/api/testimonials", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTestimonials),
    });
    setTestimonials(newTestimonials);
    setEditingTestimonial(null);
  };

  const deleteTestimonial = async (id: string) => {
    if (!confirm("Удалить отзыв?")) return;
    const newTestimonials = testimonials.filter((t) => t.id !== id);
    await fetch("/api/testimonials", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTestimonials),
    });
    setTestimonials(newTestimonials);
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/kr-control-7x4q/login");
    router.refresh();
  };

  return (
    <div
      className="min-h-screen bg-bg text-ink"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Header */}
      <div className="border-b border-line px-8 py-6 flex justify-between items-center">
        <div>
          <h1 className="font-serif text-2xl mb-1">
            KREA<span className="text-cyan">.</span>
          </h1>
          <p className="text-ink-mute text-xs tracking-wide">
            Административная панель · {username}
          </p>
        </div>
        <button
          onClick={logout}
          className="px-4 py-2 border border-line-strong rounded text-sm text-ink-mute hover:text-ink transition-colors"
        >
          Выход
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-line flex">
        {[
          { id: "leads", label: "Заявки" },
          { id: "projects", label: "Проекты" },
          { id: "testimonials", label: "Отзывы" },
          { id: "settings", label: "Параметры" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as Tab)}
            className={`px-6 py-4 border-b-2 font-mono text-xs tracking-wide transition-colors ${tab === t.id ? "border-cyan text-cyan" : "border-transparent text-ink-mute hover:text-ink"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="p-8 max-w-7xl mx-auto">
        {/* LEADS */}
        {tab === "leads" && (
          <div className="grid md:grid-cols-[300px_1fr] gap-8">
            <div>
              <h3 className="font-mono text-xs tracking-wide text-cyan uppercase mb-4">
                Фильтр
              </h3>
              {["all", "new", "read", "archived"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f as any)}
                  className={`block w-full text-left px-4 py-2 mb-2 rounded text-sm transition-colors ${filter === f ? "bg-cyan/20 text-cyan" : "text-ink-dim hover:text-ink"}`}
                >
                  {f === "all" && `Все (${counts.all})`}
                  {f === "new" && `Новые (${counts.new})`}
                  {f === "read" && `Прочитаны (${counts.read})`}
                  {f === "archived" && `В архиве (${counts.archived})`}
                </button>
              ))}
            </div>
            <div>
              <div className="space-y-2">
                {filtered.map((l) => (
                  <div
                    key={l.id}
                    onClick={() => setSelected(l)}
                    className={`p-4 border rounded cursor-pointer transition-colors ${selected?.id === l.id ? "border-cyan bg-cyan/5" : "border-line hover:border-cyan/50"}`}
                  >
                    <div className="font-mono text-xs text-cyan mb-1">
                      {new Date(l.createdAt).toLocaleString("ru")}
                    </div>
                    <div className="font-mono text-sm text-ink mb-1">
                      {l.name}
                    </div>
                    <div className="text-xs text-ink-dim truncate">
                      {l.contact}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {selected && (
              <div className="md:col-start-2">
                <h3 className="font-mono text-xs tracking-wide text-cyan uppercase mb-4">
                  Детали
                </h3>
                <div className="bg-bg-2 border border-line rounded-lg p-6 space-y-4 max-w-2xl">
                  <div>
                    <label className="block font-mono text-xs text-cyan uppercase mb-2">
                      Имя
                    </label>
                    <div className="text-ink">{selected.name}</div>
                  </div>
                  <div>
                    <label className="block font-mono text-xs text-cyan uppercase mb-2">
                      Организация
                    </label>
                    <div className="text-ink">{selected.company || "—"}</div>
                  </div>
                  <div>
                    <label className="block font-mono text-xs text-cyan uppercase mb-2">
                      Контакт
                    </label>
                    <div className="text-ink break-all">{selected.contact}</div>
                  </div>
                  <div>
                    <label className="block font-mono text-xs text-cyan uppercase mb-2">
                      Бюджет
                    </label>
                    <div className="text-ink">{selected.budget || "—"}</div>
                  </div>
                  <div>
                    <label className="block font-mono text-xs text-cyan uppercase mb-2">
                      Бриф
                    </label>
                    <div className="text-ink text-sm leading-relaxed whitespace-pre-wrap">
                      {selected.message}
                    </div>
                  </div>
                  <div className="flex gap-2 pt-4 border-t border-line">
                    <select
                      value={selected.status}
                      onChange={(e) =>
                        updateStatus(selected.id, e.target.value as any)
                      }
                      className="flex-1 px-3 py-2 bg-bg border border-line rounded text-sm text-ink outline-none focus:border-cyan"
                    >
                      <option value="new">Новая</option>
                      <option value="read">Прочитана</option>
                      <option value="archived">В архиве</option>
                    </select>
                    <button
                      onClick={() => removeLead(selected.id)}
                      className="px-4 py-2 bg-red-500/20 border border-red-500/50 rounded text-sm text-red-400 hover:bg-red-500/30"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* PROJECTS */}
        {tab === "projects" && (
          <div className="space-y-6">
            <button
              onClick={() =>
                setEditingProject({
                  id: `temp-${Date.now()}`,
                  name: "",
                  nameRu: "",
                  desc: "",
                  descRu: "",
                  tag: "",
                  tagRu: "",
                  year: new Date().getFullYear().toString(),
                  colors: ["#4dc8ff", "#04101e"],
                })
              }
              className="px-4 py-2 bg-cyan/20 border border-cyan rounded text-sm text-cyan hover:bg-cyan/30"
            >
              + Добавить проект
            </button>
            <div className="grid gap-4">
              {projects.map((p) => (
                <div
                  key={p.id}
                  className="p-4 bg-bg-2 border border-line rounded-lg"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-mono text-sm text-ink">
                        {p.name} / {p.nameRu}
                      </h4>
                      <p className="text-xs text-ink-dim mt-1">
                        {p.year} · {p.tag}
                      </p>
                    </div>
                    <button
                      onClick={() => setEditingProject(p)}
                      className="text-xs text-cyan hover:text-cyan/80"
                    >
                      Редактировать
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {editingProject && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                <div className="bg-bg border border-line rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
                  <div className="sticky top-0 bg-bg-2 border-b border-line px-6 py-4 flex justify-between items-center">
                    <h3 className="font-mono text-sm text-cyan uppercase">
                      Редактировать проект
                    </h3>
                    <button
                      onClick={() => setEditingProject(null)}
                      className="text-ink-mute hover:text-ink"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Name (EN)"
                        value={editingProject.name}
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            name: e.target.value,
                          })
                        }
                        className="px-3 py-2 bg-bg-2 border border-line rounded text-sm text-ink outline-none focus:border-cyan"
                      />
                      <input
                        type="text"
                        placeholder="Название (RU)"
                        value={editingProject.nameRu}
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            nameRu: e.target.value,
                          })
                        }
                        className="px-3 py-2 bg-bg-2 border border-line rounded text-sm text-ink outline-none focus:border-cyan"
                      />
                    </div>
                    <textarea
                      placeholder="Description (EN)"
                      value={editingProject.desc}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          desc: e.target.value,
                        })
                      }
                      rows={2}
                      className="w-full px-3 py-2 bg-bg-2 border border-line rounded text-sm text-ink outline-none focus:border-cyan resize-none"
                    />
                    <textarea
                      placeholder="Описание (RU)"
                      value={editingProject.descRu}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          descRu: e.target.value,
                        })
                      }
                      rows={2}
                      className="w-full px-3 py-2 bg-bg-2 border border-line rounded text-sm text-ink outline-none focus:border-cyan resize-none"
                    />
                    <div className="grid md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Tag (EN)"
                        value={editingProject.tag}
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            tag: e.target.value,
                          })
                        }
                        className="px-3 py-2 bg-bg-2 border border-line rounded text-sm text-ink outline-none focus:border-cyan"
                      />
                      <input
                        type="text"
                        placeholder="Теги (RU)"
                        value={editingProject.tagRu}
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            tagRu: e.target.value,
                          })
                        }
                        className="px-3 py-2 bg-bg-2 border border-line rounded text-sm text-ink outline-none focus:border-cyan"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Year"
                      value={editingProject.year}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          year: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 bg-bg-2 border border-line rounded text-sm text-ink outline-none focus:border-cyan"
                    />
                    <div className="flex gap-2 pt-4 border-t border-line">
                      <button
                        onClick={saveProject}
                        className="flex-1 px-4 py-2 bg-cyan/20 border border-cyan rounded text-sm text-cyan hover:bg-cyan/30"
                      >
                        Сохранить
                      </button>
                      {!editingProject.id.startsWith("temp-") && (
                        <button
                          onClick={() => deleteProject(editingProject.id)}
                          className="px-4 py-2 bg-red-500/20 border border-red-500/50 rounded text-sm text-red-400 hover:bg-red-500/30"
                        >
                          Удалить
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TESTIMONIALS */}
        {tab === "testimonials" && (
          <div className="space-y-6">
            <button
              onClick={() =>
                setEditingTestimonial({
                  id: `temp-${Date.now()}`,
                  quote: "",
                  quoteRu: "",
                  author: "",
                  role: "",
                })
              }
              className="px-4 py-2 bg-cyan/20 border border-cyan rounded text-sm text-cyan hover:bg-cyan/30"
            >
              + Добавить отзыв
            </button>
            <div className="grid gap-4">
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  className="p-4 bg-bg-2 border border-line rounded-lg"
                >
                  <p className="text-sm text-ink-dim italic mb-3 line-clamp-2">
                    "{t.quote}"
                  </p>
                  <div className="flex justify-between items-start">
                    <div className="text-xs">
                      <div className="text-ink font-mono">{t.author}</div>
                      <div className="text-ink-dim">{t.role}</div>
                    </div>
                    <button
                      onClick={() => setEditingTestimonial(t)}
                      className="text-xs text-cyan hover:text-cyan/80"
                    >
                      Редактировать
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {editingTestimonial && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                <div className="bg-bg border border-line rounded-lg max-w-2xl w-full">
                  <div className="sticky top-0 bg-bg-2 border-b border-line px-6 py-4 flex justify-between items-center">
                    <h3 className="font-mono text-sm text-cyan uppercase">
                      Редактировать отзыв
                    </h3>
                    <button
                      onClick={() => setEditingTestimonial(null)}
                      className="text-ink-mute hover:text-ink"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="p-6 space-y-4">
                    <textarea
                      placeholder="Quote (EN)"
                      value={editingTestimonial.quote}
                      onChange={(e) =>
                        setEditingTestimonial({
                          ...editingTestimonial,
                          quote: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full px-3 py-2 bg-bg-2 border border-line rounded text-sm text-ink outline-none focus:border-cyan resize-none"
                    />
                    <textarea
                      placeholder="Цитата (RU)"
                      value={editingTestimonial.quoteRu}
                      onChange={(e) =>
                        setEditingTestimonial({
                          ...editingTestimonial,
                          quoteRu: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full px-3 py-2 bg-bg-2 border border-line rounded text-sm text-ink outline-none focus:border-cyan resize-none"
                    />
                    <div className="grid md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Author"
                        value={editingTestimonial.author}
                        onChange={(e) =>
                          setEditingTestimonial({
                            ...editingTestimonial,
                            author: e.target.value,
                          })
                        }
                        className="px-3 py-2 bg-bg-2 border border-line rounded text-sm text-ink outline-none focus:border-cyan"
                      />
                      <input
                        type="text"
                        placeholder="Role"
                        value={editingTestimonial.role}
                        onChange={(e) =>
                          setEditingTestimonial({
                            ...editingTestimonial,
                            role: e.target.value,
                          })
                        }
                        className="px-3 py-2 bg-bg-2 border border-line rounded text-sm text-ink outline-none focus:border-cyan"
                      />
                    </div>
                    <div className="flex gap-2 pt-4 border-t border-line">
                      <button
                        onClick={saveTestimonial}
                        className="flex-1 px-4 py-2 bg-cyan/20 border border-cyan rounded text-sm text-cyan hover:bg-cyan/30"
                      >
                        Сохранить
                      </button>
                      {!editingTestimonial.id.startsWith("temp-") && (
                        <button
                          onClick={() =>
                            deleteTestimonial(editingTestimonial.id)
                          }
                          className="px-4 py-2 bg-red-500/20 border border-red-500/50 rounded text-sm text-red-400 hover:bg-red-500/30"
                        >
                          Удалить
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SETTINGS */}
        {tab === "settings" && (
          <div className="max-w-2xl">
            <div className="space-y-6">
              <div className="p-4 bg-bg-2 border border-line rounded-lg">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifyTelegram}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        notifyTelegram: e.target.checked,
                      })
                    }
                    className="w-4 h-4 accent-cyan"
                  />
                  <span className="font-mono text-sm text-ink">
                    Уведомления в Telegram
                  </span>
                </label>
              </div>
              <div className="p-4 bg-bg-2 border border-line rounded-lg">
                <label className="block font-mono text-xs text-cyan uppercase mb-2">
                  Email подпись
                </label>
                <input
                  type="text"
                  value={settings.emailFooter}
                  onChange={(e) =>
                    setSettings({ ...settings, emailFooter: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-bg border border-line rounded text-sm text-ink outline-none focus:border-cyan"
                />
              </div>
              <button
                onClick={async () => {
                  await fetch("/api/settings", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(settings),
                  });
                  alert("Сохранено");
                }}
                className="px-4 py-2 bg-cyan/20 border border-cyan rounded text-sm text-cyan hover:bg-cyan/30"
              >
                Сохранить параметры
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
