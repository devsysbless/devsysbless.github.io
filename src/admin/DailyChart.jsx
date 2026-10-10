import { useEffect, useRef, useState } from 'react'
import { BarChart3, Table2 } from 'lucide-react'
import { fmtDay, fmtNumber } from './format.js'

const HEIGHT = 240
const PAD = { top: 26, right: 8, bottom: 28, left: 40 }

// Skala sumbu Y dengan angka bulat (0, 5, 10, …)
function niceScale(max) {
  if (max <= 0) return { top: 4, step: 1 }
  const rough = max / 4
  const pow = 10 ** Math.floor(Math.log10(rough))
  const step = Math.max(1, [1, 2, 5, 10].map((m) => m * pow).find((s) => s >= rough))
  return { top: Math.ceil(max / step) * step, step }
}

// Kolom dengan ujung atas membulat 4px dan dasar persegi
function columnPath(x, y, w, h) {
  const r = Math.min(4, w / 2, h)
  return `M${x},${y + h}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h}Z`
}

export default function DailyChart({ data }) {
  const wrapRef = useRef(null)
  const [width, setWidth] = useState(640)
  const [hover, setHover] = useState(null)
  const [view, setView] = useState('chart')

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const innerW = Math.max(width - PAD.left - PAD.right, 10)
  const innerH = HEIGHT - PAD.top - PAD.bottom
  const max = Math.max(0, ...data.map((d) => d.visits))
  const { top, step } = niceScale(max)
  const band = innerW / Math.max(data.length, 1)
  const barW = Math.max(Math.min(24, band - 2), 1) // minimal 2px celah antar kolom
  const yOf = (v) => PAD.top + innerH - (v / top) * innerH
  const ticks = []
  for (let v = 0; v <= top; v += step) ticks.push(v)
  const labelEvery = Math.ceil(data.length / Math.max(Math.floor(innerW / 56), 1))
  const peak = max > 0 ? data.map((d) => d.visits).lastIndexOf(max) : -1
  const hovered = hover != null ? data[hover] : null

  return (
    <div className="card dash-card dash-chart">
      <div className="dash-card-head">
        <div>
          <h3>Kunjungan harian</h3>
          <p className="dash-sub">Jumlah halaman dibuka per hari, tanpa bot</p>
        </div>
        <div className="seg" role="tablist" aria-label="Tampilan">
          <button role="tab" aria-selected={view === 'chart'} onClick={() => setView('chart')}>
            <BarChart3 size={15} /> Grafik
          </button>
          <button role="tab" aria-selected={view === 'table'} onClick={() => setView('table')}>
            <Table2 size={15} /> Tabel
          </button>
        </div>
      </div>

      <div ref={wrapRef} className="chart-wrap" hidden={view !== 'chart'}>
        <svg width={width} height={HEIGHT} role="img" aria-label="Grafik kunjungan harian">
          {ticks.map((t) => (
            <g key={t}>
              <line className="grid" x1={PAD.left} x2={width - PAD.right} y1={yOf(t)} y2={yOf(t)} />
              <text className="axis" x={PAD.left - 8} y={yOf(t)} dy="0.32em" textAnchor="end">
                {fmtNumber(t)}
              </text>
            </g>
          ))}

          {data.map((d, i) => {
            const cx = PAD.left + band * i + band / 2
            const h = (d.visits / top) * innerH
            const showLabel = (data.length - 1 - i) % labelEvery === 0
            return (
              <g key={d.date}>
                {hover === i && <rect className="hover-band" x={cx - band / 2} y={PAD.top} width={band} height={innerH} />}
                {h > 0 && (
                  <path
                    className={`col ${hover != null && hover !== i ? 'is-dim' : ''}`}
                    d={columnPath(cx - barW / 2, yOf(d.visits), barW, h)}
                  />
                )}
                {i === peak && hover == null && (
                  <text className="peak" x={cx} y={yOf(d.visits) - 8} textAnchor="middle">
                    {fmtNumber(d.visits)}
                  </text>
                )}
                {showLabel && (
                  <text className="axis" x={cx} y={HEIGHT - 8} textAnchor="middle">
                    {fmtDay(d.date)}
                  </text>
                )}
                {/* Area hover lebih besar dari kolomnya */}
                <rect
                  x={cx - band / 2}
                  y={PAD.top}
                  width={band}
                  height={innerH}
                  fill="transparent"
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                />
              </g>
            )
          })}
        </svg>

        {hovered && (
          // Tooltip di samping kolom (kiri bila kolom di separuh kanan) supaya tidak keluar dari kartu
          <div
            className={`chart-tip ${hover >= data.length / 2 ? 'is-left' : ''}`}
            style={{
              left: PAD.left + band * hover + (hover >= data.length / 2 ? -6 : band + 6),
              top: PAD.top,
            }}
          >
            <strong>{fmtDay(hovered.date, { weekday: 'long', year: 'numeric' })}</strong>
            <span>
              <i className="swatch" /> {fmtNumber(hovered.visits)} kunjungan
            </span>
            <span className="muted">{fmtNumber(hovered.unique_visitors)} pengunjung unik</span>
          </div>
        )}
      </div>

      {view === 'table' && (
        <div className="table-scroll table-short">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th className="num">Kunjungan</th>
                <th className="num">Pengunjung unik</th>
              </tr>
            </thead>
            <tbody>
              {[...data].reverse().map((d) => (
                <tr key={d.date}>
                  <td>{fmtDay(d.date, { weekday: 'short', year: 'numeric' })}</td>
                  <td className="num">{fmtNumber(d.visits)}</td>
                  <td className="num">{fmtNumber(d.unique_visitors)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
