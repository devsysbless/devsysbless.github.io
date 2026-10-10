import { useState } from 'react'
import { Mail, Send, Copy, Check } from 'lucide-react'
import { CONTACT_NEEDS, SITE } from '../data/content.js'
import { GithubIcon } from './shared.jsx'

export default function Contact() {
  const [form, setForm] = useState({ name: '', business: '', need: CONTACT_NEEDS[0], story: '' })
  const [copied, setCopied] = useState(false)

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  // Belum ada backend, jadi form ini menyusun email siap kirim lewat aplikasi email pengunjung.
  const handleSubmit = (e) => {
    e.preventDefault()
    const subject = `[Konsultasi] ${form.need} — ${form.name}`
    const body = [
      `Halo ${SITE.name},`,
      '',
      `Nama: ${form.name}`,
      `Usaha: ${form.business || '-'}`,
      `Kebutuhan: ${form.need}`,
      '',
      'Cerita singkat:',
      form.story,
    ].join('\n')
    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(SITE.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard tidak tersedia; alamat tetap terlihat di layar
    }
  }

  return (
    <section className="section" id="kontak">
      <div className="container">
        <div className="contact reveal">
          <div className="contact-info">
            <span className="eyebrow eyebrow-light">Konsultasi gratis</span>
            <h2>Ceritakan masalah Anda. Kami bantu terjemahkan jadi solusi.</h2>
            <p>
              Tidak perlu menyiapkan dokumen teknis. Cukup ceritakan apa yang mengganggu usaha Anda hari ini — balasan
              berisi saran awal, tanpa kewajiban apa pun.
            </p>

            <div className="contact-links">
              <div className="contact-link">
                <Mail size={20} />
                <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
                <button className="icon-btn icon-btn-light" onClick={copyEmail} aria-label="Salin alamat email">
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
              <div className="contact-link">
                <GithubIcon size={20} />
                <a href={SITE.github} target="_blank" rel="noreferrer">
                  github.com/devsysbless
                </a>
              </div>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <label>
              Nama Anda
              <input required value={form.name} onChange={update('name')} placeholder="mis. Budi" />
            </label>
            <label>
              Nama / jenis usaha <span className="optional">(opsional)</span>
              <input value={form.business} onChange={update('business')} placeholder="mis. Toko bangunan, klinik, kafe" />
            </label>
            <label>
              Yang Anda butuhkan
              <select value={form.need} onChange={update('need')}>
                {CONTACT_NEEDS.map((n) => (
                  <option key={n}>{n}</option>
                ))}
              </select>
            </label>
            <label>
              Ceritakan singkat masalahnya
              <textarea
                required
                rows={4}
                value={form.story}
                onChange={update('story')}
                placeholder="mis. Setiap akhir bulan admin kami butuh 3 hari untuk rekap penjualan dari 4 cabang…"
              />
            </label>
            <button type="submit" className="btn btn-accent btn-block">
              Kirim lewat Email <Send size={18} />
            </button>
            <p className="form-note">Tombol ini akan membuka aplikasi email Anda dengan pesan yang sudah tersusun.</p>
          </form>
        </div>
      </div>
    </section>
  )
}
