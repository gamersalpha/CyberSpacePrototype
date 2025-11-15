// core.js - Module principal pour la visualisation 3D du réseau
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export const Core = {
  THREE,
  state: {
    scene: null,
    camera: null,
    renderer: null,
    controls: null,
    groups: {
      zones: new THREE.Group(),
      nodes: new THREE.Group(),
      links: new THREE.Group(),
      traffic: new THREE.Group()
    },
    data: {
      zones: [
        { id: 'core',      label: 'Core/DMZ',   color: 0x00d1ff },
        { id: 'lan-home',  label: 'LAN Maison', color: 0x1f6feb },
        { id: 'lan-iot',   label: 'IoT',        color: 0x08b1ff },
        { id: 'lan-guest', label: 'Invités',    color: 0x5e86ff }
      ],
      nodes: [
        { id: 'router-1',  label: 'Routeur',    type: 'router',  ip: '192.168.1.1',  zone: 'core' },
        { id: 'pc-1',      label: 'PC Bureau',  type: 'pc',      ip: '192.168.1.12', zone: 'lan-home' },
        { id: 'nas-1',     label: 'NAS',        type: 'nas',     ip: '192.168.1.20', zone: 'lan-home' },
        { id: 'printer-1', label: 'Imprimante', type: 'printer', ip: '192.168.1.50', zone: 'lan-home' },
        { id: 'lamp-1',    label: 'Lampe',      type: 'lamp',    ip: '192.168.1.81', zone: 'lan-iot' }
      ]
    },
    zoneCenters: new Map([
      ['core',      new THREE.Vector3(  0, 0,   0)],
      ['lan-home',  new THREE.Vector3(-10, 0, -10)],
      ['lan-iot',   new THREE.Vector3( 12, 0,  -8)],
      ['lan-guest', new THREE.Vector3( -2, 0,  12)]
    ]),
    zoneVisuals: new Map(),
    nodeMap: new Map(),
    labelsEnabled: true,
  },
  frameSubs: [],
  onFrame(fn) {
    this.frameSubs.push(fn);
  },
};

/**
 * Crée un label sprite pour afficher du texte en 3D
 * @param {string} text - Le texte à afficher
 * @returns {THREE.Sprite} - Le sprite de label
 */
export function makeLabel(text) {
  const canvas = document.createElement('canvas');
  const size = 256;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  // Arrière-plan semi-transparent
  ctx.fillStyle = '#00000066';
  ctx.fillRect(0, size * 0.56, size, size * 0.44);

  // Texte
  ctx.font = '28px system-ui';
  ctx.fillStyle = '#cfe8ff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, size / 2, size * 0.78);

  const tex = new THREE.CanvasTexture(canvas);
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true });
  const spr = new THREE.Sprite(mat);
  spr.scale.set(2.6, 2.6, 1);
  spr.material.depthTest = false;
  spr.renderOrder = 999;

  return spr;
}

/**
 * Crée un mesh 3D basé sur le type de nœud
 * @param {string} type - Type de nœud (router, printer, nas, pc, etc.)
 * @returns {THREE.Mesh} - Le mesh 3D
 */
export function meshForType(type) {
  const geoBall = new THREE.SphereGeometry(0.7, 24, 20);
  const geoBox = new THREE.BoxGeometry(1.2, 0.7, 1.2);
  const geoCyl = new THREE.CylinderGeometry(0.5, 0.5, 1.2, 16);
  const mat = new THREE.MeshStandardMaterial({
    color: 0x8fd1ff,
    metalness: 0.6,
    roughness: 0.2
  });

  switch (type) {
    case 'router':
      return new THREE.Mesh(geoBox, mat.clone());
    case 'printer':
      return new THREE.Mesh(geoCyl, mat.clone());
    case 'nas':
      return new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.4, 0.9), mat.clone());
    default:
      return new THREE.Mesh(geoBall, mat.clone());
  }
}

/**
 * Ajoute les zones réseau à la scène 3D
 */
export function addZones() {
  const { zones } = Core.state.data;
  const { zoneCenters, zoneVisuals } = Core.state;
  const g = Core.state.groups.zones;

  zones.forEach(z => {
    const center = zoneCenters.get(z.id) || new THREE.Vector3();
    const members = Core.state.data.nodes.filter(n => n.zone === z.id);
    const radius = Math.max(3.2, 2 + members.length * 0.9);

    // Base circulaire de la zone
    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(radius, radius, 0.08, 64),
      new THREE.MeshPhysicalMaterial({
        color: z.color,
        transparent: true,
        opacity: 0.06
      })
    );
    base.position.copy(center);

    // Mur cylindrique de la zone
    const wall = new THREE.Mesh(
      new THREE.CylinderGeometry(radius * 1.03, radius * 1.03, 2.2, 48, 1, true),
      new THREE.MeshBasicMaterial({
        color: z.color,
        transparent: true,
        opacity: 0.14,
        side: THREE.DoubleSide
      })
    );
    wall.position.copy(center).add(new THREE.Vector3(0, 1.15, 0));

    // Label de la zone
    const label = makeLabel(z.label);
    label.position.copy(center).add(new THREE.Vector3(0, 1.6, 0));

    // Groupe de la zone
    const grp = new THREE.Group();
    grp.add(base, wall, label);
    grp.userData = { center, radius, pulse: 0 };
    g.add(grp);
    zoneVisuals.set(z.id, grp);
  });
}

