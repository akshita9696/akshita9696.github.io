// Small inline SVG icons, drawn for this site. Each one inherits the text colour.

const svg = (body, size = 24) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`

export const icons = {
  search: svg('<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>'),
  apps: svg(
    [4, 12, 20]
      .flatMap((x) => [4, 12, 20].map((y) => `<circle cx="${x}" cy="${y}" r="1.4" fill="currentColor" stroke="none"/>`))
      .join(''),
  ),
  bookmark: svg('<path d="M6 3h12v18l-6-4-6 4z"/>'),
  trailer: svg('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4"/><path d="M10.5 9.5v5l4-2.5z" fill="currentColor"/>'),
  plus: svg('<path d="M12 5v14M5 12h14"/>'),
  like: svg('<path d="M7 11v9H4v-9zM7 11l4-8a2 2 0 0 1 2 2v4h5.5a2 2 0 0 1 2 2.3l-1.2 7A2 2 0 0 1 17.3 20H7"/>'),
  dislike: svg('<path d="M7 13V4H4v9zM7 13l4 8a2 2 0 0 0 2-2v-4h5.5a2 2 0 0 0 2-2.3l-1.2-7A2 2 0 0 0 17.3 4H7"/>'),
  share: svg('<circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="M8.2 10.9l7.6-4.6M8.2 13.1l7.6 4.6"/>'),
  download: svg('<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>'),
  bolt: svg('<path d="M13 3L6 13h5l-1 8 7-10h-5z" fill="currentColor"/>', 16),
  play: '<svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3.5v17l14-8.5z" fill="currentColor"/></svg>',
  check:
    '<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="#1A98FF"/><path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  chevron: svg('<path d="M15 5l-7 7 7 7"/>', 28),
  menu: svg('<path d="M4 7h16M4 12h16M4 17h16"/>'),
  close: svg('<path d="M6 6l12 12M18 6L6 18"/>'),
  trend: svg('<circle cx="12" cy="12" r="10"/><path d="M7 15l4-4 3 3 4-5M14 9h4v4"/>', 30),
}

// Our own smile curve (not Amazon's arrow): a soft swoosh that ends in a small heart.
export const smile = (width = 64) =>
  `<svg class="smile" width="${width}" height="${Math.round(width * 0.22)}" viewBox="0 0 64 14" aria-hidden="true"><path d="M3 3c14 9 34 10 50 3" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/><path d="M57.5 4.2c.9-1.6 3.4-1 3.1.9-.2 1.4-2.7 3-3.9 3.6-.9-1-2.9-3.1-2.3-4.4.6-1.2 2.5-1 3.1-.1z" fill="currentColor"/></svg>`
