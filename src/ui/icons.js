/**
 * Minimal inline SVG icon set (1.5px stroke, consistent weight).
 * No icon font, no emoji.
 */

const PATHS = {
  play: ['M8 5.5v13l11-6.5z'],
  pause: ['M8 5v14', 'M16 5v14'],
  prev: ['M18 6l-9 6 9 6z', 'M6 6v12'],
  next: ['M6 6l9 6-9 6z', 'M18 6v12'],
  mic: ['M12 4a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V7a3 3 0 0 0-3-3z', 'M6 11a6 6 0 0 0 12 0', 'M12 17v4', 'M9 21h6'],
  camera: ['M4 8h3l2-2h6l2 2h3v11H4z', 'M12 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z'],
  share: ['M12 16V4', 'M7 9l5-5 5 5', 'M5 14v5h14v-5'],
  bookmark: ['M6 4h12v17l-6-4-6 4z'],
  expand: ['M4 9V4h5', 'M20 9V4h-5', 'M4 15v5h5', 'M20 15v5h-5'],
  collapse: ['M9 4v5H4', 'M15 4v5h5', 'M9 20v-5H4', 'M15 20v-5h5'],
  chevron: ['M8 10l4 4 4-4'],
  sliders: ['M4 7h10', 'M18 7h2', 'M4 12h4', 'M12 12h8', 'M4 17h12', 'M20 17h0', 'M16 5v4', 'M10 10v4', 'M16 15v4'],
  cube: ['M12 3l8 4.5v9L12 21l-8-4.5v-9z', 'M12 12l8-4.5', 'M12 12L4 7.5', 'M12 12v9'],
  wave: ['M3 14c3 0 3-6 6-6s3 8 6 8 3-6 6-6'],
  circle: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z'],
  dice: ['M5 5h14v14H5z', 'M9 9h.01', 'M15 9h.01', 'M12 12h.01', 'M9 15h.01', 'M15 15h.01'],
  reset: ['M4 10a8 8 0 1 1 2 7', 'M4 4v6h6'],
  close: ['M6 6l12 12', 'M18 6L6 18'],
  menu: ['M4 7h16', 'M4 12h16', 'M4 17h16'],
  grid: ['M4 4h6v6H4z', 'M14 4h6v6h-6z', 'M4 14h6v6H4z', 'M14 14h6v6h-6z'],
  info: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z', 'M12 11v5', 'M12 8h.01'],
  moon: ['M20 14.5A8 8 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5z'],
  trash: ['M5 7h14', 'M9 7V5h6v2', 'M7 7l1 13h8l1-13'],
  sparkle: ['M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z'],
  external: ['M14 4h6v6', 'M20 4l-9 9', 'M11 5H5v14h14v-6']
};

/**
 * @param {string} name
 * @param {number} [size]
 * @returns {SVGSVGElement}
 */
export function createIcon(name, size = 16) {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('width', String(size));
  svg.setAttribute('height', String(size));
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '1.5');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('aria-hidden', 'true');
  svg.classList.add('uv-icon');

  const paths = PATHS[name] || PATHS.circle;
  for (const d of paths) {
    const path = document.createElementNS(ns, 'path');
    path.setAttribute('d', d);
    svg.appendChild(path);
  }
  return svg;
}
