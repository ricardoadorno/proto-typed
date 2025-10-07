# 09 - Migration Strategy

## 🎯 Overview

Ensure **backward compatibility** during the transition from symbolic to verbal syntax while providing clear migration paths and automated tooling.

---

## 📅 Migration Phases

### Phase 1: Dual Support (Weeks 1-4)

**Goal**: Parser accepts **both** old and new syntax

**Implementation**:
- Lexer defines both old and new tokens
- Parser has alternative rules (OR expressions)
- Emit **warnings** for deprecated syntax
- All examples updated to new syntax
- Documentation shows both syntaxes

**User Experience**:
- Existing DSL code works without changes
- Console warnings guide users to new syntax
- IntelliSense suggests new syntax first

---

### Phase 2: Deprecation Warnings (Weeks 5-8)

**Goal**: Increase visibility of migration need

**Implementation**:
- Stronger warning messages in console
- Monaco editor underlines deprecated syntax
- Migration tool available
- Documentation emphasizes new syntax
- Old syntax marked as "deprecated"

**User Experience**:
- Clear migration timeline communicated
- Automated migration tool provided
- Examples exclusively use new syntax

---

### Phase 3: Migration-Only Mode (Weeks 9-10)

**Goal**: Force migration before final removal

**Implementation**:
- Parser rejects old syntax with error
- Error message provides auto-migration option
- Migration tool integrated into editor UI
- Final grace period announced

**User Experience**:
- One-click migration in editor
- Clear error messages with migration instructions

---

### Phase 4: New Syntax Only (Week 11+)

**Goal**: Complete migration to verbal syntax

**Implementation**:
- Remove old token definitions
- Simplify parser (no OR alternatives)
- Clean up codebase
- Performance improvements from simpler grammar

**User Experience**:
- Faster parsing
- Cleaner error messages
- Simplified documentation

---

## 🛠️ Migration Tools

### 1. Automated Migration Script

**Location**: `src/utils/migrate-dsl.ts`

**Features**:
- Parses old DSL syntax
- Transforms to new verbal syntax
- Preserves formatting and comments
- Validates output

**Usage**:
```typescript
import { migrateDSL } from './utils/migrate-dsl';

const oldDSL = `
screen Home:
  row-w50-center-p4:
    @@+[Edit](edit)
`;

const newDSL = migrateDSL(oldDSL);
// Output:
// screen Home:
//   container-wide:
//     @outline-md[Edit](edit)
```

---

### 2. Migration Rules

#### Buttons

```typescript
function migrateButton(oldSyntax: string): string {
  // Pattern: (@{1,3})([_+\-=!]?)\[text\](?:\{icon\})? ...
  
  const sizeMap = {
    '@': 'lg',
    '@@': 'md',
    '@@@': 'sm',
  };
  
  const variantMap = {
    '': 'primary',
    '_': 'ghost',
    '+': 'outline',
    '-': 'secondary',
    '=': 'destructive',
    '!': 'warning',
  };
  
  const match = oldSyntax.match(/(@{1,3})([_+\-=!]?)\[([^\]]+)\](?:\{([^}]+)\})?(?:\(([^)]+)\))?/);
  
  if (match) {
    const [, sizeToken, variantSymbol, label, icon, action] = match;
    const size = sizeMap[sizeToken] || 'md';
    const variant = variantMap[variantSymbol] || 'primary';
    
    let newSyntax = `@${variant}`;
    if (size !== 'md') newSyntax += `-${size}`;
    newSyntax += `[${label}]`;
    if (icon) newSyntax += `{${icon}}`;
    if (action) newSyntax += `(${action})`;
    
    return newSyntax;
  }
  
  return oldSyntax;
}

// Examples:
migrateButton('@[Save]') // → @primary-lg[Save]
migrateButton('@@+[Edit]') // → @outline-md[Edit] or @outline[Edit]
migrateButton('@@@=[Delete]') // → @destructive-sm[Delete]
```

---

#### Layouts

```typescript
function migrateLayout(oldSyntax: string): string {
  // Parse modifiers from old syntax
  const match = oldSyntax.match(/(row|col|grid|card|container)(-[^:]+)?:/);
  
  if (!match) return oldSyntax;
  
  const [, baseType, modifiers] = match;
  
  // Map common patterns to canonical layouts
  const layoutMap: Record<string, string> = {
    'row-center': 'row-center',
    'row-between': 'row-between',
    'row-start': 'row-start',
    'row-end': 'row-end',
    'col-start': 'stack',
    'col-center': 'stack',
    'grid-cols2': 'grid-2',
    'grid-cols3': 'grid-3',
    'grid-cols4': 'grid-4',
    'card': 'card',
    'card-p4': 'card-compact',
    'card-p6': 'card',
    'card-p8': 'card-feature',
    'container-wfull': 'container-wide',
    'container-narrow': 'container-narrow',
  };
  
  const key = modifiers ? `${baseType}${modifiers}` : baseType;
  const canonical = layoutMap[key];
  
  if (canonical) {
    return `${canonical}:`;
  }
  
  // Fallback: best guess
  if (baseType === 'row') return 'row-start:';
  if (baseType === 'col') return 'stack:';
  if (baseType === 'grid') return 'grid-3:';
  if (baseType === 'card') return 'card:';
  if (baseType === 'container') return 'container-wide:';
  
  return oldSyntax;
}

// Examples:
migrateLayout('row-w50-center-p4:') // → row-center:
migrateLayout('col-start-gap2:') // → stack:
migrateLayout('grid-cols3-gap4:') // → grid-3:
migrateLayout('card-p6:') // → card:
```

