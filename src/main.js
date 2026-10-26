import './style.css'
import { site } from './content.js'
import { renderNav, initNav } from './sections/nav.js'
import { renderHero, initHero } from './sections/hero.js'
import { renderTabs, initTabs } from './sections/tabs.js'
import { renderFooter } from './sections/footer.js'

document.title = site.tab

document.querySelector('#app').innerHTML = `
  ${renderNav()}
  ${renderHero()}
  ${renderTabs()}
  ${renderFooter()}
`

initNav()
initHero()
initTabs()
