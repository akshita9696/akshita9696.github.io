import { tryAI as t } from '../content.js'
import { openModal } from './modal.js'
import { openContact } from './share.js'

// "Try my AI": the visitor pastes their website, my n8n workflow reads the landing page,
// and the answer comes back as a one-line read of the business plus 3 automation ideas.
//
// The workflow replies with JSON shaped like:
// { "business": "One line on what they do", "ideas": [{ "title", "how", "impact" }, ...] }

const esc = (str = '') =>
  String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])

// Accepts "acme.com", "www.acme.com" or a full link. Rejects anything that isn't a public website.
function cleanUrl(raw) {
  const text = raw.trim()
  if (!text || /\s/.test(text)) return null
  try {
    const url = new URL(/^https?:\/\//i.test(text) ? text : `https://${text}`)
    const host = url.hostname
    if (!host.includes('.') || /^(localhost|\d+\.\d+\.\d+\.\d+|\[.*\])$/i.test(host)) return null
    return url.href
  } catch {
    return null
  }
}

// The step list ticks along while the workflow runs, so the wait feels like watching it work.
function showSteps(box) {
  const list = box.querySelector('.ai-steps')
  list.hidden = false
  list.innerHTML = t.steps.map((s) => `<li>${s}</li>`).join('')
  const items = [...list.children]
  let i = 0
  items[0].classList.add('now')
  const timer = setInterval(() => {
    if (i >= items.length - 1) return clearInterval(timer)
    items[i].classList.replace('now', 'done')
    items[++i].classList.add('now')
  }, 1600)
  return () => {
    clearInterval(timer)
    list.hidden = true
  }
}

function showResult(data, site) {
  const host = new URL(site).hostname.replace(/^www\./, '')
  openModal({
    title: t.resultTitle,
    body: `
      <p class="ai-site">${esc(host)}</p>
      ${data.business ? `<p class="modal-text">${esc(data.business)}</p>` : ''}
      <ol class="ai-ideas">
        ${data.ideas
          .slice(0, 3)
          .map(
            (idea, i) => `
          <li>
            <span class="ai-num">${t.ideaLabel} ${i + 1}</span>
            <b>${esc(idea.title)}</b>
            <span>${esc(idea.how)}</span>
            ${idea.impact ? `<em>${esc(idea.impact)}</em>` : ''}
          </li>`,
          )
          .join('')}
      </ol>
      <p class="share-to">
        <button class="modal-btn" data-talk>${t.cta}</button>
        <button class="modal-btn ghost" data-again>${t.again}</button>
      </p>`,
    onOpen: (box) => {
      box.querySelector('[data-talk]').addEventListener('click', () => openContact(`${t.contactSubject} ${host}`))
      box.querySelector('[data-again]').addEventListener('click', openTryAI)
    },
  })
}

export function openTryAI() {
  openModal({
    title: t.title,
    body: `
      <p class="modal-text">${t.text}</p>
      <form class="ai-form">
        <input type="text" name="site" inputmode="url" autocomplete="url" spellcheck="false"
          placeholder="${t.placeholder}" aria-label="Your website" maxlength="300" required>
        <button class="modal-btn" type="submit">${t.go}</button>
      </form>
      <p class="feedback-error" role="alert" hidden></p>
      <ol class="ai-steps" aria-live="polite" hidden></ol>`,
    onOpen: (box) => {
      const form = box.querySelector('form')
      const error = box.querySelector('.feedback-error')
      const say = (msg) => {
        error.textContent = msg
        error.hidden = !msg
      }
      form.site.focus()
      form.addEventListener('submit', async (e) => {
        e.preventDefault()
        const site = cleanUrl(form.site.value)
        if (!site) return say(t.badUrl)
        if (!t.endpoint) return say(t.offline)
        say('')
        const btn = form.querySelector('[type=submit]')
        btn.disabled = true
        form.site.disabled = true
        const stop = showSteps(box)
        try {
          const res = await fetch(t.endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: site }),
          })
          const data = await res.json()
          if (!res.ok || !Array.isArray(data.ideas) || !data.ideas.length) throw new Error(data.error || res.status)
          showResult(data, site)
        } catch (err) {
          stop()
          say(err.message === 'daily_limit' ? t.busy : err.message === 'invalid_url' ? t.badUrl : t.failed)
          btn.disabled = false
          form.site.disabled = false
          form.site.focus()
        }
      })
    },
  })
}
