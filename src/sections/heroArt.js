// The hero photo: the sofa scene, where her eyes follow the cursor and the poster tilts slightly in 3D.

// Versions of the sofa photo that differ only in where she looks. They line up pixel for pixel,
// so crossfading between them looks like her eyes and head moving.
const GAZE = ['up', 'up-right', 'left', 'center', 'right', 'down-left', 'down', 'down-right']
// The 3 by 3 grid of directions. No up-left image yet, so she looks straight up there.
const GRID = [
  ['up', 'up', 'up-right'],
  ['left', 'center', 'right'],
  ['down-left', 'down', 'down-right'],
]
// Photo shape (2:3) and where her face sits in it, as a fraction of the photo.
const PHOTO = { ratio: 2 / 3, faceX: 0.81, faceY: 0.28 }

export function renderArt() {
  return `
    <div class="hero-art" id="heroArt" aria-hidden="true">
      <div class="frame" id="heroFrame">
        ${GAZE.map((g) =>
          g === 'center'
            ? `<img class="gaze on" data-gaze="${g}" src="/images/gaze/${g}.jpg" alt="">`
            : `<img class="gaze" data-gaze="${g}" data-src="/images/gaze/${g}.jpg" alt="">`,
        ).join('')}
      </div>
      <div class="hero-shade"></div>
    </div>
  `
}

export function initArt() {
  const art = document.getElementById('heroArt')
  const frame = document.getElementById('heroFrame')
  const gazes = [...frame.querySelectorAll('.gaze')]
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Only devices with a mouse can make her look around, so only they download the other
  // seven photos. Phones get the one photo they show, which saves about 1.9 MB.
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    gazes.forEach((g) => g.dataset.src && (g.src = g.dataset.src))
  }

  // Size the photo like "object-fit: cover", so we know exactly where her face is on screen.
  const layout = () => {
    const W = art.clientWidth
    const H = art.clientHeight
    let w = W
    let h = W / PHOTO.ratio
    if (h < H) {
      h = H
      w = H * PHOTO.ratio
    }
    const css = getComputedStyle(art)
    const px = parseFloat(css.getPropertyValue('--focus-x')) || 0.58
    const py = parseFloat(css.getPropertyValue('--focus-y')) || 0.3
    Object.assign(frame.style, {
      width: `${w}px`,
      height: `${h}px`,
      left: `${(W - w) * px}px`,
      top: `${(H - h) * py}px`,
    })
  }

  // Her eyes follow the cursor: pick the direction from where the pointer is, relative to her face.
  let current = 'center'
  const look = (dir) => {
    if (dir === current) return
    current = dir
    gazes.forEach((g) => g.classList.toggle('on', g.dataset.gaze === dir))
  }
  let tx = 0, ty = 0
  let lastMove = performance.now()
  window.addEventListener('pointermove', (e) => {
    lastMove = performance.now()
    tx = e.clientX / innerWidth - 0.5
    ty = e.clientY / innerHeight - 0.5
    const r = frame.getBoundingClientRect()
    if (r.bottom < 0) return
    const fx = r.left + PHOTO.faceX * r.width
    const fy = r.top + PHOTO.faceY * r.height
    const dz = Math.max(70, r.width * 0.07)
    const col = e.clientX < fx - dz ? 0 : e.clientX > fx + dz ? 2 : 1
    // Most of the page sits below her face, so "down" only kicks in well below it.
    const row = e.clientY < fy - dz ? 0 : e.clientY > fy + Math.max(260, dz * 3.5) ? 2 : 1
    look(GRID[row][col])
  })
  document.addEventListener('pointerleave', () => look('center'))

  // On phones there is no cursor, so she glances around on her own every few seconds.
  const idle = ['center', 'right', 'center', 'up-right', 'center', 'left', 'center', 'down']
  let idleStep = 0
  setInterval(() => {
    if (performance.now() - lastMove < 4000) return
    idleStep = (idleStep + 1) % idle.length
    look(idle[idleStep])
  }, 1800)

  // 3D: the poster tilts slightly toward the cursor, like it's held in your hand.
  let x = 0, y = 0
  const loop = () => {
    x += (tx - x) * 0.06
    y += (ty - y) * 0.06
    frame.style.transform = `perspective(1400px) rotateY(${x * -4}deg) rotateX(${y * 3}deg) translate(${x * -10}px, ${y * -6}px) scale(1.05)`
    requestAnimationFrame(loop)
  }
  if (!reduce) loop()

  window.addEventListener('resize', layout)
  window.addEventListener('load', layout)
  layout()
}
