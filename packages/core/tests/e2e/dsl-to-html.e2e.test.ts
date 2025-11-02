/**
 * E2E Test Suite: DSL Input → HTML Output
 *
 * Tests the complete pipeline:
 * DSL Text → parseAndBuildAst() → AST → astToHtmlStringPreview() → HTML String
 *
 * Focus: Validate that valid DSL syntax parses without errors and renders HTML output
 */

import { describe, it, expect } from 'vitest'
import { parseAndBuildAst, astToHtmlStringPreview } from '../../src/index'

/**
 * Test helper: Parse DSL and check for no errors
 */
function expectDslToParseWithoutErrors(dsl: string) {
  const ast = parseAndBuildAst(dsl)
  expect(ast.__errors).toHaveLength(0)
  return ast
}

describe('E2E: DSL to HTML Pipeline - Valid Syntax Tests', () => {
  // ============================================================
  // 1. BASIC VIEWS & SCREENS
  // ============================================================

  describe('1. Views: Screen Definitions', () => {
    it('should parse simple screen without errors', () => {
      const dsl = `
screen Home:
  # Welcome
  > This is the home screen
`
      expectDslToParseWithoutErrors(dsl)
    })

    it('should parse multiple screens without errors', () => {
      const dsl = `
screen First:
  > First screen

screen Second:
  > Second screen
`
      expectDslToParseWithoutErrors(dsl)
    })

    it('should parse modal without errors', () => {
      const dsl = `
modal ConfirmDialog:
  # Confirm?
  > Are you sure?
`
      expectDslToParseWithoutErrors(dsl)
    })

    it('should parse drawer without errors', () => {
      const dsl = `
drawer MainMenu:
  > Menu content
`
      expectDslToParseWithoutErrors(dsl)
    })
  })

  // ============================================================
  // 2. TYPOGRAPHY & TEXT ELEMENTS
  // ============================================================

  describe('2. Typography: All Heading Levels', () => {
    it('should parse all heading levels without errors', () => {
      const dsl = `
screen TypographyTest:
  # Heading 1
  ## Heading 2
  ### Heading 3
  #### Heading 4
  ##### Heading 5
  ###### Heading 6
`
      expectDslToParseWithoutErrors(dsl)
    })

    it('should parse paragraph without errors', () => {
      const dsl = `
screen TextTest:
  > This is a paragraph
`
      expectDslToParseWithoutErrors(dsl)
    })

    it('should parse all text variants without errors', () => {
      const dsl = `
screen TextTest:
  > Paragraph with margin
  >> Inline text
  >>> Muted text
  *> Note
  "> Quote
`
      expectDslToParseWithoutErrors(dsl)
    })
  })

  // ============================================================
  // 3. BUTTONS & NAVIGATION
  // ============================================================

  describe('3. Buttons: All Variants', () => {
    it('should parse all button variants without errors', () => {
      const dsl = `
screen ButtonTest:
  @[Primary](action)
  @secondary[Secondary](action)
  @outline[Outline](action)
  @ghost[Ghost](action)
  @destructive[Delete](action)
  @link[Link](action)
  @success[Success](action)
  @warning[Warning](action)
`
      expectDslToParseWithoutErrors(dsl)
    })

    it('should parse all button sizes without errors', () => {
      const dsl = `
screen ButtonTest:
  @-xs[XS](action)
  @-sm[Small](action)
  @-md[Medium](action)
  @-lg[Large](action)
  @secondary-lg[Big Secondary](action)
`
      expectDslToParseWithoutErrors(dsl)
    })

    it('should parse navigation actions without errors', () => {
      const dsl = `
screen Home:
  @[Go](Other)
  @[Back](-1)
  @[Close](close)
  @[Open Modal](ModalName)
`
      expectDslToParseWithoutErrors(dsl)
    })
  })

  // ============================================================
  // 4. LAYOUTS (CANONICAL PRESETS)
  // ============================================================

  describe('4. Layouts: Containers', () => {
    it('should parse all container types without errors', () => {
      const dsl = `
screen LayoutTest:
  container:
    # Standard Container

screen LayoutTest2:
  container-narrow:
    # Narrow Container

screen LayoutTest3:
  container-wide:
    # Wide Container

screen LayoutTest4:
  container-full:
    # Full Width
`
      expectDslToParseWithoutErrors(dsl)
    })
  })

  describe('4. Layouts: Stacks', () => {
    it('should parse all stack types without errors', () => {
      const dsl = `
screen LayoutTest:
  stack:
    > Item 1
  stack-tight:
    > Item 1
  stack-loose:
    > Item 1
  stack-flush:
    > Item 1
`
      expectDslToParseWithoutErrors(dsl)
    })
  })

  describe('4. Layouts: Rows', () => {
    it('should parse all row types without errors', () => {
      const dsl = `
screen LayoutTest:
  row:
    @[Button 1](action)
  row-center:
    @[Button](action)
  row-between:
    @[Left](action)
    @[Right](action)
  row-end:
    @[Button](action)
`
      expectDslToParseWithoutErrors(dsl)
    })
  })

  describe('4. Layouts: Grids and Cards', () => {
    it('should parse grid types without errors', () => {
      const dsl = `
screen LayoutTest:
  grid-2:
    card:
      # Card 1
  grid-3:
    card:
      # Card 2
  grid-4:
    card:
      # Card 3
  grid-auto:
    card:
      # Card 4
`
      expectDslToParseWithoutErrors(dsl)
    })

    it('should parse card types without errors', () => {
      const dsl = `
screen LayoutTest:
  card:
    # Card Title
  card-compact:
    # Compact Card
  card-feature:
    # Feature Card
`
      expectDslToParseWithoutErrors(dsl)
    })

    it('should parse special layouts without errors', () => {
      const dsl = `
screen LayoutTest:
  header:
    # App Title
  list:
    - Item 1
    - Item 2
  navigator:
    - Home | Home
    - Profile | Profile
  ---
`
      expectDslToParseWithoutErrors(dsl)
    })
  })

  // ============================================================
  // 5. FORMS & INPUTS
  // ============================================================

  describe('5. Forms: Input Types', () => {
    it('should parse all input types without errors', () => {
      const dsl = `
screen FormTest:
  ___: [Name] [Enter name]
  ___email: [Email] [Enter email]
  ___password: [Password] [Enter password]
  ___date: [Birth Date] [Select date]
  ___number: [Age] [Enter age]
  ___textarea: [Message] [Type message]
`
      expectDslToParseWithoutErrors(dsl)
    })

    it('should parse select with options without errors', () => {
      const dsl = `
screen FormTest:
  ___: [Country] [Select country] [USA | Canada | Mexico]
`
      expectDslToParseWithoutErrors(dsl)
    })

    it('should parse checkboxes and radios without errors', () => {
      const dsl = `
screen FormTest:
  [X] Agree
  [ ] Disagree
  (X) Option A
  ( ) Option B
`
      expectDslToParseWithoutErrors(dsl)
    })
  })

  // ============================================================
  // 6. COMPONENTS & PROPS
  // ============================================================

  describe('6. Components: Definition and Usage', () => {
    it('should parse component definition without errors', () => {
      const dsl = `
component UserCard:
  card:
    ## %name
    >>> %email
`
      expectDslToParseWithoutErrors(dsl)
    })

    it('should parse component instance without errors', () => {
      const dsl = `
component UserCard:
  card:
    ## %name

screen Home:
  $UserCard:
    - John
`
      expectDslToParseWithoutErrors(dsl)
    })

    it('should parse component list without errors', () => {
      const dsl = `
component Item:
  >> %name - %status

screen Home:
  list $Item:
    - Task 1 | Done
    - Task 2 | Pending
`
      expectDslToParseWithoutErrors(dsl)
    })
  })

  // ============================================================
  // 7. IMAGES & LINKS
  // ============================================================

  describe('7. Media: Images and Links', () => {
    it('should parse images without errors', () => {
      const dsl = `
screen ImageTest:
  ![Logo](https://example.com/logo.png)
  ![Product](https://example.com/product.png)
`
      expectDslToParseWithoutErrors(dsl)
    })

    it('should parse text with links without errors', () => {
      const dsl = `
screen LinkTest:
  > Visit our website at https://example.com
`
      expectDslToParseWithoutErrors(dsl)
    })
  })

  // ============================================================
  // 8. COMPREHENSIVE E2E TESTS
  // ============================================================

  describe('8. Complete App: Multi-Screen with All Features', () => {
    it('should parse complete realistic app without errors', () => {
      const dsl = `
component MetricCard:
  card:
    ### %label
    # %value
    >> %change

component UserRow:
  row-between:
    > %name
    >>> %role
    @outline-sm[Edit](edit)

screen Dashboard:
  header:
    # Dashboard
    @ghost[Menu](MainMenu)

  container-wide:
    grid-3:
      $MetricCard:
        - Users | 1,234 | +12%
      $MetricCard:
        - Revenue | 45K | +8%
      $MetricCard:
        - Tasks | 89 | -3%

    ### Recent Users
    list $UserRow:
      - Alice Smith | Developer
      - Bob Jones | Designer
      - Carol White | Manager

    row-end:
      @[View All](Users)

  navigator:
    - Dashboard | Dashboard
    - Users | Users
    - Settings | Settings

screen Users:
  container:
    # User Management
    ___: [Search] [Search users...]
    list $UserRow:
      - Alice Smith | Developer
      - Bob Jones | Designer
    @[Add User](AddUser)

screen AddUser:
  card:
    # Add New User
    ___email: [Email] [user@example.com]
    ___: [Name] [Full name]
    [X] Active
    row-end:
      @ghost[Cancel](-1)
      @[Create](Users)

screen Settings:
  container:
    # Settings
    card:
      ## Preferences
      [ ] Dark Mode
      [X] Notifications
    row-end:
      @ghost[Back](-1)
      @[Save](save)

modal ConfirmDelete:
  card:
    # Delete?
    > This cannot be undone
    row-end:
      @ghost[Cancel](close)
      @destructive[Confirm](delete)

drawer MainMenu:
  list:
    - Dashboard | Dashboard
    - Users | Users
    - Settings | Settings
`
      expectDslToParseWithoutErrors(dsl)
    })
  })

  // ============================================================
  // 9. ERROR HANDLING & VALIDATION
  // ============================================================

  describe('9. Valid DSL Should Render HTML', () => {
    it('should render simple screen to HTML', () => {
      const dsl = `
screen Home:
  # Welcome
  > This is the home screen
  @[Next](Next)

screen Next:
  # Second Screen
  @[Back](-1)
`
      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const html = astToHtmlStringPreview(ast)
      expect(html).toBeTruthy()
    })

    it('should render components to HTML', () => {
      const dsl = `
component Card:
  card:
    # %title

screen Home:
  $Card:
    - Hello
  $Card:
    - World
`
      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const html = astToHtmlStringPreview(ast)
      expect(html).toBeTruthy()
    })

    it('should render forms to HTML', () => {
      const dsl = `
screen FormTest:
  card:
    # Contact Form
    ___email: [Email] [your@email.com]
    ___: [Name] [Your name]
    ___textarea: [Message] [Enter message]
    @[Submit](submit)
`
      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const html = astToHtmlStringPreview(ast)
      expect(html).toBeTruthy()
    })

    it('should render layouts to HTML', () => {
      const dsl = `
screen Dashboard:
  header:
    # My App

  container-wide:
    grid-3:
      card:
        ### Metric 1
        # 100
      card:
        ### Metric 2
        # 200
      card:
        ### Metric 3
        # 300

  navigator:
    - Home | Home
    - Profile | Profile
`
      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const html = astToHtmlStringPreview(ast)
      expect(html).toBeTruthy()
    })
  })
})
