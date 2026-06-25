const CACHE_NAME = 'pressmark-static-v2'

function isSameOrigin(request) {
  return new URL(request.url).origin === self.location.origin
}

function isNavigation(request) {
  return request.mode === 'navigate' || request.destination === 'document'
}

async function fromNetworkFirst(request) {
  const cache = await caches.open(CACHE_NAME)

  try {
    const response = await fetch(new Request(request, { cache: 'reload' }))
    if (response.ok) cache.put(request, response.clone())
    return response
  } catch (error) {
    const fallback =
      (await cache.match(request, { ignoreVary: true })) ||
      (await cache.match(request.url, { ignoreVary: true })) ||
      (await cache.match('./', { ignoreVary: true })) ||
      (await cache.match('/', { ignoreVary: true }))
    if (fallback) return fallback
    throw error
  }
}

async function fromCacheFirst(request) {
  const cache = await caches.open(CACHE_NAME)
  const cached =
    (await cache.match(request, { ignoreVary: true })) ||
    (await cache.match(request.url, { ignoreVary: true }))
  if (cached) return cached

  const response = await fetch(request)
  if (response.ok) cache.put(request, response.clone())
  return response
}

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting())
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const request = event.request
  if (request.method !== 'GET') return
  if (!isSameOrigin(request)) return

  const url = new URL(request.url)
  if (url.pathname.endsWith('/sw.js')) return

  event.respondWith(isNavigation(request) ? fromNetworkFirst(request) : fromCacheFirst(request))
})
