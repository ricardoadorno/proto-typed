const mobileAppExample = `
drawer MyDrawer:
  > ## App Menu
  
  #[Dashboard](MobileApp)
  > 📊 View dashboard
  
  #[Messages](MessagesScreen)
  > 💬 Check messages
  
  #[Calendar](SettingsScreen)
  > 📅 View calendar
  
  #[Files](ProfileScreen)
  > 📁 Browse files
  
  #[Settings](SettingsScreen)
  > ⚙️ App settings
  
  #[Help](SettingsScreen)
  > ❓ Get help
  
  @destructive[Logout](MobileApp)
  > 💪 Sign out

screen Mob:
  header:
    # My App
    @primary[Menu](MyDrawer)

  # Welcome to Mobile App
  > This is a complete mobile application example
  
  card:
    ## Features
    > Explore our amazing features
    list:
      - Real-time notifications
      - Offline support
      - Cloud sync
    @primary[Get Started](MessagesScreen)
  
  card:
    ## Quick Actions
    grid-2:
      @primary[📧 Messages](MessagesScreen)
      @primary[📊 Analytics](ProfileScreen)
      @secondary[⚙️ Settings](SettingsScreen)
      @outline[❓ Help](SettingsScreen)

  navigator:
    - Home | 🏠 | MobileApp
    - Search | 🔍 | SettingsScreen
    - Messages | 💬 | MessagesScreen
    - Profile | 👤 | ProfileScreen
    - More | ⋯ | SettingsScreen
    
  fab:
    - + | MessagesScreen

  drawer MyDrawer:
    > ## App Menu
    
    #[Dashboard](MobileApp)
    > 📊 View dashboard
    
    #[Messages](MessagesScreen)
    > 💬 Check messages
    
    #[Calendar](SettingsScreen)
    > 📅 View calendar
    
    #[Files](ProfileScreen)
    > 📁 Browse files
    
    #[Settings](SettingsScreen)
    > ⚙️ App settings
    
    #[Help](SettingsScreen)
    > ❓ Get help
    
    @destructive[Logout](MobileApp)
    > 🚪 Sign out

screen MessagesScreen:
  header:
    @ghost[CircleArrowLeft](MobileApp)
    # Messages
    @primary[Search]{🔍}
  > Your conversations

  navigator:
    - Home | 🏠 | MobileApp
    - Search | 🔍 | SettingsScreen
    - Messages | 💬 | MessagesScreen
    - Profile | 👤 | ProfileScreen
    - More | ⋯ | SettingsScreen

screen ProfileScreen:
  header:
    @ghost[CircleArrowLeft](MobileApp)
    # Profile
    @primary[Edit]{✏️}

  card:
    ![Profile Picture](https://via.placeholder.com/100x100)
    ## John Doe
    > Senior Developer
    *> @johndoe
    
    ---
    
    ### Stats
    - Followers: 1,234
    - Following: 567
    - Posts: 89
    
  card:
    ## Settings
    [X] Push notifications
    [X] Email updates
    [ ] SMS alerts
    ___: Theme{Choose theme}[Light | Dark | Auto]
    @primary[Save Changes]

  navigator:
    - Home | 🏠 | MobileApp
    - Search | 🔍 | SettingsScreen
    - Messages | 💬 | MessagesScreen
    - Profile | 👤 | ProfileScreen
    - More | ⋯ | SettingsScreen

screen SettingsScreen:
  header:
    @ghost[CircleArrowLeft](MobileApp)
    # Settings

  card:
    ## Account
    list:
      - [Profile]{👤}(ProfileScreen)
      - [Privacy]{🔒}(ProfileScreen)
      - [Security]{🛡️}(ProfileScreen)
    
  card:
    ## Preferences
    [X] Dark mode
    [X] Push notifications
    [ ] Location services
    ___: Language{Select language}[English | Spanish | French | German]
    ___: Timezone{Select timezone}[UTC | EST | PST | CET]
    
  card:
    ## Support
    list:
      - [Help Center]{❓}(MessagesScreen)
      - [Contact Us]{📧}(MessagesScreen)
      - [Feedback]{💭}(MessagesScreen)
    
  card:
    ## Account Actions
    @primary[Export Data]
    @destructive[Delete Account](MobileApp)

  navigator:
    - Home | 🏠 | MobileApp
    - Search | 🔍 | SettingsScreen
    - Messages | 💬 | MessagesScreen
    - Profile | 👤 | ProfileScreen
    - More | ⋯ | SettingsScreen
`;

export default mobileAppExample;
