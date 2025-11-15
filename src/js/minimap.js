// minimap.js - Mini-carte 2D du réseau
import { Core, focusOnNode } from './core.js';

// Éléments DOM
const panel = document.getElementById('miniPanel');
const cvs = document.getElementById('miniCanvas');
const ctx = cvs.getContext('2d');
const header = document.getElementById('miniHeader');
const close = document.getElementById('miniClose');

/**
 * Redimensionne le canvas de la mini-carte
 */
function resize() {
  const r = panel.getBoundingClientRect();
  const dpr = Math.max(1, devicePixelRatio || 1);
  cvs.width = r.width * dpr;
  cvs.height = (r.height - 34) * dpr;
  cvs.style.width = r.width + 'px';
  cvs.style.height = (r.height - 34) + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

/**
 * Ouvre la mini-carte
 */
function open() {
  if (getComputedStyle(panel).display === 'none') {
    panel.style.display = 'block';
    resize();
  }
}

// Gestion des événements
document.getElementById('btnMap').onclick = open;
close.onclick = () => panel.style.display = 'none';
window.addEventListener('resize', () => {
  if (panel.style.display !== 'none') resize();
});

// Gestion du déplacement de la fenêtre (drag & drop)
let drag = false;
let offX = 0;
let offY = 0;

header.onmousedown = e => {
  drag = true;
  offX = e.clientX - panel.offsetLeft;
  offY = e.clientY - panel.offsetTop;
};

window.onmousemove = e => {
  if (!drag) return;
  panel.style.left = (e.clientX - offX) + 'px';
  panel.style.top = (e.clientY - offY) + 'px';
  resize();
};

window.onmouseup = () => drag = false;

/**
 * Calcule les limites (bounding box) de toutes les zones
 * @returns {Object} - { minX, maxX, minZ, maxZ }
 */
function bounds() {
  const zV = Core.state.zoneVisuals;
  let minX = Infinity;
  let maxX = -Infinity;
  let minZ = Infinity;
  let maxZ = -Infinity;

  zV.forEach(g => {
    const c = g.userData.center;
    const r = g.userData.radius * 1.6;
    minX = Math.min(minX, c.x - r);
    maxX = Math.max(maxX, c.x + r);
    minZ = Math.min(minZ, c.z - r);
    maxZ = Math.max(maxZ, c.z + r);
  });

  return { minX, maxX, minZ, maxZ };
}

/**
 * Projette les coordonnées 3D (x, z) en coordonnées 2D sur le canvas
 * @param {number} x - Coordonnée X en 3D
 * @param {number} z - Coordonnée Z en 3D
 * @param {DOMRect} rect - Rectangle du panneau
 * @param {Object} b - Limites (bounds)
 * @returns {Object} - { x, y } en coordonnées canvas
 */
function project(x, z, rect, b) {
  const margin = 12;
  const w = rect.width - 2 * margin;
  const h = rect.height - 34 - 2 * margin;
  const sx = (x - b.minX) / (b.maxX - b.minX);
  const sz = (z - b.minZ) / (b.maxZ - b.minZ);
  return {
    x: margin + sx * w,
    y: 34 + margin + sz * h
  };
}

/**
 * Dessine la mini-carte
 */
function draw() {
  if (panel.style.display === 'none') return;

  const rect = panel.getBoundingClientRect();
  const b = bounds();
  ctx.clearRect(0, 0, rect.width, rect.height);

  // Dessiner les zones
  Core.state.data.zones.forEach(z => {
    const g = Core.state.zoneVisuals.get(z.id);
    const c = project(g.userData.center.x, g.userData.center.z, rect, b);
    const r = g.userData.radius * (rect.width / (Math.max(1, (b.maxX - b.minX)) * 2.2));

    // Cercle de la zone
    ctx.beginPath();
    ctx.arc(c.x, c.y, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${(z.color >> 16) & 255},${(z.color >> 8) & 255},${z.color & 255},0.08)`;
    ctx.fill();
    ctx.strokeStyle = `rgba(${(z.color >> 16) & 255},${(z.color >> 8) & 255},${z.color & 255},0.45)`;
    ctx.stroke();

    // Label de la zone
    ctx.fillStyle = '#9ad0ff';
    ctx.font = '12px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(z.label, c.x, c.y - r - 6);
  });

  // Dessiner les nœuds
  Core.state.data.nodes.forEach(n => {
    const m = Core.state.nodeMap.get(n.id);
    if (!m) return;
    const p = project(m.position.x, m.position.z, rect, b);
    ctx.fillStyle = '#cfe8ff';
    ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
  });
}

// Enregistrement de la fonction de dessin dans la boucle d'animation
Core.onFrame(draw);

/**
 * Gestion du clic sur la mini-carte pour zoomer sur un nœud
 */
cvs.addEventListener('click', (e) => {
  const rect = panel.getBoundingClientRect();
  const b = bounds();
  let best = null;
  let bd = 1e9;

  Core.state.data.nodes.forEach(n => {
    const m = Core.state.nodeMap.get(n.id);
    if (!m) return;
    const p = project(m.position.x, m.position.z, rect, b);
    const dx = p.x - (e.clientX - rect.left);
    const dy = p.y - (e.clientY - rect.top);
    const d = dx * dx + dy * dy;
    if (d < bd) {
      bd = d;
      best = n.id;
    }
  });

  // Si un nœud est proche du clic, zoomer dessus
  if (best && bd < 30 * 30) focusOnNode(best);
});
