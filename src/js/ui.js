// ui.js - Gestion des interactions UI
import { Core } from './core.js';

// Éléments du menu
const btnFit = document.getElementById('btnFit');
const btnLabels = document.getElementById('btnToggleLabels');
const btnSpread = document.getElementById('btnSpread');

/**
 * Bouton "Recentrer" - Recentre la caméra sur l'origine
 */
btnFit.onclick = () => {
  Core.state.controls.target.set(0, 0, 0);
};

/**
 * Bouton "Masquer/Afficher labels" - Toggle la visibilité des labels
 */
btnLabels.onclick = () => {
  Core.state.labelsEnabled = !Core.state.labelsEnabled;
  btnLabels.textContent = Core.state.labelsEnabled ? 'Masquer labels' : 'Afficher labels';

  Core.state.groups.nodes.children.forEach(m => {
    const s = m.children.find(c => c.type === 'Sprite');
    if (s) s.visible = Core.state.labelsEnabled;
  });
};

/**
 * Bouton "Écarter" - Réorganise les nœuds en cercle dans leurs zones
 */
btnSpread.onclick = () => {
  const { data, zoneVisuals, nodeMap } = Core.state;

  data.zones.forEach(z => {
    const members = data.nodes.filter(n => n.zone === z.id);
    const center = zoneVisuals.get(z.id).userData.center;
    const radius = Math.max(2, 1.2 * Math.sqrt(Math.max(1, members.length))) + 1.6;

    members.forEach((n, i) => {
      const a = (i / members.length) * Math.PI * 2;
      const p = center.clone().add({
        x: Math.cos(a) * radius,
        y: 0.15,
        z: Math.sin(a) * radius
      });
      const m = nodeMap.get(n.id);
      if (m) m.position.set(p.x, p.y, p.z);
    });
  });
};
