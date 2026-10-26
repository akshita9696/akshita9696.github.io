import { gallery as g } from '../content.js'
import { icons } from '../ui/icons.js'
import { openPlayer } from '../ui/player.js'

// The Gallery tab: sideways-scrolling rows of project cards, like a streaming site.
// Automation work first, then what's being built now, the marketing years in India,
// and the MSc projects.
// The short rows sit side by side with no scroll arrows (`fixed`); on phones they still swipe.
const rows = [
  { key: 'project', title: g.row, projects: g.projects },
  { key: 'building', title: g.building.row, projects: g.building.projects, fixed: true },
  { key: 'earlier', title: g.earlier.row, projects: g.earlier.projects, fixed: true },
  { key: 'university', title: g.university.row, projects: g.university.projects, fixed: true },
]

// Zooms the card's picture into one spot, so a huge workflow still reads boldly on a small card.
const zoom = (f) =>
  f ? ` style="object-position:${f.x}% ${f.y}%;transform-origin:${f.x}% ${f.y}%;transform:scale(${f.zoom})"` : ''

// With a picture, the cover shows it and opens it full size when clicked.
// Without one, it shows a designed cover with the project's name (and brands, if listed),
// over a background `photo` when there is one.
const cover = (p, id) => {
  const style = `--c1:${p.colors[0]};--c2:${p.colors[1]}${p.ink ? `;--ink:${p.ink}` : ''}`
  return p.image
    ? `<button class="cover has-img${p.fit === 'cover' || p.focus ? ' fill' : ''}" data-view="${id}" aria-label="${g.view}: ${p.title}" style="${style}">
         <img src="${p.image}" alt="${p.title}" loading="lazy"${zoom(p.focus)}><span class="cover-zoom">${g.view}</span>
       </button>`
    : `<div class="cover${p.photo ? ' photo' : ''}" style="${style}${p.photo ? `;--photo:url('${p.photo}')` : ''}">
         <span class="cover-kind${p.building ? ' live' : ''}">${p.kind}</span>
         <span class="cover-title">${p.title}</span>
         ${p.brands ? `<span class="cover-brands">${p.brands.join(' · ')}</span>` : ''}
       </div>`
}

// `data-find` lets search jump to a card: project-0, project-1... and earlier-0, earlier-1...
const tile = (key) => (p, i) => `
  <li class="tile" data-find="${key}-${i}">
    ${cover(p, `${key}:${i}`)}
    <h3>${p.title}</h3>
    <p class="tile-made">${p.made}</p>
    <p class="tile-for"><b>For:</b> ${p.for}</p>
    ${p.site || p.link || p.github
      ? `<p class="tile-actions">
           ${p.site || p.link ? `<a class="tile-btn" href="${p.site || p.link}" target="_blank" rel="noopener">${p.site ? g.visit : g.peek}</a>` : ''}
           ${p.github ? `<a class="tile-btn ghost" href="${p.github}" target="_blank" rel="noopener">${g.github}</a>` : ''}
         </p>`
      : ''}
  </li>`

const row = (r) => `
  <div class="row-block">
    <div class="row-head">
      <h2>${r.title}</h2>
      ${
        r.fixed
          ? ''
          : `<div class="row-arrows">
               <button class="icon-btn" data-scroll="-1" aria-label="Scroll left">${icons.chevron}</button>
               <button class="icon-btn flip" data-scroll="1" aria-label="Scroll right">${icons.chevron}</button>
             </div>`
      }
    </div>
    <ul class="row${r.fixed ? ' fixed' : ''}">${r.projects.map(tile(r.key)).join('')}</ul>
  </div>`

export function renderGallery() {
  return `
    <div class="panel" id="gallery" aria-label="Gallery">
      ${rows.map(row).join('')}
    </div>
  `
}

export function initGallery() {
  const panel = document.getElementById('gallery')

  panel.addEventListener('click', (e) => {
    const view = e.target.closest('[data-view]')
    if (view) {
      const [key, i] = view.dataset.view.split(':')
      const p = rows.find((r) => r.key === key).projects[i]
      openPlayer(p.image, p.title)
      return
    }
    const arrow = e.target.closest('[data-scroll]')
    if (arrow) {
      const list = arrow.closest('.row-block').querySelector('.row')
      list.scrollBy({ left: arrow.dataset.scroll * list.clientWidth * 0.9, behavior: 'smooth' })
    }
  })
}
