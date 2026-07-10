import { useState, useEffect } from "react";
import X from "lucide-react/dist/esm/icons/x";
import Plus from "lucide-react/dist/esm/icons/plus";
import Edit3 from "lucide-react/dist/esm/icons/edit-3";
import Trash2 from "lucide-react/dist/esm/icons/trash-2";
import Upload from "lucide-react/dist/esm/icons/upload";
import LogOut from "lucide-react/dist/esm/icons/log-out";
import ArrowLeft from "lucide-react/dist/esm/icons/arrow-left";
import BarChart3 from "lucide-react/dist/esm/icons/bar-chart-3";
import LayoutGrid from "lucide-react/dist/esm/icons/layout-grid";
import Eye from "lucide-react/dist/esm/icons/eye";
import Users from "lucide-react/dist/esm/icons/users";
import MessageSquare from "lucide-react/dist/esm/icons/message-square";
import CalendarDays from "lucide-react/dist/esm/icons/calendar-days";
import Phone from "lucide-react/dist/esm/icons/phone";
import Settings from "lucide-react/dist/esm/icons/settings";

// ---------- Настройки входа (логин/пароль админа) ----------

function SecuritySettings({ token, showToast, onTokenChange }) {
  const [form, setForm] = useState({
    currentPassword: "",
    newUsername: localStorage.getItem("admin-username") || "admin",
    newPassword: "",
    confirm: ""
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = (e) => {
    e.preventDefault();
    setError("");

    if (form.newPassword && form.newPassword !== form.confirm) {
      setError("Новый пароль и подтверждение не совпадают");
      return;
    }
    if (form.newPassword && form.newPassword.length < 6) {
      setError("Новый пароль должен быть не короче 6 символов");
      return;
    }

    setSaving(true);
    fetch("/api/admin/credentials", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        currentPassword: form.currentPassword,
        newUsername: form.newUsername,
        newPassword: form.newPassword
      })
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok && data.success) {
          // Токен привязан к учётным данным — обновляем сессию новым
          localStorage.setItem("admin-token", data.token);
          localStorage.setItem("admin-username", data.username);
          onTokenChange(data.token);
          showToast("Данные входа обновлены");
          setForm({ currentPassword: "", newUsername: data.username, newPassword: "", confirm: "" });
        } else {
          setError(data.error || "Ошибка при сохранении");
        }
      })
      .catch(() => setError("Ошибка сети"))
      .finally(() => setSaving(false));
  };

  return (
    <form onSubmit={handleSave} className="max-w-xl bg-surface border border-borderSoft p-6 md:p-8 rounded-xl">
      <h2 className="text-xl font-bold text-ink mb-1">Данные для входа</h2>
      <p className="text-muted text-sm mb-6">
        Смена логина или пароля администратора. После сохранения текущая сессия
        продолжит работать, а все остальные устройства будут разлогинены.
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1">
            Текущий пароль (обязательно)
          </label>
          <input
            type="password"
            value={form.currentPassword}
            onChange={(e) => setForm((prev) => ({ ...prev, currentPassword: e.target.value }))}
            placeholder="••••••••"
            className="w-full px-4 py-2 bg-bg border border-borderSoft rounded-lg text-ink focus:outline-none focus:border-primary"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1">
            Логин
          </label>
          <input
            type="text"
            value={form.newUsername}
            onChange={(e) => setForm((prev) => ({ ...prev, newUsername: e.target.value }))}
            placeholder="admin"
            className="w-full px-4 py-2 bg-bg border border-borderSoft rounded-lg text-ink focus:outline-none focus:border-primary font-mono"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1">
              Новый пароль
            </label>
            <input
              type="password"
              value={form.newPassword}
              onChange={(e) => setForm((prev) => ({ ...prev, newPassword: e.target.value }))}
              placeholder="Оставь пустым, чтобы не менять"
              className="w-full px-4 py-2 bg-bg border border-borderSoft rounded-lg text-ink focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1">
              Подтверждение пароля
            </label>
            <input
              type="password"
              value={form.confirm}
              onChange={(e) => setForm((prev) => ({ ...prev, confirm: e.target.value }))}
              placeholder="Повтори новый пароль"
              className="w-full px-4 py-2 bg-bg border border-borderSoft rounded-lg text-ink focus:outline-none focus:border-primary"
            />
          </div>
        </div>
      </div>

      {error && <p className="text-red-400 text-xs mt-4">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="mt-6 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-bright font-semibold shadow-glow transition-all disabled:opacity-50"
      >
        {saving ? "Сохранение…" : "Обновить данные входа"}
      </button>
    </form>
  );
}

