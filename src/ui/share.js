import { share as s, cv, reactions, contact, feedback } from '../content.js'
import { openModal, closeModal } from './modal.js'

// The big pop-ups behind the hero's round buttons: share, CV, and the reactions.

// The page address without any #section on the end.
const pageUrl = () => location.origin + location.pathname

export function openShare() {
  const url = pageUrl()
  const enc = encodeURIComponent
  const links = [
    ['LinkedIn', `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`],
    ['WhatsApp', `https://wa.me/?text=${enc(`${s.message} ${url}`)}`],
    ['Email', `mailto:?subject=${enc(s.subject)}&body=${enc(`${s.message}\n\n${url}`)}`],
  ]
  openModal({
    title: s.title,
    body: `
      <p class="modal-text">${s.text}</p>
      <div class="share-link">
        <input type="text" value="${url}" readonly aria-label="Portfolio link">
        <button class="modal-btn" data-copy>${s.copy}</button>
      </div>
      <p class="share-to">
        ${links.map(([name, href]) => `<a class="modal-btn ghost" href="${href}" target="_blank" rel="noopener">${name}</a>`).join('')}
        ${navigator.share ? `<button class="modal-btn ghost" data-native>${s.more}</button>` : ''}
      </p>`,
    onOpen: (box) => {
      const copy = box.querySelector('[data-copy]')
      const input = box.querySelector('input')
      copy.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(url)
        } catch {
          // Clipboard blocked: select the link so it can be copied by hand.
          input.select()
          return
        }
        copy.textContent = s.copied
      })
      box.querySelector('[data-native]')?.addEventListener('click', () =>
        navigator.share({ title: s.subject, text: s.message, url }).catch(() => {}),
      )
    },
  })
}

export function openCV() {
  if (cv.file) {
    const a = document.createElement('a')
    a.href = cv.file
    a.download = cv.file.split('/').pop()
    a.click()
  }
  const t = cv.file ? cv.done : cv.soon
  openModal({
    title: t.title,
    body: `
      <p class="modal-text">${t.text}</p>
      <p class="share-to">
        <button class="modal-btn" data-share>${cv.shareNow}</button>
        <button class="modal-btn ghost" data-close>${cv.close}</button>
      </p>`,
    onOpen: (box) => box.querySelector('[data-share]').addEventListener('click', openShare),
  })
}

// Shortlist, like and dislike. The first button is the bold one.
export function openReaction(kind) {
  const r = reactions[kind]
  const next = { share: openShare, cv: openCV, contact: openContact, feedback: openFeedback }
  openModal({
    title: r.title,
    body: `
      <p class="modal-text">${r.text}</p>
      <p class="share-to">
        ${r.buttons.map((b, i) => `<button class="modal-btn${i ? ' ghost' : ''}" data-do="${b.do}">${b.label}</button>`).join('')}
      </p>`,
    onOpen: (box) =>
      box.querySelectorAll('[data-do]').forEach((btn) =>
        btn.addEventListener('click', () => (next[btn.dataset.do] || closeModal)()),
      ),
  })
}

// Shows my email address in full, so it can be copied even without an email app.
// `subject` lets other pop-ups (like Try my AI) say what the email is about.
export function openContact(subject = contact.subject) {
  const mailto = `mailto:${contact.email}?subject=${encodeURIComponent(typeof subject === 'string' ? subject : contact.subject)}`
  openModal({
    title: contact.title,
    body: `
      <p class="modal-text">${contact.text}</p>
      <div class="share-link">
        <input type="text" value="${contact.email}" readonly aria-label="My email address">
        <button class="modal-btn" data-copy>${contact.copy}</button>
      </div>
      <p class="share-to"><a class="modal-btn ghost" href="${mailto}">${contact.write}</a></p>`,
    onOpen: (box) => {
      const copy = box.querySelector('[data-copy]')
      copy.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(contact.email)
          copy.textContent = contact.copied
        } catch {
          box.querySelector('input').select()
        }
      })
    },
  })
}

// A small form for "Tell me what to fix". It posts to `feedback.endpoint` when one is set;
// otherwise it opens the visitor's email app with their note already written.
export function openFeedback() {
  const f = feedback
  openModal({
    title: f.title,
    body: `
      <p class="modal-text">${f.text}</p>
      <form class="feedback-form">
        <textarea name="message" rows="4" maxlength="1500" required placeholder="${f.placeholder}" aria-label="${f.placeholder}"></textarea>
        <label class="feedback-email">${f.emailLabel}
          <input type="email" name="email" autocomplete="email" maxlength="200">
        </label>
        <p class="feedback-error" role="alert" hidden>${f.failed}</p>
        <p class="share-to"><button class="modal-btn" type="submit">${f.send}</button></p>
      </form>`,
    onOpen: (box) => {
      const form = box.querySelector('form')
      box.querySelector('textarea').focus()
      form.addEventListener('submit', async (e) => {
        e.preventDefault()
        const message = form.message.value.trim()
        const email = form.email.value.trim()
        if (!message) return form.message.focus()
        if (!f.endpoint) {
          const body = email ? `${message}\n\nReply to: ${email}` : message
          location.href = `mailto:${contact.email}?subject=${encodeURIComponent(f.subject)}&body=${encodeURIComponent(body)}`
          return showThanks()
        }
        const btn = form.querySelector('[type=submit]')
        btn.disabled = true
        btn.textContent = f.sending
        try {
          const res = await fetch(f.endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, email, page: location.href }),
          })
          if (!res.ok) throw new Error(res.status)
          showThanks()
        } catch {
          box.querySelector('.feedback-error').hidden = false
          btn.disabled = false
          btn.textContent = f.send
        }
      })
    },
  })
}

function showThanks() {
  openModal({
    title: feedback.thanks.title,
    body: `
      <p class="modal-text">${feedback.thanks.text}</p>
      <p class="share-to"><button class="modal-btn" data-close>Close</button></p>`,
  })
}
