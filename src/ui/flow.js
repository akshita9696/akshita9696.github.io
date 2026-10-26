// "Watch it run": a full-screen pop-up that plays an automation on top of the real n8n pictures.
// A glowing dot runs along the real wires, each step lights up and gets a tick, the section it
// belongs to glows, and the camera follows the dot. A caption says what happened in plain English.
// Each run opens and closes on the whole picture, then the next example plays.

// Icons for the hand-offs between workflows: a person, a clock, an email or a phone call.
const BADGE_ICONS = {
  person: '<circle cx="12" cy="8" r="3.6"/><path d="M5 20c1.2-3.6 4-5.4 7-5.4s5.8 1.8 7 5.4"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  mail: '<rect x="3.5" y="5.5" width="17" height="13" rx="2"/><path d="M4 7l8 6 8-6"/>',
  phone: '<path d="M6.5 3.5h3l1.5 4-2 1.5a11 11 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 4.5 5.5a2 2 0 0 1 2-2z"/>',
}
const GAP = 220 // room between two workflow pictures for a hand-off badge
const TOP = 48 // room above the pictures for their names
const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
const CANCEL = Symbol('cancel')

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches

let el, flow, svg, stage, lastFocus
let nodes = {} // id -> { el, cx, cy, wf, subs: [edge ids] }
let edges = {} // "from>to" -> { el, wf }
let run = 0
let step = 0
let last = null // the step the dot is standing on
let playing = true
let whole = false
let token = 0
let raf = 0
const cam = { cx: 0, cy: 0, w: 1, tx: 0, ty: 0, tw: 1 }

// ---------- drawing ----------

const worldOf = (wf, x, y) => (wf ? [wf.at[0] + wf.offset[0] + x / 2, wf.at[1] + wf.offset[1] + y / 2] : [x, y])
const wfOf = (key) => flow.workflows.find((w) => w.key === key)

// The pictures sit side by side in run order, centred on one line, with room between them.
function layout() {
  const tallest = Math.max(...flow.workflows.map((w) => w.size[1]))
  let x = 0
  flow.workflows.forEach((w) => {
    w.at = [x, TOP + (tallest - w.size[1]) / 2]
    x += w.size[0] + GAP
  })
  flow.world = { w: x - GAP, h: TOP + tallest + 24 }
}

function drawWorkflow(wf) {
  const k = wf.key
  const sections = wf.sections
    .map(
      ([title, x, y, w, h], i) => `
      <g class="fsec" data-sec="${k}:${i}">
        <rect class="fsec-box" x="${x}" y="${y}" width="${w}" height="${h}" rx="16"/>
        <g class="fsec-tag" transform="translate(${x + 18} ${y + 18})"><rect class="fsec-pill" height="46" rx="23"/><text x="20" y="31">${esc(title)}</text></g>
      </g>`,
    )
    .join('')
  const wires = wf.edges.map(([a, b, d]) => `<path class="flit" data-edge="${esc(`${k}:${a}>${k}:${b}`)}" d="${d}"/>`).join('')
  const steps = wf.nodes
    .map(([name, x, y, w, h]) => {
      const sub = h < 90 // the AI helpers under an agent: model, schema, embeddings, knowledge base
      const ring =
        w < 90
          ? `<circle class="fring" cx="${x + w / 2}" cy="${y + h / 2}" r="${w / 2 + 7}"/>`
          : `<rect class="fring" x="${x - 7}" y="${y - 7}" width="${w + 14}" height="${h + 14}" rx="${sub ? 47 : 17}"/>`
      const tick = sub ? [x + w * 0.88, y + h * 0.12] : [x + w, y]
      return `
      <g class="fnode${sub ? ' sub' : ''}" data-node="${esc(`${k}:${name}`)}">
        ${ring}<rect class="fhit" x="${x}" y="${y}" width="${w}" height="${h}"/>
        <g class="fcheck" transform="translate(${tick[0]} ${tick[1]})"><circle r="15"/><path d="M-6.5 0.5l4.5 4.5 8.5-9"/></g>
      </g>`
    })
    .join('')
  const [lx, ly] = wf.at
  return `
    <image href="${wf.image}" x="${lx}" y="${ly}" width="${wf.size[0]}" height="${wf.size[1]}"/>
    <text class="fwf-name" x="${lx}" y="${ly - 16}">${esc(wf.name)}</text>
    <g transform="translate(${lx + wf.offset[0]} ${ly + wf.offset[1]}) scale(0.5)">${sections}${wires}${steps}</g>`
}

