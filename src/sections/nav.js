import { nav } from '../content.js'
import { icons, smile } from '../ui/icons.js'

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
        <button class="icon-btn" aria-label="Search">${icons.search}</button>
        <button class="icon-btn" aria-label="Apps">${icons.apps}</button>
        <button class="icon-btn" aria-label="Watchlist">${icons.bookmark}</button>
        <button class="avatar" aria-label="Akshita's profile"></button>
      </div>
    </header>
  `
}

// The bar turns solid once the page scrolls, like the real thing.
export function initNav() {
  const bar = document.getElementById('nav')
  const update = () => bar.classList.toggle('solid', window.scrollY > 40)
  update()
  window.addEventListener('scroll', update, { passive: true })
}
