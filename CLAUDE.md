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

CyberSpacePrototype is [**TO BE DOCUMENTED**: Add project description, goals, and key features here].

### Technology Stack

**TO BE DOCUMENTED** - As the project evolves, document:
- **Frontend**: [Framework/library used]
- **Backend**: [Language/framework]
- **Database**: [Database system]
- **Infrastructure**: [Deployment platform, containerization]
- **Key Dependencies**: [Major libraries and their purposes]

### Project Goals

**TO BE DOCUMENTED** - Key objectives:
1. [Goal 1]
2. [Goal 2]
3. [Goal 3]

---

## Repository Structure

```
CyberSpacePrototype/
├── .git/                    # Git version control
├── CLAUDE.md               # This file - AI assistant guide
├── README.md               # [TO BE ADDED] User-facing documentation
├── [src/]                  # [TO BE ADDED] Source code
├── [tests/]                # [TO BE ADDED] Test files
├── [docs/]                 # [TO BE ADDED] Additional documentation
├── [config/]               # [TO BE ADDED] Configuration files
└── [scripts/]              # [TO BE ADDED] Build/deployment scripts
```

### Key Directories

**TO BE DOCUMENTED** - As directories are created, document their purposes:

- **`src/`**: Main application source code
  - Purpose: [Description]
  - Key files: [List important files]

- **`tests/`**: Test suites
  - Unit tests: [Location and patterns]
  - Integration tests: [Location and patterns]
  - E2E tests: [Location and patterns]

- **`docs/`**: Additional documentation
  - API documentation: [Location]
  - Architecture diagrams: [Location]
  - User guides: [Location]

---

## Development Environment Setup

### Prerequisites

**TO BE DOCUMENTED** - List required tools and versions:

```bash
# Example prerequisites (update as needed):
# - Node.js >= 18.x
# - Python >= 3.10
# - Docker >= 20.x
# - Other tools...
```

### Initial Setup

```bash
# 1. Clone the repository
git clone [repository-url]
cd CyberSpacePrototype

# 2. Install dependencies
# [TO BE DOCUMENTED] - Add installation commands

# 3. Configure environment
# [TO BE DOCUMENTED] - Add environment setup

# 4. Verify installation
# [TO BE DOCUMENTED] - Add verification commands
```

### Environment Variables

**TO BE DOCUMENTED** - Document required environment variables:

```bash
# .env.example (create as needed)
# VAR_NAME=description
```

---

## Code Conventions & Standards

### General Principles

**TO BE DOCUMENTED** - Establish coding standards:

1. **Code Style**: [Formatter used - e.g., Prettier, Black, etc.]
2. **Linting**: [Linter configuration - e.g., ESLint, Pylint]
3. **Type Safety**: [TypeScript strict mode, Python type hints, etc.]
4. **Documentation**: [JSDoc, docstrings, inline comments policy]

### Naming Conventions

**TO BE DOCUMENTED**:

- **Files**: [kebab-case, camelCase, snake_case]
- **Functions**: [camelCase, snake_case]
- **Classes**: [PascalCase]
- **Constants**: [UPPER_SNAKE_CASE]
- **Variables**: [camelCase, snake_case]

### File Organization

**TO BE DOCUMENTED**:

```
# Example component/module structure
module-name/
├── index.[ext]           # Main entry point
├── [module].test.[ext]  # Tests
├── [module].types.[ext] # Type definitions
└── utils/               # Helper functions
```

### Import/Export Patterns

**TO BE DOCUMENTED**:

```javascript
// Example import order (adjust for your language):
// 1. External dependencies
// 2. Internal dependencies
// 3. Types/interfaces
// 4. Styles/assets
```

---

## Architecture Patterns

### Design Principles

**TO BE DOCUMENTED** - Document architectural decisions:

1. **Separation of Concerns**: [How code is organized]
2. **Dependency Injection**: [If/how it's used]
3. **State Management**: [Pattern used]
4. **Error Handling**: [Strategy and patterns]
5. **Logging**: [Approach and tools]

### Common Patterns

**TO BE DOCUMENTED** - Key patterns used in the codebase:

#### Pattern 1: [Name]
- **Purpose**: [What it solves]
- **When to use**: [Use cases]
- **Example**:
```
[Code example]
```

#### Pattern 2: [Name]
- **Purpose**: [What it solves]
- **When to use**: [Use cases]
- **Example**:
```
[Code example]
```

### Anti-Patterns to Avoid

**TO BE DOCUMENTED**:

1. [Anti-pattern 1]: [Why to avoid and alternative]
2. [Anti-pattern 2]: [Why to avoid and alternative]

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

### Project Management

**TO BE DOCUMENTED**:

```bash
# Start development server
# [command]

# Build for production
# [command]

# Run linter
# [command]

# Format code
# [command]

# Run tests
# [command]

# Generate documentation
# [command]
```

### Database Operations

**TO BE DOCUMENTED** (if applicable):

```bash
# Run migrations
# [command]

# Seed database
# [command]

# Reset database
# [command]
```

### Deployment

**TO BE DOCUMENTED**:

```bash
# Deploy to staging
# [command]

# Deploy to production
# [command]

# Rollback
# [command]
```

---

## Troubleshooting

### Common Issues

**TO BE DOCUMENTED** - As issues arise, document solutions:

#### Issue 1: [Description]
**Symptom**: [What you see]
**Cause**: [Why it happens]
**Solution**: [How to fix]

#### Issue 2: [Description]
**Symptom**: [What you see]
**Cause**: [Why it happens]
**Solution**: [How to fix]

### Getting Help

**TO BE DOCUMENTED**:

- **Documentation**: [Link to docs]
- **Issue Tracker**: [Link to issues]
- **Team Communication**: [Slack, Discord, etc.]
- **Code Owners**: [List maintainers]

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

**TO BE DOCUMENTED**:

| File | Purpose | When to Modify |
|------|---------|----------------|
| [file] | [purpose] | [when] |

### Important Links

**TO BE DOCUMENTED**:

- [Production URL]
- [Staging URL]
- [Documentation]
- [CI/CD Dashboard]
- [Monitoring Dashboard]

---

## Version History

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2025-11-15 | 1.0.0 | Initial CLAUDE.md template created | Claude AI |

---

## Notes for Future Development

As this project grows, ensure you:

1. **Fill in all "TO BE DOCUMENTED" sections** as they become relevant
2. **Remove sections** that don't apply to your project
3. **Add new sections** for project-specific needs
4. **Keep examples current** with actual code in the repository
5. **Review and update quarterly** to maintain accuracy

This document is a living guide - keep it updated as the project evolves!
