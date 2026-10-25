import { hero, details as d, gallery, search as s } from '../content.js'

// The search box behind the nav's magnifying glass. It looks through everything
// on the page (intro, experience, education, tools, projects) and jumps to the match.
// Opens with the icon, the "/" key, or Cmd/Ctrl + K.

// One entry per thing worth finding. `find` matches a data-find attribute on the page.
const entries = () => [
  { find: 'top', section: s.sections.about, title: 'About Akshita', text: hero.description },
  { find: 'experience', section: s.sections.experience, title: d.experience.title, text: d.experience.intro },
  ...d.experience.roles.map((r, i) => ({
    find: `role-${i}`,
    section: s.sections.experience,
    title: `${r.role} · ${r.org}`,
    text: `${r.when}. ${r.text}`,
  })),
  { find: 'education', section: s.sections.education, title: d.education.title, text: d.education.text },
  { find: 'tools', section: s.sections.tools, title: d.tools.title, text: d.tools.text },
  { find: 'building', section: s.sections.building, title: d.building.title, text: d.building.text },
  ...gallery.projects.map((p, i) => ({
    find: `project-${i}`,
    section: s.sections.projects,
    title: p.title,
    text: `${p.made} For: ${p.for}`,
    extra: p.kind,
  })),
]

const esc = (str) => str.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])

// Search words match from the start of a word, so "AI" finds "AI agents" but not "trained".
const rx = (w, flags = 'i') => new RegExp(`(^|[^a-z0-9])(${w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, flags)

// Wrap every search word in <mark>, after escaping the text.
const mark = (text, words) => {
  let out = esc(text)
  words.forEach((w) => {
    out = out.replace(rx(esc(w), 'gi'), '$1<mark>$2</mark>')
  })
  return out
}

// A short window of text around the first match, so long entries stay readable.
const snippet = (text, words) => {
  const at = Math.min(
    ...words.map((w) => {
      const m = rx(w).exec(text)
      return m ? m.index + m[1].length : -1
    }).filter((i) => i >= 0),
    Infinity,
  )
  if (at === Infinity || text.length <= 150) return text
  const start = Math.max(0, text.lastIndexOf(' ', Math.max(0, at - 50)))
  const end = text.indexOf(' ', Math.min(text.length, at + 110))
  return `${start > 0 ? '…' : ''}${text.slice(start, end < 0 ? undefined : end).trim()}${end > 0 ? '…' : ''}`
}

// Every word must appear somewhere; matches in the title rank first.
function find(query) {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean)
  if (!words.length) return { words, hits: [] }
  const hits = entries()
    .map((e) => {
      const all = `${e.title} ${e.text} ${e.section} ${e.extra || ''}`
      if (!words.every((w) => rx(w).test(all))) return null
      return { ...e, score: words.filter((w) => rx(w).test(e.title)).length }
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
  return { words, hits }
}

let el
let input
let list
let hits = []
let active = 0
let lastFocus

function render() {
  const query = input.value.trim()
  const result = find(query)
  hits = result.hits
  active = 0
  if (!query) {
    list.innerHTML = `
      <p class="search-note">${s.tryLabel}</p>
      <p class="search-chips">${s.tryThese.map((t) => `<button class="search-chip" data-try="${t}">${t}</button>`).join('')}</p>`
    return
  }
  if (!hits.length) {
    list.innerHTML = `<p class="search-note">${s.none} "<b>${esc(query)}</b>". ${s.noneHint}</p>`
    return
  }
  list.innerHTML = hits
    .map(
      (h, i) => `
      <button class="search-hit${i === 0 ? ' on' : ''}" role="option" data-hit="${i}" aria-selected="${i === 0}">
        <span class="search-section">${h.section}</span>
        <span class="search-title">${mark(h.title, result.words)}</span>
        <span class="search-text">${mark(snippet(h.text, result.words), result.words)}</span>
      </button>`,
    )
    .join('')
}

function move(step) {
  if (!hits.length) return
  active = (active + step + hits.length) % hits.length
  list.querySelectorAll('.search-hit').forEach((b, i) => {
    b.classList.toggle('on', i === active)
    b.setAttribute('aria-selected', i === active)
    if (i === active) b.scrollIntoView({ block: 'nearest' })
  })
}

function close() {
  el.classList.remove('show')
  document.body.style.overflow = ''
  lastFocus?.focus()
}

// Scroll to the match (sideways too, for project cards) and make it glow for a moment.
function go(hit) {
  close()
  const target = hit.find === 'top' ? document.getElementById('top') : document.querySelector(`[data-find="${hit.find}"]`)
  if (!target) return
  target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
  target.classList.remove('found')
  void target.offsetWidth
  target.classList.add('found')
  setTimeout(() => target.classList.remove('found'), 2600)
}

export function openSearch() {
  if (!el) {
    el = document.createElement('div')
    el.className = 'search'
    el.setAttribute('role', 'dialog')
    el.setAttribute('aria-modal', 'true')
    el.setAttribute('aria-label', s.label)
    el.innerHTML = `
      <div class="search-box">
        <label class="search-field">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>
          <input type="search" placeholder="${s.placeholder}" aria-label="${s.label}" autocomplete="off" spellcheck="false">
          <kbd>Esc</kbd>
        </label>
        <div class="search-results" role="listbox"></div>
      </div>`
    input = el.querySelector('input')
    list = el.querySelector('.search-results')
    input.addEventListener('input', render)
    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') (e.preventDefault(), move(1))
      if (e.key === 'ArrowUp') (e.preventDefault(), move(-1))
      if (e.key === 'Enter' && hits[active]) go(hits[active])
    })
    el.addEventListener('click', (e) => {
      if (e.target === el) return close()
      const hit = e.target.closest('[data-hit]')
      if (hit) return go(hits[hit.dataset.hit])
      const chip = e.target.closest('[data-try]')
      if (chip) {
        input.value = chip.dataset.try
        render()
        input.focus()
      }
    })
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && el.classList.contains('show')) close()
    })
    document.body.append(el)
  }
  lastFocus = document.activeElement
  el.classList.add('show')
  document.body.style.overflow = 'hidden'
  input.value = ''
  render()
  input.focus()
}

// "/" or Cmd/Ctrl + K opens search from anywhere, unless someone is typing in a box.
export function initSearchKeys() {
  document.addEventListener('keydown', (e) => {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName)
    if ((e.key === '/' && !typing) || (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey))) {
      e.preventDefault()
      openSearch()
    }
  })
}
