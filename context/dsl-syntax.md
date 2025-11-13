# Proto-Typed: DSL Syntax Reference

## Syntax Fundamentals

Proto-Typed uses an **indentation-based syntax** similar to Python or YAML. Nesting is determined by indentation level (2 spaces), and blocks are marked with a colon (`:`).

### Basic Structure

```
element:
  nested-element:
    deeply-nested-element:
```

### Key Syntax Rules

1. **Indentation**: 2 spaces per level (consistent throughout the file)
2. **Block markers**: Colon (`:`) indicates a block with children
3. **Newlines**: Significant whitespace—each element on its own line
4. **No closing tags**: End of block determined by outdentation
5. **Case-sensitive**: `screen` ≠ `Screen` (use lowercase keywords)

---

## Views (Top-Level Containers)

Views are the primary organizational units in Proto-Typed. Each prototype contains one or more views.

### Screen

**Purpose**: Full-page view with client-side routing

**Syntax**:
```
screen ScreenName:
  [children...]
```

**Properties**:
- `ScreenName`: Identifier for navigation (PascalCase recommended)

**Behavior**:
- Only one screen visible at a time
- Client-side navigation via `navigateTo(ScreenName)`
- Browser history support (back/forward)
- URL hash updates (`#ScreenName`)

**Example**:
```
screen Home:
  container:
    ## Welcome Home
    @[Go to Settings](Settings)

screen Settings:
  container:
    ## Settings
    @[Back to Home](Home)
```

---

### Modal

**Purpose**: Overlay dialog that can be toggled

**Syntax**:
```
modal ModalName:
  [children...]
```

**Properties**:
- `ModalName`: Identifier for toggling

**Behavior**:
- Hidden by default
- Toggles visibility via `toggleModal(ModalName)`
- Overlays current screen
- No routing—stays on same screen

**Example**:
```
modal ConfirmDelete:
  card:
    ## Confirm Deletion
    > Are you sure you want to delete this item?

    row-between:
      @secondary[Cancel](ConfirmDelete)
      @destructive[Delete](deleteAction)

screen Items:
  container:
    ## Item List
    @destructive[Delete Item](ConfirmDelete)
```

---

### Drawer

**Purpose**: Side panel or bottom sheet (mobile)

**Syntax**:
```
drawer DrawerName:
  [children...]
```

**Properties**:
- `DrawerName`: Identifier for toggling

**Behavior**:
- Hidden by default
- Toggles visibility via `toggleDrawer(DrawerName)`
- Typically slides from bottom on mobile, side on desktop
- No routing

**Example**:
```
drawer Filters:
  card:
    ## Filter Options
    # Checkbox filters...

screen Products:
  container:
    @[Show Filters](Filters)
    # Product list...
```

---

### Component

**Purpose**: Reusable UI block with props

**Syntax**:
```
component ComponentName:
  [children with %prop interpolation...]
```

**Properties**:
- `ComponentName`: Identifier for instantiation

**Behavior**:
- Stored as a template
- Instantiated with `$ComponentName` in lists
- Props interpolated with `%propName` syntax

**Example**:
```
component UserCard:
  card:
    ## %name
    > Email: %email
    > Role: %role

screen Team:
  list $UserCard:
    - Alice | alice@example.com | Designer
    - Bob | bob@example.com | Developer
    - Charlie | charlie@example.com | Manager
```

**Props Extraction**:
- List items split by pipe (`|`)
- First prop: `%name` → "Alice"
- Second prop: `%email` → "alice@example.com"
- Third prop: `%role` → "Designer"

---

## Layouts (Canonical Presets)

Layouts are **fixed presets** with predefined Tailwind classes. Each layout maps to a specific use case.

### Container Layouts

```
container:
  [children...]
```
- **Purpose**: Standard page container
- **Classes**: `max-w-7xl mx-auto px-4`
- **Use**: Main content wrapper

```
container-narrow:
  [children...]
```
- **Purpose**: Narrow content column
- **Classes**: `max-w-2xl mx-auto px-4`
- **Use**: Reading content, forms

---

### Stack Layouts (Vertical)

```
stack:
  [children...]
```
- **Purpose**: Vertical spacing (medium gap)
- **Classes**: `flex flex-col gap-4`
- **Use**: General vertical layouts

