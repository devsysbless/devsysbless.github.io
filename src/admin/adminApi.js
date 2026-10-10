export const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '')

const KEY_NAME = 'dsb-admin-key'

export class AuthError extends Error {}

export async function adminGet(path, key) {
  let res
  try {
    res = await fetch(`${API_URL}${path}`, { headers: { 'X-Admin-Key': key } })
  } catch {
    throw new Error(`Tidak bisa terhubung ke API (${API_URL}). Pastikan backend sedang berjalan.`)
  }
  if (res.status === 401) throw new AuthError('Password salah.')
  if (res.status === 503) throw new Error('Login dashboard belum diaktifkan di server.')
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(typeof data.detail === 'string' ? data.detail : `Gagal memuat data (${res.status}).`)
  return data
}

// Kunci disimpan per tab (sessionStorage); "ingat" menyimpannya juga di localStorage
export function loadKey() {
  try {
    return sessionStorage.getItem(KEY_NAME) || localStorage.getItem(KEY_NAME) || ''
  } catch {
    return ''
  }
}

export function saveKey(key, remember) {
  try {
    sessionStorage.setItem(KEY_NAME, key)
    if (remember) localStorage.setItem(KEY_NAME, key)
  } catch {
    // storage diblokir; kunci hanya bertahan selama halaman terbuka
  }
}

export function clearKey() {
  try {
    sessionStorage.removeItem(KEY_NAME)
    localStorage.removeItem(KEY_NAME)
  } catch {
    // abaikan
  }
}
