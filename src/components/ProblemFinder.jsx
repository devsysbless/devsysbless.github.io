import { useState } from 'react'
import { ArrowRight, Lightbulb, MousePointerClick } from 'lucide-react'
import { PROBLEMS, SERVICES } from '../data/content.js'
import { SectionHead } from './shared.jsx'

export default function ProblemFinder() {
  const [activeId, setActiveId] = useState(null)
  const active = PROBLEMS.find((p) => p.id === activeId)
  const service = active && SERVICES.find((s) => s.id === active.service)
  const ServiceIcon = service?.icon

  return (
    <section className="section" id="masalah">
      <div className="container">
        <SectionHead eyebrow="Pernah mengalami ini?" title="Klik masalah yang paling mirip dengan Anda">
          Tidak perlu tahu istilah teknisnya. Pilih saja, nanti kami tunjukkan solusinya.
        </SectionHead>

        <div className="finder reveal">
          <div className="finder-list" role="list">
            {PROBLEMS.map((p) => (
              <button
                key={p.id}
                role="listitem"
                className={`finder-item ${p.id === activeId ? 'is-active' : ''}`}
                onClick={() => setActiveId(p.id)}
                aria-pressed={p.id === activeId}
              >
                <span className="finder-check" aria-hidden="true" />
                {p.text}
              </button>
            ))}
          </div>

          <div className="finder-answer" aria-live="polite">
            {active ? (
              <div key={active.id} className="finder-answer-inner">
                <span className="tag">
                  <ServiceIcon size={16} /> {service.title}
                </span>
                <h3>Solusinya:</h3>
                <p>{active.answer}</p>
                <div className="first-step">
                  <Lightbulb size={18} />
                  <div>
                    <strong>Langkah pertama yang bisa Anda lakukan</strong>
                    <p>{active.firstStep}</p>
                  </div>
                </div>
                <a href="#kontak" className="btn btn-primary">
                  Bahas masalah ini <ArrowRight size={18} />
                </a>
              </div>
            ) : (
              <div className="finder-empty">
                <MousePointerClick size={36} />
                <p>Pilih salah satu masalah di samping untuk melihat solusinya.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