```
stack-tight:
  [children...]
```
- **Purpose**: Vertical spacing (small gap)
- **Classes**: `flex flex-col gap-2`
- **Use**: Compact lists, grouped elements

---

### Row Layouts (Horizontal)

```
row-center:
  [children...]
```
- **Purpose**: Centered horizontal row
- **Classes**: `flex items-center justify-center gap-4`
- **Use**: Centering content

```
row-between:
  [children...]
```
- **Purpose**: Space-between horizontal row
- **Classes**: `flex items-center justify-between gap-4`
- **Use**: Headers, action rows

```
row-start:
  [children...]
```
- **Purpose**: Left-aligned horizontal row
- **Classes**: `flex items-center justify-start gap-4`
- **Use**: Left-aligned groups

---

### Grid Layouts

```
grid-2:
  [children...]
```
- **Purpose**: 2-column responsive grid
- **Classes**: `grid grid-cols-1 md:grid-cols-2 gap-4`
- **Use**: Card layouts, feature lists

```
grid-3:
  [children...]
```
- **Purpose**: 3-column responsive grid
- **Classes**: `grid grid-cols-1 md:grid-cols-3 gap-4`
- **Use**: Wide layouts, dashboards

```
grid-4:
  [children...]
```
- **Purpose**: 4-column responsive grid
- **Classes**: `grid grid-cols-2 md:grid-cols-4 gap-4`
- **Use**: Icon grids, galleries

---

### Special Layouts

```
card:
  [children...]
```
- **Purpose**: Card container with padding and border
- **Classes**: `rounded-lg border p-6`
- **Styles**: `background-color: var(--card); border-color: var(--border);`
- **Use**: Content blocks, panels

```
header:
  [children...]
```
- **Purpose**: Page header section
- **Classes**: `border-b py-4 px-4`
- **Styles**: `border-color: var(--border);`
- **Use**: Top of screens

```
list:
  [children...]
```
- **Purpose**: List container
- **Classes**: `flex flex-col divide-y`
- **Styles**: `border-color: var(--border);`
- **Use**: Item lists, menus

---

### Navigation Layouts

```
navigator:
  [children...]
```
- **Purpose**: Bottom navigation bar (mobile pattern)
- **Classes**: `fixed bottom-0 left-0 right-0 border-t flex items-center justify-around py-2`
- **Styles**: `background-color: var(--background); border-color: var(--border);`
- **Use**: App navigation

**Navigator Syntax**:
```
navigator:
  - [Home](Home) | home
  - [Profile](Profile) | user
  - [Settings](Settings) | settings
```
- Format: `[Label](Target) | icon`
- Icons use Lucide icon names

```
fab:
  [children...]
```
- **Purpose**: Floating action button
- **Classes**: `fixed bottom-20 right-4 rounded-full shadow-lg`
- **Use**: Primary actions

---

## Primitives (Content Elements)

### Headings

**Syntax**:
```
## Heading Level 2
### Heading Level 3
#### Heading Level 4
```

**Levels**:
- `#`: h1 (rarely used—use in headers)
- `##`: h2 (page titles)
- `###`: h3 (section titles)
- `####`: h4 (subsection titles)

**Rendering**:
```html
<h2 class="text-2xl font-bold" style="color: var(--foreground);">Heading Level 2</h2>
```

---

### Text

**Syntax**:
```
> Regular paragraph text
>> Muted text (secondary color)
>>> Small text
```

**Variants**:
- `>`: Regular text
- `>>`: Muted text (lighter color)
- `>>>`: Small text (reduced size)

**Rendering**:
```html
<p class="text-base" style="color: var(--foreground);">Regular paragraph text</p>
<p class="text-sm" style="color: var(--muted-foreground);">Muted text</p>
<p class="text-xs" style="color: var(--muted-foreground);">Small text</p>
```

---

### Images

**Syntax**:
```
![Alt text](https://example.com/image.jpg)
```

**Properties**:
- `Alt text`: Accessibility description
- URL: Image source

**Rendering**:
```html
<img src="https://example.com/image.jpg" alt="Alt text" class="w-full h-auto rounded-md" />
```

---

### Links

**Syntax**:
```
#[Link Text](https://example.com)
```

**Note**: External links only—internal navigation uses buttons

**Rendering**:
```html
<a href="https://example.com" target="_blank" rel="noopener noreferrer" class="underline" style="color: var(--primary);">Link Text</a>
```

