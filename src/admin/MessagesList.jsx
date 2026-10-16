import { useEffect, useState } from 'react'
import { Bot, CircleAlert, CircleCheck, CircleMinus, Clock, Copy, Mail, Phone, RotateCw } from 'lucide-react'
import { adminPost } from './adminApi.js'
import { DEVICE_LABELS, fmtDateTime } from './format.js'
import Pager from './Pager.jsx'
import usePaged from './usePaged.js'

const URGENCY = {
  tinggi: { icon: CircleAlert, label: 'Urgensi tinggi', tone: 'critical' },
  sedang: { icon: Clock, label: 'Urgensi sedang', tone: 'warning' },
  rendah: { icon: CircleCheck, label: 'Urgensi rendah', tone: 'good' },
}
// Hasil AI dicek ulang beberapa kali setelah diminta, karena dikerjakan di background
const RECHECK_MS = [3000, 8000, 15000]

// AI hanya melihat penanda [NAMA]; nama asli diisi di sini, di browser pemilik
const fillName = (text, name) => text.replaceAll('[NAMA]', name)

function AiTriage({ message, aiEnabled, onRetry }) {
  const [copied, setCopied] = useState(false)
  const ai = message.ai
  if (!ai && !aiEnabled) return null

  if (!ai || ai.status === 'working') {
    return (
      <div className="ai-box">
        <span className="ai-head">
          <Bot size={15} /> {ai ? 'Rara sedang membaca pesan ini…' : 'Belum dibaca Rara'}
        </span>
        {!ai && (
          <button className="ai-link" onClick={onRetry}>
            <RotateCw size={13} /> Minta Rara membaca
          </button>
        )}
      </div>
    )
  }

  if (ai.status === 'failed') {
    return (
      <div className="ai-box">
        <span className="ai-head">
          <Bot size={15} /> Rara gagal membaca: {ai.error || 'tidak diketahui'}
        </span>
        {aiEnabled && (
          <button className="ai-link" onClick={onRetry}>
            <RotateCw size={13} /> Coba lagi
          </button>
        )}
      </div>
    )
  }

  const r = ai.result
  const u = URGENCY[r.urgensi] || URGENCY.sedang
  const UrgencyIcon = u.icon
  const draft = fillName(r.draft_balasan, message.name)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(draft)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard diblokir browser; teks tetap bisa diseleksi manual
    }
  }

  return (
    <div className="ai-box">
      <div className="ai-head">
        <Bot size={15} /> Catatan Rara
        <span className={`status status-${u.tone}`}>
          <UrgencyIcon size={14} /> {u.label}
        </span>
        <span className="tag-need">{r.kategori}</span>
        {ai.provider && <small>via {ai.provider}</small>}
      </div>
      {r.ringkasan && <p>{r.ringkasan}</p>}
      {r.langkah_berikut && (
        <p>
          <strong>Langkah berikut:</strong> {r.langkah_berikut}
        </p>
      )}
      {draft && (
        <details>
          <summary>Draft balasan</summary>
          <p className="ai-draft">{draft}</p>
          <div className="ai-actions">
            <button className="ai-link" onClick={copy}>
              <Copy size={13} /> {copied ? 'Tersalin' : 'Salin'}
            </button>
            <a
              className="ai-link"
              href={`mailto:${message.email}?subject=${encodeURIComponent(`Re: ${message.need}`)}&body=${encodeURIComponent(draft)}`}
            >
              <Mail size={13} /> Buka di email
            </a>
            {aiEnabled && (
              <button className="ai-link" onClick={onRetry}>
                <RotateCw size={13} /> Baca ulang
              </button>
            )}
          </div>
        </details>
      )}
    </div>
  )
}

// Status selalu tampil dengan ikon + teks, tidak hanya warna
const STATUS = {
  sent: { icon: CircleCheck, label: 'Email terkirim', tone: 'good' },
  failed: { icon: CircleAlert, label: 'Email gagal', tone: 'critical' },
  skipped: { icon: CircleMinus, label: 'SMTP belum diatur', tone: 'warning' },
  pending: { icon: Clock, label: 'Sedang diproses', tone: 'neutral' },
}

function StatusBadge({ status, error }) {
  const s = STATUS[status] || STATUS.pending
  const Icon = s.icon
  return (
    <span className={`status status-${s.tone}`} title={error || ''}>
      <Icon size={14} /> {s.label}
    </span>
  )
}

export default function MessagesList({ adminKey, refreshTick, aiEnabled }) {
  const [localTick, setLocalTick] = useState(0)
  const [retryError, setRetryError] = useState('')
  const [timers, setTimers] = useState([])
  const { data, error, loading, offset, setOffset, limit } = usePaged(
    '/api/admin/messages',
    adminKey,
    refreshTick + localTick,
    10,
  )

  useEffect(() => () => timers.forEach(clearTimeout), [timers])

  const retry = async (id) => {
    try {
      await adminPost(`/api/admin/ai/triage/${id}`, adminKey)
      setRetryError('')
      setLocalTick((t) => t + 1)
      setTimers(RECHECK_MS.map((ms) => setTimeout(() => setLocalTick((t) => t + 1), ms)))
    } catch (err) {
      setRetryError(err.message)
    }
  }

  return (
    <div className="card dash-card">
      <div className="dash-card-head">
        <div>
          <h3>Pesan masuk</h3>
          <p className="dash-sub">Dari formulir kontak website</p>
        </div>
      </div>

      {error && <p className="dash-error">{error}</p>}
      {retryError && <p className="dash-error">{retryError}</p>}
      {data.items.length === 0 && !loading && <p className="dash-empty">Belum ada pesan</p>}

      <ul className={`msg-list ${loading ? 'is-loading' : ''}`}>
        {data.items.map((m) => (
          <li key={m.id} className="msg">
            <div className="msg-top">
              <div>
                <strong className="msg-name">{m.name}</strong>
                {m.business && <span className="msg-business"> · {m.business}</span>}
              </div>
              <span className="msg-time">{fmtDateTime(m.created_at)}</span>
            </div>
            <div className="msg-meta">
              <span className="tag-need">{m.need}</span>
              <a href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.need}`)}`}>
                <Mail size={14} /> {m.email}
              </a>
              {m.phone && (
                <a href={`tel:${m.phone.replace(/[^\d+]/g, '')}`}>
                  <Phone size={14} /> {m.phone}
                </a>
              )}
              <StatusBadge status={m.email_status} error={m.email_error} />
            </div>
            <p className="msg-story">{m.story}</p>
            <AiTriage message={m} aiEnabled={aiEnabled} onRetry={() => retry(m.id)} />
            <p className="msg-foot">
              {[m.city, m.country].filter(Boolean).join(', ') || 'Lokasi tidak diketahui'} ·{' '}
              {[DEVICE_LABELS[m.device_type] || m.device_type, m.os, m.browser].filter(Boolean).join(' / ') || '–'} · IP{' '}
              {m.ip || '–'}
              {m.email_status === 'failed' && m.email_error && <> · {m.email_error}</>}
            </p>
          </li>
        ))}
      </ul>
      <Pager total={data.total} offset={offset} limit={limit} setOffset={setOffset} />
    </div>
  )
}