/**
 * Ajoute les nœuds réseau à la scène 3D
 */
export function addNodes() {
  const nodesGroup = Core.state.groups.nodes;
  Core.state.nodeMap.clear();
  nodesGroup.clear();

  const nodes = Core.state.data.nodes;
  nodes.forEach((n) => {
    const center = Core.state.zoneVisuals.get(n.zone)?.userData.center || new THREE.Vector3();
    const siblings = nodes.filter(s => s.zone === n.zone);
    const idx = siblings.findIndex(s => s.id === n.id);
    const radius = Math.max(1.4, 0.9 * Math.sqrt(Math.max(1, siblings.length)));
    const angle = (idx / Math.max(1, siblings.length)) * Math.PI * 2;

    // Position du nœud en cercle autour du centre de la zone
    const pos = new THREE.Vector3(
      Math.cos(angle) * radius,
      THREE.MathUtils.randFloat(0, 0.8),
      Math.sin(angle) * radius
    ).add(center);

    // Création du mesh selon le type
    const m = meshForType(n.type);
    m.position.copy(pos);
    m.userData = { ...n, selected: false };

    // Label du nœud
    const label = makeLabel(n.label);
    label.position.set(0, 1.2, 0);
    m.add(label);

    nodesGroup.add(m);
    Core.state.nodeMap.set(n.id, m);
  });
}

/**
 * Zoom animé sur un nœud spécifique
 * @param {string} id - ID du nœud
 */
export function focusOnNode(id) {
  const obj = Core.state.nodeMap.get(id);
  if (!obj) return;

  const target = obj.position.clone();
  const dir = new THREE.Vector3(0.7, 0.5, 1).normalize();
  const dist = 6;
  const dest = target.clone().addScaledVector(dir, dist);
  const startPos = Core.state.camera.position.clone();
  const startTarget = Core.state.controls.target.clone();

  let t = 0;
  const dur = 0.8;

  (function tween() {
    t = Math.min(1, t + 1 / 60 / dur);
    Core.state.camera.position.lerpVectors(startPos, dest, t);
    Core.state.controls.target.lerpVectors(startTarget, target, t);
    if (t < 1) requestAnimationFrame(tween);
  })();
}

/**
 * Initialise la scène 3D, la caméra, le renderer et les contrôles
 */
export function init() {
  const { THREE } = Core;

  // Scène
  const scene = Core.state.scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x06080c, 0.03);

  // Caméra
  const camera = Core.state.camera = new THREE.PerspectiveCamera(
    70,
    innerWidth / innerHeight,
    0.1,
    2000
  );
  camera.position.set(0, 10, 26);

  // Renderer
  const renderer = Core.state.renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(devicePixelRatio);
  renderer.setSize(innerWidth, innerHeight);
  renderer.setClearColor(0x0a0d12);
  document.body.appendChild(renderer.domElement);

  // Contrôles orbitaux
  const controls = Core.state.controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // Lumières
  scene.add(new THREE.HemisphereLight(0x7aa6ff, 0x0b0d12, 0.9));
  const key = new THREE.SpotLight(0x6ee7ff, 1.2, 120, Math.PI / 6, 0.3, 1.0);
  key.position.set(12, 18, 10);
  key.castShadow = true;
  scene.add(key);

  // Grille au sol
  const grid = new THREE.GridHelper(160, 160, 0x164a8a, 0x102942);
  grid.material.opacity = 0.25;
  grid.material.transparent = true;
  scene.add(grid);

  // Ajout des groupes à la scène
  scene.add(
    Core.state.groups.zones,
    Core.state.groups.nodes,
    Core.state.groups.links,
    Core.state.groups.traffic
  );

  // Initialisation des zones et nœuds
  addZones();
  addNodes();

  // Gestion du redimensionnement
  window.addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });

  // Démarrage de la boucle d'animation
  animate();
}

/**
 * Boucle d'animation principale
 */
export function animate() {
  function loop() {
    Core.state.controls.update();
    Core.frameSubs.forEach(fn => fn());
    Core.state.renderer.render(Core.state.scene, Core.state.camera);
    requestAnimationFrame(loop);
  }
  loop();
}

// Raycasting pour la sélection des nœuds
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('pointermove', (e) => {
  const rect = Core.state.renderer.domElement.getBoundingClientRect();
  mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
});

window.addEventListener('click', () => {
  raycaster.setFromCamera(mouse, Core.state.camera);
  const hit = raycaster.intersectObjects(Core.state.groups.nodes.children, false)[0];
  if (hit) {
    const ud = hit.object.userData || {};
    window.dispatchEvent(new CustomEvent('node-selected', { detail: ud }));
  }
});

// Initialisation automatique
init();