---

#### Inputs

```typescript
function migrateInput(oldSyntax: string): string {
  // Pattern: ___[\*\-]?(?::Label)?(?:\{Placeholder\})? ...
  
  const match = oldSyntax.match(/___([\\*\\-]?):?([^{]+)?(?:\\{([^}]+)\\})?/);
  
  if (!match) return oldSyntax;
  
  const [, modifier, label, placeholder] = match;
  
  let type = 'text';
  if (modifier === '*') type = 'password';
  if (modifier === '-') type = 'text'; // disabled becomes flag
  
  let newSyntax = `___${type}:`;
  if (label) newSyntax += ` ${label.trim()}`;
  if (placeholder) newSyntax += ` | placeholder: ${placeholder}`;
  if (modifier === '-') newSyntax += ' | disabled';
  
  return newSyntax;
}

// Examples:
migrateInput('___:Email{Enter email}') // → ___text: Email | placeholder: Enter email
migrateInput('___*:Password{Enter}') // → ___password: Password | placeholder: Enter
migrateInput('___-:Disabled{Can\\'t edit}') // → ___text: Disabled | placeholder: Can't edit | disabled
```

---

#### Components

```typescript
function migrateComponentUse(oldSyntax: string, componentDef: AstNode): string {
  // Extract component name
  const match = oldSyntax.match(/\\$([a-zA-Z][a-zA-Z0-9]*)/);
  if (!match) return oldSyntax;
  
  const componentName = match[1];
  
  // Find component definition to get prop names
  const props = extractPropsFromDefinition(componentDef);
  
  // Parse old values (pipe-separated)
  const valuesMatch = oldSyntax.match(/- ([^\\n]+)/);
  if (!valuesMatch) return oldSyntax;
  
  const values = valuesMatch[1].split('|').map(v => v.trim());
  
  // Build new syntax with named props
  const bindings = props.map((propName, index) => {
    const value = values[index] || '';
    return `${propName}: ${value}`;
  }).join(' | ');
  
  return `$${componentName}: ${bindings}`;
}

function extractPropsFromDefinition(componentDef: AstNode): string[] {
  // Find all %propName in component template
  const props: string[] = [];
  
  function traverse(node: AstNode) {
    if (node.type === 'Text' || node.type === 'Paragraph') {
      const matches = (node.props.text as string).matchAll(/%([a-zA-Z][a-zA-Z0-9_-]*)/g);
      for (const match of matches) {
        if (!props.includes(match[1])) {
          props.push(match[1]);
        }
      }
    }
    node.children?.forEach(traverse);
  }
  
  traverse(componentDef);
  return props;
}

// Example:
// Old: - John Doe | john@email.com | 555-1234
// Component has: %name, %email, %phone
// New: $UserCard: name: John Doe | email: john@email.com | phone: 555-1234
```

---

### 3. Migration Command

**CLI Tool**: `npm run migrate`

```bash
# Migrate a single file
npm run migrate -- src/examples/dashboard.ts

# Migrate all example files
npm run migrate -- src/examples/*.ts

# Dry run (preview changes)
npm run migrate -- src/examples/dashboard.ts --dry-run
```

**Implementation** (`scripts/migrate.ts`):

```typescript
import fs from 'fs';
import path from 'path';
import { migrateDSL } from '../src/utils/migrate-dsl';

const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const files = args.filter(arg => !arg.startsWith('--'));

files.forEach(filePath => {
  const content = fs.readFileSync(filePath, 'utf-8');
  const migrated = migrateDSL(content);
  
  if (isDryRun) {
    console.log(`[DRY RUN] ${filePath}:`);
    console.log(migrated);
  } else {
    fs.writeFileSync(filePath, migrated, 'utf-8');
    console.log(`✅ Migrated ${filePath}`);
  }
});
```

---

### 4. Editor Integration

**Monaco Warning Provider**:

