// Presentation-only SVGs; research data and browser storage are unchanged.
const paths = {
  download: '<path d="M12 3v12M7 10l5 5 5-5M4 16v5h16v-5"/>',
  arrow: '<path d="M5 12h14M14 7l5 5-5 5"/>',
  leaf: '<path d="M5 19C3 10 8 4 20 4c0 12-6 17-15 15Z"/><path d="M4 21 16 9M9 16V11M9 16h5"/>',
  cup: '<path d="M4 10h12v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5Zm12 1h2a3 3 0 0 1 0 6h-2M7 3c-2 2 2 2 0 4M12 2c-2 2 2 2 0 4"/>',
  iced: '<path d="m5 6 2 15h10l2-15ZM15 6l2-4h4M9 10h3v3H9ZM13 15h3v3h-3"/>',
  home: '<path d="m3 11 9-8 9 8M5 9v12h14V9M9 21v-7h6v7"/>',
  cafe: '<path d="M3 8h18l-2-5H5ZM4 8v13h16V8M8 21v-7h4v7M15 12h2M3 8c0 4 4 4 4 0 0 4 5 4 5 0 0 4 5 4 5 0 0 4 4 4 4 0"/>',
  dashboard: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="11" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="18" width="7" height="3" rx="1"/>',
  wishlist: '<path d="M20 5c-3-3-6-1-8 1-2-2-5-4-8-1-4 4 1 9 8 15 7-6 12-11 8-15Z"/>',
  opportunities: '<path d="m12 3 2.6 6.4L21 12l-6.4 2.6L12 21l-2.6-6.4L3 12l6.4-2.6Z"/>',
  watchlist: '<path d="M6 3h12v18l-6-4-6 4Z"/>',
  notebook: '<rect x="5" y="3" width="15" height="18" rx="2"/><path d="M3 7h4M3 12h4M3 17h4M10 8h6M10 12h6M10 16h4"/>',
  brief: '<path d="M5 3h10l4 4v14H5ZM14 3v5h5M9 12h6M9 16h6"/>',
  sources: '<circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/><circle cx="12" cy="19" r="3"/><path d="m7 9 4 7M17 9l-4 7M9 6h6"/>',
  search: '<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  posts: '<path d="M4 4h16v12H9l-5 4ZM8 8h8M8 12h5"/>',
  change: '<path d="M3 20h18M5 16l5-6 4 3 6-9M15 4h5v5"/>',
  mixed: '<path d="M3 6h6l6 12h6M17 14l4 4-4 4M3 18h6l6-12h6M17 2l4 4-4 4"/>'
};
export function icon(name, cls='') {
  return `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.leaf}</svg>`;
}
export const botanical = `<svg class="botanical" viewBox="0 0 190 170" fill="none" aria-hidden="true"><path d="M34 155C67 110 88 74 153 19" stroke="currentColor" stroke-width="2"/><path d="M66 111C24 113 24 73 33 61c34 8 41 27 33 50ZM88 83c-31-10-33-43-20-56 25 12 30 29 20 56ZM115 56c-4-34 17-43 41-43 4 26-12 42-41 43ZM75 100c18-30 51-27 66-10-18 24-42 28-66 10ZM48 135c18-30 47-29 65-16-13 24-39 30-65 16Z" fill="currentColor" fill-opacity=".09" stroke="currentColor" stroke-width="1.5"/></svg>`;
export function changeText(current, before, formatted) {
  return `${before && current!==before ? (current>before?'↑ ':'↓ ') : ''}${formatted}`;
}
