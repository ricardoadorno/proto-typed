import { ExampleCategory } from '../types'

/**
 * Mobile-specific component examples including headers, navigation, drawers, and FABs
 */
export const mobileExamples: ExampleCategory = {
  title: 'Mobile Components',
  examples: [
    {
      name: 'App Header',
      code: `screen HeaderExample:
  header:
    # My Application
    @_[Menu]{☰}(MyDrawer)
    @_[Profile]{👤}(profile-screen)
    
  # Main Content
  > Your app content goes here
  > Header will remain fixed at the top`,
      description:
        'Create a fixed header with title and action buttons for mobile apps',
    },
    {
      name: 'Bottom Navigation',
      code: `screen NavigatorExample:
  # Main Content Area
  > App content and main interface
  
  navigator:
    - [Home]{🏠}(home-screen)
    - [Search]{🔍}(search-screen)
    - [Messages]{💬}(messages-screen)
    - [Profile]{👤}(profile-screen)
    - [More]{⋯}(more-screen)`,
      description:
        'Create a fixed bottom navigation bar with icons and labels for mobile navigation',
    },
    {
      name: 'Slide-out Drawer',
      code: `screen DrawerExample:
  # App Content
  > Main application interface
  > Click the menu button to open drawer
  
  drawer MyDrawer:
    - [Dashboard]{📊}(dashboard-screen)
    - [Projects]{📁}(projects-screen)
    - [Messages]{💬}(messages-screen)
    - [Calendar]{📅}(calendar-screen)
    - [Settings]{⚙️}(settings-screen)
    - [Help]{❓}(help-screen)
    - [Logout]{🚪}(logout)`,
      description:
        'Create a slide-out drawer menu with navigation items and icons',
    },
    {
      name: 'Floating Action Button',
      code: `screen FABExample:
  # Main Interface
  > Your main application content
  > The FAB will float over the content
  
  card:
    ## Recent Items
    list:
      - Document 1
      - Document 2
      - Document 3
      
  fab {➕}
  
  > FAB provides primary action access`,
      description:
        'Add a floating action button for primary actions that overlay the content',
    },
    {
      name: 'Complete Mobile App',
      code: `screen MobileAppExample:
  header:
    # TaskMaster
    @_[Menu]{☰}(AppDrawer)
    @_[Notifications]{🔔}(notifications)
    
  card:
    ## Today's Tasks
    list:
      - [Complete](task1)Morning standup{Team meeting}@=[Done](mark-done)
      - [Review](task2)Code review{Pull request #123}@+[Open](open-pr)
      - [Call](task3)Client meeting{Project discussion}@![Urgent](urgent)
      
  navigator:
    - [Tasks]{📋}(tasks)
    - [Calendar]{📅}(calendar)
    - [Messages]{💬}(messages)
    - [Profile]{👤}(profile)
    
  drawer AppDrawer:
    - [Dashboard]{📊}(dashboard)
    - [Projects]{📁}(projects)
    - [Team]{👥}(team)
    - [Reports]{📈}(reports)
    - [Settings]{⚙️}(settings)
    - [Help]{❓}(help)
    
  fab {➕}`,
      description:
        'A complete mobile app layout with header, content, navigation, drawer, and FAB',
    },
    {
      name: 'Modal Dialog',
      code: `screen ModalExample:
  # Main Screen
  > Click button to open modal
  @[Open Settings](SettingsModal)
  
  modal SettingsModal:
    ## App Settings
    [X] Enable notifications
    [ ] Auto-sync data
    [ ] Dark mode
    
    ___:Username{Current username}
    ___:Email{user@example.com}
    
    @[Save Changes](save)
    @_[Cancel](close)`,
      description:
        'Create modal dialogs that can be opened from buttons and closed with actions',
    },
  ],
}

export default mobileExamples
