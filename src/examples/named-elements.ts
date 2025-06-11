/**
 * Example demonstrating the Named UI Elements (modal and drawer) 
 * functionality in Proto-type DSL
 */

const namedElementsExample = `
screen Home:
  # Named UI Elements Demo
  
  > This screen demonstrates how modals and drawers work.
  > They are hidden by default and activated when referenced by a button.
  
  @[Open Welcome Modal](WelcomeModal)
  @[Toggle Left Drawer](LeftDrawer)
  @[Open Settings Modal](SettingsModal)
  card:
    > Try clicking the buttons above to see the modals and drawer in action.
    > Note that these elements are defined below but are hidden until activated.

modal WelcomeModal:
  # Welcome to Proto-type!
  > This is a modal that was hidden until you clicked the button.
  > Modals are perfect for displaying important information without leaving the current screen.
  @[Close](Home)

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
    
    @[Save Settings]
  @[Cancel]

drawer LeftDrawer:
  - [Dashboard]{📊}(dashboard)
  - [Profile]{👤}(profile)
  - [Messages]{💬}(messages)
  - [Settings]{⚙️}(settings)
  - [Close Drawer]{❌}(LeftDrawer)
`;

export default namedElementsExample;
