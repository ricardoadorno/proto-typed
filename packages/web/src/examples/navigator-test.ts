export const navigatorTest = `
screen NavigatorTest:
  container:
    # Navigator Examples
    > Testing different navigator formats with Lucide icons

    # Three-part format with Lucide icons
    > Complete format with text, Lucide icon names (with 'i-' prefix) and destination:

    ---

    # Three-part format with emoji icons
    > Complete format with text, emoji icons and destination:

    ---

    # Two-part format (text | destination)
    > Simple format with just text and destination:

    ---

    # Mixed format with Lucide and emoji
    > Mixing different formats and icon types (Lucide icons need 'i-' prefix):

    navigator:
      - Home | i-home | HomeScreen
      - Settings | ⚙️ | SettingsScreen
      - Profile | i-user | ProfileScreen
      - Help | HelpScreen

screen HomeScreen:
  # Home Screen
  > This is the home screen
  @[Back to Navigator Test](NavigatorTest)

screen SearchScreen:
  # Search Screen  
  > This is the search screen
  @[Back to Navigator Test](NavigatorTest)

screen MessagesScreen:
  # Messages Screen
  > This is the messages screen
  @[Back to Navigator Test](NavigatorTest)

screen ProfileScreen:
  # Profile Screen
  > This is the profile screen
  @[Back to Navigator Test](NavigatorTest)

screen DashboardScreen:
  # Dashboard Screen
  > This is the dashboard screen
  @[Back to Navigator Test](NavigatorTest)

screen SettingsScreen:
  # Settings Screen
  > This is the settings screen
  @[Back to Navigator Test](NavigatorTest)

screen AboutScreen:
  # About Screen
  > This is the about screen
  @[Back to Navigator Test](NavigatorTest)

screen HelpScreen:
  # Help Screen
  > This is the help screen
  @[Back to Navigator Test](NavigatorTest)
`
