import { useEffect, useMemo, useState } from 'react'
import { CircleAlert, CircleCheck, Coffee, Loader, ShieldCheck, Sparkles } from 'lucide-react'
import PixelOffice from '../pixel/PixelOffice.jsx'
import { AuthError, adminGet, adminPost } from './adminApi.js'
import { DEVICE_LABELS, fmtDateTime } from './format.js'

const POLL_MS = 8_000

// Status selalu tampil dengan ikon + teks, tidak hanya warna
const STATUS = {
  idle: { icon: Coffee, label: 'Santai', tone: 'neutral' },
  working: { icon: Loader, label: 'Bekerja', tone: 'good' },
  failed: { icon: CircleAlert, label: 'Ada kendala', tone: 'critical' },
}
const EVENT_STATUS = {
  working: { icon: Loader, tone: 'neutral' },
  done: { icon: CircleCheck, tone: 'good' },
  failed: { icon: CircleAlert, tone: 'critical' },
}
const AGENT_NAMES = { resepsionis: 'Rara', analis: 'Dimas', asisten: 'Sasa' }

function bubbleFor(agent) {
  if (agent.status === 'working') return agent.task
  if (agent.status === 'failed') return 'Waduh, ada kendala. Cek log aktivitas.'
  return null
}

export default function OfficePanel({ adminKey, days, refreshTick, onAuthError, onAiStatus }) {
  const [office, setOffice] = useState(null)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(null)
  const [pollTick, setPollTick] = useState(0)
  const [asking, setAsking] = useState(false)

  useEffect(() => {
    let cancelled = false
    adminGet('/api/admin/office', adminKey)
      .then((data) => {
        if (cancelled) return
        setOffice(data)
        setError('')
        onAiStatus?.(data.ai_enabled)
      })
      .catch((err) => {
        if (cancelled) return
        if (err instanceof AuthError) onAuthError()
        else setError(err.message)
      })
    return () => {
      cancelled = true
    }
  }, [adminKey, refreshTick, pollTick, onAuthError, onAiStatus])

  // Kantor dipantau lebih sering dari statistik supaya animasinya terasa hidup
  useEffect(() => {
    const id = setInterval(() => {
      if (document.visibilityState === 'visible') setPollTick((t) => t + 1)
    }, POLL_MS)
    return () => clearInterval(id)
  }, [])

  const agents = useMemo(
    () => (office?.agents || []).map((a) => ({ ...a, bubble: bubbleFor(a) })),
    [office],
  )
  const visitors = useMemo(
    () => (office?.visitors || []).map((v) => ({ id: v.id, device: v.device })),
    [office],
  )

  const askSummary = async () => {
    setAsking(true)
    try {
      await adminPost(`/api/admin/ai/summary?days=${Math.min(days, 90)}`, adminKey)
      setError('')
      setPollTick((t) => t + 1)
    } catch (err) {
      if (err instanceof AuthError) onAuthError()
      else setError(err.message)
    } finally {
      setAsking(false)
    }
  }

  const analystBusy = agents.find((a) => a.id === 'analis')?.status === 'working'

  return (
    <div className="card dash-card office-panel">
      <div className="dash-card-head">
        <div>
          <h3>Kantor AI</h3>
          <p className="dash-sub">
            {office ? `${visitors.length} pengunjung sedang online · ` : ''}karyawan AI bekerja tanpa melihat data pribadi
          </p>
        </div>
        <button
          className="btn btn-ghost btn-sm"
          onClick={askSummary}
          disabled={!office?.ai_enabled || asking || analystBusy}
          title="Dimas merangkum statistik dari angka agregat saja"
        >
          <Sparkles size={16} /> {analystBusy ? 'Dimas sedang merangkum…' : `Minta ringkasan ${Math.min(days, 90)} hari`}
        </button>
      </div>

      {error && <p className="dash-error">{error}</p>}
      {office && !office.ai_enabled && (
        <p className="office-off">
          <CircleAlert size={16} /> AI belum aktif. Isi <code>GROQ_API_KEY</code> (atau <code>GEMINI_API_KEY</code> /{' '}
          <code>OPENROUTER_API_KEY</code>) di <code>.env</code> API, lalu recreate container. Pengunjung online tetap
          tampil.
        </p>
      )}

      <div className="office-layout">
        <div>
          <PixelOffice
            agents={agents}
            visitors={visitors}
            selectedId={selected}
            onAgentClick={(id) => setSelected(selected === id ? null : id)}
            label="Kantor pixel: karyawan AI dan pengunjung website yang sedang online"
          />
          <p className="office-privacy">
            <ShieldCheck size={14} /> Yang dikirim ke AI hanya isi kebutuhan (data pribadi disamarkan) dan angka agregat.
            Nama, email, HP, nama usaha, IP, lokasi, dan perangkat tidak pernah dikirim.
          </p>
        </div>

        <div className="office-side">
          <ul className="agent-list">
            {agents.map((a) => {
              const s = STATUS[a.status] || STATUS.idle
              const Icon = s.icon
              return (
                <li key={a.id} className={selected === a.id ? 'is-selected' : ''}>
                  <button type="button" onClick={() => setSelected(selected === a.id ? null : a.id)}>
                    <span className="agent-name">
                      {a.name} <small>{a.role}</small>
                    </span>
                    <span className={`status status-${s.tone}`}>
                      <Icon size={14} className={a.status === 'working' ? 'spin' : ''} /> {s.label}
                    </span>
                  </button>
                  <p>{a.status === 'working' && a.task ? a.task : a.job}</p>
                </li>
              )
            })}
          </ul>

          {office?.summary && (
            <div className="office-summary">
              <strong>
                Ringkasan Dimas · {office.summary.days} hari
                <small>{fmtDateTime(office.summary.created_at)}</small>
              </strong>
              <p>{office.summary.text}</p>
            </div>
          )}
        </div>
      </div>

      {office?.events.length > 0 && (
        <details className="office-log-admin">
          <summary>Log aktivitas ({office.events.length} terakhir)</summary>
          <ul>
            {office.events.map((e) => {
              const s = EVENT_STATUS[e.status] || EVENT_STATUS.working
              const Icon = s.icon
              return (
                <li key={e.id}>
                  <span className={`status status-${s.tone}`}>
                    <Icon size={14} />
                  </span>
                  <span>
                    <strong>{AGENT_NAMES[e.agent] || e.agent}</strong> · {e.title}
                    {e.provider && <small> · via {e.provider}</small>}
                    {e.error && <small className="office-err"> · {e.error}</small>}
                  </span>
                  <time>{fmtDateTime(e.created_at)}</time>
                </li>
              )
            })}
          </ul>
        </details>
      )}

      {visitors.length > 0 && (
        <p className="dash-sub office-visitors">
          Online:{' '}
          {Object.entries(
            visitors.reduce((acc, v) => ({ ...acc, [v.device]: (acc[v.device] || 0) + 1 }), {}),
          )
            .map(([device, n]) => `${n} ${DEVICE_LABELS[device] || device}`)
            .join(' · ')}
        </p>
      )}
    </div>
  )
}
