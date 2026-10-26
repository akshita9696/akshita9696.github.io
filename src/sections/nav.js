import { nav } from '../content.js'
import { icons, smile } from '../ui/icons.js'
import { openSearch, initSearchKeys } from '../ui/search.js'

export function renderNav() {
  const links = nav.links
    .map(
      (l) =>
        `<a href="${l.href}" class="nav-link${l.active ? ' active' : ''}"${l.active ? ' aria-current="page"' : ''}>${l.label}</a>`,
    )
    .join('')

  return `
    <header class="nav" id="nav">
      <a class="logo" href="#top" aria-label="life video, home">
        <span>life video</span>${smile(58)}
      </a>
      <nav class="nav-links" aria-label="Main">
        ${links}
        <span class="nav-sep" aria-hidden="true"></span>
        <a href="#top" class="nav-brand" aria-label="akshita">${nav.brand}${smile(54)}</a>
      </nav>
      <div class="nav-icons">
        <button class="icon-btn" data-search aria-label="Search my portfolio" title="Search (press /)">${icons.search}</button>
        <button class="icon-btn" aria-label="Apps">${icons.apps}</button>
        <button class="icon-btn watchlist" aria-label="Watchlist">${icons.bookmark}</button>
        <button class="icon-btn menu-btn" data-menu aria-label="Open menu" aria-expanded="false" aria-controls="mobile-menu">${icons.menu}</button>
        <button class="avatar" aria-label="Akshita's profile"></button>
      </div>
    </header>
    <nav class="mobile-menu" id="mobile-menu" aria-label="Menu" hidden>
      ${nav.links.map((l) => `<a href="${l.href}">${l.label}</a>`).join('')}
    </nav>
  `
}

// The bar turns solid once the page scrolls, like the real thing.
export function initNav() {
  const bar = document.getElementById('nav')
  const update = () => bar.classList.toggle('solid', window.scrollY > 40)
  update()
  window.addEventListener('scroll', update, { passive: true })

  bar.querySelector('[data-search]').addEventListener('click', openSearch)
  initSearchKeys()
  initMenu()
}

// Phones only: the ☰ button opens the menu links in a panel under the bar.
// Any link, a tap outside, or Esc closes it.
function initMenu() {
  const btn = document.querySelector('[data-menu]')
  const panel = document.getElementById('mobile-menu')
  const set = (open) => {
    // Sit exactly under the bar, whatever its height on this phone.
    if (open) panel.style.top = `${document.getElementById('nav').getBoundingClientRect().bottom}px`
    panel.hidden = !open
    btn.setAttribute('aria-expanded', open)
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu')
    btn.innerHTML = open ? icons.close : icons.menu
    document.getElementById('nav').classList.toggle('menu-open', open)
  }
  btn.addEventListener('click', () => set(panel.hidden))
  panel.addEventListener('click', (e) => e.target.closest('a') && set(false))
  // composedPath, not closest: tapping the button swaps its icon, which detaches the tapped element.
  document.addEventListener('click', (e) => {
    if (!panel.hidden && !e.composedPath().some((n) => n === btn || n === panel)) set(false)
  })
  document.addEventListener('keydown', (e) => e.key === 'Escape' && !panel.hidden && set(false))
}
