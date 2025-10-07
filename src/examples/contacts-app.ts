const contactsAppExample = `styles:
  --primary: #3b82f6;
  --accent: #8b5cf6;


component ContactCard:
  card:
    row-between:
      stack-tight:
        >> %name
        >>> %email
      @@@+[i-Edit](EditContact)


component MenuItem:
  #[%label](%destination)


component GroupItem:
  stack-tight:
    #[%name](Contacts)
    >>> %count members


screen Contacts:
  header:
    >> My Contacts
    @@@_[i-Menu](MainDrawer)
  container:
    > Your contacts organized in one place
    list $ContactCard:
      - John Silva | john@email.com
      - Maria Santos | maria@email.com
      - Pedro Costa | pedro@email.com

  navigator:
    - i-Users | Contacts
    - i-Star | Favorites
    - i-Settings | Settings

  fab{+}(CreateContact)


modal CreateContact:
  card:
    ## New Contact
    >>> Fill contact information

    ___*:Full Name{Enter name}
    ___*:Email{email@example.com}
    ___:Phone{(11) 99999-9999}
    ___-:ID{Auto-generated}

    ---

    #### Category
    (X) Personal
    ( ) Work
    ( ) Family

    ---

    [X] Add to favorites
    [ ] Sync with cloud

    row-between:
      @@-[Cancel](-1)
      @@[i-Save Save](Contacts)


modal ConfirmDelete:
  card:
    ### Delete Contact?
    > This action cannot be undone

    *> All contact data will be permanently removed

    "> Consider archiving instead of deleting

    row-between:
      @@+[Cancel](-1)
      @@=[i-Trash Delete](Contacts)


drawer MainDrawer:
  stack:
    ![App Logo](https://via.placeholder.com/150x50)
    
    ###### Main Menu

    list $MenuItem:
      - Contacts | Contacts
      - Favorites | Favorites
      - Groups | Groups
      - Settings | Settings

    ---

    card:
      >> Premium Features
      >>> Unlock advanced tools
      @@[i-Crown Upgrade](Premium)

    ---

    @@=[i-LogOut Sign Out](Contacts)


screen Favorites:
  header:
    ## ⭐ Favorites
    @[i-Menu](MainDrawer)

  container:
    stack:
      ![Star](https://via.placeholder.com/100)
      
      > No favorites yet
      
      *> Tap the star icon to add contacts

      @@[i-ArrowLeft Back](Contacts)

  navigator:
    - i-Users | Contacts
    - i-Star | Favorites
    - i-Settings | Settings


screen Groups:
  header:
    ## Groups
    @[i-Menu](MainDrawer)

  stack:
    > Organize contacts by groups

    list $GroupItem:
      - Family | 5
      - Work | 12
      - Friends | 8

    ---

    @@[i-Plus New Group](Contacts)

  navigator:
    - i-Users | Contacts
    - i-Star | Favorites
    - i-Settings | Settings


screen Settings:
  header:
    ## Settings
    @[i-Menu](MainDrawer)

  stack:
    card:
      #### Account
      
      list $MenuItem:
        - Sync Settings | Contacts
        - Backup Settings | Contacts
        - Import Contacts | ImportScreen
        - Export Contacts | ExportScreen

    ---

    card:
      #### Preferences
      
      [X] Dark mode
      [X] Notifications
      [ ] Auto-backup

    ---

    row-center:
      @@=[Clear Cache](Contacts)

  navigator:
    - i-Users | Contacts
    - i-Star | Favorites
    - i-Settings | Settings


screen ImportScreen:
  header:
    ### Import Contacts
    @_[i-ArrowLeft](Settings)

  stack:
    > Import from other sources

    list $MenuItem:
      - CSV File | Settings
      - Google | Settings
      - iCloud | Settings

    *> Existing contacts won't be replaced


screen ExportScreen:
  header:
    ### Export Contacts
    @_[i-ArrowLeft](Settings)

  stack:
    > Export for backup

    (X) CSV
    ( ) vCard
    ( ) JSON

    ---

    [ ] Include archived
    [X] Include photos

    ---

    @@[i-Download Export Now](Settings)


screen Premium:
  header:
    ### 👑 Premium
    @_[i-ArrowLeft](-1)

  container:
    stack:
      ![Crown](https://via.placeholder.com/100)
      
      ## Unlock Premium
      
      > Get exclusive features

      ---

      grid-2:
        card:
          >> ∞
          >>> Unlimited contacts
        card:
          >> 🔄
          >>> Real-time sync

      ---

      # $9.90/month
      >>> or $99/year (save 15%)

      ---

      @@[i-Crown Subscribe](Contacts)
      @_[Maybe Later](-1)

`;

export default contactsAppExample;