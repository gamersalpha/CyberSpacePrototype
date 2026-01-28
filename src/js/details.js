// details.js - Affichage des détails d'un nœud avec analyse OSI
import { Core } from './core.js';

// Modèle OSI - 7 couches
const OSI = [
  null,
  { id: 1, name: 'Physique' },
  { id: 2, name: 'Liaison' },
  { id: 3, name: 'Réseau' },
  { id: 4, name: 'Transport' },
  { id: 5, name: 'Session' },
  { id: 6, name: 'Présentation' },
  { id: 7, name: 'Application' }
];

// Mapping protocoles → couche OSI
const PROTO_TO_LAYER = {
  // Couche 7 - Application
  http: 7, https: 7, ssh: 7, ftp: 7, telnet: 7, smtp: 7, pop3: 7, imap: 7,
  dns: 7, mdns: 7, ipp: 7, printer: 7, jetdirect: 7, smb: 7, samba: 7,
  nfs: 7, upnp: 7, rdp: 7, vnc: 7, snmp: 7, mqtt: 7, coap: 7, ntp: 7,
  rpcbind: 7,
  // Couche 4 - Transport
  tcp: 4, udp: 4,
  // Couche 3 - Réseau
  icmp: 3
};

// Couleurs par couche OSI
const LAYER_COLOR = {
  7: '#4db1ff',
  6: '#6aa7ff',
  5: '#7b9aff',
  4: '#51d1b8',
  3: '#c2d15a',
  2: '#f7a24a',
  1: '#ef6a6a'
};

// Éléments DOM
const el = {
  panel: document.getElementById('details'),
  title: document.getElementById('d-title'),
  sub: document.getElementById('d-sub'),
  osi: document.getElementById('d-osi'),
  protos: document.getElementById('d-protos')
};

/**
 * Groupe les protocoles par couche OSI
 * @param {Array} ports - Liste des ports détectés par nmap
 * @returns {Map} - Map des couches OSI avec leurs protocoles
 */
function groupProtocolsByLayer(ports) {
  const layers = new Map();
  const ensure = (l) => (layers.has(l) ? layers.get(l) : layers.set(l, new Set()).get(l));

  (ports || []).forEach(p => {
    const svc = (p.service || '').toLowerCase();
    const proto = (p.protocol || '').toLowerCase();

    // Ajout des protocoles de transport
    if (proto === 'tcp') ensure(4).add('TCP');
    if (proto === 'udp') ensure(4).add('UDP');

    // Mapping des services vers les couches OSI
    [svc, proto].filter(Boolean).forEach(name => {
      const L = PROTO_TO_LAYER[name];
      if (L) ensure(L).add(name.toUpperCase());
    });
  });

  return layers;
}

/**
 * Affiche les barres visuelles du modèle OSI
 * @param {Map} layers - Map des couches actives
 */
function renderOSI(layers) {
  el.osi.innerHTML = '';

  for (let i = 7; i >= 1; i--) {
    // Label de la couche
    const label = document.createElement('div');
    label.className = 'layer';
    label.textContent = `${i}. ${OSI[i].name}`;

    // Barre de visualisation
    const bar = document.createElement('div');
    bar.className = 'bar';

    const fill = document.createElement('div');
    fill.className = 'fill';

    if (layers.has(i)) {
      fill.style.background = LAYER_COLOR[i];
      fill.style.opacity = 0.9;
      fill.style.width = '100%';
    } else {
      fill.style.background = '#0e1726';
      fill.style.opacity = 0.35;
      fill.style.width = '100%';
    }

    bar.appendChild(fill);
    el.osi.appendChild(label);
    el.osi.appendChild(bar);
  }
}

/**
 * Affiche la liste des protocoles détectés par couche
 * @param {Map} layers - Map des couches avec leurs protocoles
 */
function renderProtocols(layers) {
  el.protos.innerHTML = '';

  const entries = [...layers.entries()].sort((a, b) => b[0] - a[0]);

  if (entries.length === 0) {
    el.protos.innerHTML = '<em>Aucun service détecté pour cet hôte.</em>';
    return;
  }

  for (const [layer, set] of entries) {
    // Titre de la couche
    const title = document.createElement('div');
    title.style.marginTop = '6px';
    title.style.opacity = '.85';
    title.textContent = `Couche ${layer} — ${OSI[layer].name}`;
    el.protos.appendChild(title);

    // Tags des protocoles
    [...set].sort().forEach(name => {
      const tag = document.createElement('span');
      tag.className = 'tag';
      tag.textContent = name;
      el.protos.appendChild(tag);
    });
  }
}

/**
 * Affiche le panneau de détails pour un nœud
 * @param {Object} node - Données du nœud
 */
function showDetails(node) {
  el.title.textContent = node.label || node.ip || node.id;
  el.sub.textContent = `${node.ip || ''}  ${node.type ? ('• ' + node.type) : ''}`;

  const layers = groupProtocolsByLayer(node.nmap?.ports || []);
  renderOSI(layers);
  renderProtocols(layers);

  el.panel.style.display = 'block';
}

// Écoute l'événement de sélection de nœud
window.addEventListener('node-selected', (ev) => {
  const node = ev.detail;
  if (node) showDetails(node);
});
