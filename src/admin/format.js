const TZ = 'Asia/Jakarta'

const numberFmt = new Intl.NumberFormat('id-ID')
const dateTimeFmt = new Intl.DateTimeFormat('id-ID', {
  timeZone: TZ,
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})
const timeFmt = new Intl.DateTimeFormat('id-ID', { timeZone: TZ, hour: '2-digit', minute: '2-digit', second: '2-digit' })

export const fmtNumber = (n) => numberFmt.format(n ?? 0)

export const fmtDateTime = (iso) => (iso ? dateTimeFmt.format(new Date(iso)) : '–')

export const fmtTime = (date) => timeFmt.format(date)

export function fmtDuration(sec) {
  if (sec == null) return '–'
  if (sec < 60) return `${sec} dtk`
  const m = Math.floor(sec / 60)
  const s = sec % 60
  if (m < 60) return s ? `${m} mnt ${s} dtk` : `${m} mnt`
  return `${Math.floor(m / 60)} jam ${m % 60} mnt`
}

// "2026-10-10" → "10 Okt" (tanggal dari API sudah dalam zona waktu lokal)
export function fmtDay(isoDate, options = {}) {
  const [y, m, d] = isoDate.split('-').map(Number)
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', timeZone: 'UTC', ...options }).format(
    new Date(Date.UTC(y, m - 1, d)),
  )
}

export const DEVICE_LABELS = { mobile: 'HP', desktop: 'Desktop', tablet: 'Tablet', bot: 'Bot', lainnya: 'Lainnya' }

export const percent = (part, total) => (total ? Math.round((part / total) * 100) : 0)
