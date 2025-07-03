/**
 * Example demonstrating Button Variants functionality in proto-typed DSL
 */

const buttonVariantsExample = `
screen ButtonVariants:
  # Button Variants Demo
  
  > This screen demonstrates the different button variants available in proto-typed.
  > Each variant has its own symbol and visual style.
  
  # Default Button
  > Standard blue button (no variant symbol):
  @[Default Button]
  
  # Ghost Button
  > Transparent background, appears on hover:
  @_[Ghost Button]
  
  # Outline Button  
  > Transparent with border (@+):
  @+[Outline Button]
  
  # Secondary Button
  > Gray background (@-):
  @-[Secondary Button]
  
  # Destructive Button
  > Red background for dangerous actions (@=):
  @=[Delete Item]
  
  # Warning Button
  > Yellow background for caution (@!):
  @![Warning Action]
  
  card:
    # Button Combinations
    > You can combine variants with icons and actions:
    
    @_[Save]{save}(SaveScreen)
    @+[Cancel]{x}
    @=[Delete]{trash}
    @![Caution]{alert-triangle}
    
    # Icon-only Buttons
    > Using Lucide icon names as button text:
    @[Home]
    @_[Settings]
    @+[User]
    @-[Heart]
    @=[Trash]
    @![AlertCircle]

`;

export { buttonVariantsExample };
