export const layoutModifiersExample = `screen LayoutModifiers:
  # Layout Modifiers Demo
  > This example demonstrates the new compact modifier syntax for layout elements.

  container-w75-center-center-p8:
    > Container with 75% width, centered content, padding 8
    
    row-h100-between-center-m4:
      > Row with 100% height, space-between justification, centered alignment, margin 4
      @[Button 1]
      @[Button 2]
      @[Button 3]
    
    grid-center-center-p4:
      > Grid with centered content and padding 4
      
      col-w50-start-stretch-p2-m1:
        > Column 50% width, flex-start justify, stretch align
        > Text content 1
        @[Action 1]
      
      col-w50-end-baseline-p2-m1:
        > Column 50% width, flex-end justify, baseline align
        > Text content 2
        @[Action 2]
    
    row-wfull-around-center-py4-mx2:
      > Row with full width, space-around, padding Y-axis 4, margin X-axis 2
      
      container-wauto-center-center-p2:
        > Auto-width container with centered content
        # Nested Content
        > This shows how modifiers work with nested layouts
        
      col-h100-evenly-stretch-px6:
        > Column with full height, space-evenly, padding X-axis 6
        > Item 1
        > Item 2
        > Item 3

  ---
  
  # Complex Layout Example
  > Advanced layout with multiple modifier combinations
  
  grid-wfull-center-start-p6-m4:
    row-h50-between-center-p4:
      col-w33-center-center-p2-m1:
        # Card 1
        > Content for card 1
        @[More Info]
        
      col-w33-center-center-p2-m1:
        # Card 2  
        > Content for card 2
        @[Learn More]
        
      col-w33-center-center-p2-m1:
        # Card 3
        > Content for card 3
        @[Discover]
    
    container-wfull-stretch-stretch-py8:
      > Full-width footer container with stretch alignment
      row-center-center-px4:
        #[Documentation]
        #[Support]
        #[Contact]
        
  ---
  
  # Directional Spacing Examples
  > Demonstrating all padding and margin directions
  
  row-wfull-center-center-p4:
    col-wauto-pl8-pr2-pt4-pb1:
      > Left padding 8, right 2, top 4, bottom 1
      @[Asymmetric Padding]
      
    col-wauto-ml4-mr2-mt1-mb3:
      > Margin left 4, right 2, top 1, bottom 3
      @[Directional Margins]
      
    col-wauto-px6-py3-ml2-mr2:
      > Combined: padding X/Y with margin left/right
      @[Mixed Spacing]
      
  container-center-center-pt8-pb4-pl6-pr6:
    # Fine-Grained Control
    > Top padding 8, bottom 4, left/right 6
    
    row-wfull-between-center-mt4-mb2:
      col-wauto-pr3-pl1:
        > Right padding 3, left 1
        @[Left Card]
        
      col-wauto-pl3-pr1:
        > Left padding 3, right 1  
        @[Right Card]
        
  ---
  
  # Grid Columns and Gap Examples
  > Demonstrating grid-cols-[1-12] and gap modifiers
  
  grid-cols3-gap4-p6:
    > 3-column grid with gap 4 and padding 6
    container-p4:
      # Card 1
      > First column content
    container-p4:
      # Card 2  
      > Second column content
    container-p4:
      # Card 3
      > Third column content
      
  grid-cols6-gap2-center-center-m4:
    > 6-column grid with small gap, centered
    col-p2:
      @[Item 1]
    col-p2:
      @[Item 2]
    col-p2:
      @[Item 3]
    col-p2:
      @[Item 4]
    col-p2:
      @[Item 5]
    col-p2:
      @[Item 6]
      
  container-w75-center-center-p8:
    # Responsive Grid Examples
    
    grid-cols12-gap1-py4:
      > 12-column grid with minimal gap
      col-p1: > 1
      col-p1: > 2
      col-p1: > 3
      col-p1: > 4
      col-p1: > 5
      col-p1: > 6
      col-p1: > 7
      col-p1: > 8
      col-p1: > 9
      col-p1: > 10
      col-p1: > 11
      col-p1: > 12
      
    grid-cols4-gap6-mt6:
      > 4-column grid with large gap
      container-center-center-p4:
        # Quarter 1
        > Large spaced content
      container-center-center-p4:
        # Quarter 2
        > Large spaced content
      container-center-center-p4:
        # Quarter 3
        > Large spaced content
      container-center-center-p4:
        # Quarter 4
        > Large spaced content
`;