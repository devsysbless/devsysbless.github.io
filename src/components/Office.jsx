import { useEffect, useMemo, useRef, useState } from 'react'
import { CircleAlert, Send, ShieldCheck } from 'lucide-react'
import { OFFICE } from '../data/content.js'
import { askAssistant, getAssistantStatus } from '../lib/api.js'
import { redact } from '../lib/redact.js'
import PixelOffice from '../pixel/PixelOffice.jsx'

const BUBBLE_MS = 6000
const BUBBLE_CHARS = 90
const YOU = [{ id: 'pengunjung-anda', label: OFFICE.you }]
const ASSISTANT = OFFICE.agents.find((a) => a.id === 'asisten')

const short = (text) => (text.length > BUBBLE_CHARS ? `${text.slice(0, BUBBLE_CHARS)}…` : text)

export default function Office() {
  const [enabled, setEnabled] = useState(false)
  const [messages, setMessages] = useState([]) // { role, content, redacted? } — sapaan pembuka tidak ikut dikirim
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [bubbles, setBubbles] = useState({})
  const logRef = useRef(null)
  const inputRef = useRef(null)
  const timers = useRef({})

  useEffect(() => {
    getAssistantStatus().then((s) => setEnabled(Boolean(s.enabled)))
    const pending = timers.current
    return () => Object.values(pending).forEach(clearTimeout)
  }, [])

  useEffect(() => {
    const log = logRef.current
    if (log) log.scrollTop = log.scrollHeight
  }, [messages, busy])

  const say = (id, text) => {
    setBubbles((b) => ({ ...b, [id]: text }))
    clearTimeout(timers.current[id])
    timers.current[id] = setTimeout(() => {
      setBubbles(({ [id]: _gone, ...rest }) => rest)
    }, BUBBLE_MS)
  }

  const agents = useMemo(
    () =>
      OFFICE.agents.map((a) => ({
        ...a,
        status: a.id === 'asisten' && busy ? 'working' : 'idle',
        bubble: a.id === 'asisten' && busy ? OFFICE.typing : bubbles[a.id],
      })),
    [busy, bubbles],
  )

  const send = async (raw) => {
    const text = raw.trim().slice(0, 1000)
    if (!text || busy) return
    // Data pribadi disamarkan di browser, sebelum dikirim ke mana pun
    const clean = redact(text)
    const next = [...messages, { role: 'user', content: clean, redacted: clean !== text }]
    setMessages(next)
    setInput('')
    setError('')
    setBusy(true)
    try {
      const reply = await askAssistant(next.map(({ role, content }) => ({ role, content })))
      setMessages((m) => [...m, { role: 'assistant', content: reply }])
      say('asisten', short(reply))
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const introduce = (id) => {
    const agent = OFFICE.agents.find((a) => a.id === id)
    if (agent) say(id, agent.intro)
    if (id === 'asisten') inputRef.current?.focus({ preventScroll: true })
  }

  if (!enabled) return null

  return (
    <section className="section" id="kantor">
      <div className="container">
        {/* Tanpa class "reveal": section ini muncul setelah status AI dimuat */}
        <div className="section-head is-center">
          <span className="eyebrow">{OFFICE.eyebrow}</span>
          <h2>{OFFICE.title}</h2>
          <p className="lead">{OFFICE.lead}</p>
        </div>

        <div className="office-grid">
          <div className="office-stage">
            <PixelOffice agents={agents} visitors={YOU} onAgentClick={introduce} label={OFFICE.canvasLabel} />
            <p className="office-hint">{OFFICE.hint}</p>
          </div>

          <div className="card office-chat">
            <div className="office-chat-head">
              <span className={`office-avatar ${busy ? 'is-busy' : ''}`} aria-hidden="true">
                {ASSISTANT.name[0]}
              </span>
              <div>
                <strong>{ASSISTANT.name}</strong>
                <span>{busy ? OFFICE.status.typing : OFFICE.status.online}</span>
              </div>
            </div>

            <div className="office-log" ref={logRef} role="log" aria-live="polite">
              <p className="chat-msg is-bot">{OFFICE.greeting}</p>
              {messages.map((m, i) => (
                <p key={i} className={`chat-msg ${m.role === 'user' ? 'is-user' : 'is-bot'}`}>
                  {m.content}
                  {m.redacted && (
                    <small className="chat-redacted">
                      <ShieldCheck size={12} /> {OFFICE.redactedNote}
                    </small>
                  )}
                </p>
              ))}
              {busy && <p className="chat-msg is-bot is-typing">{OFFICE.typing}</p>}
            </div>

            {messages.length === 0 && (
              <div className="chat-suggest">
                {OFFICE.suggestions.map((s) => (
                  <button key={s} type="button" onClick={() => send(s)} disabled={busy}>
                    {s}
                  </button>
                ))}
              </div>
            )}

            {error && (
              <p className="form-error" role="alert">
                <CircleAlert size={16} />
                <span>
                  {error} <a href="#kontak">{OFFICE.contactCta}</a>
                </span>
              </p>
            )}

            <form
              className="chat-form"
              onSubmit={(e) => {
                e.preventDefault()
                send(input)
              }}
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                maxLength={1000}
                placeholder={OFFICE.placeholder}
                aria-label={OFFICE.inputLabel}
                autoComplete="off"
              />
              <button className="btn btn-primary chat-send" disabled={busy || !input.trim()} aria-label={OFFICE.send}>
                <Send size={18} />
              </button>
            </form>

            <p className="chat-note">
              <ShieldCheck size={14} /> {OFFICE.privacyNote}
            </p>
            <p className="chat-note">
              {OFFICE.disclaimer} <a href="#kontak">{OFFICE.contactCta}</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
