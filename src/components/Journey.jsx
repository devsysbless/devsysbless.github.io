import { JOURNEY, NAME_MEANING } from '../data/content.js'
import { SectionHead } from './shared.jsx'

export default function Journey() {
  return (
    <section className="section section-alt" id="perjalanan">
      <div className="container">
        <SectionHead eyebrow="Perjalanan" title="Dari memasang kabel, sampai merancang sistem">
          Pengalaman yang dibangun lapis demi lapis — itulah sebabnya kami paham sistem Anda dari bawah sampai atas.
        </SectionHead>

        <div className="journey-wrap">
          <ol className="timeline">
            {JOURNEY.map(({ icon: Icon, title, desc, current }) => (
              <li key={title} className={`timeline-item reveal ${current ? 'is-current' : ''}`}>
                <span className="timeline-dot">
                  <Icon size={18} />
                </span>
                <div className="timeline-body">
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </div>
              </li>
            ))}
          </ol>

          <aside className="card name-card reveal">
            <h3>Arti nama kami</h3>
            <ul>
              {NAME_MEANING.map((n) => (
                <li key={n.word}>
                  <span className="name-word">{n.word}</span>
                  <span>
                    <strong>{n.meaning}</strong>
                    <small>{n.desc}</small>
                  </span>
                </li>
              ))}
            </ul>
            <p>
              Kami percaya teknologi yang baik seharusnya menjadi <em>berkah</em> bagi pemiliknya: menghemat waktu,
              mengurangi cemas, dan membuka peluang baru.
            </p>
          </aside>
        </div>
      </div>
    </section>
  )
}