---

### Buttons

**Syntax**:
```
@[Button Text](target)
@variant-size[Button Text](target)
```

**Variants**:
- `primary` (default): Main actions
- `secondary`: Secondary actions
- `outline`: Less emphasis
- `ghost`: Minimal style
- `destructive`: Dangerous actions
- `link`: Button styled as link
- `success`: Positive actions
- `warning`: Caution actions

**Sizes**:
- `xs`: Extra small
- `sm`: Small
- `md` (default): Medium
- `lg`: Large

**Targets**:
- `ScreenName`: Navigate to screen
- `ModalName`: Toggle modal
- `DrawerName`: Toggle drawer
- `https://...`: External link
- `functionName()`: JavaScript action
- `-1`: Browser back

**Examples**:
```
# Default (primary-md)
@[Click Me](Home)

# Secondary large
@secondary-lg[Submit Form](submitForm())

# Destructive action
@destructive[Delete](ConfirmDelete)

# Ghost small
@ghost-sm[Cancel](-1)

# Success
@success[Save](saveData())
```

**Rendering**:
```html
<button
  class="inline-flex items-center px-4 py-2 rounded-md font-medium transition-colors"
  style="background-color: var(--primary); color: var(--primary-foreground);"
  onclick="navigateTo('Home')"
>
  Click Me
</button>
```

---

## Inputs (Form Elements)

### Text Input

**Syntax**:
```
input[Label]:
input-placeholder[Label | Placeholder text]:
```

**Variants**:
- `input`: Standard text input
- `input-placeholder`: With placeholder
- `input-email`: Email type
- `input-password`: Password type
- `input-number`: Number type
- `input-date`: Date picker
- `input-search`: Search field

**Example**:
```
input-email[Email Address | Enter your email]:
input-password[Password | ********]:
input-search[Search | Search items...]:
```

**Rendering**:
```html
<div class="flex flex-col gap-2">
  <label class="text-sm font-medium" style="color: var(--foreground);">Email Address</label>
  <input
    type="email"
    placeholder="Enter your email"
    class="px-3 py-2 rounded-md border"
    style="background-color: var(--input); border-color: var(--border); color: var(--foreground);"
  />
</div>
```

---

### Textarea

**Syntax**:
```
textarea[Label | Placeholder]:
```

**Example**:
```
textarea[Comments | Enter your feedback here...]:
```

**Rendering**:
```html
<div class="flex flex-col gap-2">
  <label class="text-sm font-medium" style="color: var(--foreground);">Comments</label>
  <textarea
    placeholder="Enter your feedback here..."
    rows="4"
    class="px-3 py-2 rounded-md border"
    style="background-color: var(--input); border-color: var(--border); color: var(--foreground);"
  ></textarea>
</div>
```

---

### Checkbox

**Syntax**:
```
checkbox[Label]:
```

**Example**:
```
checkbox[I agree to the terms and conditions]:
checkbox[Send me email updates]:
```

**Rendering**:
```html
<label class="flex items-center gap-2 cursor-pointer">
  <input type="checkbox" class="rounded" style="accent-color: var(--primary);" />
  <span class="text-sm" style="color: var(--foreground);">I agree to the terms and conditions</span>
</label>
```

---

### Radio Buttons

**Syntax**:
```
radio[Label | option1 | option2 | option3]:
```

**Example**:
```
radio[Select a plan | Free | Pro | Enterprise]:
```

**Rendering**:
```html
<div class="flex flex-col gap-2">
  <label class="text-sm font-medium" style="color: var(--foreground);">Select a plan</label>
  <div class="flex flex-col gap-2">
    <label class="flex items-center gap-2 cursor-pointer">
      <input type="radio" name="radio-xyz" value="Free" style="accent-color: var(--primary);" />
      <span class="text-sm" style="color: var(--foreground);">Free</span>
    </label>
    <label class="flex items-center gap-2 cursor-pointer">
      <input type="radio" name="radio-xyz" value="Pro" style="accent-color: var(--primary);" />
      <span class="text-sm" style="color: var(--foreground);">Pro</span>
    </label>
    <label class="flex items-center gap-2 cursor-pointer">
      <input type="radio" name="radio-xyz" value="Enterprise" style="accent-color: var(--primary);" />
      <span class="text-sm" style="color: var(--foreground);">Enterprise</span>
    </label>
  </div>
</div>
```

