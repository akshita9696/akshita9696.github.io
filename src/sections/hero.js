import { hero, actions } from '../content.js'
import { icons, smile } from '../ui/icons.js'
import { toast } from '../ui/toast.js'
import { openPlayer } from '../ui/player.js'
import { openShare, openReaction } from '../ui/share.js'
import { openTryAI } from '../ui/tryai.js'
import { renderArt, initArt } from './heroArt.js'

// The hero: title, buttons and info strip. The photo behind them lives in heroArt.js.

const roundButtons = [
  { key: 'plus', label: 'Add Akshita to your shortlist', action: 'shortlist' },
  { key: 'like', label: 'Like' },
  { key: 'dislike', label: 'Dislike' },
  { key: 'share', label: 'Share' },
]

export function renderHero() {
  const round = roundButtons
    .map(
      (b) =>
        `<button class="round-btn" data-action="${b.action || b.key}" aria-label="${b.label}" title="${b.label}">${icons[b.key]}</button>`,
    )
    .join('')

  return `
    <section class="hero" id="top" aria-label="${hero.titleTop} ${hero.titleBottom}">
      ${renderArt()}
      <div class="hero-copy">
        <p class="badge">${hero.badge}${smile(46)}</p>
        <h1 class="title">
          <span class="title-top">${hero.titleTop}</span>
          <span class="title-bottom">${hero.titleBottom}</span>
        </h1>
      </div>

      <div class="hero-bottom">
        <div class="hero-actions">
          <div class="round-row">${round}</div>
          <button class="btn-play" data-action="play">${icons.play}<span>${hero.play}</span></button>
          <div class="progress" aria-hidden="true"><i></i></div>
          <button class="btn-grey" data-action="tryAI">${hero.tryAI}</button>
          <p class="included">${icons.check}<span>${hero.included}</span></p>
        </div>

        <div class="hero-info">
          <p class="tags">
            <span class="new">${hero.isNew}</span>
            <span class="rank">${icons.trend}${hero.rank}</span>
          </p>
          <p class="desc">${hero.description}</p>
          <p class="meta">
            ${hero.genres.map((g) => `<span class="genre">${g}</span>`).join('<span class="dot">•</span>')}
            <span class="m">${hero.rating}</span><span class="m">${hero.year}</span><span class="m">${hero.runtime}</span>
          </p>
        </div>

        <div class="hero-cast">
          <p><span class="muted">Cast:</span> ${hero.cast.map((c) => `<u>${c}</u>`).join(', ')}</p>
          <p class="rating-icons" aria-hidden="true">
            <span>A</span><span>${icons.bolt}</span><span>CC</span><span class="ad">AD))</span>
          </p>
        </div>
      </div>
    </section>
  `
}

export function initHero() {
  initArt()
  document.querySelectorAll('.hero [data-action]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const a = btn.dataset.action
      if (a === 'share') return openShare()
      if (a === 'tryAI') return openTryAI()
      // Pressing like or dislike again just takes it back, without a pop-up.
      if (a === 'like' || a === 'dislike') {
        const other = document.querySelector(`.hero [data-action="${a === 'like' ? 'dislike' : 'like'}"]`)
        other.classList.remove('on')
        btn.classList.toggle('on')
        if (!btn.classList.contains('on')) return
        return openReaction(a)
      }
      if (a === 'shortlist') {
        btn.classList.add('on')
        return openReaction(a)
      }
      if (a === 'play' && hero.video) {
        openPlayer(hero.video, `${hero.titleTop} ${hero.titleBottom}`)
        return
      }
      toast(actions[a])
    })
  })
}