// Where a wire leaves a step (right edge, middle) and where it arrives (left edge, middle).
// "wf:2" means the right-hand edge of workflow 2's picture, for hand-offs that any step can lead to.
function port(id, side) {
  if (id.startsWith('wf:')) {
    const wf = wfOf(id.slice(3))
    return [wf.at[0] + wf.size[0], wf.at[1] + wf.size[1] / 2]
  }
  const wf = wfOf(id.slice(0, 1))
  const [, x, y, w, h] = wf.nodes.find((n) => n[0] === id.slice(2))
  return worldOf(wf, side === 'out' ? x + w : x, y + h / 2)
}

// Two lines, split at the space nearest the middle.
function twoLines(label) {
  const spaces = [...label.matchAll(/ /g)].map((m) => m.index)
  if (!spaces.length) return ['', label]
  const at = spaces.reduce((a, b) => (Math.abs(b - label.length / 2) < Math.abs(a - label.length / 2) ? b : a))
  return [label.slice(0, at), label.slice(at + 1)]
}

function drawHandoff(hand) {
  const [ax, ay] = port(hand.from, 'out')
  const [bx, by] = port(hand.to, 'in')
  const mx = (ax + bx) / 2
  const my = (ay + by) / 2
  const r = 22
  const curve = (x1, y1, x2, y2) => `M${x1} ${y1} C${(x1 + x2) / 2} ${y1} ${(x1 + x2) / 2} ${y2} ${x2} ${y2}`
  const into = curve(ax, ay, mx - r, my)
  const out = curve(mx + r, my, bx, by)
  const [l1, l2] = twoLines(hand.label)
  return `
    <path class="fhand" d="${into}"/><path class="fhand" d="${out}"/>
    <path class="flit hand" data-edge="${esc(`${hand.from}>${hand.id}`)}" d="${into}"/>
    <path class="flit hand" data-edge="${esc(`${hand.id}>${hand.to}`)}" d="${out}"/>
    <g class="fnode badge" data-node="${hand.id}" transform="translate(${mx} ${my})">
      <circle class="fring" r="${r + 6}"/><circle class="fbadge" r="${r}"/>
      <svg x="-12" y="-12" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${BADGE_ICONS[hand.icon || 'person']}</svg>
      <text class="fbadge-label" y="-48">${esc(l1)}</text><text class="fbadge-label" y="-30">${esc(l2)}</text>
      <g class="fcheck" transform="translate(${r - 4} ${-r + 4}) scale(0.6)"><circle r="15"/><path d="M-6.5 0.5l4.5 4.5 8.5-9"/></g>
    </g>`
}

function draw() {
  const { w, h } = flow.world
  stage.innerHTML = `
    <svg class="flow-svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="The real ${flow.title} workflows in n8n, playing step by step">
      ${flow.workflows.map(drawWorkflow).join('')}
      ${(flow.handoffs || []).map(drawHandoff).join('')}
      <circle class="fdot" r="7" cx="-50" cy="-50"/>
    </svg>`
  svg = stage.querySelector('svg')

  // Index steps and wires, remembering which workflow each belongs to (for picture positions).
  nodes = {}
  edges = {}
  svg.querySelectorAll('[data-edge]').forEach((p) => {
    const k = p.dataset.edge.slice(0, 1)
    edges[p.dataset.edge] = { el: p, wf: p.classList.contains('hand') ? null : wfOf(k) }
    const len = p.getTotalLength()
    p.style.strokeDasharray = `${len} ${len + 1}`
    p.style.strokeDashoffset = len
  })
  svg.querySelectorAll('[data-node]').forEach((g) => {
    const shape = g.querySelector('.fhit, .fbadge')
    const box = shape.getBBox()
    const ctm = shape.getCTM()
    const root = svg.getCTM().inverse()
    const pt = svg.createSVGPoint()
    pt.x = box.x + box.width / 2
    pt.y = box.y + box.height / 2
    const c = pt.matrixTransform(root.multiply(ctm))
    nodes[g.dataset.node] = { el: g, cx: c.x, cy: c.y, subs: [] }
  })
  // AI helpers light up with the step they plug into, including helpers of helpers
  // (embeddings feed a knowledge base, which feeds a tool, which feeds the agent).
  const feeds = (id) =>
    Object.keys(edges).filter((key) => key.endsWith(`>${id}`) && nodes[key.split('>')[0]]?.el.classList.contains('sub'))
  Object.keys(nodes).forEach((id) => {
    if (nodes[id].el.classList.contains('sub')) return
    const seen = new Set()
    const walk = (to) => feeds(to).forEach((key) => !seen.has(key) && (seen.add(key), walk(key.split('>')[0])))
    walk(id)
    nodes[id].subs = [...seen]
  })
  // Section name tags: size each pill to its text.
  svg.querySelectorAll('.fsec-tag').forEach((tag) => {
    tag.querySelector('rect').setAttribute('width', tag.querySelector('text').getComputedTextLength() + 40)
  })
}

