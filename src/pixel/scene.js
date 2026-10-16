// Gambar kantor pixel: ruangan, meja, dan karakter — semuanya digambar dengan kode (tanpa file gambar).
// Ukuran logis 256×144; canvas diperbesar lewat CSS dengan `image-rendering: pixelated`.

export const W = 256
export const H = 144

// Posisi pojok kiri-atas permukaan meja tiap karyawan AI
export const DESKS = {
  resepsionis: { x: 44, y: 72 },
  analis: { x: 112, y: 72 },
  asisten: { x: 180, y: 72 },
}
export const DESK_W = 32

// Pengunjung muncul di depan pintu lalu berjalan di area lobi
export const DOOR = { x: 16, y: 50 }
export const LOBBY = { x0: 10, x1: 238, y0: 100, y1: 128 }

const THEMES = {
  light: {
    wall: '#ebe6da',
    wallLine: '#e0d9ca',
    baseboard: '#a88f6c',
    floorA: '#dcc9aa',
    floorB: '#d3be9c',
    rug: '#9fd5cc',
    rugEdge: '#0f766e',
    skyA: '#9fd8f5',
    skyB: '#c9edfb',
    cloud: '#ffffff',
    frame: '#8b6b4a',
    door: '#a0704a',
    doorDark: '#7a5236',
    knob: '#fbbf24',
    deskTop: '#c08b5c',
    desk: '#a0704a',
    deskEdge: '#7a5236',
    monitor: '#2d3748',
    screenOff: '#1a202c',
    screenOn: '#0d9488',
    code: '#ccfbf1',
    chair: '#475569',
    shelf: '#8b6b4a',
    plant: '#16a34a',
    plantDark: '#15803d',
    pot: '#b45309',
    clock: '#ffffff',
    hand: '#13202f',
    shadow: 'rgba(19, 32, 47, 0.18)',
    selected: '#f59e0b',
  },
  dark: {
    wall: '#1c2738',
    wallLine: '#223047',
    baseboard: '#0f1828',
    floorA: '#2a3446',
    floorB: '#253041',
    rug: '#134e4a',
    rugEdge: '#2dd4bf',
    skyA: '#0b1736',
    skyB: '#13224a',
    cloud: '#fde68a',
    frame: '#3f4b5f',
    door: '#5b4636',
    doorDark: '#3f3127',
    knob: '#fbbf24',
    deskTop: '#7a5a3f',
    desk: '#5f4532',
    deskEdge: '#3f2e21',
    monitor: '#111827',
    screenOff: '#0b1220',
    screenOn: '#14b8a6',
    code: '#ccfbf1',
    chair: '#334155',
    shelf: '#4a3a2c',
    plant: '#22c55e',
    plantDark: '#15803d',
    pot: '#92400e',
    clock: '#cbd5e1',
    hand: '#0b1220',
    shadow: 'rgba(0, 0, 0, 0.35)',
    selected: '#fbbf24',
  },
}

export const themeColors = (theme) => THEMES[theme] || THEMES.light

// ---------- Karakter 8×11: huruf = warna dari palet, '.' = transparan ----------
const HEADS = {
  short: ['..HHHH..', '.HHHHHH.', '.HSSSSH.', '.SKSSKS.', '..SSSS..'],
  long: ['..HHHH..', '.HHHHHH.', 'HHSSSSHH', 'HSKSSKSH', 'HHSSSSHH'],
  glasses: ['..HHHH..', '.HHHHHH.', '.HSSSSH.', '.GKGGKG.', '..SSSS..'],
  bun: ['...HH...', '.HHHHHH.', '.HSSSSH.', '.SKSSKS.', '..SSSS..'],
  cap: ['.CCCCC..', 'CCCCCCCC', '.HSSSSH.', '.SKSSKS.', '..SSSS..'],
}
const TORSOS = {
  idle: ['.CCCCCC.', 'CCCCCCCC', 'SCCCCCCS'],
  typeA: ['.CCCCCC.', 'SCCCCCCS', '.CCCCCC.'],
  typeB: ['.CCCCCC.', 'CCCCCCCC', '.SCCCCS.'],
  wave: ['SCCCCCC.', 'SCCCCCCC', '.CCCCCCS'],
}
const LEGS = {
  stand: ['.PPPPPP.', '.PP..PP.', '.BB..BB.'],
  stride: ['.PPPPPP.', 'PP....PP', 'BB....BB'],
}

