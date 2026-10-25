import { details } from '../content.js'
import { renderGallery, initGallery } from './gallery.js'
import { renderDetails } from './details.js'

// The Gallery / Details bar under the hero. Both sections show, one after the other,
// like the streaming site; the tabs jump to each and the underline follows the scroll.

const ids = ['gallery', 'details']

export function renderTabs() {
  return `
    <section class="details" id="tabs" aria-label="Gallery and details">
      <nav class="tabs" aria-label="Sections">
        ${ids.map((id, i) => `<a href="#${id}" data-tab="${id}">${details.tabs[i]}</a>`).join('')}
      </nav>
      ${renderGallery()}
      ${renderDetails()}
    </section>
  `
}

function mark(id) {
  document.querySelectorAll('[data-tab]').forEach((tab) => {
    const on = tab.dataset.tab === id
    tab.classList.toggle('on', on)
    if (on) tab.setAttribute('aria-current', 'true')
    else tab.removeAttribute('aria-current')
  })
}

export function initTabs() {
  initGallery()
  mark('gallery')

  // Details takes over once its top passes the middle of the screen.
  const detailsEl = document.getElementById('details')
  const update = () => mark(detailsEl.getBoundingClientRect().top < innerHeight / 2 ? 'details' : 'gallery')
  update()
  window.addEventListener('scroll', update, { passive: true })
  document.querySelectorAll('[data-tab]').forEach((tab) => tab.addEventListener('click', () => mark(tab.dataset.tab)))
}
