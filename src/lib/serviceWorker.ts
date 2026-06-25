export function registerServiceWorker() {
  if (!('serviceWorker' in navigator) || !import.meta.env.PROD) return

  window.addEventListener('load', () => {
    const base = import.meta.env.BASE_URL || '/'
    navigator.serviceWorker.register(`${base}sw.js`).catch(() => {
      // Offline support is a bonus layer; the app remains usable if registration is blocked.
    })
  })
}