// ---------- Контакты ----------

function ContactsSettings({ token, showToast }) {
  const [form, setForm] = useState({ telegramUsername: "", email: "", phone: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/contacts")
      .then((res) => (res.ok ? res.json() : {}))
      .then((data) =>
        setForm({
          telegramUsername: data.telegramUsername || "",
          email: data.email || "",
          phone: data.phone || ""
        })
      )
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    fetch("/api/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(form)
    })
      .then((res) => {
        if (res.ok) {
          showToast("Контакты сохранены — уже видны на сайте");
        } else {
          showToast("Ошибка при сохранении контактов", "error");
        }
      })
      .catch(() => showToast("Ошибка сети", "error"))
      .finally(() => setSaving(false));
  };

  if (loading) return <p className="text-muted text-sm">Загрузка контактов…</p>;

  return (
    <form onSubmit={handleSave} className="max-w-xl bg-surface border border-borderSoft p-6 md:p-8 rounded-xl">
      <h2 className="text-xl font-bold text-ink mb-1">Контактные данные</h2>
      <p className="text-muted text-sm mb-6">
        Эти значения показываются в секции «Контакты» и в кнопках «Написать в Telegram» по всему сайту.
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1">
            Telegram (юзернейм без @)
          </label>
          <input
            type="text"
            value={form.telegramUsername}
            onChange={(e) => setForm((prev) => ({ ...prev, telegramUsername: e.target.value.replace(/^@/, "") }))}
            placeholder="my_username"
            className="w-full px-4 py-2 bg-bg border border-borderSoft rounded-lg text-ink focus:outline-none focus:border-primary font-mono"
          />
          {form.telegramUsername && (
            <p className="text-[11px] text-muted mt-1 font-mono">t.me/{form.telegramUsername}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1">
            Email
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            placeholder="me@example.com"
            className="w-full px-4 py-2 bg-bg border border-borderSoft rounded-lg text-ink focus:outline-none focus:border-primary font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1">
            Телефон (международный формат, без пробелов)
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
            placeholder="+998901234567"
            className="w-full px-4 py-2 bg-bg border border-borderSoft rounded-lg text-ink focus:outline-none focus:border-primary font-mono"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="mt-6 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-bright font-semibold shadow-glow transition-all disabled:opacity-50"
      >
        {saving ? "Сохранение…" : "Сохранить контакты"}
      </button>
    </form>
  );
}

// ---------- Аналитика ----------

function StatTile({ icon: Icon, label, value }) {
  return (
    <div className="bg-surface border border-borderSoft rounded-xl p-5 flex flex-col gap-2">
      <div className="flex items-center gap-2 text-muted">
        <Icon className="w-4 h-4" />
        <span className="text-xs font-semibold uppercase tracking-wider">{label}</span>
      </div>
      <span className="text-3xl font-extrabold text-ink font-mono">{value}</span>
    </div>
  );
}

function AnalyticsDashboard({ token, projects }) {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/stats", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        if (!res.ok) throw new Error("stats error");
        return res.json();
      })
      .then(setStats)
      .catch(() => setError("Не удалось загрузить статистику"));
  }, [token]);

  if (error) return <p className="text-red-400 text-sm">{error}</p>;
  if (!stats) return <p className="text-muted text-sm">Загрузка статистики…</p>;

  const todayKey = new Date().toISOString().slice(0, 10);
  const todayVisits = (stats.daily[todayKey] && stats.daily[todayKey].visits) || 0;

  // Ряд последних 14 дней (нули для дней без событий)
  const days = [];
  for (let i = 13; i >= 0; i--) {
    const key = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
    const d = stats.daily[key] || {};
    days.push({
      key,
      label: `${key.slice(8, 10)}.${key.slice(5, 7)}`,
      visits: d.visits || 0,
      views: d.projectViews || 0
    });
  }
  const maxVisits = Math.max(1, ...days.map((d) => d.visits));

  const titleById = (id) => {
    const p = projects.find((pr) => pr.id === id);
    return (p && p.ru && p.ru.title) || id;
  };
  const topProjects = Object.entries(stats.projects || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 7);
  const maxProjectViews = Math.max(1, ...topProjects.map(([, n]) => n));

  const langEntries = Object.entries(stats.languages || {}).sort((a, b) => b[1] - a[1]);
  const langTotal = langEntries.reduce((sum, [, n]) => sum + n, 0);

  return (
    <div className="space-y-8">
      {/* Плитки-счётчики */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile icon={Users} label="Всего визитов" value={stats.totals.visits} />
        <StatTile icon={CalendarDays} label="Визитов сегодня" value={todayVisits} />
        <StatTile icon={Eye} label="Просмотров кейсов" value={stats.totals.projectViews} />
        <StatTile icon={MessageSquare} label="Заявок с формы" value={stats.totals.contacts} />
      </div>

      {/* Визиты за 14 дней */}
      <div className="bg-surface border border-borderSoft rounded-xl p-6">
        <h3 className="text-sm font-bold text-ink uppercase tracking-wider mb-5">
          Визиты за последние 14 дней
        </h3>
        <div className="flex items-end gap-1.5 h-36">
          {days.map((d) => (
            <div
              key={d.key}
              className="flex-1 flex flex-col items-center gap-1 group cursor-default"
              title={`${d.label}: ${d.visits} визитов, ${d.views} просмотров кейсов`}
            >
              <span className="text-[10px] font-mono text-primary-bright opacity-0 group-hover:opacity-100 transition-opacity">
                {d.visits}
              </span>
              <div className="w-full h-24 flex items-end">
                <div
                  className={`w-full rounded-t transition-colors ${
                    d.visits > 0 ? "bg-primary group-hover:bg-primary-bright" : "bg-borderSoft"
                  }`}
                  style={{ height: d.visits > 0 ? `${Math.max(8, (d.visits / maxVisits) * 100)}%` : "3px" }}
                />
              </div>
              <span className="text-[10px] font-mono text-muted">{d.label.slice(0, 2)}</span>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-muted mt-3 font-mono">
          {days[0].label} — {days[days.length - 1].label}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Топ кейсов по просмотрам */}
        <div className="bg-surface border border-borderSoft rounded-xl p-6">
          <h3 className="text-sm font-bold text-ink uppercase tracking-wider mb-5">
            Интерес к кейсам
          </h3>
          {topProjects.length === 0 ? (
            <p className="text-muted text-sm">Пока нет просмотров — данные появятся, когда посетители начнут открывать кейсы.</p>
          ) : (
            <div className="space-y-3.5">
              {topProjects.map(([id, count]) => (
                <div key={id} title={`${titleById(id)}: ${count} просмотров`}>
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <span className="text-xs text-ink truncate">{titleById(id)}</span>
                    <span className="text-xs font-mono text-muted shrink-0">{count}</span>
                  </div>
                  <div className="h-2 bg-bg rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${(count / maxProjectViews) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Языки посетителей */}
        <div className="bg-surface border border-borderSoft rounded-xl p-6">
          <h3 className="text-sm font-bold text-ink uppercase tracking-wider mb-5">
            Языки посетителей
          </h3>
          {langTotal === 0 ? (
            <p className="text-muted text-sm">Пока нет данных о языках.</p>
          ) : (
            <div className="space-y-3.5">
              {langEntries.map(([lang, count]) => {
                const pct = Math.round((count / langTotal) * 100);
                return (
                  <div key={lang} title={`${lang.toUpperCase()}: ${count} (${pct}%)`}>
                    <div className="flex items-center justify-between gap-3 mb-1">
                      <span className="text-xs font-mono text-ink uppercase">{lang}</span>
                      <span className="text-xs font-mono text-muted">{count} · {pct}%</span>
                    </div>
                    <div className="h-2 bg-bg rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminPanel() {
  const [token, setToken] = useState(localStorage.getItem("admin-token") || "");
  const [username, setUsername] = useState(localStorage.getItem("admin-username") || "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeLangTab, setActiveLangTab] = useState("ru");
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "" });
  const [view, setView] = useState("projects"); // "projects" | "stats"

  useEffect(() => {
    if (!token) return;
    // Проверяем, что токен ещё действителен (мог протухнуть после смены пароля)
    fetch("/api/admin/verify", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        if (!res.ok) throw new Error("Token expired");
        fetchProjects();
      })
      .catch(() => handleLogout());
  }, [token]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 3000);
  };

  const fetchProjects = () => {
    fetch("/api/projects")
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized or server error");
        return res.json();
      })
      .then((data) => setProjects(data))
      .catch((err) => {
        console.error(err);
        handleLogout();
      });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok && data.success) {
          localStorage.setItem("admin-token", data.token);
          localStorage.setItem("admin-username", data.username || username);
          setToken(data.token);
          setPassword("");
        } else {
          setError(data.error || "Неверный логин или пароль");
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Ошибка подключения к серверу");
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("admin-token");
    setToken("");
    setProjects([]);
  };

  const handleCreateNew = () => {
    setEditingProject({
      id: "",
      category: "erp",
      stack: [],
      screenshots: [],
      ru: { title: "", description: "", task: "", solution: "", result: "" },
      uz: { title: "", description: "", task: "", solution: "", result: "" },
      en: { title: "", description: "", task: "", solution: "", result: "" }
    });
    setIsEditing(true);
  };

  const handleEdit = (project) => {
    setEditingProject({ ...project });
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    if (!window.confirm(`Удалить проект "${id}"?`)) return;

    fetch(`/api/projects/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => {
        if (res.ok) {
          showToast("Проект успешно удален");
          fetchProjects();
        } else {
          showToast("Ошибка при удалении проекта", "error");
        }
      })
      .catch((err) => {
        console.error(err);
        showToast("Ошибка сети", "error");
      });
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!editingProject.id) {
      showToast("Пожалуйста, введите уникальный ID проекта", "error");
      return;
    }

    fetch("/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(editingProject)
    })
      .then((res) => {
        if (res.ok) {
          showToast("Проект успешно сохранен");
          setIsEditing(false);
          setEditingProject(null);
          fetchProjects();
        } else {
          showToast("Ошибка при сохранении", "error");
        }
      })
      .catch((err) => {
        console.error(err);
        showToast("Ошибка сети", "error");
      });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    fetch("/api/upload", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    })
      .then((res) => {
        if (!res.ok) throw new Error("Upload failed");
        return res.json();
      })
      .then((data) => {
        if (data.success) {
          setEditingProject((prev) => ({
            ...prev,
            screenshots: [...prev.screenshots, data.path]
          }));
          showToast("Изображение успешно загружено");
        }
      })
      .catch((err) => {
        console.error(err);
        showToast("Ошибка при загрузке изображения", "error");
      })
      .finally(() => setUploading(false));
  };

  const removeScreenshot = (index) => {
    setEditingProject((prev) => ({
      ...prev,
      screenshots: prev.screenshots.filter((_, i) => i !== index)
    }));
  };

  // Login Screen View
  if (!token) {
    return (
      <div className="min-h-screen bg-bg text-ink flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-surface border border-borderSoft p-8 rounded-2xl shadow-glow backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          
          <h1 className="text-2xl font-extrabold text-ink mb-2 text-center">Админ-панель</h1>
          <p className="text-muted text-sm mb-6 text-center">Введите логин и пароль администратора</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Логин"
                autoComplete="username"
                className="w-full px-4 py-3 bg-bg border border-borderSoft rounded-lg text-ink focus:outline-none focus:border-primary transition-all text-center placeholder:text-muted/50"
                required
              />
            </div>
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Пароль"
                autoComplete="current-password"
                className="w-full px-4 py-3 bg-bg border border-borderSoft rounded-lg text-ink focus:outline-none focus:border-primary transition-all text-center placeholder:text-muted/50"
                required
              />
            </div>
            {error && <p className="text-red-500 text-xs text-center">{error}</p>}
            <button
              type="submit"
              className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-bright shadow-glow transition-all"
            >
              Войти
            </button>
            <a 
              href="/"
              className="block text-center text-xs text-muted hover:text-primary-bright mt-4 transition-colors"
            >
              Вернуться на сайт
            </a>
          </form>
        </div>
      </div>
    );
  }

  // Admin Dashboard Main View
  return (
    <div className="min-h-screen bg-bg text-ink font-sans">
      {/* Toast Alert */}
      {toast.message && (
        <div 
          className={`fixed bottom-5 right-5 px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in text-white text-sm font-bold ${
            toast.type === "error" ? "bg-red-500" : "bg-green-500"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Header bar */}
      <header className="sticky top-0 z-40 bg-bgAlt/95 backdrop-blur-md border-b border-borderSoft px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a
            href="/"
            className="flex items-center gap-1.5 text-muted hover:text-primary-bright transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> На сайт
          </a>
          <span className="h-4 w-[1px] bg-borderSoft" />
          <h1 className="text-xl font-bold text-ink tracking-tight">Панель управления CMS</h1>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3.5 py-1.8 bg-surface text-muted hover:text-red-400 border border-borderSoft rounded-lg hover:border-red-400/20 text-xs font-semibold transition-all"
        >
          <LogOut className="w-4 h-4" /> Выйти
        </button>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Editing view */}
        {isEditing && editingProject ? (
          <form onSubmit={handleSave} className="bg-surface border border-borderSoft p-6 md:p-8 rounded-xl shadow-lg relative">
            <h2 className="text-2xl font-bold mb-6 text-ink">
              {editingProject.id ? "Редактирование проекта" : "Создание нового проекта"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Left Column Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1">
                    ID проекта (латиница без пробелов, уникальный slug)
                  </label>
                  <input
                    type="text"
                    value={editingProject.id}
                    onChange={(e) => setEditingProject(prev => ({ ...prev, id: e.target.value }))}
                    disabled={!!projects.find(p => p.id === editingProject.id) && editingProject.id !== ""}
                    placeholder="bellissimo-bot"
                    className="w-full px-4 py-2 bg-bg border border-borderSoft rounded-lg text-ink focus:outline-none focus:border-primary disabled:opacity-50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1">
                    Категория
                  </label>
                  <select
                    value={editingProject.category}
                    onChange={(e) => setEditingProject(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-2 bg-bg border border-borderSoft rounded-lg text-ink focus:outline-none focus:border-primary"
                  >
                    <option value="erp">ERP / CRM</option>
                    <option value="bots">Telegram боты</option>
                    <option value="ai">AI решения</option>
                    <option value="automation">Автоматизация процессов</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1">
                    Стек технологий (через запятую)
                  </label>
                  <input
                    type="text"
                    value={editingProject.stack.join(", ")}
                    onChange={(e) => setEditingProject(prev => ({ 
                      ...prev, 
                      stack: e.target.value.split(",").map(t => t.trim()).filter(Boolean) 
                    }))}
                    placeholder="React, FastAPI, Docker"
                    className="w-full px-4 py-2 bg-bg border border-borderSoft rounded-lg text-ink focus:outline-none focus:border-primary"
                    required
                  />
                </div>
              </div>

              {/* Right Column Screenshots Area */}
              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">
                  Скриншоты кейса
                </label>
                
                {/* Upload Trigger area */}
                <div className="relative border-2 border-dashed border-borderSoft hover:border-primary/40 rounded-xl p-6 text-center cursor-pointer transition-colors mb-4 group bg-bg/50">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    disabled={uploading}
                  />
                  <Upload className="w-8 h-8 text-muted group-hover:text-primary-bright mx-auto mb-2 transition-colors" />
                  <p className="text-xs text-muted font-medium">
                    {uploading ? "Загрузка..." : "Нажмите или перетащите изображение"}
                  </p>
                </div>

                {/* Uploaded thumbnails grid */}
                <div className="grid grid-cols-4 gap-2">
                  {editingProject.screenshots.map((src, idx) => (
                    <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-borderSoft group shadow bg-bg">
                      <img src={src} alt="screenshot" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeScreenshot(idx)}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Localized content Tabs */}
            <div className="border-t border-borderSoft pt-6">
              <div className="flex border-b border-borderSoft gap-2 mb-6">
                {["ru", "uz", "en"].map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setActiveLangTab(lang)}
                    className={`px-4 py-2 font-mono font-bold text-xs uppercase border-b-2 transition-all ${
                      activeLangTab === lang 
                        ? "border-primary text-primary-bright" 
                        : "border-transparent text-muted hover:text-ink"
                    }`}
                  >
                    {lang} Language
                  </button>
                ))}
              </div>

              {/* Tab Text inputs */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1">
                    Название проекта ({activeLangTab.toUpperCase()})
                  </label>
                  <input
                    type="text"
                    value={editingProject[activeLangTab]?.title || ""}
                    onChange={(e) => setEditingProject(prev => ({
                      ...prev,
                      [activeLangTab]: { ...prev[activeLangTab], title: e.target.value }
                    }))}
                    className="w-full px-4 py-2 bg-bg border border-borderSoft rounded-lg text-ink focus:outline-none focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1">
                    Краткое описание ({activeLangTab.toUpperCase()})
                  </label>
                  <textarea
                    rows={2}
                    value={editingProject[activeLangTab]?.description || ""}
                    onChange={(e) => setEditingProject(prev => ({
                      ...prev,
                      [activeLangTab]: { ...prev[activeLangTab], description: e.target.value }
                    }))}
                    className="w-full px-4 py-2 bg-bg border border-borderSoft rounded-lg text-ink focus:outline-none focus:border-primary"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1">
                      Задача ({activeLangTab.toUpperCase()})
                    </label>
                    <textarea
                      rows={3}
                      value={editingProject[activeLangTab]?.task || ""}
                      onChange={(e) => setEditingProject(prev => ({
                        ...prev,
                        [activeLangTab]: { ...prev[activeLangTab], task: e.target.value }
                      }))}
                      className="w-full px-4 py-2 bg-bg border border-borderSoft rounded-lg text-ink focus:outline-none focus:border-primary"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1">
                      Решение ({activeLangTab.toUpperCase()})
                    </label>
                    <textarea
                      rows={3}
                      value={editingProject[activeLangTab]?.solution || ""}
                      onChange={(e) => setEditingProject(prev => ({
                        ...prev,
                        [activeLangTab]: { ...prev[activeLangTab], solution: e.target.value }
                      }))}
                      className="w-full px-4 py-2 bg-bg border border-borderSoft rounded-lg text-ink focus:outline-none focus:border-primary"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1">
                      Результат ({activeLangTab.toUpperCase()})
                    </label>
                    <textarea
                      rows={3}
                      value={editingProject[activeLangTab]?.result || ""}
                      onChange={(e) => setEditingProject(prev => ({
                        ...prev,
                        [activeLangTab]: { ...prev[activeLangTab], result: e.target.value }
                      }))}
                      className="w-full px-4 py-2 bg-bg border border-borderSoft rounded-lg text-ink focus:outline-none focus:border-primary"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Actions button */}
            <div className="flex gap-4 mt-8 justify-end">
              <button
                type="button"
                onClick={() => { setIsEditing(false); setEditingProject(null); }}
                className="px-5 py-2.5 bg-surface text-muted border border-borderSoft rounded-lg hover:text-ink font-semibold transition-colors"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-bright font-semibold shadow-glow transition-all"
              >
                Сохранить проект
              </button>
            </div>
          </form>
        ) : (
          <div>
            {/* Tabs: Проекты / Аналитика */}
            <div className="flex items-center gap-2 mb-8 border-b border-borderSoft">
              {[
                { id: "projects", label: "Проекты", icon: LayoutGrid },
                { id: "stats", label: "Аналитика", icon: BarChart3 },
                { id: "contacts", label: "Контакты", icon: Phone },
                { id: "settings", label: "Настройки", icon: Settings }
              ].map((tab) => {
                const TabIcon = tab.icon;
                const isActive = view === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setView(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 -mb-[1px] transition-all ${
                      isActive
                        ? "border-primary text-primary-bright"
                        : "border-transparent text-muted hover:text-ink"
                    }`}
                  >
                    <TabIcon className="w-4 h-4" /> {tab.label}
                  </button>
                );
              })}
            </div>

            {view === "stats" ? (
              <AnalyticsDashboard token={token} projects={projects} />
            ) : view === "contacts" ? (
              <ContactsSettings token={token} showToast={showToast} />
            ) : view === "settings" ? (
              <SecuritySettings token={token} showToast={showToast} onTokenChange={setToken} />
            ) : (
            <>
            {/* Dashboard Actions header */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-ink">Мои Проекты ({projects.length})</h2>
              <button
                onClick={handleCreateNew}
                className="flex items-center gap-1 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-bright font-semibold shadow-glow transition-all"
              >
                <Plus className="w-5 h-5" /> Добавить проект
              </button>
            </div>

            {/* Projects list grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((project) => (
                <div key={project.id} className="bg-surface border border-borderSoft p-5 rounded-xl shadow-md flex items-center justify-between group hover:border-primary/20 transition-all">
                  <div className="flex items-center gap-4">
                    {/* Thumbnail placeholder */}
                    <div className="w-12 h-12 bg-bg rounded-lg border border-borderSoft overflow-hidden shrink-0 flex items-center justify-center text-muted font-bold text-xs">
                      {project.screenshots && project.screenshots.length > 0 ? (
                        <img src={project.screenshots[0]} alt="thumb" className="w-full h-full object-cover" />
                      ) : (
                        project.category.toUpperCase()
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-ink leading-snug">{project.ru?.title || project.id}</h3>
                      <p className="text-xs text-muted font-mono mt-1">ID: {project.id} | {project.category}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(project)}
                      className="p-2 bg-bg border border-borderSoft text-muted hover:text-primary-bright rounded-lg hover:border-primary/20 transition-colors"
                      title="Редактировать"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="p-2 bg-bg border border-borderSoft text-muted hover:text-red-400 rounded-lg hover:border-red-400/20 transition-colors"
                      title="Удалить"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
