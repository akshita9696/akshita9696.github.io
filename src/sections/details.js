import { details as d, hero } from '../content.js'

// The Details tab: two wide boxes on the left, three on the right, like the streaming-site layout.

const badges = (list) => `<p class="badges">${list.map((b) => `<span>${b}</span>`).join('')}</p>`

// Every box shows its full text, with no "More" button to click.
const card = (title, body) => `
  <article class="card">
    <h3>${title}</h3>
    ${body}
  </article>
`

export function renderDetails() {
  const ex = d.experience
  const experience = card(
    ex.title,
    `<p class="card-meta">
       ${hero.genres.map((g) => `<u>${g}</u>`).join(' <span class="dot">•</span> ')}
     </p>
     <p class="card-meta">${hero.rating} &nbsp; ${hero.year} &nbsp; ${hero.runtime} ${badges(ex.badges)}</p>
     <p class="lead">${ex.intro}</p>
     <ul class="roles">
       ${ex.roles.map((r) => `<li><span class="when">${r.when}</span><b>${r.role}</b> · ${r.org}<br>${r.text}</li>`).join('')}
     </ul>`,
  )

  const credits = card(
    d.credits.title,
    `<dl class="credits">
       ${d.credits.rows
         .map(([k, v, plain]) => `<dt>${k}</dt><dd>${v.map((x) => (plain ? x : `<u>${x}</u>`)).join(', ')}</dd>`)
         .join('')}
     </dl>`,
  )

  const simple = (c) => card(c.title, `${badges(c.badges)}<p class="lead">${c.text}</p>`)

  return `
    <section class="details" id="details" aria-label="Details">
      <nav class="tabs" aria-label="Sections">
        <a href="#gallery">${d.tabs[0]}</a>
        <a href="#details" class="on" aria-current="page">${d.tabs[1]}</a>
      </nav>
      <div class="details-grid">
        <div class="col">${experience}${credits}</div>
        <div class="col">${simple(d.education)}${simple(d.tools)}${simple(d.building)}</div>
      </div>
    </section>
  `
}
