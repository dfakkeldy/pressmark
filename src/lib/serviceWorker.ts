const CACHE_NAME = 'pressmark-static-v2'

async function warmRuntimeCache(base: string) {
  if (!('caches' in window)) return

  const urls = new Set<string>([
    new URL(base, window.location.href).href,
    window.location.href,
    new URL(`${base}sample-figure.svg`, window.location.href).href,
    new URL(`${base}favicon.svg`, window.location.href).href,
    new URL(`${base}icons.svg`, window.location.href).href,
  ])

  performance.getEntriesByType('resource').forEach((entry) => {
    if (entry instanceof PerformanceResourceTiming) {
      const url = new URL(entry.name)
      if (url.origin === window.location.origin) urls.add(url.href)
    }
  })

  const cache = await caches.open(CACHE_NAME)
  await Promise.allSettled(Array.from(urls).map((url) => cache.add(url)))
}

export function registerServiceWorker() {
  if (!('serviceWorker' in navigator) || !import.meta.env.PROD) return

  window.addEventListener('load', () => {
    const base = import.meta.env.BASE_URL || '/'
    navigator.serviceWorker
      .register(`${base}sw.js`)
      .then(() => {
        void warmRuntimeCache(base)
        window.setTimeout(() => void warmRuntimeCache(base), 4000)
      })
      .catch(() => {
        // Offline support is a bonus layer; the app remains usable if registration is blocked.
      })
  })
}
