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
  
  @[Logout](MobileApp)
  > 💪 Sign out

screen Mob:
  header:
    # My App
    @[Menu](MyDrawer)

  # Welcome to Mobile App
  > This is a complete mobile application example
  
  card:
    ## Features
    > Explore our amazing features
    - Real-time notifications
    - Offline support
    - Cloud sync
    @[Get Started](MessagesScreen)
  
  card:
    ## Quick Actions
    row:
      col:
        @[📧 Messages](MessagesScreen)
      col:
        @[📊 Analytics](ProfileScreen)    row:
      col:
        @[⚙️ Settings](SettingsScreen)
      col:
        @[❓ Help](SettingsScreen)

  navigator:
    - Home | 🏠 | MobileApp
    - Search | 🔍 | SettingsScreen
    - Messages | 💬 | MessagesScreen
    - Profile | 👤 | ProfileScreen
    - More | ⋯ | SettingsScreen
    
  fab{+}(MessagesScreen)

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
    
    @[Logout](MobileApp)
    > 🚪 Sign out

screen MessagesScreen:
  header:
    @_[CircleArrowLeft](MobileApp)
    # Messages
    @[Search]{🔍}
  > Your conversations

  navigator:
    - Home | 🏠 | MobileApp
    - Search | 🔍 | SettingsScreen
    - Messages | 💬 | MessagesScreen
    - Profile | 👤 | ProfileScreen
    - More | ⋯ | SettingsScreen

screen ProfileScreen:
  header:
    @_[CircleArrowLeft](MobileApp)
    # Profile
    @[Edit]{✏️}

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
    ___:Theme{Choose theme}[Light | Dark | Auto]
    @[Save Changes]

  navigator:
    - Home | 🏠 | MobileApp
    - Search | 🔍 | SettingsScreen
    - Messages | 💬 | MessagesScreen
    - Profile | 👤 | ProfileScreen
    - More | ⋯ | SettingsScreen

screen SettingsScreen:
  header:
    @_[CircleArrowLeft](MobileApp)
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
    ___:Language{Select language}[English | Spanish | French | German]
    ___:Timezone{Select timezone}[UTC | EST | PST | CET]
    
  card:
    ## Support
    list:
      - [Help Center]{❓}(MessagesScreen)
      - [Contact Us]{📧}(MessagesScreen)
      - [Feedback]{💭}(MessagesScreen)
    
  card:
    ## Account Actions
    @[Export Data]
    @[Delete Account](MobileApp)

  navigator:
    - Home | 🏠 | MobileApp
    - Search | 🔍 | SettingsScreen
    - Messages | 💬 | MessagesScreen
    - Profile | 👤 | ProfileScreen
    - More | ⋯ | SettingsScreen
`;

export default mobileAppExample;
