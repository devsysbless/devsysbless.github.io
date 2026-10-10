import { Check } from 'lucide-react'
import { SERVICES } from '../data/content.js'
import { SectionHead } from './shared.jsx'

export default function Services() {
  return (
    <section className="section section-alt" id="layanan">
      <div className="container">
        <SectionHead eyebrow="Layanan" title="Satu pintu, dari aplikasi sampai server">
          Biasanya Anda perlu programmer, admin server, dan pengelola data yang berbeda-beda. Di sini,
          semuanya ditangani oleh satu orang yang memahami gambaran utuhnya.
        </SectionHead>

        <div className="grid grid-3">
          {SERVICES.map(({ id, icon: Icon, title, plain, examples }) => (
            <article key={id} className="card service-card reveal">
              <div className="icon-box">
                <Icon size={24} />
              </div>
              <h3>{title}</h3>
              <p>{plain}</p>
              <ul className="check-list">
                {examples.map((ex) => (
                  <li key={ex}>
                    <Check size={16} /> {ex}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
