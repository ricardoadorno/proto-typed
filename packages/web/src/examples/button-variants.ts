/**
 * Example demonstrating Button Variants functionality in proto-typed DSL
 */

const buttonVariantsExample = `
screen ButtonVariants:
  # Button Variants Demo
  
  > This screen demonstrates the different button variants available in proto-typed.
  > Each variant has its own verbal name and visual style.
  
  # Primary Button (Default)
  > Standard button with primary color:
  @primary[Primary Button]
  @primary-lg[Large Primary]
  @primary-md[Medium Primary]
  @primary-sm[Small Primary]
  
  # Secondary Button
  > Gray background for less prominent actions:
  @secondary[Secondary Button]
  @secondary-lg[Large Secondary]
  
  # Outline Button  
  > Transparent with border:
  @outline[Outline Button]
  @outline-md[Medium Outline]
  
  # Ghost Button
  > Transparent background, subtle hover:
  @ghost[Ghost Button]
  @ghost-sm[Small Ghost]
  
  # Destructive Button
  > Red background for dangerous actions:
  @destructive[Delete Item]
  @destructive-lg[Large Delete]
  
  # Warning Button
  > Orange/yellow background for caution:
  @warning[Warning Action]
  @warning-md[Proceed Carefully]
  
  # Link Button
  > Styled like a hyperlink:
  @link[Link Style]
  @link-sm[Small Link]
  
  # Success Button
  > Green background for positive actions:
  @success[Confirm]
  @success-lg[Approve Request]
  
  card:
    # Button Combinations
    > Buttons with actions and different sizes:
    
    @primary[Save](SaveScreen)
    @outline[Cancel](-1)
    @destructive-sm[Delete](confirmDelete)
    @warning[Caution](warningScreen)
    @success-lg[Approve](approveAction)
    @ghost[Close]
    @link[Learn More](docs)

`

export { buttonVariantsExample }
