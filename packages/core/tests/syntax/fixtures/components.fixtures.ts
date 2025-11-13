/**
 * Components Domain - DSL Fixtures
 *
 * Collection of DSL examples for component system testing.
 * Each fixture includes the DSL string for parsing and rendering.
 */

export const componentsFixtures = {
  definitions: {
    simple: `component UserCard:
  card:
    # User Name`,

    withProps: `component ProfileCard:
  card:
    ## $name
    > Email: $email
    >> $role`,

    complex: `component ProductCard:
  card:
    ### $title
    > Price: $price
    >> Category: $category
    row:
      @secondary[View](view)
      @[Add to Cart](cart)`,

    nested: `component ComplexCard:
  card:
    stack:
      ## $title
      row-between:
        > $label
        >> $value
      ---
      @[$action](action)`,
  },

  instances: {
    simple: `component Greeting:
  # Hello, $name!

screen Home:
  $Greeting: John`,

    multipleProps: `component UserInfo:
  ## $name
  > Email: $email

screen Profile:
  list $UserInfo:
    - Alice | alice@example.com`,

    multiple: `component Badge:
  > $label

screen Test:
  stack:
    $Badge: New
    $Badge: Featured
    $Badge: Sale`,

    inLayout: `component Item:
  card-compact:
    > $text

screen List:
  grid-2:
    $Item: First
    $Item: Second
    $Item: Third
    $Item: Fourth`,
  },

  lists: {
    simple: `component UserCard:
  card:
    ## $name
    > Email: $email

screen Users:
  list $UserCard:
    - John|john@example.com
    - Jane|jane@example.com
    - Bob|bob@example.com`,

    complex: `component ProductCard:
  card:
    ### $title
    > Price: $price
    >> $category
    @[Add to Cart](cart)

screen Products:
  list $ProductCard:
    - Laptop|$999|Electronics
    - Desk|$299|Furniture
    - Chair|$149|Furniture`,

    nested: `component TaskCard:
  card-compact:
    row-between:
      stack-tight:
        ## $title
        >>> $status
      @ghost[i-check Done](done)

screen Tasks:
  container:
    # My Tasks
    list $TaskCard:
      - Fix bug|In Progress
      - Write tests|Todo
      - Deploy|Done`,
  },

  propSubstitution: {
    inText: `component Message:
  > Hello $name, your code is $code

screen Test:
  list $Message:
    - Alice | ABC123`,

    inAction: `component ActionCard:
  card:
    # $title
    @[Click](action-$id)

screen Test:
  list $ActionCard:
    - My Action | 123`,

    multiple: `component InfoCard:
  card:
    # $title

screen Test:
  list $InfoCard:
    - Great Article
    - Tech News
    - Amazing content`,
  },

  multipleComponents: {
    headerAndFooter: `component Header:
  # $title

component Footer:
  >> $copyright

screen Test:
  $Header: Welcome
  > Content here
  $Footer: Copyright`,

    library: `component Button:
  @[$label]($action)

component Card:
  card:
    ## $title

component Badge:
  >>> $text

screen Demo:
  $Card: DemoCard
  row:
    $Button: Cancel
    $Button: Submit
  $Badge: Beta`,
  },

  edge: {
    notFound: `screen Test:
  $NonExistent: data`,

    missingProps: `component Template:
  > Name: $name
  > Email: $email

screen Test:
  $Template: OnlyName`,

    emptyProps: `component Empty:
  > User: $name

screen Test:
  $Empty:`,
  },
}
