const listsExample = `
component UserList:
  card:
    row:
      col:
        ![Profile Photo](%photoUrl)
      col:
        # %name
        > %phone
        > %email
        @+[Edit](%editAction)
        @=[Delete](%deleteAction)

screen ListExamples:
  # List Examples
  > This screen demonstrates different types of lists and their capabilities

  card:
    ## Simple Lists
    > Basic unordered list items

    list:
      - Simple text item
      - Another item
      - Third item with more text
      - Final simple item

  card:
    ## User List with Component
    > List using UserList component with data props

    list $UserList:
      - João Silva | (11) 99999-9999 | joao@email.com
      - Maria Santos | (11) 88888-8888 | maria@email.com
      - Pedro Oliveira | (11) 77777-7777 | pedro@email.com
      - Ana Costa | (11) 66666-6666 | ana@email.com

  card:
    ## Mixed Content Lists
    > Combining different types of content

    list:
      - [Home](HomePage)Dashboard Overview{Main navigation hub}[Customize](customize)
      - Simple navigation item
      - [Reports](ReportsPage)Monthly Analytics{View detailed reports}[Download](download)[Share](share)
      - Another simple item
      - [Profile](ProfilePage)User Account{Manage your profile}[Edit](edit)[Privacy](privacy)

  card:
    ## Task Management Example
    > Real-world task list with various actions and button variants

    list:
      - [Task](TaskDetail)Setup Development Environment{Configure local development}[Start](start)@_[Skip](skip)
      - [Task](TaskDetail)Review Code Changes{Pull request #123}@+[Approve](approve)@![Request Changes](changes)@_[Comment](comment)
      - [Task](TaskDetail)Deploy to Production{Release v2.1.0}@+[Deploy](deploy)@=[Rollback](rollback)
      - [Meeting](MeetingDetail)Team Standup{Daily sync meeting}[Join](join)@-[Reschedule](reschedule)

  card:
    ## Contact List Example
    > Contact management with multiple actions

    list:
      - [Contact](ContactDetail)Sarah Johnson{Product Manager}[Call](call)[Email](email)[Message](message)
      - [Contact](ContactDetail)Mike Chen{Frontend Developer}[Call](call)[Email](email)
      - [Contact](ContactDetail)Alex Rivera{UX Designer}[Call](call)[Email](email)[Schedule](schedule)
      - [Contact](ContactDetail)Emma Davis{Backend Developer}[Call](call)[Email](email)[Message](message)[Archive](archive)

  card:
    ## Shopping Cart Example
    > E-commerce list with quantity and actions

    list:
      - [Product](ProductPage)Wireless Headphones{Bluetooth 5.0, Noise Cancelling}[Remove](remove)[Save for Later](save)
      - [Product](ProductPage)Laptop Stand{Adjustable aluminum stand}[Remove](remove)[Update Quantity](quantity)
      - [Product](ProductPage)USB-C Cable{3 feet, fast charging}[Remove](remove)[Move to Wishlist](wishlist)

  card:
    ## Button Variants in Lists
    > Demonstrating all button variants in list items

    list:
      - Default buttons[Save](save)[Edit](edit)
      - Ghost buttons@_[Delete](delete)@_[Cancel](cancel)
      - Outline buttons@+[Approve](approve)@+[Review](review)
      - Secondary buttons@-[Archive](archive)@-[Hide](hide)
      - Destructive buttons@=[Remove](remove)@=[Destroy](destroy)
      - Warning buttons@![Caution](caution)@![Alert](alert)
      - Mixed variants[Normal](normal)@_[Ghost](ghost)@+[Outline](outline)@=[Danger](danger)

  card:
    ## Notification List
    > System notifications with actions

    list:
      - [Notification](NotificationDetail)New Message{From: team@company.com}[Mark Read](read)@=[Delete](delete)
      - System Update Available{Version 2.1.0 is ready}@+[Update Now](update)@_[Later](later)
      - [Alert](AlertDetail)Security Alert{Unusual login detected}@![Review](review)@_[Dismiss](dismiss)
      - Welcome to proto-typed!{Getting started guide}[Start Tutorial](tutorial)@_[Skip](skip)

  @[Back to Examples](ExamplesList)
`;

export default listsExample;