// ---------- camera ----------

const zoomWidth = () => Math.min(Math.max(stage.clientWidth * 0.95, 380), 1150)

function aim(cx, cy, w = zoomWidth()) {
  cam.tx = cx
  cam.ty = cy
  cam.tw = w
}

function aimWhole() {
  const { w, h } = flow.world
  aim(w / 2, h / 2, Math.max(w, (h * stage.clientWidth) / stage.clientHeight) * 1.02)
}

function frame() {
  const sw = stage.clientWidth || 1
  const sh = stage.clientHeight || 1
  const k = reduced() ? 1 : 0.09
  cam.cx += (cam.tx - cam.cx) * k
  cam.cy += (cam.ty - cam.cy) * k
  cam.w += (cam.tw - cam.w) * k
  const vw = cam.w
  const vh = (cam.w * sh) / sw
  // Never drift past the edge of the pictures.
  const { w, h } = flow.world
  const cx = vw >= w ? w / 2 : Math.min(Math.max(cam.cx, vw / 2), w - vw / 2)
  const cy = vh >= h ? h / 2 : Math.min(Math.max(cam.cy, vh / 2), h - vh / 2)
  svg?.setAttribute('viewBox', `${cx - vw / 2} ${cy - vh / 2} ${vw} ${vh}`)
  raf = requestAnimationFrame(frame)
}

// ---------- playing ----------

const steps = () => flow.runs[run].steps
const sleep = (ms, t) =>
  new Promise((r) => setTimeout(r, ms)).then(() => {
    if (t !== token) throw CANCEL
  })

function reset() {
  svg.querySelectorAll('.fnode').forEach((n) => n.classList.remove('active', 'done'))
  svg.querySelectorAll('.fsec').forEach((s) => s.classList.remove('active'))
  Object.values(edges).forEach(({ el }) => {
    el.classList.remove('lit')
    el.style.strokeDashoffset = el.getTotalLength()
  })
  svg.querySelector('.fdot').classList.remove('show')
  last = null
}

const isHandoff = (id) => (flow.handoffs || []).some((h) => h.id === id)

// The wire between two steps. A hand-off badge can be reached from any step, along its own wire.
const link = (a, b) =>
  edges[`${a}>${b}`] ? `${a}>${b}` : isHandoff(b) ? Object.keys(edges).find((key) => key.endsWith(`>${b}`)) : null

function lightEdge(key) {
  const e = edges[key]
  if (!e) return
  e.el.classList.add('lit')
  e.el.style.strokeDashoffset = 0
}

function sectionOf(id) {
  const n = nodes[id]
  if (!n || isHandoff(id)) return null
  const k = id.slice(0, 1)
  let best = null
  svg.querySelectorAll(`[data-sec^="${k}:"]`).forEach((s) => {
    const b = s.getBoundingClientRect()
    const p = n.el.getBoundingClientRect()
    const x = p.left + p.width / 2
    const y = p.top + p.height / 2
    if (x >= b.left && x <= b.right && y >= b.top && y <= b.bottom && (!best || b.width * b.height < best.area)) best = { s, area: b.width * b.height }
  })
  return best?.s
}

