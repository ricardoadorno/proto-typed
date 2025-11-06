/**
 * Layouts Domain - DSL Fixtures
 *
 * Collection of DSL examples for layout elements testing.
 * Each fixture includes the DSL string for parsing and rendering.
 */

export const layoutsFixtures = {
  containers: {
    basic: `screen Test:
  container:
    # Content`,

    narrow: `screen Test:
  container-narrow:
    > Narrow content for reading`,

    wide: `screen Test:
  container-wide:
    > Wide content for dashboards`,

    full: `screen Test:
  container-full:
    > Full width content`,

    nested: `screen Test:
  container:
    # Main Container
    container-narrow:
      > Nested narrow section`,
  },

  stacks: {
    basic: `screen Test:
  stack:
    > Item 1
    > Item 2
    > Item 3`,

    tight: `screen Test:
  stack-tight:
    > Compact item 1
    > Compact item 2`,

    loose: `screen Test:
  stack-loose:
    > Spaced item 1
    > Spaced item 2`,

    none: `screen Test:
  stack-none:
    > No gap item 1
    > No gap item 2`,

    nested: `screen Test:
  stack:
    # Section 1
    stack-tight:
      > Detail A
      > Detail B
    # Section 2
    stack-tight:
      > Detail C
      > Detail D`,
  },

  rows: {
    basic: `screen Test:
  row:
    @[Button 1](action1)
    @[Button 2](action2)`,

    center: `screen Test:
  row-center:
    @[Centered](action)`,

    between: `screen Test:
  row-between:
    @[Left](left)
    @[Right](right)`,

    start: `screen Test:
  row-start:
    > Start aligned`,

    end: `screen Test:
  row-end:
    > End aligned`,

    complex: `screen Test:
  row-between:
    stack-tight:
      # Title
      >> Subtitle
    row:
      @secondary[Cancel](cancel)
      @[Confirm](confirm)`,
  },

  grids: {
    basic: `screen Test:
  grid:
    > Item 1
    > Item 2`,

    twoColumn: `screen Test:
  grid-2:
    card:
      # Card 1
    card:
      # Card 2`,

    threeColumn: `screen Test:
  grid-3:
    > Col 1
    > Col 2
    > Col 3`,

    fourColumn: `screen Test:
  grid-4:
    > Col 1
    > Col 2
    > Col 3
    > Col 4`,

    responsive: `screen Test:
  grid-responsive:
    card:
      # Auto 1
    card:
      # Auto 2
    card:
      # Auto 3`,

    nested: `screen Test:
  grid-2:
    card:
      stack:
        # Left Card
        > Content
    card:
      stack:
        # Right Card
        > Content`,
  },

  cards: {
    basic: `screen Test:
  card:
    # Card Title
    > Card content`,

    compact: `screen Test:
  card-compact:
    > Compact card`,

    feature: `screen Test:
  card-feature:
    # Feature Card
    > Highlighted content`,

    multiple: `screen Test:
  stack:
    card:
      # Card 1
      > Content 1
    card:
      # Card 2
      > Content 2
    card-feature:
      # Featured
      > Special content`,
  },

  special: {
    header: `screen Test:
  header:
    # App Title
    > Subtitle`,

    sidebar: `screen Test:
  sidebar:
    @[Nav Item 1](page1)
    @[Nav Item 2](page2)`,

    separator: `screen Test:
  > Before
  ---
  > After`,

    fab: `screen Test:
  fab:`,

    fabWithIcon: `screen Test:
  fab:`,

    navigator: `screen Test:
  navigator:
    - home|Home
    - search|Search
    - profile|Profile`,
  },

  lists: {
    simple: `screen Test:
  - First item
  - Second item
  - Third item`,

    standalone: `screen Test:
  - Single item
  - Another item`,

    nested: `screen Test:
  - Item with content
  - Item with button`,
  },

  layers: {
    relative: `screen Test:
  layer-relative:
    > Content`,

    absolute: `screen Test:
  layer-absolute:
    > Overlay content`,

    fixed: `screen Test:
  layer-fixed:
    > Fixed position`,

    sticky: `screen Test:
  layer-sticky:
    > Sticky header`,
  },

  scroll: {
    auto: `screen Test:
  scroll-auto:
    > Scrollable content`,

    horizontal: `screen Test:
  scroll-x:
    > Horizontal scroll`,

    vertical: `screen Test:
  scroll-y:
    > Vertical scroll`,
  },
}
