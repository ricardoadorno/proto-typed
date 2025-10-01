/**
 * Custom Styles Demo - Showcasing theme system and custom CSS variables
 * This example demonstrates how to use the new styles: global token 
 * to configure themes and custom styling variables.
 */

export const customStylesDemo = `styles:
  --custom-accent: oklch(0.7 0.2 120);
  --custom-shadow: 0 10px 25px rgba(0,0,0,0.3);

screen StylesDemo:
  # Custom Styles Showcase
  > This example demonstrates the new theming system with shadcn-inspired CSS variables.
  
  container:
    card:
      ## Current
      > The slate theme provides a sophisticated blue-gray color palette that's easy on the eyes.
      @[Primary Button]
      @_[Ghost Button]
      @+[Outline Button]
      @-[Secondary Button]
      @=[Destructive Button]
    
    card:
      ## Theme Features
      > Automatic dark mode optimization
      > Semantic color variables (primary, secondary, muted, accent, destructive)
      > Consistent border radius and spacing
      > Accessible contrast ratios
    
    card:
      ## Available Themes
      > **neutral** - Clean grayscale palette
      > **stone** - Warm neutral tones
      > **zinc** - Cool metallic grays  
      > **gray** - Balanced blue-grays
      > **slate** - Rich blue-gray tones (current)
    
    card:
      ## Custom Variables
      > You can define custom CSS variables alongside theme selection:
      > \`--custom-accent: oklch(0.7 0.2 120);\`
      > \`--custom-shadow: 0 10px 25px rgba(0,0,0,0.3);\`

screen NeutralTheme:
  # Neutral Theme Example  
  > Clean and minimal grayscale design
  
  container:
    @[Switch to Neutral]
    > The neutral theme uses pure grayscale colors for a timeless, clean appearance.

screen StoneTheme:
  # Stone Theme Example
  > Warm and natural earth tones
  
  container:
    @[Switch to Stone]
    > The stone theme incorporates subtle warm undertones for a more organic feel.`;

export default customStylesDemo;