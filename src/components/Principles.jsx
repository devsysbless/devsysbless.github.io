import { PRINCIPLES } from '../data/content.js'
import { SectionHead } from './shared.jsx'

export default function Principles() {
  return (
    <section className="section" id="prinsip">
      <div className="container">
        <SectionHead eyebrow="Yang membuat kami berbeda" title="Prinsip kerja B·L·E·S·S">
          Nama usaha ini bukan sekadar nama. Setiap hurufnya adalah janji cara kami bekerja dengan Anda.
        </SectionHead>

        <div className="principles">
          {PRINCIPLES.map(({ letter, icon: Icon, title, desc }, i) => (
            <article key={title} className="principle reveal" style={{ transitionDelay: `${i * 70}ms` }}>
              <span className="principle-letter" aria-hidden="true">
                {letter}
              </span>
              <div>
                <h3>
                  <Icon size={18} /> {title}
                </h3>
                <p>{desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
