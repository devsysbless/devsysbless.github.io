import { fmtNumber, percent } from './format.js'

export default function Breakdown({ title, items, labels = {} }) {
  const total = items.reduce((sum, it) => sum + it.count, 0)
  const max = Math.max(1, ...items.map((it) => it.count))

  return (
    <div className="card dash-card">
      <h3>{title}</h3>
      {items.length === 0 ? (
        <p className="dash-empty">Belum ada data</p>
      ) : (
        <ul className="bd-list">
          {items.map((it) => {
            const label = labels[it.label] || it.label
            const pct = percent(it.count, total)
            return (
              <li key={it.label} title={`${label}: ${fmtNumber(it.count)} (${pct}%)`}>
                <div className="bd-head">
                  <span className="bd-label">{label}</span>
                  <span className="bd-value">
                    {fmtNumber(it.count)} <small>{pct}%</small>
                  </span>
                </div>
                <div className="bd-bar" style={{ width: `${(it.count / max) * 100}%` }} />
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
