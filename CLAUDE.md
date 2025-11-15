# CLAUDE.md - CyberSpacePrototype

> **Purpose**: This document serves as a comprehensive guide for AI assistants (like Claude) working with this codebase. It documents the project structure, development workflows, conventions, and key patterns to ensure consistent and effective collaboration.

**Last Updated**: 2025-11-15
**Repository**: CyberSpacePrototype
**Status**: Initial Setup / Early Development

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Repository Structure](#repository-structure)
3. [Development Environment Setup](#development-environment-setup)
4. [Code Conventions & Standards](#code-conventions--standards)
5. [Architecture Patterns](#architecture-patterns)
6. [Testing Strategy](#testing-strategy)
7. [Development Workflows](#development-workflows)
8. [Git & Version Control](#git--version-control)
9. [AI Assistant Guidelines](#ai-assistant-guidelines)
10. [Common Tasks & Commands](#common-tasks--commands)
11. [Troubleshooting](#troubleshooting)

---

## Project Overview

### What is CyberSpacePrototype?

CyberSpacePrototype is a **3D interactive network visualization tool** with a cyberpunk aesthetic. It allows users to visualize and explore network topologies in an immersive 3D environment, import Nmap scan results, and analyze network nodes with OSI layer breakdowns.

**Key Features**:
- 3D visualization of network topology using Three.js
- Interactive zone-based network organization (Core/DMZ, LAN, IoT, Guest)
- Nmap XML import for automatic network discovery
- OSI model analysis for detected services
- 2D minimap for quick navigation
- Cyberpunk-inspired visual design

### Technology Stack

- **Frontend**: Vanilla JavaScript with ES6 modules
- **3D Engine**: Three.js 0.162.0
- **Graphics**: WebGL (via Three.js), Canvas 2D API (minimap)
- **Backend**: None (static site, client-side only)
- **Database**: None (in-memory state management)
- **Infrastructure**: Static file serving (any HTTP server)
- **Key Dependencies**:
  - Three.js: 3D rendering engine
  - OrbitControls: Camera controls for 3D navigation
  - DOMParser: XML parsing for Nmap imports

### Project Goals

Key objectives:
1. **Visualize network topologies** in an intuitive and visually appealing 3D environment
2. **Import and analyze Nmap scans** automatically, with intelligent device type detection
3. **Educational tool** for understanding network architecture and the OSI model
4. **Modular architecture** for easy extension and customization

---

## Repository Structure

```
CyberSpacePrototype/
├── .git/                    # Git version control
├── CLAUDE.md               # This file - AI assistant guide
├── README.md               # User-facing documentation
├── public/                  # Static files served to browser
│   └── index.html          # Main HTML page with UI and styles
└── src/                     # JavaScript source code
    └── js/                  # JavaScript modules
        ├── core.js         # Core 3D engine (scene, camera, renderer)
        ├── details.js      # Details panel with OSI analysis
        ├── minimap.js      # 2D minimap canvas
        ├── nmap.js         # Nmap XML import functionality
        └── ui.js           # UI interaction handlers
```

### Key Directories

- **`public/`**: Static files served to the browser
  - `index.html`: Single-page application with embedded CSS
  - Contains all HTML structure and styling

- **`src/js/`**: JavaScript ES6 modules
  - **`core.js`**: Main 3D engine module
    - Scene, camera, renderer initialization
    - Zone and node creation
    - Raycasting for node selection
    - Animation loop

  - **`details.js`**: Details panel module
    - OSI model visualization
    - Protocol classification
    - Node information display

  - **`minimap.js`**: 2D minimap module
    - Canvas-based 2D rendering
    - Click-to-zoom navigation
    - Draggable panel

  - **`nmap.js`**: Nmap import module
    - XML parsing
    - Device type detection
    - Node creation from scan results

  - **`ui.js`**: UI controls module
    - Button event handlers
    - Label visibility toggle
    - Node reorganization

---

## Development Environment Setup

### Prerequisites

Minimal requirements:

- **Web Browser**: Modern browser with ES6 module support
  - Chrome >= 61
  - Firefox >= 60
  - Safari >= 11
  - Edge >= 16

- **HTTP Server** (recommended): Any static file server
  - Python 3: `python3 -m http.server`
  - Node.js: `npx serve` or `npx http-server`
  - PHP: `php -S localhost:8000`
  - VS Code: Live Server extension

### Initial Setup

```bash
# 1. Clone the repository
git clone <repository-url>
cd CyberSpacePrototype

# 2. No dependencies to install!
# The project uses CDN-hosted Three.js via importmap

# 3. Start a local HTTP server
python3 -m http.server 8000
# OR
npx serve
# OR
php -S localhost:8000

# 4. Open in browser
# Navigate to http://localhost:8000/public/
```

### Environment Variables

**Not required** - This is a client-side only application with no backend or configuration files needed.

---

## Code Conventions & Standards

### General Principles

1. **Code Style**: Clean, readable JavaScript with consistent formatting
   - 2-space indentation
   - Single quotes for strings
   - Semicolons optional but consistent
   - Meaningful variable names

2. **Linting**: No formal linter currently configured
   - Follow existing code patterns
   - Keep code consistent with surrounding context

3. **Type Safety**: JavaScript (no TypeScript)
   - Use JSDoc comments for function documentation
   - Document parameter types and return values

4. **Documentation**: JSDoc for public functions
   - Document purpose, parameters, and return values
   - Add inline comments for complex logic

### Naming Conventions

- **Files**: kebab-case (e.g., `minimap.js`, `nmap.js`)
- **Functions**: camelCase (e.g., `addNodes()`, `focusOnNode()`)
- **Classes**: Not used (functional approach)
- **Constants**: UPPER_SNAKE_CASE (e.g., `OSI`, `PROTO_TO_LAYER`)
- **Variables**: camelCase (e.g., `nodeMap`, `zoneVisuals`)

### File Organization

Each module is self-contained:

```
src/js/
├── core.js         # Exports: Core, init, addZones, addNodes, etc.
├── details.js      # Imports: Core; exports: none (event-driven)
├── minimap.js      # Imports: Core, focusOnNode; exports: none
├── nmap.js         # Imports: Core, addNodes; exports: none
└── ui.js           # Imports: Core; exports: none
```

### Import/Export Patterns

```javascript
// 1. External dependencies (Three.js via CDN)
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// 2. Internal dependencies
import { Core, addNodes, focusOnNode } from './core.js';

// 3. Export pattern
export const Core = { ... };
export function addNodes() { ... }
```

**Module Communication**:
- Use custom DOM events for inter-module communication
- Example: `window.dispatchEvent(new CustomEvent('node-selected', { detail: nodeData }))`

---

## Architecture Patterns

### Design Principles

1. **Separation of Concerns**: Each module has a single, well-defined responsibility
   - `core.js`: 3D rendering and scene management
   - `details.js`: Node details display
   - `minimap.js`: 2D navigation
   - `nmap.js`: Data import
   - `ui.js`: UI controls

2. **Event-Driven Communication**: Modules communicate via custom DOM events
   - Loose coupling between modules
   - Example: `node-selected` event from core to details

3. **State Management**: Centralized in `Core.state` object
   - Single source of truth for application state
   - All modules import and reference `Core.state`

4. **Error Handling**: Minimal, defensive programming
   - Check for null/undefined before accessing properties
   - Use optional chaining (`?.`) when appropriate

5. **Logging**: Console-based (development only)
   - No production logging framework

### Common Patterns

#### Pattern 1: Centralized State Object
- **Purpose**: Single source of truth for application state
- **When to use**: For shared data accessed by multiple modules
- **Example**:
```javascript
export const Core = {
  state: {
    scene: null,
    camera: null,
    renderer: null,
    data: { zones: [], nodes: [] },
    nodeMap: new Map()
  }
};
```

#### Pattern 2: Custom DOM Events for Inter-Module Communication
- **Purpose**: Decouple modules while allowing communication
- **When to use**: When one module needs to notify others of changes
- **Example**:
```javascript
// In core.js - dispatch event
window.dispatchEvent(new CustomEvent('node-selected', { detail: nodeData }));

// In details.js - listen for event
window.addEventListener('node-selected', (ev) => {
  showDetails(ev.detail);
});
```

#### Pattern 3: Frame Subscription for Animation
- **Purpose**: Allow modules to hook into the animation loop
- **When to use**: For continuous rendering (e.g., minimap redraw)
- **Example**:
```javascript
// In core.js
Core.onFrame(fn) { this.frameSubs.push(fn); }

// In minimap.js
Core.onFrame(draw); // draw() called every frame
```

### Anti-Patterns to Avoid

1. **Direct DOM manipulation from core.js**: Keep 3D logic separate from UI
   - ❌ Don't: Add UI elements inside core.js
   - ✅ Do: Use events to communicate with UI modules

2. **Tight coupling between modules**: Avoid importing everything everywhere
   - ❌ Don't: Import details.js from core.js
   - ✅ Do: Use events for cross-module communication

3. **Global state pollution**: Keep state contained in Core object
   - ❌ Don't: Create global variables outside modules
   - ✅ Do: Store in `Core.state` or module-local variables

---

## Testing Strategy

### Testing Philosophy

**TO BE DOCUMENTED**:

- **Test Coverage Goals**: [e.g., >80% for critical paths]
- **Testing Pyramid**: [Unit vs Integration vs E2E ratio]
- **TDD/BDD Approach**: [If applicable]

### Running Tests

```bash
# [TO BE DOCUMENTED] - Add test commands
# npm test
# pytest
# etc.
```

### Writing Tests

**TO BE DOCUMENTED** - Testing conventions:

```
# Test file naming: [pattern]
# Test structure: [AAA pattern, Given-When-Then, etc.]
# Mocking strategy: [Approach]
# Fixtures/factories: [Location and usage]
```

### Test Categories

1. **Unit Tests**
   - Location: [Path]
   - Purpose: [Description]
   - Run: `[command]`

2. **Integration Tests**
   - Location: [Path]
   - Purpose: [Description]
   - Run: `[command]`

3. **E2E Tests**
   - Location: [Path]
   - Purpose: [Description]
   - Run: `[command]`

---

## Development Workflows

### Feature Development

**TO BE DOCUMENTED** - Standard workflow:

1. **Create Branch**: `git checkout -b feature/your-feature-name`
2. **Develop**: Make changes following conventions
3. **Test**: Ensure all tests pass
4. **Commit**: Follow commit message conventions
5. **Push**: Push to remote branch
6. **PR**: Create pull request for review

### Code Review Guidelines

**TO BE DOCUMENTED**:

- **What to review**: [Checklist]
- **Approval requirements**: [Number of approvals needed]
- **CI/CD checks**: [Required checks]

### Release Process

**TO BE DOCUMENTED**:

1. [Step 1]
2. [Step 2]
3. [Step 3]

---

## Git & Version Control

### Branch Strategy

**TO BE DOCUMENTED** - Current strategy:

- **`main`**: Production-ready code
- **`develop`**: Integration branch (if used)
- **`feature/*`**: Feature branches
- **`bugfix/*`**: Bug fix branches
- **`hotfix/*`**: Emergency fixes

### Commit Message Convention

**TO BE DOCUMENTED** - Follow a consistent format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Test additions/changes
- `chore`: Build/tool changes

**Examples**:
```
feat(auth): add OAuth2 authentication
fix(api): handle null response in user endpoint
docs(readme): update installation instructions
```

### Pre-commit Hooks

**TO BE DOCUMENTED**:

- [Linting]
- [Formatting]
- [Test execution]
- [Other checks]

---

## AI Assistant Guidelines

### When Working on This Codebase

#### 1. Code Quality Standards

- **Always** follow the established code conventions documented above
- **Always** write tests for new features and bug fixes
- **Always** update documentation when making changes
- **Never** commit code with known security vulnerabilities
- **Never** bypass linting or formatting checks

#### 2. Security Considerations

- Validate all user inputs
- Avoid common vulnerabilities:
  - SQL Injection
  - XSS (Cross-Site Scripting)
  - Command Injection
  - CSRF (Cross-Site Request Forgery)
  - Insecure Deserialization
- Use parameterized queries for database operations
- Sanitize data before rendering
- Keep dependencies updated

#### 3. Before Making Changes

1. **Read** existing code in the area you're modifying
2. **Understand** the current patterns and conventions
3. **Search** for similar implementations elsewhere in the codebase
4. **Ask** if uncertain about approach or conventions
5. **Plan** complex changes using TodoWrite tool

#### 4. When Adding Dependencies

- Check if existing dependencies can solve the problem
- Verify package security and maintenance status
- Document why the dependency is needed
- Update package manifests and lock files

#### 5. Documentation Requirements

When making significant changes:

- Update this CLAUDE.md if conventions change
- Update README.md for user-facing changes
- Add/update code comments for complex logic
- Document API changes in appropriate locations
- Update type definitions if applicable

#### 6. Error Handling

- Use consistent error handling patterns
- Provide meaningful error messages
- Log errors appropriately
- Don't expose sensitive information in errors
- Handle edge cases explicitly

#### 7. Performance Considerations

- Be mindful of algorithmic complexity
- Avoid unnecessary database queries
- Implement caching where appropriate
- Profile performance-critical code
- Document performance trade-offs

#### 8. Code Review Checklist

Before marking work as complete:

- [ ] Code follows established conventions
- [ ] Tests are written and passing
- [ ] Documentation is updated
- [ ] No security vulnerabilities introduced
- [ ] No performance regressions
- [ ] Error handling is comprehensive
- [ ] Edge cases are handled
- [ ] Code is self-documenting or well-commented
- [ ] Dependencies are justified and documented
- [ ] Changes are backwards compatible (or breaking changes documented)

---

## Common Tasks & Commands

### Development

```bash
# Start development server (Python)
python3 -m http.server 8000
# Then open http://localhost:8000/public/

# Start development server (Node.js)
npx serve
# OR
npx http-server

# Start development server (PHP)
php -S localhost:8000
```

### Code Modifications

**Adding a new zone**:
1. Edit `src/js/core.js`
2. Add zone to `data.zones` array
3. Add position to `zoneCenters` Map

**Adding a new node type**:
1. Edit `src/js/core.js`
2. Add case to `meshForType()` function
3. Update `guessType()` in `nmap.js` if needed

**Adding a new protocol mapping**:
1. Edit `src/js/details.js`
2. Add entry to `PROTO_TO_LAYER` object

### Testing Nmap Import

```bash
# Generate a test scan
sudo nmap -sV -oX test-scan.xml 192.168.1.0/24

# Then import via UI:
# 1. Click "Charger scan nmap"
# 2. Select test-scan.xml
```

### Database Operations

**Not applicable** - No database used.

### Deployment

**Static site deployment** - Copy files to any static host:

```bash
# Deploy to GitHub Pages
git push origin main
# Configure GitHub Pages to serve from /public

# Deploy to Netlify
# Drag and drop the entire folder

# Deploy to any web server
rsync -av public/ user@server:/var/www/html/
```

---

## Troubleshooting

### Common Issues

#### Issue 1: Modules not loading (CORS error)
**Symptom**: Browser console shows CORS errors, modules fail to load
**Cause**: Opening `index.html` directly with `file://` protocol
**Solution**: Use an HTTP server (see [Development Environment Setup](#development-environment-setup))

#### Issue 2: Three.js fails to load
**Symptom**: Console error: "Failed to resolve module specifier 'three'"
**Cause**: Browser doesn't support importmap or CDN is blocked
**Solution**:
- Check browser version (needs ES6 module support)
- Check network/firewall isn't blocking unpkg.com
- Try downloading Three.js locally if CDN is unavailable

#### Issue 3: Nmap import doesn't work
**Symptom**: Alert shows "Imported 0 hosts"
**Cause**: XML format incorrect or hosts are down
**Solution**:
- Ensure using `-oX` flag with nmap: `nmap -oX output.xml ...`
- Check hosts have `state="up"` in XML
- Verify XML is well-formed

#### Issue 4: Performance issues with many nodes
**Symptom**: Laggy 3D navigation, low FPS
**Cause**: Too many nodes/polygons being rendered
**Solution**:
- Click "Masquer labels" to hide label sprites
- Reduce node detail in `meshForType()` (lower segment counts)
- Consider LOD (Level of Detail) for distant objects

#### Issue 5: Minimap not appearing
**Symptom**: Clicking "Carte" does nothing
**Cause**: JavaScript error in minimap.js
**Solution**: Check browser console for errors

### Getting Help

- **Documentation**: See this file (CLAUDE.md) and README.md
- **Issue Tracker**: GitHub Issues (if repository is public)
- **Browser Console**: Check for JavaScript errors (F12 → Console)

---

## Maintenance Notes

### Updating This Document

This document should be updated whenever:

1. **New conventions are established**: Document them immediately
2. **Architecture changes**: Update relevant sections
3. **New tools are adopted**: Document setup and usage
4. **Patterns emerge**: Document successful patterns
5. **Anti-patterns discovered**: Document what to avoid

### Document Ownership

**TO BE DOCUMENTED**:
- **Primary Maintainer**: [Name/Role]
- **Last Review Date**: 2025-11-15
- **Next Review Date**: [Date]

---

## Quick Reference

### Essential Commands Cheatsheet

```bash
# Development
# [TO BE ADDED]

# Testing
# [TO BE ADDED]

# Deployment
# [TO BE ADDED]
```

### Key Files Reference

| File | Purpose | When to Modify |
|------|---------|----------------|
| `public/index.html` | Main HTML page with UI structure and CSS | Adding UI elements, changing styles |
| `src/js/core.js` | 3D engine, scene setup, zones, nodes | Adding zones, node types, changing 3D visuals |
| `src/js/details.js` | Details panel with OSI analysis | Changing OSI visualization, protocol mapping |
| `src/js/minimap.js` | 2D canvas minimap | Changing minimap appearance or behavior |
| `src/js/nmap.js` | Nmap XML import | Changing device detection logic |
| `src/js/ui.js` | UI button handlers | Adding new UI controls |
| `CLAUDE.md` | This file - AI assistant guide | When conventions/architecture changes |
| `README.md` | User-facing documentation | When adding features or changing usage |

### Important Links

- **Three.js Docs**: https://threejs.org/docs/
- **Nmap XML Output**: https://nmap.org/book/output-formats-xml-output.html
- **OSI Model Reference**: https://en.wikipedia.org/wiki/OSI_model

---

## Version History

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2025-11-15 | 1.0.0 | Initial CLAUDE.md template created | Claude AI |
| 2025-11-15 | 1.1.0 | Complete project setup with full documentation | Claude AI |

---

## Notes for Future Development

As this project grows, ensure you:

1. **Fill in all "TO BE DOCUMENTED" sections** as they become relevant
2. **Remove sections** that don't apply to your project
3. **Add new sections** for project-specific needs
4. **Keep examples current** with actual code in the repository
5. **Review and update quarterly** to maintain accuracy

This document is a living guide - keep it updated as the project evolves!
