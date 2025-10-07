# 06 - Text & Primitives

## 🎯 Overview

Consolidate and stabilize **typography, links, images, and views** with minimal changes. These elements already have clear syntax and only need alignment with the new verbal philosophy.

---

## 📝 Typography (Unchanged)

Typography syntax remains **stable** as it's already intuitive:

### Headings

**Pattern**: `#` to `######` (levels 1-6)

```dsl
# Heading 1 (H1)
## Heading 2 (H2)
### Heading 3 (H3)
#### Heading 4 (H4)
##### Heading 5 (H5)
###### Heading 6 (H6)
```

**Renders to**: `<h1>` to `<h6>`

---

### Paragraph

**Pattern**: `>`

```dsl
> This is a paragraph with bottom margin.
> Another paragraph.
```

**Renders to**: `<p class="mb-4">`

---

### Text

**Pattern**: `>>`

```dsl
>> Text without bottom margin
>> Useful for tight spacing
```

**Renders to**: `<p class="mb-0">`

---

### Muted Text

**Pattern**: `>>>`

```dsl
>>> Subdued text for secondary information
>>> Last updated: 5 mins ago
```

**Renders to**: `<p style="color: var(--muted-foreground);">`

---

### Note

**Pattern**: `*>`

```dsl
*> Note: This is important information
*> Please read carefully
```

**Renders to**: `<p class="note">`

---

### Quote

**Pattern**: `">`

```dsl
"> To be or not to be
"> - Shakespeare
```

**Renders to**: `<blockquote>`

---

## 🔗 Links (Stable)

**Pattern**: `#[Label](destination)`

```dsl
#[External Link](https://example.com)
#[Email Us](mailto:support@example.com)
#[Navigate to Screen](ScreenName)
#[Go Back](-1)
```

**Renders to**: `<a href="...">`

