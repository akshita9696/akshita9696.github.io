import './style.css'
import { site } from './content.js'
import { renderNav, initNav } from './sections/nav.js'
import { renderHero, initHero } from './sections/hero.js'
import { renderDetails } from './sections/details.js'

document.title = site.tab

document.querySelector('#app').innerHTML = `
  ${renderNav()}
  ${renderHero()}
  ${renderDetails()}
`

initNav()
initHero()
