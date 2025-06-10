const mobileAppExample = `
screen MobileApp:
  header:
    # My App
    @[Menu](MyDrawer)
    @[Profile](ProfileScreen)

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
        @[📊 Analytics](ProfileScreen)
    row:
      col:
        @[⚙️ Settings](SettingsScreen)
      col:
        @[❓ Help](SettingsScreen)  
        
  bottom_nav:
    nav_item [Home]{🏠}(MobileApp)
    nav_item [Search]{🔍}(SettingsScreen)
    nav_item [Messages]{💬}(MessagesScreen)
    nav_item [Profile]{👤}(ProfileScreen)
    nav_item [More]{⋯}(SettingsScreen)

  fab {+}:
    fab_item [New Message]{✉️}(MessagesScreen)
    fab_item [New Contact]{👤}(ProfileScreen)
    fab_item [Camera]{📷}(SettingsScreen)

  drawer MyDrawer:
    drawer_item [Dashboard]{📊}(MobileApp)
    drawer_item [Messages]{💬}(MessagesScreen)
    drawer_item [Calendar]{📅}(SettingsScreen)
    drawer_item [Files]{📁}(ProfileScreen)
    drawer_item [Settings]{⚙️}(SettingsScreen)
    drawer_item [Help]{❓}(SettingsScreen)
    drawer_item [Logout]{🚪}(MobileApp)

screen MessagesScreen:
  header:
    @_[CircleArrowLeft](MobileApp)
    # Messages
    @[Search]{🔍}

  > Your conversations


  bottom_nav:
    nav_item [Home]{🏠}(MobileApp)
    nav_item [Search]{🔍}(SettingsScreen)
    nav_item [Messages]{💬}(MessagesScreen)
    nav_item [Profile]{👤}(ProfileScreen)
    nav_item [More]{⋯}(SettingsScreen)

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

  bottom_nav:
    nav_item [Home]{🏠}(MobileApp)
    nav_item [Search]{🔍}(SettingsScreen)
    nav_item [Messages]{💬}(MessagesScreen)
    nav_item [Profile]{👤}(ProfileScreen)
    nav_item [More]{⋯}(SettingsScreen)

screen SettingsScreen:
  header:
    @_[CircleArrowLeft](MobileApp)
    # Settings

  card:
    ## Account
    drawer_item [Profile]{👤}(ProfileScreen)
    drawer_item [Privacy]{🔒}(ProfileScreen)
    drawer_item [Security]{🛡️}(ProfileScreen)
    
  card:
    ## Preferences
    [X] Dark mode
    [X] Push notifications
    [ ] Location services    ___:Language{Select language}[English | Spanish | French | German]
    ___:Timezone{Select timezone}[UTC | EST | PST | CET]
    
  card:
    ## Support
    drawer_item [Help Center]{❓}(MessagesScreen)
    drawer_item [Contact Us]{📧}(MessagesScreen)
    drawer_item [Feedback]{💭}(MessagesScreen)
    
  card:
    ## Account Actions
    @[Export Data]
    @[Delete Account](MobileApp)

  bottom_nav:
    nav_item [Home]{🏠}(MobileApp)
    nav_item [Search]{🔍}(SettingsScreen)
    nav_item [Messages]{💬}(MessagesScreen)
    nav_item [Profile]{👤}(ProfileScreen)
    nav_item [More]{⋯}(SettingsScreen)
`;

export default mobileAppExample;
