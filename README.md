# CyberSpacePrototype

Visualisation 3D interactive de réseaux informatiques avec style cyberpunk, utilisant Three.js.

![Cyberpunk Network 3D](https://img.shields.io/badge/Three.js-0.162.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🎯 Fonctionnalités

- **Visualisation 3D interactive** : Navigation fluide dans l'espace 3D avec contrôles orbitaux
- **Zones réseau** : Organisation visuelle par zones (Core/DMZ, LAN, IoT, Invités)
- **Mini-carte 2D** : Vue d'ensemble cliquable pour navigation rapide
- **Import de scans Nmap** : Chargement et visualisation automatique de résultats de scan
- **Analyse OSI** : Affichage des couches du modèle OSI actives pour chaque nœud
- **Interface cyberpunk** : Design futuriste avec effets visuels immersifs

## 📦 Structure du projet

```
CyberSpacePrototype/
├── public/
│   └── index.html          # Page principale
├── src/
│   └── js/
│       ├── core.js         # Module principal (scène 3D, caméra, renderer)
│       ├── details.js      # Panneau de détails avec analyse OSI
│       ├── minimap.js      # Mini-carte 2D
│       ├── nmap.js         # Import de scans Nmap
│       └── ui.js           # Interactions UI (boutons)
├── CLAUDE.md               # Guide pour assistants IA
└── README.md               # Ce fichier
```

## 🚀 Installation

### Prérequis

- Un navigateur web moderne (Chrome, Firefox, Edge, Safari)
- Un serveur HTTP local (optionnel mais recommandé)

### Méthode 1 : Serveur HTTP simple (recommandé)

```bash
# Cloner le dépôt
git clone <repository-url>
cd CyberSpacePrototype

# Lancer un serveur HTTP local
# Option 1 : Python 3
python3 -m http.server 8000

# Option 2 : Node.js (npx)
npx serve

# Option 3 : PHP
php -S localhost:8000
```

Puis ouvrir http://localhost:8000/public/ dans votre navigateur.

### Méthode 2 : Ouverture directe (limitations CORS possibles)

Ouvrir directement `public/index.html` dans votre navigateur.

> ⚠️ **Note** : Certains navigateurs peuvent bloquer les modules ES6 en mode `file://`. Un serveur HTTP local est recommandé.

## 🎮 Utilisation

### Navigation 3D

- **Rotation** : Clic gauche + glisser
- **Zoom** : Molette de la souris
- **Panoramique** : Clic droit + glisser (ou clic molette + glisser)

### Interface

- **Carte** : Ouvre/ferme la mini-carte 2D
- **Recentrer** : Recentre la caméra sur l'origine
- **Masquer labels** : Toggle l'affichage des labels 3D
- **Écarter** : Réorganise les nœuds en cercle dans leurs zones
- **Charger scan nmap** : Importe un fichier XML de scan Nmap
- **Mode remplacement** : Active/désactive le remplacement des nœuds lors de l'import

### Interactions

- **Clic sur un nœud** : Affiche le panneau de détails avec :
  - Informations générales (IP, type)
  - Visualisation des couches OSI actives
  - Liste des protocoles détectés par couche

- **Clic sur la mini-carte** : Zoom animé vers le nœud le plus proche

## 📊 Import de scans Nmap

### Génération d'un scan Nmap compatible

```bash
# Scan basique
sudo nmap -oX scan.xml 192.168.1.0/24

# Scan détaillé avec détection de services
sudo nmap -sV -oX scan.xml 192.168.1.0/24

# Scan complet (plus long)
sudo nmap -sV -sC -O -oX scan.xml 192.168.1.0/24
```

### Import dans l'application

1. Cliquer sur **"Charger scan nmap"**
2. Sélectionner votre fichier `scan.xml`
3. Les hôtes détectés apparaissent automatiquement dans la scène 3D

**Options** :
- **Mode remplacement OFF** (défaut) : Les nouveaux hôtes s'ajoutent aux existants
- **Mode remplacement ON** : Les hôtes existants sont supprimés avant l'import

## 🏗️ Architecture technique

### Modules JavaScript

#### **core.js**
- Initialisation de la scène Three.js
- Gestion de la caméra et du renderer
- Création des zones et nœuds réseau
- Système de raycasting pour la sélection

#### **details.js**
- Affichage du panneau de détails
- Analyse et classification par couches OSI
- Mapping protocoles → couches

#### **minimap.js**
- Rendu 2D Canvas de la topologie
- Projection 3D → 2D
- Navigation par clic

#### **nmap.js**
- Parsing XML des scans Nmap
- Détection automatique du type d'appareil
- Attribution automatique des zones

#### **ui.js**
- Gestion des boutons d'interface
- Contrôles de visibilité et réorganisation

### Technologies utilisées

- **Three.js 0.162.0** : Moteur de rendu 3D WebGL
- **ES6 Modules** : Architecture modulaire moderne
- **Canvas 2D API** : Mini-carte
- **DOMParser** : Import XML Nmap
- **Custom Events** : Communication inter-modules

## 🎨 Personnalisation

### Ajouter une zone réseau

Dans `src/js/core.js`, modifier le tableau `data.zones` :

```javascript
zones: [
  { id: 'ma-zone', label: 'Ma Zone', color: 0xff5733 }
]
```

Et ajouter la position dans `zoneCenters` :

```javascript
zoneCenters: new Map([
  ['ma-zone', new THREE.Vector3(15, 0, 15)]
])
```

### Ajouter un type de nœud

Dans `src/js/core.js`, modifier la fonction `meshForType()` :

```javascript
case 'mon-type':
  return new THREE.Mesh(
    new THREE.ConeGeometry(0.6, 1.5, 8),
    mat.clone()
  );
```

### Personnaliser les couleurs

Les couleurs principales sont définies dans le `<style>` de `index.html` :

```css
--color-primary: #00d1ff;
--color-secondary: #1f6feb;
--background: #0a0d12;
```

## 🐛 Dépannage

### Les modules ne se chargent pas

- Vérifier que vous utilisez un serveur HTTP (pas `file://`)
- Vérifier la console du navigateur pour les erreurs CORS
- Essayer avec `python3 -m http.server`

### Les imports Nmap ne fonctionnent pas

- Vérifier que le fichier est au format XML (`-oX` avec Nmap)
- Vérifier que les hôtes ont le statut `state="up"`
- Vérifier la console pour les erreurs de parsing

### Performance lente avec beaucoup de nœuds

- Désactiver les labels avec le bouton "Masquer labels"
- Réduire le nombre de polygones dans `meshForType()`
- Activer le antialiasing sélectif dans `core.js`

## 📝 Licence

MIT License - Voir LICENSE pour plus de détails

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📧 Contact

Pour toute question ou suggestion, ouvrir une issue sur GitHub.

---

**Fait avec ❤️ et Three.js**
