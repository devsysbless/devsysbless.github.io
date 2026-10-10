import { Eye, Flag } from 'lucide-react'
import { MISSIONS, VISION } from '../data/content.js'
import { SectionHead } from './shared.jsx'

export default function VisionMission() {
  return (
    <section className="section" id="visi-misi">
      <div className="container">
        <SectionHead eyebrow="Arah kami" title="Visi & Misi" />

        <div className="vm-grid">
          <div className="vision reveal">
            <span className="vm-label">
              <Eye size={18} /> Visi
            </span>
            <blockquote>{VISION}</blockquote>
          </div>

          <div className="card mission reveal">
            <span className="vm-label">
              <Flag size={18} /> Misi
            </span>
            <ol>
              {MISSIONS.map((m, i) => (
                <li key={m}>
                  <span className="mission-num">{String(i + 1).padStart(2, '0')}</span>
                  <p>{m}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