```typescript
export function provideDiagnostics(model: monaco.editor.ITextModel): monaco.editor.IMarkerData[] {
  const text = model.getValue();
  const markers: monaco.editor.IMarkerData[] = [];
  
  // Detect old button syntax
  const oldButtonRegex = /(@{1,3})([_+\-=!]?)\[[^\]]+\]/g;
  let match;
  
  while ((match = oldButtonRegex.exec(text)) !== null) {
    markers.push({
      severity: monaco.MarkerSeverity.Warning,
      startLineNumber: model.getPositionAt(match.index).lineNumber,
      startColumn: model.getPositionAt(match.index).column,
      endLineNumber: model.getPositionAt(match.index + match[0].length).lineNumber,
      endColumn: model.getPositionAt(match.index + match[0].length).column,
      message: 'Deprecated button syntax. Use verbal syntax: @variant-size[Label]',
      code: 'deprecated-button-syntax',
    });
  }
  
  // Detect old layout modifiers
  const oldLayoutRegex = /(row|col|grid|card|container)-[^:]+:/g;
  
  while ((match = oldLayoutRegex.exec(text)) !== null) {
    markers.push({
      severity: monaco.MarkerSeverity.Warning,
      startLineNumber: model.getPositionAt(match.index).lineNumber,
      startColumn: model.getPositionAt(match.index).column,
      endLineNumber: model.getPositionAt(match.index + match[0].length).lineNumber,
      endColumn: model.getPositionAt(match.index + match[0].length).column,
      message: 'Deprecated layout syntax. Use canonical layouts (e.g., card:, grid-3:)',
      code: 'deprecated-layout-syntax',
    });
  }
  
  return markers;
}
```

**Quick Fix Provider**:

```typescript
export function provideCodeActions(
  model: monaco.editor.ITextModel,
  range: monaco.Range,
  context: monaco.languages.CodeActionContext
): monaco.languages.CodeAction[] {
  const actions: monaco.languages.CodeAction[] = [];
  
  context.markers.forEach(marker => {
    if (marker.code === 'deprecated-button-syntax') {
      const oldText = model.getValueInRange({
        startLineNumber: marker.startLineNumber,
        startColumn: marker.startColumn,
        endLineNumber: marker.endLineNumber,
        endColumn: marker.endColumn,
      });
      
      const newText = migrateButton(oldText);
      
      actions.push({
        title: `Migrate to new syntax: ${newText}`,
        kind: 'quickfix',
        edit: {
          edits: [{
            resource: model.uri,
            edit: {
              range: {
                startLineNumber: marker.startLineNumber,
                startColumn: marker.startColumn,
                endLineNumber: marker.endLineNumber,
                endColumn: marker.endColumn,
              },
              text: newText,
            },
          }],
        },
      });
    }
  });
  
  return actions;
}
```

---

## 📊 Migration Tracking

### Metrics to Monitor

1. **Usage of old syntax** (via warnings)
2. **Migration tool usage** (analytics)
3. **User feedback** (support tickets, GitHub issues)
4. **Parse error rates** (before/after migration)

### Dashboard

Create a migration dashboard showing:
- % of users on new syntax
- Most common migration patterns
- Error rates by syntax version

---

## 📋 Migration Checklist

### Phase 1: Dual Support
- [ ] Implement dual-syntax parser
- [ ] Add deprecation warnings to console
- [ ] Update all examples to new syntax
- [ ] Document both syntaxes (mark old as deprecated)

### Phase 2: Migration Tooling
- [ ] Implement `migrateDSL()` function
- [ ] Create migration CLI tool
- [ ] Add Monaco warning provider
- [ ] Add Monaco quick fix provider
- [ ] Test migration on all existing examples

### Phase 3: Communication
- [ ] Announce migration timeline
- [ ] Publish migration guide
- [ ] Create video tutorial
- [ ] Notify users in app (banner)

### Phase 4: Enforcement
- [ ] Switch to migration-only mode
- [ ] Provide clear error messages
- [ ] Monitor support requests
- [ ] Collect feedback

### Phase 5: Cleanup
- [ ] Remove old token definitions
- [ ] Simplify parser
- [ ] Update documentation (remove old syntax)
- [ ] Performance testing

---

## 🚨 Rollback Plan

If migration causes significant issues:

1. **Immediate**: Revert to Phase 1 (dual support)
2. **Communicate**: Announce extended timeline
3. **Investigate**: Identify migration failures
4. **Fix**: Update migration tool
5. **Resume**: Restart migration phases

---

## 📖 User-Facing Documentation

### Migration Guide

**Title**: "Migrating to Verbal Syntax"

**Sections**:
1. **Why We're Migrating**: Better readability, consistency
2. **Timeline**: Phases and deadlines
3. **Quick Start**: One-click migration in editor
4. **Manual Migration**: Reference for each element type
5. **FAQ**: Common questions and issues
6. **Support**: Where to get help

**Example**:

```markdown
## Quick Migration

### Using the Editor
1. Open your DSL file
2. Look for yellow warning underlines
3. Click the lightbulb icon
4. Select "Migrate to new syntax"

### Using the CLI
```bash
npm run migrate -- src/my-prototype.ts
```

### Common Migrations

**Buttons**:
- `@@+[Edit]` → `@outline-md[Edit]` or `@outline[Edit]`
- `@=[Delete]` → `@destructive-lg[Delete]`

**Layouts**:
- `row-center-p4:` → `row-center:`
- `card-p6:` → `card:`

**Inputs**:
- `___*:Password` → `___password: Password`
```

---

## ✅ Success Criteria

- [ ] **100%** of examples migrated to new syntax
- [ ] **<5%** error rate during migration
- [ ] **<10** support tickets related to migration
- [ ] **90%+** user satisfaction with migration process
- [ ] **No** functionality regression

---

**Conclusion**: This migration strategy balances backward compatibility with forward progress, providing users with clear guidance and automated tooling to ease the transition to verbal syntax.
