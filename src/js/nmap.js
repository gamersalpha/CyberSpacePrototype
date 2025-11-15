// nmap.js - Import et analyse de scans nmap
import { Core, addNodes } from './core.js';

/**
 * Devine le type d'appareil basé sur les ports ouverts
 * @param {Array} ports - Liste des ports détectés
 * @returns {string} - Type de l'appareil (router, printer, nas, pc)
 */
function guessType(ports) {
  const ids = new Set(ports.map(p => +p.portid));

  // Imprimantes (IPP, JetDirect)
  if (ids.has(515) || ids.has(9100)) return 'printer';

  // NAS (SMB, Samba, NFS)
  if (ids.has(445) || ids.has(139) || ids.has(2049)) return 'nas';

  // Routeurs (SSH)
  if (ids.has(22)) return 'router';

  // Serveurs web / PC
  if (ids.has(80) || ids.has(443) || ids.has(8080)) return 'pc';

  // Par défaut
  return 'pc';
}

/**
 * Importe un fichier XML de scan nmap
 * @param {string} txt - Contenu XML du fichier nmap
 * @param {Object} options - Options d'import
 * @param {boolean} options.replace - Remplacer les nœuds existants ?
 * @param {string} options.ipPrefix - Préfixe IP pour déterminer la zone
 * @returns {Array} - Liste des nœuds ajoutés
 */
function importXml(txt, { replace = false, ipPrefix = '192.168.1.' } = {}) {
  const doc = new DOMParser().parseFromString(txt, 'application/xml');
  const hosts = [...doc.querySelectorAll('host')];
  const added = [];

  // Mode remplacement : vider les nœuds existants
  if (replace) {
    Core.state.data.nodes.length = 0;
    Core.state.nodeMap.clear();
    Core.state.groups.nodes.clear();
  }

  hosts.forEach(h => {
    // Récupération de l'adresse IP
    const addr = h.querySelector('address[type="ipv4"], address[type="ipv6"], address');
    if (!addr) return;
    const ip = addr.getAttribute('addr');

    // Vérification du statut (up/down)
    const st = h.querySelector('status')?.getAttribute('state') || 'unknown';
    if (st !== 'up') return;

    // Nom d'hôte
    const name = h.querySelector('hostnames hostname')?.getAttribute('name');

    // Ports ouverts
    const ports = [...h.querySelectorAll('port')].map(p => ({
      portid: p.getAttribute('portid'),
      protocol: p.getAttribute('protocol') || 'tcp',
      state: p.querySelector('state')?.getAttribute('state') || '',
      service: p.querySelector('service')?.getAttribute('name') || ''
    }));

    // Détermination du type et de la zone
    const type = guessType(ports);
    const id = `nmap-${ip.replace(/[:\.]/g, '-')}`;

    // Éviter les doublons
    if (Core.state.data.nodes.some(n => n.id === id)) return;

    const zone = ip?.startsWith(ipPrefix) ? 'lan-home' : 'core';

    // Création du nœud
    const node = {
      id,
      label: name || ip,
      type,
      ip,
      zone,
      nmap: { ports }
    };

    Core.state.data.nodes.push(node);
    added.push(node);
  });

  // Régénération de la scène 3D
  addNodes();
  return added;
}

// Création de l'input file caché
const input = document.createElement('input');
input.type = 'file';
input.accept = '.xml';
input.style.display = 'none';
document.body.appendChild(input);

// Boutons de gestion
document.getElementById('btnLoadXml').onclick = () => input.click();
document.getElementById('btnReplace').onclick = (e) => e.currentTarget.classList.toggle('active');

// Gestion du chargement de fichier
input.addEventListener('change', async (ev) => {
  const f = ev.target.files[0];
  if (!f) return;

  const txt = await f.text();
  const replace = document.getElementById('btnReplace').classList.contains('active');
  const nodes = importXml(txt, { replace });

  alert(`Importé ${nodes.length} hôtes.`);
  input.value = ''; // Reset de l'input
});
