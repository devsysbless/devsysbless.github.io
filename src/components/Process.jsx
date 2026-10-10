import { PROCESS } from '../data/content.js'
import { SectionHead } from './shared.jsx'

export default function Process() {
  return (
    <section className="section section-alt" id="cara-kerja">
      <div className="container">
        <SectionHead eyebrow="Cara kerja" title="5 langkah, tanpa ribet">
          Anda selalu tahu sedang di tahap mana, apa yang dikerjakan, dan apa yang akan Anda terima.
        </SectionHead>

        <ol className="process">
          {PROCESS.map(({ icon: Icon, title, desc }, i) => (
            <li key={title} className="process-step reveal" style={{ transitionDelay: `${i * 80}ms` }}>
              <span className="process-num">{i + 1}</span>
              <Icon size={26} className="process-icon" />
              <h3>{title}</h3>
              <p>{desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