**Navigation Types**:
- External URLs (http://, https://)
- Email links (mailto:)
- Screen navigation (ScreenName)
- History back (-1)

---

## 🖼️ Images (Stable)

**Pattern**: `![Alt Text](src)`

```dsl
![Logo](/logo.png)
![User Avatar](https://avatar.example.com/user.jpg)
![Product Image](product-photo.jpg)
```

**Renders to**: `<img src="..." alt="...">`

**Attributes**: Alt text is required for accessibility

---

## 🪟 Views (Stable)

Views remain **unchanged** with clear semantic names:

### Screen

**Pattern**: `screen <Name>:`

```dsl
screen Home:
  # Welcome
  > Main content here
```

**Purpose**: Full-page views with navigation

---

### Modal

**Pattern**: `modal <Name>:`

```dsl
modal ConfirmDialog:
  # Confirm Action
  > Are you sure?
  
  row-end:
    @outline[Cancel](close)
    @primary[Confirm](confirmAction)
```

**Purpose**: Overlay dialogs

---

### Drawer

**Pattern**: `drawer <Name>:`

```dsl
drawer MainMenu:
  # Navigation
  
  list:
    - #[Home](Home)
    - #[Settings](Settings)
    - #[Logout](logout)
```

**Purpose**: Side panels (usually for navigation)

---

## 🧩 Special Elements

### Separator

**Pattern**: `---`

```dsl
card:
  # Section 1
  > Content
  
  ---
  
  # Section 2
  > More content
```

**Renders to**: `<hr />`

---

### Navigator (Minor Update)

**Pattern**: `navigator:`

Bottom navigation bar for mobile apps.

**Current syntax** (to be reviewed):
```dsl
navigator:
  - icon text | destination
  - Home | HomeScreen
  - i-Settings Config | Settings
```

**Proposed verbal syntax**:
```dsl
navigator:
  - label: Home | icon: home | destination: Home
  - label: Profile | icon: user | destination: Profile
  - label: Settings | icon: settings | destination: Settings
```

**Rationale**: Explicit prop names align with component binding system

---

### Header (Stable)

**Pattern**: `header:` (canonical layout)

```dsl
header:
  row-between:
    # App Name
    @ghost{menu}(MainMenu)
```

**Purpose**: Sticky top bar (moved to canonical layouts)

---

### FAB (Floating Action Button)

**Pattern**: `fab{icon}(action)`

```dsl
fab{plus}(addItem)
fab{edit}(editMode)
```

**Renders to**: Floating button (bottom-right)

---

## 🛠️ Technical Implementation

### Navigator Update Only

If we adopt the verbal navigator syntax:

#### Token
```typescript
export const Navigator = createToken({ 
  name: 'Navigator', 
  pattern: /navigator:/ 
});

export const NavigatorItem = createToken({ 
  name: 'NavigatorItem', 
  pattern: /-\s*label:\s*([^|]+)\|\s*icon:\s*([^|]+)\|\s*destination:\s*(.+)/ 
});
```

#### AST Builder
```typescript
export function buildNavigatorItem(ctx: Context): AstNode {
  const match = ctx.NavigatorItem[0].image.match(
    /-\s*label:\s*([^|]+)\|\s*icon:\s*([^|]+)\|\s*destination:\s*(.+)/
  );
  
  if (match) {
    const [, label, icon, destination] = match;
    return {
      type: 'NavigatorItem',
      id: generateId('nav-item'),
      props: {
        label: label.trim(),
        icon: icon.trim(),
        destination: destination.trim()
      },
      children: []
    };
  }
  
  throw new Error('Invalid navigator item syntax');
}
```

#### Renderer
```typescript
export function renderNavigatorItem(node: AstNode): string {
  const { label, icon, destination } = node.props as any;
  const navAttrs = NavigationMediator.generateNavigationAttributes(destination);
  
  return `
    <button class="navigator-item" ${navAttrs}>
      <i data-lucide="${icon}" class="w-5 h-5"></i>
      <span class="text-xs mt-1">${label}</span>
    </button>
  `;
}
```

---

## 🔄 Migration Notes

### Typography, Links, Images, Views
**No changes required** - existing syntax is stable.

### Navigator
If updated to verbal syntax:

**Before**:
```dsl
navigator:
  - Home | HomeScreen
  - i-Settings Config | Settings
```

**After**:
```dsl
navigator:
  - label: Home | icon: home | destination: Home
  - label: Settings | icon: settings | destination: Settings
```

---

## 📋 Checklist

### Typography
- [ ] Verify heading levels (1-6) render correctly
- [ ] Test paragraph, text, muted text styles
- [ ] Validate note and quote rendering

### Links
- [ ] Test external URL navigation
- [ ] Test email links
- [ ] Test screen navigation
- [ ] Test history back (-1)

### Images
- [ ] Verify image rendering with alt text
- [ ] Test various image sources (local, remote)

### Views
- [ ] Test screen rendering and navigation
- [ ] Test modal overlay and close actions
- [ ] Test drawer slide-in/out

### Navigator (if updating)
- [ ] Define new navigator item token
- [ ] Update parser rule
- [ ] Build AST with label/icon/destination
- [ ] Render with explicit props
- [ ] Create migration tool for old syntax

### FAB
- [ ] Test FAB positioning (bottom-right)
- [ ] Verify icon rendering
- [ ] Test click actions

### Separator
- [ ] Verify `<hr />` rendering with theme styles

---

## 🎯 Decision Point: Navigator Syntax

**Option 1: Keep Current (Positional)**
```dsl
navigator:
  - Home{home}(Home)
  - Settings{settings}(Settings)
```

**Pros**: Concise, already works  
**Cons**: Inconsistent with new component binding system

---

**Option 2: Adopt Verbal (Explicit)**
```dsl
navigator:
  - label: Home | icon: home | destination: Home
  - label: Settings | icon: settings | destination: Settings
```

**Pros**: Consistent with component props, self-documenting  
**Cons**: More verbose, requires migration

---

**Recommendation**: **Option 2** for consistency across the language.

---

**Next**: See [07 - Grammar & Connectors](./07-grammar-connectors.md) for global syntax rules.