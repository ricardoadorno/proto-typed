/**
 * Demo example showing how route metadata works
 * This example demonstrates screens, components, modals, and drawers
 */

export const metadataDemo = `screen Home:
  # Welcome to Route Metadata Demo
  > This demo shows how the route manager creates unified metadata
  @[Open Settings Modal](SettingsModal)
  @[Go to Profile](Profile)
  
  container:
    $UserCard

screen Profile:
  # User Profile
  > Profile information page
  @[Go Back](Home)
  $UserCard

component UserCard:
  card:
    # User Information
    > Name: John Doe
    > Email: john@example.com
    @[Edit Profile](Profile)

modal SettingsModal:
  # Settings
  > Application settings
  
  container:
    ___:Theme{Select theme}[Dark | Light]
    ___:Language{Select language}[English | Spanish | Portuguese]
    
    row:
      @[Save](close)
      @[Cancel](close)

  
    - [Home](Home)Home Page
    - [Profile](Profile)User Profile  
    - [Settings](SettingsModal)Application Settings
    - [About](About)About This App
    
screen About:
  # About
  > This is a demo application showing route metadata functionality
  @[Back to Home](Home)
`

export default metadataDemo
