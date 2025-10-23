const listsExample = `
component User
  card:
    row:
      col:
        ![Profile Photo](%photoUrl)
      col:
        # %name
        > %phone
        > %email
        @outline[Edit](%editAction)
        @destructive[Delete](%deleteAction)

screen ListExamples:
  # List Examples
  > This screen demonstrates different types of lists and their capabilities

  card:
    ## Simple Lists
    > Basic unordered list items

    - Simple text item
    - Another item
    - Third item with more text
    - Final simple item

  card:
    ## User List with Component
    > List using UserList component with data props

    list $User
      - João Silva | (11) 99999-9999 | joao@email.com
      - Maria Santos | (11) 88888-8888 | maria@email.com
      - Pedro Oliveira | (11) 77777-7777 | pedro@email.com
      - Ana Costa | (11) 66666-6666 | ana@email.com

  card:
    ## Mixed Content Lists
    > Combining different types of content

    
      - [Home](HomePage)Dashboard Overview{Main navigation hub}[Customize](customize)
      - Simple navigation item
      - [Reports](ReportsPage)Monthly Analytics{View detailed reports}[Download](download)[Share](share)
      - Another simple item
      - [Profile](ProfilePage)User Account{Manage your profile}[Edit](edit)[Privacy](privacy)

  card:
    ## Task Management Example
    > Real-world task list with various actions and button variants

    
      - [Task](TaskDetail)Setup Development Environment{Configure local development}[Start](start)@ghost[Skip](skip)
      - [Task](TaskDetail)Review Code Changes{Pull request #123}@outline[Approve](approve)@warning[Request Changes](changes)@ghost[Comment](comment)
      - [Task](TaskDetail)Deploy to Production{Release v2.1.0}@outline[Deploy](deploy)@destructive[Rollback](rollback)
      - [Meeting](MeetingDetail)Team Standup{Daily sync meeting}[Join](join)@secondary[Reschedule](reschedule)

  card:
    ## Contact List Example
    > Contact management with multiple actions

    
      - [Contact](ContactDetail)Sarah Johnson{Product Manager}[Call](call)[Email](email)[Message](message)
      - [Contact](ContactDetail)Mike Chen{Frontend Developer}[Call](call)[Email](email)
      - [Contact](ContactDetail)Alex Rivera{UX Designer}[Call](call)[Email](email)[Schedule](schedule)
      - [Contact](ContactDetail)Emma Davis{Backend Developer}[Call](call)[Email](email)[Message](message)[Archive](archive)

  card:
    ## Shopping Cart Example
    > E-commerce list with quantity and actions

    
      - [Product](ProductPage)Wireless Headphones{Bluetooth 5.0, Noise Cancelling}[Remove](remove)[Save for Later](save)
      - [Product](ProductPage)Laptop Stand{Adjustable aluminum stand}[Remove](remove)[Update Quantity](quantity)
      - [Product](ProductPage)USB-C Cable{3 feet, fast charging}[Remove](remove)[Move to Wishlist](wishlist)

  card:
    ## Button Variants in Lists
    > Demonstrating all button variants in list items

    
      - Default buttons[Save](save)[Edit](edit)
      - Ghost buttons@ghost[Delete](delete)@ghost[Cancel](cancel)
      - Outline buttons@outline[Approve](approve)@outline[Review](review)
      - Secondary buttons@secondary[Archive](archive)@secondary[Hide](hide)
      - Destructive buttons@destructive[Remove](remove)@destructive[Destroy](destroy)
      - Warning buttons@warning[Caution](caution)@warning[Alert](alert)
      - Mixed variants[Normal](normal)@ghost[Ghost](ghost)@outline[Outline](outline)@destructive[Danger](danger)

  card:
    ## Notification List
    > System notifications with actions

    
      - [Notification](NotificationDetail)New Message{From: team@company.com}[Mark Read](read)@destructive[Delete](delete)
      - System Update Available{Version 2.1.0 is ready}@outline[Update Now](update)@ghost[Later](later)
      - [Alert](AlertDetail)Security Alert{Unusual login detected}@warning[Review](review)@ghost[Dismiss](dismiss)
      - Welcome to proto-typed!{Getting started guide}[Start Tutorial](tutorial)@ghost[Skip](skip)

  @primary[Back to Examples](ExamplesList)
`

export default listsExample
