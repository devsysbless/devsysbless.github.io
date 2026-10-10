import { NAV, SITE } from '../data/content.js'
import { Logo } from './shared.jsx'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <a href="#top" className="brand">
            <Logo size={28} />
            <span>{SITE.name}</span>
          </a>
          <p>{SITE.tagline}</p>
        </div>

        <nav className="footer-links" aria-label="Navigasi footer">
          {NAV.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
          <a href="#kontak">Kontak</a>
        </nav>
      </div>

      <div className="container footer-bottom">
        <span>
          © {new Date().getFullYear()} {SITE.name}. Dibuat dengan sepenuh hati.
        </span>
      </div>
    </footer>
  )
}
