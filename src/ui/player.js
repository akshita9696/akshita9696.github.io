// A pop-up viewer, so visitors never leave the site.
// It plays Loom links and video files, and shows project pictures full size.

// Accepts a share link (loom.com/share/ID) or an embed link (loom.com/embed/ID).
export const loomId = (url) => (url || '').match(/loom\.com\/(?:share|embed)\/([a-f0-9]{32})/i)?.[1] || ''

const isFile = (url) => /\.(webm|mp4|mov)$/i.test(url || '')
const isImage = (url) => /\.(jpe?g|png|webp|gif|avif)$/i.test(url || '')

let el
let lastFocus

function close() {
  el.classList.remove('show')
  el.querySelector('.player-frame').innerHTML = ''
  document.body.style.overflow = ''
  lastFocus?.focus()
}

export function openPlayer(url, title) {
  const id = loomId(url)
  const image = isImage(url)
  if (!id && !isFile(url) && !image) return
  if (!el) {
    el = document.createElement('div')
    el.className = 'player'
    el.setAttribute('role', 'dialog')
    el.setAttribute('aria-modal', 'true')
    el.innerHTML = `
      <div class="player-box">
        <button class="player-close" aria-label="Close">&times;</button>
        <div class="player-frame"></div>
      </div>`
    el.addEventListener('click', (e) => {
      if (e.target === el || e.target.closest('.player-close')) close()
    })
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && el.classList.contains('show')) close()
    })
    document.body.append(el)
  }
  lastFocus = document.activeElement
  el.setAttribute('aria-label', title)
  const frame = el.querySelector('.player-frame')
  // Pictures keep their own shape; videos sit in a 16:9 frame.
  frame.classList.toggle('picture', image)
  frame.innerHTML = id
    ? `<iframe src="https://www.loom.com/embed/${id}?autoplay=1&hide_owner=true" title="${title}" allow="autoplay; fullscreen" allowfullscreen></iframe>`
    : image
      ? `<img src="${url}" alt="${title}">`
      : `<video src="${url}" title="${title}" controls autoplay playsinline></video>`
  el.classList.add('show')
  document.body.style.overflow = 'hidden'
  el.querySelector('.player-close').focus()
}