export const AGENT_LOOKS = {
  resepsionis: { head: 'long', palette: { H: '#5b3a29', S: '#f2c9a0', K: '#1f2937', C: '#0f766e', P: '#334155', B: '#1f2937' } },
  analis: {
    head: 'glasses',
    palette: { H: '#1f2937', S: '#c68a5a', K: '#111827', G: '#e5e7eb', C: '#d97706', P: '#1e3a5f', B: '#111827' },
  },
  asisten: { head: 'bun', palette: { H: '#3b2f2f', S: '#e0ac7e', K: '#1f2937', C: '#4f46e5', P: '#374151', B: '#111827' } },
}

const SKINS = ['#f2c9a0', '#e0ac7e', '#c68a5a', '#8d5a3b']
const HAIRS = ['#1f2937', '#5b3a29', '#7c4a1e', '#3b2f2f', '#9ca3af']
const SHIRTS = ['#dc2626', '#2563eb', '#16a34a', '#db2777', '#0891b2', '#ca8a04', '#7c3aed']
const PANTS = ['#334155', '#1e3a5f', '#44403c', '#3f3f46']
const VISITOR_HEADS = ['short', 'long', 'cap', 'short', 'bun']

function hash(text) {
  let h = 2166136261
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619)
  return h >>> 0
}

// Tampilan pengunjung ditentukan dari id-nya, jadi orang yang sama selalu berpenampilan sama
export function visitorLook(id) {
  const h = hash(String(id))
  const pick = (list, shift) => list[(h >>> shift) % list.length]
  return {
    head: pick(VISITOR_HEADS, 0),
    palette: { H: pick(HAIRS, 3), S: pick(SKINS, 7), K: '#1f2937', C: pick(SHIRTS, 11), P: pick(PANTS, 15), B: '#1f2937' },
  }
}

export function drawSprite(ctx, look, torso, legs, x, y) {
  const rows = [...HEADS[look.head], ...TORSOS[torso], ...LEGS[legs]]
  rows.forEach((row, ry) => {
    for (let rx = 0; rx < row.length; rx++) {
      const color = look.palette[row[rx]]
      if (!color) continue
      ctx.fillStyle = color
      ctx.fillRect(Math.round(x) + rx, Math.round(y) + ry, 1, 1)
    }
  })
}

// ---------- Ruangan (digambar sekali per tema, lalu disalin tiap frame) ----------
export function drawRoom(ctx, theme) {
  const c = themeColors(theme)
  const rect = (color, x, y, w, h) => {
    ctx.fillStyle = color
    ctx.fillRect(x, y, w, h)
  }

  // Dinding & lantai
  rect(c.wall, 0, 0, W, 48)
  for (let x = 6; x < W; x += 12) rect(c.wallLine, x, 0, 1, 46)
  rect(c.baseboard, 0, 46, W, 2)
  for (let y = 48; y < H; y += 8) {
    for (let x = 0; x < W; x += 8) rect((x + y) % 16 === 0 ? c.floorA : c.floorB, x, y, 8, 8)
  }

  // Karpet lobi
  rect(c.rugEdge, 58, 104, 140, 24)
  rect(c.rug, 60, 106, 136, 20)

  // Pintu
  rect(c.doorDark, 6, 14, 22, 34)
  rect(c.door, 8, 16, 18, 32)
  rect(c.doorDark, 10, 18, 14, 10)
  rect(c.doorDark, 10, 32, 14, 12)
  rect(c.knob, 22, 30, 2, 2)

  // Jam dinding
  rect(c.frame, 44, 10, 12, 12)
  rect(c.clock, 45, 11, 10, 10)
  rect(c.hand, 49, 13, 1, 4)
  rect(c.hand, 50, 16, 3, 1)

  // Logo Dev Sys Bless
  rect('#0f766e', 116, 8, 24, 24)
  rect('#14b8a6', 116, 8, 24, 2)
  const white = '#ffffff'
  ;[
    [121, 19],
    [122, 18],
    [123, 17],
    [122, 20],
    [123, 21],
    [135, 19],
    [134, 18],
    [133, 17],
    [134, 20],
    [133, 21],
  ].forEach(([x, y]) => rect(white, x, y, 1, 1))
  rect('#fbbf24', 127, 17, 2, 5)
  rect('#fbbf24', 126, 18, 4, 3)

  // Jendela
  rect(c.frame, 156, 6, 44, 30)
  rect(c.skyA, 158, 8, 40, 13)
  rect(c.skyB, 158, 21, 40, 13)
  rect(c.frame, 177, 8, 2, 26)
  if (theme === 'dark') {
    ;[
      [162, 11],
      [170, 15],
      [185, 10],
      [193, 17],
      [188, 26],
    ].forEach(([x, y]) => rect('#e2e8f0', x, y, 1, 1))
    rect(c.cloud, 164, 24, 4, 4)
  } else {
    rect(c.cloud, 161, 12, 10, 3)
    rect(c.cloud, 163, 10, 5, 2)
    rect(c.cloud, 184, 24, 9, 3)
    rect('#fde68a', 190, 10, 5, 5)
  }

  // Rak buku
  rect(c.shelf, 210, 12, 26, 36)
  rect(c.deskEdge, 212, 24, 22, 2)
  rect(c.deskEdge, 212, 36, 22, 2)
  const books = ['#0f766e', '#f59e0b', '#dc2626', '#2563eb', '#16a34a', '#7c3aed']
  for (let i = 0; i < 6; i++) {
    rect(books[i], 213 + i * 3, 15 + (i % 2), 2, 9 - (i % 2))
    rect(books[(i + 3) % 6], 213 + i * 3, 27 + ((i + 1) % 2), 2, 9 - ((i + 1) % 2))
  }

  // Tanaman
  rect(c.pot, 241, 40, 10, 8)
  rect(c.plantDark, 243, 30, 6, 10)
  rect(c.plant, 240, 26, 5, 8)
  rect(c.plant, 247, 24, 5, 9)
  rect(c.plant, 244, 21, 4, 8)
}

