import { footer as f } from '../content.js'
import { smile } from '../ui/icons.js'

// "Contact us" and the footer, at the very bottom like the streaming site's footer.

// Simple drawn icons (not the companies' official artwork), sized to sit beside each label.
const glyphs = {
  email:
    '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 6.5L12 13l8.5-6.5"/></svg>',
  linkedin:
    '<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="4" fill="currentColor"/><path d="M7 10v7M7 7.2v.1M11 17v-4.2c0-1.6 1-2.6 2.4-2.6s2.1 1 2.1 2.6V17M11 10v7" stroke="#0b1016" stroke-width="2" stroke-linecap="round" fill="none"/></svg>',
  github:
    '<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.2-3.4-1.2-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.4 1.1 3 .8.1-.7.4-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.6 9.6 0 0 1 5 0c1.9-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.9V21c0 .3.2.6.7.5A10 10 0 0 0 12 2z"/></svg>',
}

export function renderFooter() {
  return `
    <footer class="footer" id="contact" aria-label="${f.title}">
      <h2>${f.title}</h2>
      <p class="footer-text">${f.text}</p>
      <ul class="contact-links">
        ${f.links
          .map(
            (l) => `
          <li>
            <a href="${l.href}"${l.key === 'email' ? '' : ' target="_blank" rel="noopener"'} data-find="contact-${l.key}">
              <span class="contact-icon">${glyphs[l.key]}</span>
              <span class="contact-label">${l.label}</span>
              <span class="contact-handle">${l.handle}</span>
            </a>
          </li>`,
          )
          .join('')}
      </ul>
      <div class="footer-bottom">
        <a class="logo" href="#top" aria-label="life video, back to the top"><span>life video</span>${smile(58)}</a>
        <p>${f.playLine}</p>
        <p class="muted">${f.copyright}</p>
      </div>
    </footer>
  `
}
