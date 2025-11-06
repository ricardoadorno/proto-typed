/**
 * Views Domain - DSL Fixtures
 *
 * Collection of DSL examples for view containers testing.
 * Each fixture includes the DSL string for parsing and rendering.
 */

export const viewsFixtures = {
  screens: {
    empty: `screen Home:`,

    withTitle: `screen Dashboard:
  # Welcome`,

    withContent: `screen Profile:
  # User Profile
  > This is the profile page
  @[Edit](edit)`,

    complex: `screen Home:
  header:
    # My App
  container:
    ## Welcome
    > Get started with our application
    row:
      @[Sign Up](signup)
      @secondary[Learn More](learn)
  navigator:
    - home|Home
    - search|Search
    - profile|Profile`,

    multiple: `screen First:
  # First Screen

screen Second:
  # Second Screen`,
  },

  modals: {
    empty: `modal Confirmation:`,

    simple: `modal Alert:
  # Alert
  > This is an alert message
  @[OK](close)`,

    confirmation: `modal DeleteConfirm:
  # Are you sure?
  > This action cannot be undone
  row:
    @secondary[Cancel](DeleteConfirm)
    @destructive[Delete](confirm)`,

    complex: `modal UserDetails:
  # User Information
  stack:
    ___[Name][Enter name]
    ___email[Email][your@email.com]
    ___textarea[Bio][Tell us about yourself]
  row-between:
    @secondary[Cancel](UserDetails)
    @[Save](save)`,
  },

  drawers: {
    empty: `drawer Menu:`,

    simple: `drawer Navigation:
  # Menu
  @[Home](HomePage)
  @[Settings](SettingsPage)`,

    navigation: `drawer MainMenu:
  # Navigation
  stack-tight:
    @ghost[i-home Home](HomePage)
    @ghost[i-search Search](SearchPage)
    @ghost[i-user Profile](ProfilePage)
    ---
    @ghost[i-settings Settings](SettingsPage)
    @ghost[i-help Help](HelpPage)`,

    complex: `drawer Sidebar:
  stack:
    # User Info
    row:
      !circle-48x48[Avatar](avatar.jpg)
      stack-tight:
        ## John Doe
        >>> john@example.com
    ---
    # Navigation
    - Home
    - Projects
    - Tasks
    ---
    @destructive[Logout](logout)`,
  },

  mixed: {
    screenAndModal: `screen Home:
  # Welcome
  @[Open Dialog](ConfirmDialog)

modal ConfirmDialog:
  # Confirm
  > Are you sure?
  @[Yes](confirm)`,

    screenAndDrawer: `screen Dashboard:
  @ghost[Menu](MainDrawer)
  # Dashboard Content

drawer MainDrawer:
  # Menu
  @[Home](HomePage)`,

    all: `screen Main:
  header:
    @ghost[Menu](NavDrawer)
    # App Title
  container:
    > Main content
    @[Show Modal](InfoModal)

modal InfoModal:
  # Information
  > Details here
  @[Close](InfoModal)

drawer NavDrawer:
  # Navigation
  @[Home](Main)
  @[About](About)`,
  },
}
