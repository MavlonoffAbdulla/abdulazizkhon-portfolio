// Лёгкий трекер событий для собственной аналитики (см. /api/track на сервере).
// Fire-and-forget: ошибки сети никогда не влияют на работу сайта.
export function track(type, payload = {}) {
  try {
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, ...payload }),
      keepalive: true
    }).catch(() => {});
  } catch (e) {
    /* noop */
  }
}

// Визит считаем один раз за сессию браузера
export function trackVisitOnce(lang) {
  try {
    if (sessionStorage.getItem("am-visit-tracked")) return;
    sessionStorage.setItem("am-visit-tracked", "1");
  } catch (e) {
    /* sessionStorage может быть недоступен — трекаем без дедупликации */
  }
  track("visit", { lang });
}