// A step is reached: the one before it gets its tick, its AI helpers and section light up.
function arrive(id) {
  if (last && nodes[last]) nodes[last].el.classList.replace('active', 'done')
  const n = nodes[id]
  if (!n) return
  n.el.classList.remove('done')
  n.el.classList.add('active')
  n.subs.forEach((key) => {
    lightEdge(key)
    nodes[key.split('>')[0]].el.classList.add('done')
  })
  svg.querySelectorAll('.fsec.active').forEach((s) => s.classList.remove('active'))
  sectionOf(id)?.classList.add('active')
  last = id
  if (!whole) aim(n.cx, n.cy)
}

// The dot runs along the real wire while the wire fills in pink behind it; the camera follows.
function travel(key, t) {
  const e = edges[key]
  if (!e) return Promise.resolve()
  const path = e.el
  const len = path.getTotalLength()
  const ms = reduced() ? 0 : Math.min(Math.max(220 + (e.wf ? len / 2 : len) * 0.75, 280), 1300)
  const dot = svg.querySelector('.fdot')
  path.classList.add('lit')
  if (!ms) {
    path.style.strokeDashoffset = 0
    return Promise.resolve()
  }
  dot.classList.add('show')
  const start = performance.now()
  return new Promise((resolve, reject) => {
    const tick = (now) => {
      if (t !== token) {
        dot.classList.remove('show')
        return reject(CANCEL)
      }
      const p = Math.min((now - start) / ms, 1)
      const ease = p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2
      const at = path.getPointAtLength(len * ease)
      const [x, y] = worldOf(e.wf, at.x, at.y)
      dot.setAttribute('cx', x)
      dot.setAttribute('cy', y)
      path.style.strokeDashoffset = len * (1 - ease)
      if (!whole) aim(x, y)
      if (p < 1) requestAnimationFrame(tick)
      else {
        dot.classList.remove('show')
        resolve()
      }
    }
    requestAnimationFrame(tick)
  })
}

function caption(i) {
  const s = steps()[i]
  const box = el.querySelector('.flow-caption')
  box.querySelector('.flow-count').textContent = `Step ${i + 1} of ${steps().length}`
  box.querySelector('h3').textContent = s.title
  box.querySelector('.flow-text').textContent = s.text
  box.querySelector('.flow-data').textContent = s.data
  box.classList.remove('fresh')
  void box.offsetWidth
  box.classList.add('fresh')
}

async function playStep(i, t) {
  step = i
  syncControls()
  caption(i)
  const started = performance.now()
  for (const id of steps()[i].nodes) {
    if (last) await travel(link(last, id), t)
    arrive(id)
    await sleep(reduced() ? 60 : 260, t)
  }
  if (playing) await sleep(Math.max(900, 2200 + steps()[i].text.length * 24 - (performance.now() - started)), t)
}

// Steps before `from` appear finished at once; then it plays on from there.
async function play(from, intro = false) {
  const t = ++token
  reset()
  for (let j = 0; j < from; j++) {
    for (const id of steps()[j].nodes) {
      if (last) lightEdge(link(last, id))
      arrive(id)
    }
  }
  if (last) nodes[last].el.classList.replace('active', 'done')
  try {
    if (intro && !whole) {
      aimWhole()
      caption(from)
      await sleep(reduced() ? 600 : 1700, t)
    }
    for (let i = from; i < steps().length; i++) {
      await playStep(i, t)
      if (!playing) return
    }
    // End of the run: pull back to show the whole path lit, then play the next example.
    await sleep(700, t)
    if (!whole) aimWhole()
    await sleep(3000, t)
    pickRun((run + 1) % flow.runs.length)
  } catch (err) {
    if (err !== CANCEL) throw err
  }
}

function pickRun(i) {
  run = i
  el.querySelectorAll('[data-run]').forEach((b) => b.setAttribute('aria-selected', String(+b.dataset.run === i)))
  play(0, true)
}

function setPlaying(on) {
  playing = on
  if (on) play(step)
  else token++
  syncControls()
}

function goTo(i) {
  playing = false
  if (i >= steps().length) return pickRun((run + 1) % flow.runs.length)
  play(Math.max(i, 0))
}

function toggleWhole() {
  whole = !whole
  el.querySelector('[data-act="whole"]').textContent = whole ? 'Zoom back in' : 'See the whole workflow'
  if (whole) aimWhole()
  else if (last) aim(nodes[last].cx, nodes[last].cy)
}

