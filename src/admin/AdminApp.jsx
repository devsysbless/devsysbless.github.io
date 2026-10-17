import { useCallback, useEffect, useState } from 'react'
import { ExternalLink, Eye, EyeOff, LogIn, LogOut, Moon, RefreshCw, Sun } from 'lucide-react'
import { Logo } from '../components/shared.jsx'
import { API_URL, AuthError, adminGet, clearKey, loadKey, saveKey } from './adminApi.js'
import Breakdown from './Breakdown.jsx'
import DailyChart from './DailyChart.jsx'
import MessagesList from './MessagesList.jsx'
import OfficePanel from './OfficePanel.jsx'
import VisitsTable from './VisitsTable.jsx'
import { DEVICE_LABELS, fmtDuration, fmtNumber, fmtTime } from './format.js'

const RANGES = [7, 30, 90]
const AUTO_REFRESH_MS = 60_000

function useTheme() {
  const [theme, setTheme] = useState(document.documentElement.dataset.theme || 'light')
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem('dsb-theme', theme)
    } catch {
      // abaikan
    }
  }, [theme])
  return [theme, () => setTheme(theme === 'dark' ? 'light' : 'dark')]
}

function ThemeButton() {
  const [theme, toggle] = useTheme()
  return (
    <button className="icon-btn" onClick={toggle} aria-label="Ganti tema">
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}

function Login({ onLogin }) {
  const [key, setKey] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      await adminGet('/api/admin/stats?days=1', key.trim())
      saveKey(key.trim(), remember)
      onLogin(key.trim())
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="login-wrap">
      <form className="card login" onSubmit={submit}>
        <div className="login-brand">
          <Logo size={40} />
          <div>
            <strong>Dev Sys Bless</strong>
            <span>Dashboard Monitor</span>
          </div>
        </div>
        <label>
          Password
          <span className="pw-field">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              autoFocus
              autoComplete="current-password"
              spellCheck={false}
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Masukkan password"
            />
            <button
              type="button"
              className="pw-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
              title={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </span>
        </label>
        <label className="check">
          <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
          Ingat di perangkat ini
        </label>
        {error && <p className="dash-error">{error}</p>}
        <button className="btn btn-primary btn-block" disabled={busy}>
          <LogIn size={18} /> {busy ? 'Memeriksa…' : 'Masuk'}
        </button>
      </form>
      <div className="login-theme">
        <ThemeButton />
      </div>
    </div>
  )
}

function StatTile({ label, value, sub }) {
  return (
    <div className="card tile">
      <span className="tile-label">{label}</span>
      <span className="tile-value">{value}</span>
      {sub && <span className="tile-sub">{sub}</span>}
    </div>
  )
}

export default function AdminApp() {
  const [adminKey, setAdminKey] = useState(loadKey)
  const [days, setDays] = useState(30)
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [refreshTick, setRefreshTick] = useState(0)
  const [updatedAt, setUpdatedAt] = useState(null)
  const [aiEnabled, setAiEnabled] = useState(false)

  const logout = useCallback(() => {
    clearKey()
    setAdminKey('')
    setStats(null)
  }, [])

  useEffect(() => {
    if (!adminKey) return
    let cancelled = false
    setLoading(true)
    adminGet(`/api/admin/stats?days=${days}`, adminKey)
      .then((data) => {
        if (cancelled) return
        setStats(data)
        setError('')
        setUpdatedAt(new Date())
      })
      .catch((err) => {
        if (cancelled) return
        if (err instanceof AuthError) logout()
        else setError(err.message)
      })
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [adminKey, days, refreshTick, logout])

  // Muat ulang otomatis selama tab sedang dilihat
  useEffect(() => {
    if (!adminKey) return
    const id = setInterval(() => {
      if (document.visibilityState === 'visible') setRefreshTick((t) => t + 1)
    }, AUTO_REFRESH_MS)
    return () => clearInterval(id)
  }, [adminKey])

  if (!API_URL) {
    return (
      <div className="login-wrap">
        <div className="card login">
          <h2>Backend belum diatur</h2>
          <p className="dash-sub">
            Dashboard membutuhkan <code>VITE_API_URL</code>. Untuk lokal sudah diatur di <code>.env.development</code>;
            untuk website online, isi variable <code>VITE_API_URL</code> di GitHub lalu deploy ulang.
          </p>
          <a className="btn btn-ghost" href="/">
            Kembali ke website
          </a>
        </div>
      </div>
    )
  }

  if (!adminKey) return <Login onLogin={setAdminKey} />

  const t = stats?.total
  const sent = stats?.messages.by_email_status.sent || 0
  const failed = stats?.messages.by_email_status.failed || 0

  return (
    <div className="dash">
      <header className="dash-header">
        <div className="container dash-header-inner">
          <a href="/" className="brand" title="Lihat website">
            <Logo size={30} />
            <span>
              Dashboard <span className="brand-muted">Monitor</span>
            </span>
          </a>
          <div className="dash-actions">
            <div className="seg" role="tablist" aria-label="Rentang waktu">
              {RANGES.map((r) => (
                <button key={r} role="tab" aria-selected={days === r} onClick={() => setDays(r)}>
                  {r} hari
                </button>
              ))}
            </div>
            <button
              className={`icon-btn ${loading ? 'is-spinning' : ''}`}
              onClick={() => setRefreshTick((x) => x + 1)}
              aria-label="Muat ulang data"
              title={updatedAt ? `Diperbarui ${fmtTime(updatedAt)}` : 'Muat ulang'}
            >
              <RefreshCw size={18} />
            </button>
            <a className="icon-btn hide-sm" href="/" target="_blank" rel="noreferrer" aria-label="Buka website">
              <ExternalLink size={18} />
            </a>
            <ThemeButton />
            <button className="icon-btn" onClick={logout} aria-label="Keluar" title="Keluar">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="container dash-main">
        {error && <p className="dash-error">{error}</p>}

        <OfficePanel
          adminKey={adminKey}
          days={days}
          refreshTick={refreshTick}
          onAuthError={logout}
          onAiStatus={setAiEnabled}
        />

        {stats && (
          <>
            <section className="tiles">
              <div className="card tile tile-hero">
                <span className="tile-label">Kunjungan · {days} hari terakhir</span>
                <span className="tile-value">{fmtNumber(stats.in_range.visits)}</span>
                <span className="tile-sub">
                  Sepanjang waktu {fmtNumber(t.visits)} · {fmtNumber(t.bot_visits)} kunjungan bot tidak dihitung
                </span>
              </div>
              <StatTile
                label={`Pengunjung unik · ${days} hari`}
                value={fmtNumber(stats.in_range.unique_visitors)}
                sub={`Sepanjang waktu ${fmtNumber(t.unique_visitors)}`}
              />
              <StatTile
                label="Hari ini"
                value={fmtNumber(stats.today.visits)}
                sub={`${fmtNumber(stats.today.unique_visitors)} pengunjung unik`}
              />
              <StatTile label="Rata-rata durasi" value={fmtDuration(t.avg_duration_seconds)} sub="per kunjungan" />
              <StatTile
                label="Pesan masuk"
                value={fmtNumber(stats.messages.total)}
                sub={`${fmtNumber(sent)} email terkirim${failed ? ` · ${fmtNumber(failed)} gagal` : ''}`}
              />
            </section>

            <DailyChart data={stats.daily} />

            <section className="bd-grid">
              <Breakdown title="Negara" items={stats.top_countries} />
              <Breakdown title="Kota" items={stats.top_cities} />
              <Breakdown title="Perangkat" items={stats.devices} labels={DEVICE_LABELS} />
              <Breakdown title="Browser" items={stats.browsers} />
              <Breakdown title="Sistem operasi" items={stats.operating_systems} />
              <Breakdown title="Asal kunjungan" items={stats.referrers} labels={{ 'Tidak diketahui': 'Langsung' }} />
            </section>
          </>
        )}

        <MessagesList adminKey={adminKey} refreshTick={refreshTick} aiEnabled={aiEnabled} />
        <VisitsTable adminKey={adminKey} refreshTick={refreshTick} />

        <p className="dash-foot">
          Data dimuat ulang otomatis setiap menit{updatedAt && ` · terakhir ${fmtTime(updatedAt)} WIB`}
        </p>
      </main>
    </div>
  )
}
