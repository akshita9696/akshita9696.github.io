import { gallery as g } from '../content.js'
import { icons } from '../ui/icons.js'
import { openPlayer } from '../ui/player.js'

// The Gallery tab: one sideways-scrolling row of project cards, like a streaming row.

// With a picture, the cover shows it and opens it full size when clicked.
// Without one, it shows a designed cover with the project's name.
const cover = (p, i) => {
  const style = `--c1:${p.colors[0]};--c2:${p.colors[1]}${p.ink ? `;--ink:${p.ink}` : ''}`
  const label = `
    <span class="cover-kind">${p.kind}</span>
    <span class="cover-title">${p.title}</span>`
  return p.image
    ? `<button class="cover has-img" data-view="${i}" aria-label="${g.view}: ${p.title}" style="${style}">
         ${label}<img src="${p.image}" alt="${p.title}" loading="lazy">
       </button>`
    : `<div class="cover" style="${style}">${label}</div>`
}

const tile = (p, i) => `
  <li class="tile" data-find="project-${i}">
    ${cover(p, i)}
    <h3>${p.title}</h3>
    <p class="tile-made">${p.made}</p>
    <p class="tile-for"><b>For:</b> ${p.for}</p>
    ${p.site ? `<p class="tile-actions"><a class="tile-btn" href="${p.site}" target="_blank" rel="noopener">${g.visit}</a></p>` : ''}
  </li>`

export function renderGallery() {
  return `
    <div class="panel" id="gallery" aria-label="Gallery">
      <div class="row-head">
        <h2>${g.row}</h2>
        <div class="row-arrows">
          <button class="icon-btn" data-scroll="-1" aria-label="Scroll left">${icons.chevron}</button>
          <button class="icon-btn flip" data-scroll="1" aria-label="Scroll right">${icons.chevron}</button>
        </div>
      </div>
      <ul class="row">${g.projects.map(tile).join('')}</ul>
    </div>
  `
}

export function initGallery() {
  const panel = document.getElementById('gallery')
  const row = panel.querySelector('.row')

  panel.addEventListener('click', (e) => {
    const view = e.target.closest('[data-view]')
    if (view) {
      const p = g.projects[view.dataset.view]
      openPlayer(p.image, p.title)
      return
    }
    const arrow = e.target.closest('[data-scroll]')
    if (arrow) row.scrollBy({ left: arrow.dataset.scroll * row.clientWidth * 0.9, behavior: 'smooth' })
  })
}
