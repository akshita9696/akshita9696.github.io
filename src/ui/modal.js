// A big centred pop-up for moments that matter more than a toast,
// like sharing the portfolio or trying my AI.

let el
let lastFocus

export function closeModal() {
  if (!el) return
  el.classList.remove('show')
  document.body.style.overflow = ''
  lastFocus?.focus()
}

// body is HTML; wire up its buttons with the `onOpen` callback, which receives the box.
export function openModal({ title, body, onOpen }) {
  if (!el) {
    el = document.createElement('div')
    el.className = 'modal'
    el.setAttribute('role', 'dialog')
    el.setAttribute('aria-modal', 'true')
    el.addEventListener('click', (e) => {
      if (e.target === el || e.target.closest('[data-close]')) closeModal()
    })
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && el.classList.contains('show')) closeModal()
    })
    document.body.append(el)
  }
  if (!el.classList.contains('show')) lastFocus = document.activeElement
  el.setAttribute('aria-label', title)
  el.innerHTML = `
    <div class="modal-box">
      <button class="modal-x" data-close aria-label="Close">&times;</button>
      <h2>${title}</h2>
      ${body}
    </div>`
  el.classList.add('show')
  document.body.style.overflow = 'hidden'
  const box = el.querySelector('.modal-box')
  onOpen?.(box)
  // Leave focus alone if onOpen already put it somewhere, like a text box.
  // Tall pop-ups always open at the top, even when the focused button is further down.
  if (!box.contains(document.activeElement)) box.querySelector('button:not(.modal-x), a')?.focus({ preventScroll: true })
  box.scrollTop = 0
}
