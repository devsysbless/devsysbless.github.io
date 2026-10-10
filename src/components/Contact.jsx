import { useState } from 'react'
import { Mail, Send, Copy, Check, CircleCheck, CircleAlert } from 'lucide-react'
import { CONTACT_NEEDS, PRIVACY_NOTE, SITE } from '../data/content.js'
import { apiEnabled, sendContact } from '../lib/api.js'
import { GithubIcon } from './shared.jsx'

const EMPTY_FORM = { name: '', email: '', phone: '', business: '', need: CONTACT_NEEDS[0], story: '', website: '' }

function mailtoLink(form) {
  const subject = `[Konsultasi] ${form.need} — ${form.name}`
  const body = [
    `Halo ${SITE.name},`,
    '',
    `Nama: ${form.name}`,
    `Telepon / WA: ${form.phone || '-'}`,
    `Usaha: ${form.business || '-'}`,
    `Kebutuhan: ${form.need}`,
    '',
    'Cerita singkat:',
    form.story,
  ].join('\n')
  return `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

export default function Contact() {
  const [form, setForm] = useState(EMPTY_FORM)
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Tanpa backend: susun email siap kirim lewat aplikasi email pengunjung
    if (!apiEnabled) {
      window.location.href = mailtoLink(form)
      return
    }
    setStatus('sending')
    setError('')
    try {
      await sendContact(form)
      setStatus('success')
    } catch (err) {
      setError(err.message)
      setStatus('error')
    }
  }

  const reset = () => {
    setForm(EMPTY_FORM)
    setStatus('idle')
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

          {status === 'success' ? (
            <div className="contact-form form-success" role="status">
              <CircleCheck size={48} />
              <h3>Pesan terkirim!</h3>
              <p>
                Terima kasih, {form.name}. Kami sudah menerima cerita Anda dan akan membalas ke <strong>{form.email}</strong>{' '}
                secepatnya.
              </p>
              <button type="button" className="btn btn-ghost" onClick={reset}>
                Kirim pesan lain
              </button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <label>
                Nama Anda
                <input required maxLength={100} value={form.name} onChange={update('name')} placeholder="mis. Budi" />
              </label>
              <div className="form-row">
                <label>
                  Email
                  <input
                    required
                    type="email"
                    maxLength={254}
                    value={form.email}
                    onChange={update('email')}
                    placeholder="nama@email.com"
                  />
                </label>
                <label>
                  Telepon / WA <span className="optional">(opsional)</span>
                  <input
                    type="tel"
                    maxLength={30}
                    value={form.phone}
                    onChange={update('phone')}
                    placeholder="08xx-xxxx-xxxx"
                  />
                </label>
              </div>
              <label>
                Nama / jenis usaha <span className="optional">(opsional)</span>
                <input
                  maxLength={150}
                  value={form.business}
                  onChange={update('business')}
                  placeholder="mis. Toko bangunan, klinik, kafe"
                />
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
                  maxLength={5000}
                  value={form.story}
                  onChange={update('story')}
                  placeholder="mis. Setiap akhir bulan admin kami butuh 3 hari untuk rekap penjualan dari 4 cabang…"
                />
              </label>

              {/* Honeypot anti-spam: tidak terlihat oleh manusia */}
              <div className="hp-field" aria-hidden="true">
                <label>
                  Website
                  <input tabIndex={-1} autoComplete="off" value={form.website} onChange={update('website')} />
                </label>
              </div>

              {status === 'error' && (
                <div className="form-error" role="alert">
                  <CircleAlert size={18} />
                  <span>
                    {error} Atau <a href={mailtoLink(form)}>kirim lewat aplikasi email</a>.
                  </span>
                </div>
              )}

              <button type="submit" className="btn btn-accent btn-block" disabled={status === 'sending'}>
                {status === 'sending' ? 'Mengirim…' : apiEnabled ? 'Kirim Pesan' : 'Kirim lewat Email'}
                <Send size={18} />
              </button>
              <p className="form-note">
                {apiEnabled
                  ? 'Pesan langsung terkirim ke kami. Anda akan menerima email konfirmasi.'
                  : 'Tombol ini akan membuka aplikasi email Anda dengan pesan yang sudah tersusun.'}
              </p>
              {apiEnabled && <p className="form-note privacy-note">{PRIVACY_NOTE}</p>}
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
