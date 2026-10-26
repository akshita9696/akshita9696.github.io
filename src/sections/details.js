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
       ${ex.roles
         .map(
           (r, i) => `
         <li data-find="role-${i}">
           <span class="when">${r.when}</span><b>${r.role}</b> · ${r.org}
           <p class="role-scope">${r.scope}</p>
           <ul class="role-points">${r.points.map((pt) => `<li>${pt}</li>`).join('')}</ul>
         </li>`,
         )
         .join('')}
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

  // Tools as small tags, grouped by what they're for.
  const tools = card(
    d.tools.title,
    `${badges(d.tools.badges)}
     ${d.tools.groups
       .map((gr) => `<p class="tool-label">${gr.label}</p><p class="tool-tags">${gr.items.map((t) => `<span>${t}</span>`).join('')}</p>`)
       .join('')}`,
    'tools',
  )

  // Each project name becomes a link once it has one.
  const b = d.building
  const building = card(
    b.title,
    `${badges(b.badges)}
     <ul class="building">
       ${b.items
         .map((it) => `<li><b>${it.link ? `<a href="${it.link}" target="_blank" rel="noopener">${it.name} ↗</a>` : it.name}</b>, ${it.text}.${it.github ? ` <a class="gh" href="${it.github}" target="_blank" rel="noopener">GitHub</a>` : ''}</li>`)
         .join('')}
     </ul>
     <p class="lead small">${b.note}</p>`,
    'building',
  )

  return `
    <div class="panel" id="details" aria-label="Details">
      <div class="details-grid">
        <div class="col">${experience}${credits}</div>
        <div class="col">${simple('education')}${tools}${building}</div>
      </div>
    </div>
  `
}