---

### Select Dropdown

**Syntax**:
```
select[Label | option1 | option2 | option3]:
```

**Example**:
```
select[Choose a country | USA | Canada | Mexico]:
```

**Rendering**:
```html
<div class="flex flex-col gap-2">
  <label class="text-sm font-medium" style="color: var(--foreground);">Choose a country</label>
  <select
    class="px-3 py-2 rounded-md border"
    style="background-color: var(--input); border-color: var(--border); color: var(--foreground);"
  >
    <option value="USA">USA</option>
    <option value="Canada">Canada</option>
    <option value="Mexico">Mexico</option>
  </select>
</div>
```

---

## Component System

### Component Definition

**Syntax**:
```
component ComponentName:
  [children with %prop placeholders]
```

**Props**:
- Use `%propName` syntax for interpolation
- Props are positional (order matters)
- Extracted from pipe-separated list items

**Example**:
```
component ProductCard:
  card:
    ![Product Image](%imageUrl)
    ## %name
    > Price: %price
    >> %description
    @[View Details](%detailsLink)
```

---

### Component Instantiation

**Syntax**:
```
list $ComponentName:
  - prop1 | prop2 | prop3
  - prop1 | prop2 | prop3
```

**Example**:
```
screen Products:
  container:
    list $ProductCard:
      - Laptop | $999 | High-performance laptop | https://placehold.co/300x200 | /products/laptop
      - Phone | $699 | Latest smartphone | https://placehold.co/300x200 | /products/phone
      - Tablet | $499 | Portable tablet | https://placehold.co/300x200 | /products/tablet
```

**Props Mapping**:
- `%name` → "Laptop"
- `%price` → "$999"
- `%description` → "High-performance laptop"
- `%imageUrl` → "https://placehold.co/300x200"
- `%detailsLink` → "/products/laptop"

---

## Head Elements (Metadata)

### Title

**Syntax**:
```
title: Page Title
```

**Example**:
```
title: My Prototype App
```

**Rendering**:
```html
<title>My Prototype App</title>
```

---

### Favicon

**Syntax**:
```
favicon: https://example.com/favicon.ico
```

**Example**:
```
favicon: https://example.com/icon.png
```

**Rendering**:
```html
<link rel="icon" href="https://example.com/icon.png" />
```

---

### Meta Tags

**Syntax**:
```
meta: property | content
```

**Example**:
```
meta: description | A rapid prototyping tool
meta: viewport | width=device-width, initial-scale=1
```

**Rendering**:
```html
<meta name="description" content="A rapid prototyping tool" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

---

## Theming & Styling

### Theme Selection

**Syntax**:
```
theme: themeName
```

**Available Themes**:
- `neutral`, `stone`, `slate`, `gray`, `zinc`
- `red`, `rose`, `orange`, `green`, `blue`, `yellow`, `violet`

**Example**:
```
theme: blue

screen Home:
  container:
    ## Themed Prototype
```

---

### Custom Styles (CSS Variables)

**Syntax**:
```
styles:
  --variable-name: value
  --another-variable: value
```

**Example**:
```
styles:
  --primary: oklch(0.7 0.2 280)
  --primary-foreground: oklch(0.95 0.02 280)
  --radius: 0.5rem

screen Home:
  container:
    ## Custom Theme
```

**Available Variables**:
- `--primary`, `--primary-foreground`
- `--secondary`, `--secondary-foreground`
- `--muted`, `--muted-foreground`
- `--destructive`, `--destructive-foreground`
- `--accent`, `--accent-foreground`
- `--background`, `--foreground`
- `--card`, `--card-foreground`
- `--popover`, `--popover-foreground`
- `--border`, `--input`, `--ring`
- `--radius`

---

## Navigation Targets

### Internal Navigation (Screens)

**Syntax**: `ScreenName`

**Example**:
```
@[Go to Settings](Settings)
```

**JavaScript**:
```javascript
navigateTo('Settings')
```

---

### Toggle Modal/Drawer

**Syntax**: `ModalName` or `DrawerName`

**Example**:
```
@[Open Filters](Filters)  // Drawer
@[Confirm](ConfirmModal)  // Modal
```

**JavaScript**:
```javascript
toggleModal('ConfirmModal')
toggleDrawer('Filters')
```

---

### External Links

**Syntax**: URLs with `://`