// ---------- Meja + karakter karyawan AI ----------
export function drawDesk(ctx, theme, id, { status, selected }, t) {
  const c = themeColors(theme)
  const d = DESKS[id]
  const look = AGENT_LOOKS[id]
  const working = status === 'working'
  const cx = d.x + 18
  const cy = d.y - 8
  const rect = (color, x, y, w, h) => {
    ctx.fillStyle = color
    ctx.fillRect(x, y, w, h)
  }

  // Bayangan & sandaran kursi
  rect(c.shadow, d.x - 2, d.y + 16, DESK_W + 4, 3)
  rect(c.chair, cx - 1, cy + 4, 10, 7)

  // Karakter: mengetik saat bekerja, bernapas pelan saat santai
  const typing = working && Math.floor(t * 6) % 2 === 0
  const bob = !working && Math.floor(t * 1.5) % 2 === 0 ? 1 : 0
  drawSprite(ctx, look, working ? (typing ? 'typeA' : 'typeB') : 'idle', 'stand', cx, cy + bob)

  // Meja
  rect(c.deskTop, d.x, d.y, DESK_W, 4)
  rect(c.desk, d.x, d.y + 4, DESK_W, 12)
  rect(c.deskEdge, d.x, d.y + 4, DESK_W, 1)
  rect(c.deskEdge, d.x + 2, d.y + 8, 10, 1)
  if (selected) {
    ctx.strokeStyle = c.selected
    ctx.lineWidth = 1
    ctx.strokeRect(d.x - 1.5, d.y - 0.5, DESK_W + 3, 17)
  }

  // Monitor: layar menyala dengan "kode" bergerak saat bekerja
  rect(c.monitor, d.x + 2, d.y - 11, 13, 10)
  rect(c.monitor, d.x + 7, d.y - 1, 3, 1)
  rect(working ? c.screenOn : c.screenOff, d.x + 3, d.y - 10, 11, 7)
  if (working) {
    const seed = Math.floor(t * 4)
    for (let i = 0; i < 3; i++) {
      const len = 3 + ((seed + i * 7) % 6)
      rect(c.code, d.x + 4, d.y - 9 + i * 2, len, 1)
    }
  } else {
    rect(c.monitor, d.x + 4, d.y - 9, 2, 1)
  }

  // Keyboard & cangkir
  rect(c.monitor, cx, d.y + 1, 8, 2)
  rect('#f8fafc', d.x + 27, d.y - 3, 3, 3)

  // Penanda status di atas kepala
  if (working) {
    const n = Math.floor(t * 3) % 4
    for (let i = 0; i < n; i++) rect(c.selected, cx + 1 + i * 2, cy - 4, 1, 1)
  } else if (status === 'failed') {
    rect('#dc2626', cx + 3, cy - 8, 2, 4)
    rect('#dc2626', cx + 3, cy - 3, 2, 1)
  }
}

export function agentAt(x, y) {
  return Object.keys(DESKS).find((id) => {
    const d = DESKS[id]
    return x >= d.x - 2 && x <= d.x + DESK_W + 2 && y >= d.y - 20 && y <= d.y + 17
  })
}

// ---------- Pengunjung ----------
export function drawVisitor(ctx, theme, v, t) {
  const c = themeColors(theme)
  const stride = v.moving && Math.floor(t * 8 + v.phase) % 2 === 0
  ctx.fillStyle = c.shadow
  ctx.fillRect(Math.round(v.x), Math.round(v.y) + 10, 8, 2)
  drawSprite(ctx, v.look, v.waving ? 'wave' : 'idle', stride ? 'stride' : 'stand', v.x, v.y - (stride ? 1 : 0))
}
