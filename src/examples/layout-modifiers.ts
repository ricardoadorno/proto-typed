export const layoutModifiersExample = `screen LayoutModifiers:
  # Canonical Layout Presets Demo
  > This example demonstrates the new canonical layout syntax.

  container-wide:
    > Wide container with max-width 7xl and auto margins
    
    row-between:
      > Row with space-between justification
      @[Button 1]
      @[Button 2]
      @[Button 3]
    
    grid-3:
      > Grid with 3 equal columns and default gap
      
      card:
        > Card with default padding
        > Text content 1
        @[Action 1]
      
      card-compact:
        > Card with minimal padding
        > Text content 2
        @[Action 2]
      
      card-feature:
        > Featured card with large padding
        > Text content 3
        @[Action 3]
    
    row-center:
      > Row with centered content
      
      container-narrow:
        > Narrow container for focused content
        # Nested Content
        > This shows how canonical layouts work with nesting
        
      stack:
        > Vertical stack with default gap
        > Item 1
        > Item 2
        > Item 3

  ---
  
  # Complex Layout Example
  > Advanced layout with canonical presets
  
  container-full:
    header:
      row-between:
        # App Header
        @[Menu]
    
    grid-2:
      card:
        ## Column 1
        stack-tight:
          > Tight vertical spacing
          > Line 1
          > Line 2
          > Line 3
      
      card:
        ## Column 2
        stack-loose:
          > Loose vertical spacing
          > Line 1
          > Line 2
          > Line 3
        @[More Info]
    
    grid-4:
      card:
        # Grid Item 1  
        > Auto-fit responsive grid
        @[Learn More]
        
      card:
        # Grid Item 2
        > Content adapts to screen size
        @[Discover]
        
      card:
        # Grid Item 3
        > Maintains minimum width
        @[Explore]
        
      card:
        # Grid Item 4
        > Flexible columns
        @[View More]
    
    container-wide:
      > Wide content footer area
      row-center:
        #[Documentation]
        #[Support]
        #[Contact]
        
  ---
  
  # All Canonical Layouts Reference
  > Complete catalog of available layouts
  
  container-narrow:
    # Container Layouts
    > container-narrow: max-w-2xl (articles, forms)
    > container-wide: max-w-7xl (dashboards)
    > container-full: w-full (full width)
    
    # Stack Layouts (Vertical)
    stack:
      > stack: flex-col gap-4 (default)
      > stack-tight: flex-col gap-2 (minimal)
      > stack-loose: flex-col gap-8 (spacious)
    
    # Row Layouts (Horizontal)
    > row-start: items-center gap-4 (left-aligned)
    > row-center: items-center justify-center gap-4
    > row-between: items-center justify-between
    > row-end: items-center justify-end gap-4 (right-aligned)
    
    # Grid Layouts
    > grid-2: 2 columns with gap-4
    > grid-3: 3 columns with gap-4
    > grid-4: 4 columns with gap-4
    > grid-auto: responsive auto-fit columns
    
    # Card Layouts
    card:
      > card: border p-6 (default)
    card-compact:
      > card-compact: border p-4 (minimal padding)
    card-feature:
      > card-feature: border-2 p-8 shadow-lg (prominent)
    
    # Special Layouts
    > header: sticky top-0 border-b px-4 py-3
    > sidebar: h-full border-r p-4
`;
