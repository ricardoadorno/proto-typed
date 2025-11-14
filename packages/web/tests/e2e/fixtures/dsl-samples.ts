/**
 * DSL Sample Code for E2E Tests
 *
 * This file contains reusable DSL code snippets for testing various
 * features of the playground. Each sample is designed to test specific
 * functionality while remaining simple and deterministic.
 */

/**
 * Single screen with basic elements
 */
export const SIMPLE_SCREEN = `screen Home:
  container:
    # Welcome
    > This is a simple test screen
    @[Click Me](action)`

/**
 * Multiple screens for navigation testing
 */
export const MULTI_SCREEN = `screen Home:
  container:
    # Home Screen
    > Welcome to the app
    @[Go to Settings](Settings)

screen Settings:
  container:
    # Settings
    > Configure your app
    @[Back to Home](Home)`

/**
 * Screen with modal and drawer
 */
export const MODAL_DRAWER = `screen Main:
  container:
    # Main Screen
    @[Open Modal](ConfirmModal)
    @[Open Drawer](MainDrawer)

modal ConfirmModal:
  container:
    # Confirmation
    > Are you sure?
    @[Yes](action)
    @[No](action)

drawer MainDrawer:
  container:
    # Menu
    - Home
    - Settings
    - About`

/**
 * Component definition and usage
 */
export const COMPONENT_EXAMPLE = `component UserCard:
  card:
    ## %name
    > Email: %email
    > Role: %role

screen Users:
  container:
    # Team Members
    list $UserCard:
      - John Doe | john@example.com | Developer
      - Jane Smith | jane@example.com | Designer
      - Bob Wilson | bob@example.com | Manager`

/**
 * Layout and structure testing
 */
export const LAYOUT_EXAMPLE = `screen Layouts:
  container:
    # Layout Tests
    row:
      > Column 1
      > Column 2

    grid:
      > Grid Item 1
      > Grid Item 2
      > Grid Item 3
      > Grid Item 4

    card:
      ## Card Title
      > Card content here`

/**
 * Form inputs testing
 */
export const FORM_EXAMPLE = `screen Form:
  container:
    # Sign Up Form
    ___[Email][Enter your email]
    ___password[Password][Enter password]
    ___[Country][Select country[USA | Canada | Mexico]]
    [X] Agree to terms
    [ ] Subscribe to newsletter
    @[Submit](submit)`

/**
 * Navigation testing with bottom navigator
 */
export const NAVIGATOR_EXAMPLE = `screen Home:
  container:
    # Home
    > Home content
  navigator:
    - Home | home | Home
    - Settings | settings | Settings

screen Settings:
  container:
    # Settings
    > Settings content
  navigator:
    - Home | home | Home
    - Settings | settings | Settings`

/**
 * Syntax error example for error testing
 */
export const SYNTAX_ERROR = `screen Invalid
  container:
    # Missing colon on screen definition`

/**
 * Empty DSL for testing empty state
 */
export const EMPTY_DSL = ``

/**
 * Complex nested structure
 */
export const NESTED_STRUCTURE = `screen Dashboard:
  container:
    header:
      # Dashboard
      @[Settings](Settings)

    row:
      card:
        ## Statistics
        > Total Users: 1,234
        > Active: 987

      card:
        ## Revenue
        > Today: $5,678
        > This Month: $123,456

    list:
      - Recent Activity
      - New Signups
      - System Alerts`

/**
 * All button variants for visual testing
 */
export const BUTTON_VARIANTS = `screen Buttons:
  container:
    # Button Variants
    @[Default Button](action)
    @@[Medium Button](action)
    @@@[Small Button](action)
    @_[Ghost Button](action)
    @+[Outline Button](action)
    @-[Secondary Button](action)
    @=[Destructive Button](action)
    @![Warning Button](action)
    @[With Icon]{star}(action)`

/**
 * Image and link elements
 */
export const MEDIA_EXAMPLE = `screen Media:
  container:
    # Media Examples
    ![Logo](https://via.placeholder.com/150)
    !rounded[Banner](https://via.placeholder.com/300x100)
    !circle-64x64[Avatar](https://via.placeholder.com/64)
    > [External Link](https://example.com)
    > [Internal Link](Settings)`

/**
 * Theme customization example
 */
export const THEME_EXAMPLE = `styles:
  --primary: oklch(0.65 0.25 270);
  --accent: oklch(0.7 0.2 180);

screen Themed:
  container:
    # Custom Theme
    > This screen uses custom colors
    @[Styled Button](action)`
