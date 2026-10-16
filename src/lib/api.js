// Penghubung ke backend (FastAPI). Alamatnya diatur lewat VITE_API_URL.
// Jika kosong, website tetap jalan: tanpa pencatatan kunjungan, formulir memakai mailto.
const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '')

export const apiEnabled = Boolean(API_URL)

function randomId() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID()
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`
}

function storedId(storage, key) {
  try {
    let id = storage.getItem(key)
    if (!id) {
      id = randomId()
      storage.setItem(key, id)
    }
    return id
  } catch {
    return randomId() // storage diblokir (mode privat, dll.)
  }
}

// ID anonim: visitor = per browser, session = per tab
const visitorId = storedId(window.localStorage, 'dsb-visitor-id')
const sessionId = storedId(window.sessionStorage, 'dsb-session-id')

let currentVisitId = null
let trackingStarted = false

export function getVisitContext() {
  return { visitor_id: visitorId, visit_id: currentVisitId }
}

export function startTracking() {
  if (!apiEnabled || trackingStarted) return
  trackingStarted = true

  const params = new URLSearchParams(window.location.search)
  const cut = (value, max) => (value ? value.slice(0, max) : null)
  const payload = {
    visitor_id: visitorId,
    session_id: sessionId,
    path: cut(window.location.pathname + window.location.hash, 500),
    referrer: cut(document.referrer, 1000),
    language: cut(navigator.language, 35),
    timezone: cut(Intl.DateTimeFormat().resolvedOptions().timeZone, 64),
    screen_width: window.screen?.width ?? null,
    screen_height: window.screen?.height ?? null,
    viewport_width: window.innerWidth,
    viewport_height: window.innerHeight,
    utm_source: cut(params.get('utm_source'), 200),
    utm_medium: cut(params.get('utm_medium'), 200),
    utm_campaign: cut(params.get('utm_campaign'), 200),
  }

  const startedAt = Date.now()
  let maxScroll = 0
  const onScroll = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight
    const percent = scrollable > 0 ? Math.round((window.scrollY / scrollable) * 100) : 100
    maxScroll = Math.max(maxScroll, Math.min(percent, 100))
  }
  window.addEventListener('scroll', onScroll, { passive: true })

  // Kirim durasi & kedalaman scroll saat tab disembunyikan / ditutup
  const sendLeave = () => {
    if (!currentVisitId || !navigator.sendBeacon) return
    const body = JSON.stringify({
      visit_id: currentVisitId,
      visitor_id: visitorId,
      duration_seconds: Math.min(Math.round((Date.now() - startedAt) / 1000), 86400),
      max_scroll_percent: maxScroll,
    })
    // text/plain supaya tidak memicu CORS preflight (sendBeacon tidak mendukungnya)
    navigator.sendBeacon(`${API_URL}/api/track/leave`, new Blob([body], { type: 'text/plain' }))
  }
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') sendLeave()
  })
  window.addEventListener('pagehide', sendLeave)

  fetch(`${API_URL}/api/track/visit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    keepalive: true,
  })
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      if (data) currentVisitId = data.visit_id
    })
    .catch(() => {
      // Pencatatan gagal tidak boleh mengganggu pengunjung
    })
}

// Asisten AI di kantor pixel. Hanya isi percakapan (sudah disamarkan) yang dikirim — tanpa visitor_id.
export async function getAssistantStatus() {
  if (!apiEnabled) return { enabled: false }
  try {
    const res = await fetch(`${API_URL}/api/assistant/status`)
    return res.ok ? await res.json() : { enabled: false }
  } catch {
    return { enabled: false }
  }
}

export async function askAssistant(messages) {
  let res
  try {
    res = await fetch(`${API_URL}/api/assistant/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    })
  } catch {
    throw new Error('Tidak bisa terhubung. Periksa koneksi internet Anda.')
  }
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(typeof data.detail === 'string' ? data.detail : 'Asisten sedang sibuk. Coba lagi sebentar.')
  return data.reply
}

export async function sendContact(form) {
  const res = await fetch(`${API_URL}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...form, ...getVisitContext() }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const detail = typeof data.detail === 'string' ? data.detail : null
    if (res.status === 422) throw new Error(detail || 'Periksa kembali isian Anda, terutama alamat email.')
    throw new Error(detail || 'Pesan gagal terkirim. Silakan coba lagi sebentar lagi.')
  }
  return data
}
