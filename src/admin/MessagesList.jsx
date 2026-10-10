import { CircleAlert, CircleCheck, CircleMinus, Clock, Mail, Phone } from 'lucide-react'
import { DEVICE_LABELS, fmtDateTime } from './format.js'
import Pager from './Pager.jsx'
import usePaged from './usePaged.js'

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

export default function MessagesList({ adminKey, refreshTick }) {
  const { data, error, loading, offset, setOffset, limit } = usePaged('/api/admin/messages', adminKey, refreshTick, 10)

  return (
    <div className="card dash-card">
      <div className="dash-card-head">
        <div>
          <h3>Pesan masuk</h3>
          <p className="dash-sub">Dari formulir kontak website</p>
        </div>
      </div>

      {error && <p className="dash-error">{error}</p>}
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
