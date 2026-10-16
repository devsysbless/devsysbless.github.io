import { useEffect, useRef } from 'react'
import { DESK_W, DESKS, DOOR, H, LOBBY, W, agentAt, drawDesk, drawRoom, drawVisitor, visitorLook } from './scene.js'
import './pixel-office.css'

const SPEED = 20 // pixel logis per detik
const STATUS_TEXT = { idle: 'sedang santai', working: 'sedang bekerja', failed: 'mengalami kendala' }

const rand = (min, max) => min + Math.random() * (max - min)
const pct = (value, total) => `${(value / total) * 100}%`

function lobbyPoint() {
  return { tx: rand(LOBBY.x0, LOBBY.x1 - 8), ty: rand(LOBBY.y0, LOBBY.y1 - 11) }
}

function currentTheme() {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
}

/**
 * Kantor pixel.
 * agents:   [{ id: 'resepsionis' | 'analis' | 'asisten', name, role, status, bubble? }]
 * visitors: [{ id, label? }] — muncul dari pintu, berjalan di lobi, keluar saat hilang dari daftar
 */
export default function PixelOffice({ agents, visitors = [], selectedId, onAgentClick, label }) {
  const canvasRef = useRef(null)
  const sceneRef = useRef({ agents, selectedId, visitors: new Map() })
  const labelRefs = useRef(new Map())

  useEffect(() => {
    sceneRef.current.agents = agents
    sceneRef.current.selectedId = selectedId
  }, [agents, selectedId])

  // Selaraskan daftar pengunjung: yang baru masuk lewat pintu, yang hilang berjalan keluar
  useEffect(() => {
    const map = sceneRef.current.visitors
    const ids = new Set(visitors.map((v) => v.id))
    visitors.forEach((v) => {
      const existing = map.get(v.id)
      if (existing) {
        existing.leaving = false
        existing.label = v.label
        return
      }
      map.set(v.id, {
        id: v.id,
        label: v.label,
        look: visitorLook(v.id),
        x: DOOR.x,
        y: DOOR.y,
        ...lobbyPoint(),
        wait: 0,
        phase: Math.random() * 2,
        moving: true,
        waving: false,
        leaving: false,
      })
    })
    map.forEach((v) => {
      if (!ids.has(v.id) && !v.leaving) {
        v.leaving = true
        v.tx = DOOR.x
        v.ty = DOOR.y
        v.wait = 0
      }
    })
  }, [visitors])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const room = document.createElement('canvas')
    room.width = W
    room.height = H
    const roomCtx = room.getContext('2d')
    let roomTheme = null

    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    let last = performance.now()
    let onScreen = true

    const step = (v, dt) => {
      if (reduced) {
        // Tanpa animasi gerak: langsung di tujuan
        v.x = v.leaving ? v.x : v.tx
        v.y = v.leaving ? v.y : v.ty
        v.moving = false
        return !v.leaving
      }
      if (v.wait > 0) {
        v.wait -= dt
        v.moving = false
        v.waving = v.wait > 0 && v.wait < 0.8 && v.label
        return true
      }
      const dx = v.tx - v.x
      const dy = v.ty - v.y
      const dist = Math.hypot(dx, dy)
      if (dist < 0.5) {
        if (v.leaving) return false
        Object.assign(v, lobbyPoint(), { wait: rand(1.5, 5), moving: false })
        return true
      }
      const move = Math.min(dist, SPEED * dt)
      v.x += (dx / dist) * move
      v.y += (dy / dist) * move
      v.moving = true
      v.waving = false
      return true
    }

    const frame = (now) => {
      raf = 0
      const dt = Math.min((now - last) / 1000, 0.1)
      last = now
      const t = reduced ? 0 : now / 1000
      const theme = currentTheme()
      if (theme !== roomTheme) {
        drawRoom(roomCtx, theme)
        roomTheme = theme
      }
      ctx.drawImage(room, 0, 0)

      const scene = sceneRef.current
      const byId = Object.fromEntries((scene.agents || []).map((a) => [a.id, a]))
      Object.keys(DESKS).forEach((id) => {
        drawDesk(ctx, theme, id, { status: byId[id]?.status || 'idle', selected: scene.selectedId === id }, t)
      })

      const people = [...scene.visitors.values()]
      people.forEach((v) => {
        if (!step(v, dt)) scene.visitors.delete(v.id)
      })
      people
        .filter((v) => scene.visitors.has(v.id))
        .sort((a, b) => a.y - b.y)
        .forEach((v) => {
          drawVisitor(ctx, theme, v, t)
          const tag = labelRefs.current.get(v.id)
          if (tag) {
            tag.style.left = pct(v.x + 4, W)
            tag.style.top = pct(v.y - 2, H)
          }
        })

      if (onScreen) raf = requestAnimationFrame(frame)
    }

    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting
      if (onScreen && !raf) {
        last = performance.now()
        raf = requestAnimationFrame(frame)
      }
    })
    observer.observe(canvas)
    raf = requestAnimationFrame(frame)

    return () => {
      observer.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [])

  const handleCanvasClick = (e) => {
    if (!onAgentClick) return
    const box = e.currentTarget.getBoundingClientRect()
    const id = agentAt(((e.clientX - box.left) / box.width) * W, ((e.clientY - box.top) / box.height) * H)
    if (id) onAgentClick(id)
  }

  const labeled = visitors.filter((v) => v.label)

  return (
    <div className="po">
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className={`po-canvas ${onAgentClick ? 'is-clickable' : ''}`}
        onClick={handleCanvasClick}
        role="img"
        aria-label={label}
      />

      {agents.map((a) => {
        const d = DESKS[a.id]
        if (!d) return null
        const center = d.x + DESK_W / 2
        return (
          <div key={a.id}>
            {a.bubble && (
              <div className="po-bubble" style={{ left: pct(center + 6, W), top: pct(d.y - 22, H) }} aria-hidden="true">
                {a.bubble}
              </div>
            )}
            <button
              type="button"
              className={`po-tag po-tag-${a.status} ${selectedId === a.id ? 'is-selected' : ''}`}
              style={{ left: pct(center, W), top: pct(d.y + 18, H) }}
              onClick={() => onAgentClick?.(a.id)}
              disabled={!onAgentClick}
              aria-label={`${a.name}, ${a.role}, ${STATUS_TEXT[a.status] || a.status}`}
            >
              <span className="po-dot" aria-hidden="true" />
              {a.name}
            </button>
          </div>
        )
      })}

      {labeled.map((v) => (
        <span
          key={v.id}
          className="po-visitor-tag"
          ref={(el) => (el ? labelRefs.current.set(v.id, el) : labelRefs.current.delete(v.id))}
          style={{ left: pct(DOOR.x + 4, W), top: pct(DOOR.y - 2, H) }}
          aria-hidden="true"
        >
          {v.label}
        </span>
      ))}
    </div>
  )
}
