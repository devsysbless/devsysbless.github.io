import { ChevronLeft, ChevronRight } from 'lucide-react'
import { fmtNumber } from './format.js'

export default function Pager({ total, offset, limit, setOffset }) {
  if (total <= limit) return null
  const from = offset + 1
  const to = Math.min(offset + limit, total)
  return (
    <div className="pager">
      <span>
        {fmtNumber(from)}–{fmtNumber(to)} dari {fmtNumber(total)}
      </span>
      <button className="icon-btn" disabled={offset === 0} onClick={() => setOffset(Math.max(0, offset - limit))} aria-label="Halaman sebelumnya">
        <ChevronLeft size={18} />
      </button>
      <button className="icon-btn" disabled={to >= total} onClick={() => setOffset(offset + limit)} aria-label="Halaman berikutnya">
        <ChevronRight size={18} />
      </button>
    </div>
  )
}
