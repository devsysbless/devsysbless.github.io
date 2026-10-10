import { useState } from 'react'
import { DEVICE_LABELS, fmtDateTime, fmtDuration } from './format.js'
import Pager from './Pager.jsx'
import usePaged from './usePaged.js'

function place(v) {
  return [v.city, v.country].filter(Boolean).join(', ') || '–'
}

function device(v) {
  const type = DEVICE_LABELS[v.device_type] || v.device_type || '–'
  const model = [v.device_brand, v.device_model].filter(Boolean).join(' ')
  return model && model !== 'Other' ? `${type} · ${model}` : type
}

export default function VisitsTable({ adminKey, refreshTick }) {
  const [includeBots, setIncludeBots] = useState(false)
  const { data, error, loading, offset, setOffset, limit } = usePaged(
    '/api/admin/visits',
    adminKey,
    refreshTick,
    25,
    includeBots ? '&include_bots=true' : '',
  )

  return (
    <div className="card dash-card">
      <div className="dash-card-head">
        <div>
          <h3>Kunjungan terbaru</h3>
          <p className="dash-sub">Detail setiap kali website dibuka</p>
        </div>
        <label className="check">
          <input type="checkbox" checked={includeBots} onChange={(e) => setIncludeBots(e.target.checked)} />
          Tampilkan bot
        </label>
      </div>

      {error && <p className="dash-error">{error}</p>}

      <div className={`table-scroll ${loading ? 'is-loading' : ''}`}>
        <table className="dash-table">
          <thead>
            <tr>
              <th>Waktu</th>
              <th>Lokasi</th>
              <th>IP</th>
              <th>Perangkat</th>
              <th>OS</th>
              <th>Browser</th>
              <th>Asal</th>
              <th className="num">Durasi</th>
              <th className="num">Scroll</th>
            </tr>
          </thead>
          <tbody>
            {data.items.length === 0 && !loading && (
              <tr>
                <td colSpan={9} className="dash-empty">
                  Belum ada kunjungan
                </td>
              </tr>
            )}
            {data.items.map((v) => (
              <tr key={v.id} title={v.user_agent || ''}>
                <td className="nowrap">{fmtDateTime(v.created_at)}</td>
                <td>{place(v)}</td>
                <td className="mono small">{v.ip || '–'}</td>
                <td>{device(v)}</td>
                <td>{[v.os, v.os_version].filter(Boolean).join(' ') || '–'}</td>
                <td>{v.browser || '–'}</td>
                <td>{v.utm_source || v.referrer_domain || 'Langsung'}</td>
                <td className="num">{fmtDuration(v.duration_seconds)}</td>
                <td className="num">{v.max_scroll_percent != null ? `${v.max_scroll_percent}%` : '–'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pager total={data.total} offset={offset} limit={limit} setOffset={setOffset} />
    </div>
  )
}
