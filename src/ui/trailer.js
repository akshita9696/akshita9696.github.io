import { trailer, highlights, reel, hero } from '../content.js'
import { smile } from './icons.js'
import { openContact, openCV } from './share.js'

// The film-reel button. Two looks share this code, picked by `reel` in content.js:
// - 'trailer': a full-screen movie trailer with letterbox bars.
// - 'highlights': Instagram-style story cards, one colour and one big number each.
// Both have story-style progress bars. Tap the right side to skip ahead, the left side to go back.

const configs = { trailer, highlights }
const t = configs[reel] || trailer
let el
let index = 0
let timer
let lastFocus

const stat = (s) =>
  `<p class="tr-stat"><span>${s.prefix || ''}</span><b data-count="${s.value}">0</b><span>${s.suffix || ''}</span></p>`

const scene = (s) => {
  if (s.type === 'brands')
    return `
      <p class="tr-line">${s.text}</p>
      <p class="tr-brands">${s.brands.map((b, i) => `<span style="--i:${i}">${b}</span>`).join('')}</p>`
  if (s.type === 'stat') return `${stat(s)}<p class="tr-label">${s.label}</p>`
  if (s.type === 'card') return `${stat(s)}<p class="tr-label">${s.label}</p><p class="tr-note">${s.note}</p>`
  if (s.type === 'intro')
    return `
      <span class="tr-avatar tr-avatar-big" aria-hidden="true"></span>
      <p class="tr-line">${s.title}</p>
      <p class="tr-note">${s.text}</p>`
  if (s.type === 'review')
    return `
      <p class="tr-stars" aria-label="Five stars">★★★★★</p>
      <p class="tr-quote">“${s.quote}”</p>
      <p class="tr-by">${s.by}</p>`
  if (s.type === 'final')
    return `
      <p class="tr-badge">${hero.badge}${smile(46)}</p>
      <h2 class="tr-title"><span class="title-top">${hero.titleTop}</span><span class="title-bottom">${hero.titleBottom}</span></h2>
      <p class="tr-tagline">${s.tagline}</p>
      <p class="tr-actions">
        <button class="modal-btn" data-go="contact">${t.buttons.contact}</button>
        <button class="modal-btn ghost" data-go="cv">${t.buttons.cv}</button>
        <button class="modal-btn ghost" data-go="again">${t.buttons.again}</button>
      </p>`
  return `<p class="tr-line${s.accent ? ' accent' : ''}">${s.text}</p>${s.sub ? `<p class="tr-sub">${s.sub}</p>` : ''}`
}

// Numbers count up from zero, easing out, so each one lands with a little punch.
function countUp(box) {
  const b = box.querySelector('[data-count]')
  if (!b) return
  const end = Number(b.dataset.count)
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return (b.textContent = end)
  const start = performance.now()
  const step = (now) => {
    const p = Math.min(1, (now - start) / 1100)
    b.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)))
    if (p < 1 && el.classList.contains('show')) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

function show(i) {
  clearTimeout(timer)
  index = Math.max(0, Math.min(i, t.scenes.length - 1))
  const s = t.scenes[index]
  const box = el.querySelector('.tr-scene')
  box.className = `tr-scene tr-${s.type}`
  box.innerHTML = scene(s)
  // Story cards change colour with each scene; the final card goes back to dark.
  el.querySelector('.tr-frame').style.setProperty('--card', s.color || '#11161d')
  el.querySelectorAll('.tr-bars i').forEach((bar, n) => {
    bar.className = n < index ? 'done' : n === index ? 'now' : ''
    bar.style.setProperty('--d', `${s.seconds || 0}s`)
  })
  el.querySelector('.tr-skip').hidden = s.type === 'final'
  if (s.type === 'stat' || s.type === 'card') countUp(box)
  if (s.type === 'final') box.querySelector('[data-go]').focus()
  else timer = setTimeout(() => show(index + 1), s.seconds * 1000)
}

function close() {
  clearTimeout(timer)
  el.classList.remove('show')
  document.body.style.overflow = ''
  lastFocus?.focus()
}

function build() {
  el = document.createElement('div')
  el.className = `trailer mode-${reel}`
  el.setAttribute('role', 'dialog')
  el.setAttribute('aria-modal', 'true')
  el.setAttribute('aria-label', t.label)
  el.innerHTML = `
    <div class="tr-frame">
      <div class="tr-bars">${t.scenes.map(() => '<i></i>').join('')}</div>
      ${t.name ? `<p class="tr-head"><span class="tr-avatar" aria-hidden="true"></span><b>${t.name}</b><span>life video</span></p>` : ''}
      <button class="tr-close" aria-label="Close">&times;</button>
      <div class="tr-scene" aria-live="polite"></div>
      <button class="tr-skip">${t.skip}</button>
    </div>`
  el.addEventListener('click', (e) => {
    if (e.target.closest('.tr-close') || e.target === el) return close()
    if (e.target.closest('.tr-skip')) return show(t.scenes.length - 1)
    const go = e.target.closest('[data-go]')
    if (go) {
      if (go.dataset.go === 'again') return show(0)
      close()
      return go.dataset.go === 'contact' ? openContact() : openCV()
    }
    // Anywhere else in the frame: right two thirds go forward, left third goes back.
    if (t.scenes[index].type === 'final') return
    const frame = el.querySelector('.tr-frame').getBoundingClientRect()
    show(e.clientX > frame.left + frame.width / 3 ? index + 1 : index - 1)
  })
  document.addEventListener('keydown', (e) => {
    if (!el.classList.contains('show')) return
    if (e.key === 'Escape') close()
    if (e.key === 'ArrowRight') show(index + 1)
    if (e.key === 'ArrowLeft') show(index - 1)
  })
  document.body.append(el)
}

export function openTrailer() {
  if (!el) build()
  lastFocus = document.activeElement
  el.classList.add('show')
  document.body.style.overflow = 'hidden'
  el.querySelector('.tr-close').focus()
  show(0)
}
