/**
 * Example demonstrating the Named UI Elements (modal and drawer) 
 * functionality in proto-typed DSL, including auto-close behavior
 */

const namedElementsExample = `
screen Home:
  # Named UI Elements Demo
  
  > This screen demonstrates how modals and drawers work.
  > They are hidden by default and activated when referenced by a button.
  > **NEW**: Any button click will automatically close open modals/drawers!
  
  @[Open Welcome Modal](WelcomeModal)
  @[Toggle Left Drawer](LeftDrawer)
  @[Open Settings Modal](SettingsModal)
  
  card:
    ## Test Auto-Close Behavior
    > Try opening a modal or drawer, then click any of these buttons:
    > Notice how the open overlay closes automatically!
    
    @[Navigate to Another Screen](TestScreen)
    @[Regular Action Button]()
    @_[Ghost Button](action)
    @+[Outline Button](action)
    @=[Destructive Action](action)
    
  card:
    > Try clicking the buttons above to see the modals and drawer in action.
    > Note that these elements are defined below but are hidden until activated.

screen TestScreen:
  # Test Screen
  > You navigated here from the Home screen.
  > If a modal or drawer was open, it should have closed automatically.
  
  @[Back to Home](Home)
  @[Open Modal Again](WelcomeModal)

modal WelcomeModal:
  # Welcome to proto-typed!
  > This is a modal that was hidden until you clicked the button.
  > Modals are perfect for displaying important information without leaving the current screen.
  
  card:
    ## Try This
    > With this modal open, try clicking any button on the background.
    > The modal should close automatically!
    
  @[Close Modal](Home)
  @[Go to Test Screen](TestScreen)

modal SettingsModal:
  # Settings
  > Configure your preferences here.
  
  card:
    > Theme:
    ( ) Light
    (X) Dark
    ( ) System
    
    > Notifications:
    [X] Email
    [ ] Push
    [ ] SMS
    
  row:
    @[Save Settings](Home)
    @_[Cancel](Home)
    @[Apply & Test](TestScreen)

drawer LeftDrawer:
  - Dashboard | 📊 | TestScreen
  - Profile | 👤 | TestScreen
  - Messages | 💬 | TestScreen
  - Settings | ⚙️ | SettingsModal
  - Home | 🏠 | Home
  - Close Drawer | ❌ | LeftDrawer
`;

export default namedElementsExample;
