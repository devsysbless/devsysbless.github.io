import { useEffect, useState } from 'react'
import { Menu, X, Sun, Moon } from 'lucide-react'
import { NAV, SITE } from '../data/content.js'
import { Logo } from './shared.jsx'

function readTheme() {
  try {
    const saved = localStorage.getItem('dsb-theme')
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    // localStorage bisa diblokir; abaikan
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [theme, setTheme] = useState(readTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem('dsb-theme', theme)
    } catch {
      // abaikan
    }
  }, [theme])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const close = () => setOpen(false)

  return (
    <header className={`navbar ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}>
      <div className="container navbar-inner">
        <a href="#top" className="brand" onClick={close}>
          <Logo />
          <span>{SITE.name}</span>
        </a>

        <nav className="nav-links" aria-label="Navigasi utama">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} onClick={close}>
              {item.label}
            </a>
          ))}
          <a href="#kontak" className="btn btn-primary btn-sm nav-cta" onClick={close}>
            Konsultasi Gratis
          </a>
        </nav>

        <div className="nav-actions">
          <button
            className="icon-btn"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label={theme === 'dark' ? 'Ganti ke mode terang' : 'Ganti ke mode gelap'}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button className="icon-btn menu-btn" onClick={() => setOpen(!open)} aria-label="Buka menu" aria-expanded={open}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </header>
  )
}