function syncControls() {
  const btn = el.querySelector('[data-act="play"]')
  btn.textContent = playing ? 'Pause' : 'Play'
  btn.setAttribute('aria-pressed', String(!playing))
  el.querySelector('[data-act="prev"]').disabled = step === 0
}

// ---------- pop-up ----------

function close() {
  token++
  cancelAnimationFrame(raf)
  el.classList.remove('show')
  document.body.style.overflow = ''
  lastFocus?.focus()
}

function build() {
  el = document.createElement('div')
  el.className = 'flow'
  el.setAttribute('role', 'dialog')
  el.setAttribute('aria-modal', 'true')
  el.innerHTML = `
    <div class="flow-box">
      <button class="player-close" aria-label="Close">&times;</button>
      <header class="flow-head">
        <p class="flow-kicker">Watch it run</p>
        <h2></h2>
        <p class="flow-built"></p>
        <div class="flow-runs" role="tablist" aria-label="Example runs"></div>
      </header>
      <div class="flow-stage"></div>
      <div class="flow-foot">
        <div class="flow-caption" aria-live="polite">
          <p class="flow-count"></p>
          <h3></h3>
          <p class="flow-text"></p>
          <p class="flow-data"></p>
        </div>
        <div class="flow-controls">
          <button class="tile-btn ghost" data-act="prev" aria-label="Previous step">&larr;</button>
          <button class="tile-btn" data-act="play">Pause</button>
          <button class="tile-btn ghost" data-act="next" aria-label="Next step">&rarr;</button>
          <button class="tile-btn ghost" data-act="whole">See the whole workflow</button>
        </div>
      </div>
      <p class="flow-note">The real workflows from n8n. The example messages are made up.</p>
    </div>`
  stage = el.querySelector('.flow-stage')
  el.addEventListener('click', (e) => {
    if (e.target === el || e.target.closest('.player-close')) return close()
    const runBtn = e.target.closest('[data-run]')
    if (runBtn) {
      playing = true
      syncControls()
      return pickRun(+runBtn.dataset.run)
    }
    const act = e.target.closest('[data-act]')?.dataset.act
    if (act === 'play') setPlaying(!playing)
    if (act === 'whole') toggleWhole()
    if (act === 'prev') goTo(step - 1)
    if (act === 'next') goTo(step + 1)
    // Tapping a step this run passes through jumps straight to it.
    const n = e.target.closest('[data-node]')
    const at = n ? steps().findIndex((s) => s.nodes.includes(n.dataset.node)) : -1
    if (at >= 0) {
      if (whole) toggleWhole()
      goTo(at)
    }
  })
  document.addEventListener('keydown', (e) => {
    if (!el.classList.contains('show')) return
    if (e.key === 'Escape') close()
    if (e.key === 'ArrowRight') goTo(step + 1)
    if (e.key === 'ArrowLeft' && step > 0) goTo(step - 1)
    if (e.key === ' ' && !e.target.closest('button')) {
      e.preventDefault()
      setPlaying(!playing)
    }
  })
  // A rotated phone or resized window re-zooms to the step on screen.
  addEventListener('resize', () => {
    if (el.classList.contains('show') && !whole && last) aim(nodes[last].cx, nodes[last].cy)
  })
  document.body.append(el)
}

export function openFlow(data) {
  if (!el) build()
  flow = data
  lastFocus = document.activeElement
  el.setAttribute('aria-label', `${flow.title}: watch it run`)
  el.querySelector('.flow-head h2').textContent = flow.title
  el.querySelector('.flow-built').innerHTML = `${flow.built} <span>${flow.stats.join(' · ')}</span>`
  el.querySelector('.flow-runs').innerHTML = flow.runs
    .map((r, i) => `<button class="flow-run" role="tab" data-run="${i}" aria-selected="${i === 0}">${r.name}</button>`)
    .join('')
  el.classList.add('show')
  document.body.style.overflow = 'hidden'
  whole = false
  el.querySelector('[data-act="whole"]').textContent = 'See the whole workflow'
  playing = true
  if (!flow.workflows[0].at) layout()
  draw()
  // Start on the whole picture, then zoom in as the first run begins.
  aimWhole()
  Object.assign(cam, { cx: cam.tx, cy: cam.ty, w: cam.tw })
  cancelAnimationFrame(raf)
  raf = requestAnimationFrame(frame)
  pickRun(0)
  el.querySelector('.player-close').focus()
}
