import { details as d, hero } from '../content.js'

// The Details tab: two wide boxes on the left, three on the right, like the streaming-site layout.
// The tab bar above it lives in tabs.js.

const badges = (list) => `<p class="badges">${list.map((b) => `<span>${b}</span>`).join('')}</p>`

// Every box shows its full text, with no "More" button to click.
// `find` is the name the search uses to jump to the box.
const card = (title, body, find) => `
  <article class="card" data-find="${find}">
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
       ${ex.roles.map((r, i) => `<li data-find="role-${i}"><span class="when">${r.when}</span><b>${r.role}</b> · ${r.org}<br>${r.text}</li>`).join('')}
     </ul>`,
    'experience',
  )

  const credits = card(
    d.credits.title,
    `<dl class="credits">
       ${d.credits.rows
         .map(([k, v, plain]) => `<dt>${k}</dt><dd>${v.map((x) => (plain ? x : `<u>${x}</u>`)).join(', ')}</dd>`)
         .join('')}
     </dl>`,
    'credits',
  )

  const simple = (key) => card(d[key].title, `${badges(d[key].badges)}<p class="lead">${d[key].text}</p>`, key)

  return `
    <div class="panel" id="details" aria-label="Details">
      <div class="details-grid">
        <div class="col">${experience}${credits}</div>
        <div class="col">${simple('education')}${simple('tools')}${simple('building')}</div>
      </div>
    </div>
  `
}