**Example**:
```
@[Visit Website](https://example.com)
#[External Link](https://example.com)
```

**JavaScript**:
```javascript
window.open('https://example.com', '_blank')
```

---

### JavaScript Actions

**Syntax**: Function calls containing `()` or `.`

**Example**:
```
@[Save](saveData())
@[Log Out](auth.logout())
```

**JavaScript**:
```javascript
onclick="saveData()"
onclick="auth.logout()"
```

---

### History Navigation

**Syntax**: Negative numbers (e.g., `-1`)

**Example**:
```
@[Back](-1)
@[Back 2 pages](-2)
```

**JavaScript**:
```javascript
history.go(-1)
```

---

## Complete Example

Here's a full prototype demonstrating multiple features:

```
title: Task Manager
theme: blue

component TaskCard:
  card:
    row-between:
      stack-tight:
        ## %title
        >> %description
      @ghost[Edit](%editAction)

screen Home:
  header:
    row-between:
      ## Tasks
      @[Add Task](NewTask)

  container:
    list $TaskCard:
      - Finish report | Complete the quarterly report | editTask(1)
      - Review PRs | Review pending pull requests | editTask(2)
      - Update docs | Update API documentation | editTask(3)

  navigator:
    - [Tasks](Home) | check-square
    - [Calendar](Calendar) | calendar
    - [Settings](Settings) | settings

screen NewTask:
  container:
    ## New Task

    stack:
      input[Title | Enter task title]:
      textarea[Description | Enter task description...]:

      row-between:
        @ghost[Cancel](-1)
        @primary[Create Task](createTask())

modal ConfirmDelete:
  card:
    ## Delete Task
    > Are you sure you want to delete this task?

    row-between:
      @secondary[Cancel](ConfirmDelete)
      @destructive[Delete](deleteTask())

drawer Filters:
  card:
    ## Filter Tasks

    stack:
      checkbox[Show completed]:
      checkbox[Show archived]:
      select[Priority | All | High | Medium | Low]:

      @primary[Apply Filters](applyFilters())
```

---

## Syntax Summary

| Category | Syntax Example | Purpose |
|----------|---------------|---------|
| **Views** | `screen Home:` | Full-page view |
| | `modal ConfirmDelete:` | Overlay dialog |
| | `drawer Filters:` | Side panel |
| | `component Card:` | Reusable template |
| **Layouts** | `container:` | Page container |
| | `stack:` | Vertical stack |
| | `row-center:` | Horizontal row |
| | `grid-2:` | 2-column grid |
| | `card:` | Card container |
| **Primitives** | `## Heading` | Heading level 2 |
| | `> Text` | Regular text |
| | `![Alt](url)` | Image |
| | `#[Link](url)` | External link |
| **Buttons** | `@[Text](target)` | Primary button |
| | `@secondary-lg[Text](target)` | Secondary large |
| **Inputs** | `input[Label]:` | Text input |
| | `textarea[Label \| Placeholder]:` | Textarea |
| | `checkbox[Label]:` | Checkbox |
| | `radio[Label \| opt1 \| opt2]:` | Radio buttons |
| | `select[Label \| opt1 \| opt2]:` | Dropdown |
| **Head** | `title: Page Title` | Page title |
| | `theme: blue` | Theme selection |
| | `styles:` | Custom CSS variables |
| **Components** | `%propName` | Prop interpolation |
| | `list $Component:` | Component instantiation |

---

## Parsing Notes for LLMs

When parsing Proto-Typed DSL:

1. **Indentation is significant**: Use `Indent`/`Outdent` tokens
2. **Colons mark blocks**: Element with `:` expects children
3. **Button syntax**: `@variant-size[text](target)` with optional variant/size
4. **Pipe separator**: Used for props in components and list items
5. **Percent syntax**: `%propName` for prop interpolation
6. **No StringLiteral token**: Text is captured by specific tokens (e.g., `Heading`, `Text`)
7. **Navigation targets**: Analyzed by `navigation-mediator` to determine type
8. **Canonical layouts**: Fixed presets, no dynamic parsing

---

This syntax is designed to be:
- **Minimal**: Few special characters
- **Readable**: Natural language-like
- **Consistent**: Uniform patterns across elements
- **Expressive**: Rich UI with concise syntax
