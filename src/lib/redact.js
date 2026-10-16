// Samarkan data pribadi sebelum pertanyaan dikirim ke asisten AI.
// Lapis pertama di browser; server menyaring ulang dengan aturan yang sama (devsysbless-api/app/services/privacy.py).

const RULES = [
  [/(?:https?:\/\/|www\.)\S+/gi, '[TAUTAN]'],
  [/[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g, '[EMAIL]'],
  [/\b(?:\d{1,3}\.){3}\d{1,3}\b/g, '[IP]'],
  [/(^|[^\w.])@[A-Za-z0-9_.]{3,}/g, '$1[AKUN]'],
]
const NUMBER_RE = /\+?\d[\d ().-]{6,}\d/g
const MONEY_BEFORE_RE = /(?:rp\.?|idr)\s*$/i
const ADDRESS_RE = /\b(?:Jl|Jln|Jalan|Gg|Gang|Komp(?:lek)?|Perum(?:ahan)?|Blok)\.?\s+[A-Z][^,\n]{0,40}/g
const RT_RW_RE = /\bRT\.?\s*\d{1,3}(?:\s*\/\s*(?:RW\.?\s*)?\d{1,3})?/gi

export function redact(text) {
  let out = text
  RULES.forEach(([re, label]) => {
    out = out.replace(re, label)
  })
  out = out.replace(NUMBER_RE, (match, offset, whole) => {
    const digits = match.replace(/\D/g, '').length
    if (digits < 8) return match
    if (MONEY_BEFORE_RE.test(whole.slice(Math.max(0, offset - 5), offset))) return match
    return '[NOMOR]'
  })
  return out.replace(ADDRESS_RE, '[ALAMAT]').replace(RT_RW_RE, '[ALAMAT]')
}
