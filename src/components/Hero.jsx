import { ArrowRight, CircleCheck, Sparkles } from 'lucide-react'
import { HERO_STATS, HERO_STATUS, SITE, YEARS_EXPERIENCE } from '../data/content.js'

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-glow" aria-hidden="true" />
      <div className="container hero-grid">
        <div className="hero-copy reveal">
          <span className="pill">
            <Sparkles size={14} /> Software · DevOps · Data
          </span>
          <h1>
            Sistem yang Membawa <span className="text-gradient">Berkah</span>, Bukan Beban.
          </h1>
          <p className="hero-sub">
            {SITE.name} membantu usaha kecil hingga menengah merapikan urusan teknologi — dari aplikasi, otomasi,
            server, sampai data. Dijelaskan dengan bahasa sehari-hari, dikerjakan langsung oleh praktisi berpengalaman{' '}
            {YEARS_EXPERIENCE} tahun.
          </p>
          <div className="hero-cta">
            <a href="#kontak" className="btn btn-primary">
              Ceritakan Masalah Anda <ArrowRight size={18} />
            </a>
            <a href="#masalah" className="btn btn-ghost">
              Saya butuh apa, ya?
            </a>
          </div>
        </div>

        <div className="hero-card reveal" aria-label="Contoh kondisi sistem yang sehat">
          <div className="hero-card-top">
            <span className="dots" aria-hidden="true">
              <i /> <i /> <i />
            </span>
            <span className="mono">status-usaha-anda</span>
          </div>
          <p className="hero-card-title">Begini rasanya kalau sistem Anda sehat:</p>
          <ul className="status-list">
            {HERO_STATUS.map((s, i) => (
              <li key={s.text} style={{ animationDelay: `${0.4 + i * 0.25}s` }}>
                <CircleCheck size={20} className="ok" />
                <span>
                  <strong>{s.text}</strong>
                  <small>{s.note}</small>
                </span>
              </li>
            ))}
          </ul>
          <p className="hero-card-foot">Anda fokus jualan. Sistem bekerja diam-diam.</p>
        </div>
      </div>

      <div className="container">
        <dl className="stats reveal">
          {HERO_STATS.map((s) => (
            <div key={s.label} className="stat">
              <dt>
                {s.value}
                <span>{s.unit}</span>
              </dt>
              <dd>{s.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
