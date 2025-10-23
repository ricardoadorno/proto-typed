const contactsAppExample = `styles:
  --primary: #3b82f6;
  --accent: #8b5cf6;


component ContactCard:
  card:
    row-between:
      stack-tight:
        >> %name
        >>> %email
      @outline-sm[i-Edit](EditContact)


component MenuItem:
  #[%label](%destination)


component GroupItem:
  stack-tight:
    #[%name](Contacts)
    >>> %count members


screen Contacts:
  header:
    >> My Contacts
    @ghost-sm[i-Menu](MainDrawer)
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

  fab:
    - + | CreateContact


modal CreateContact:
  card:
    ## New Contact
    >>> Fill contact information

    ___: Full Name{Enter name} | required
    ___email: Email{email@example.com} | required
    ___: Phone{(11) 99999-9999}
    ___: ID{Auto-generated} | disabled

    ---

    #### Category
    (X) Personal
    ( ) Work
    ( ) Family

    ---

    [X] Add to favorites
    [ ] Sync with cloud

    row-between:
      @secondary-md[Cancel](-1)
      @primary-md[i-Save Save](Contacts)


modal ConfirmDelete:
  card:
    ### Delete Contact?
    > This action cannot be undone

    *> All contact data will be permanently removed

    "> Consider archiving instead of deleting

    row-between:
      @outline-md[Cancel](-1)
      @destructive-md[i-Trash Delete](Contacts)


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
      @primary-md[i-Crown Upgrade](Premium)

    ---

    @destructive-md[i-LogOut Sign Out](Contacts)


screen Favorites:
  header:
    ## ⭐ Favorites
    @primary[i-Menu](MainDrawer)

  container:
    stack:
      ![Star](https://via.placeholder.com/100)
      
      > No favorites yet
      
      *> Tap the star icon to add contacts

      @primary-md[i-ArrowLeft Back](Contacts)

  navigator:
    - i-Users | Contacts
    - i-Star | Favorites
    - i-Settings | Settings


screen Groups:
  header:
    ## Groups
    @primary[i-Menu](MainDrawer)

  stack:
    > Organize contacts by groups

    list $GroupItem:
      - Family | 5
      - Work | 12
      - Friends | 8

    ---

    @primary-md[i-Plus New Group](Contacts)

  navigator:
    - i-Users | Contacts
    - i-Star | Favorites
    - i-Settings | Settings


screen Settings:
  header:
    ## Settings
    @primary[i-Menu](MainDrawer)

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
      @destructive-md[Clear Cache](Contacts)

  navigator:
    - i-Users | Contacts
    - i-Star | Favorites
    - i-Settings | Settings


screen ImportScreen:
  header:
    ### Import Contacts
    @ghost[i-ArrowLeft](Settings)

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
    @ghost[i-ArrowLeft](Settings)

  stack:
    > Export for backup

    (X) CSV
    ( ) vCard
    ( ) JSON

    ---

    [ ] Include archived
    [X] Include photos

    ---

    @primary-md[i-Download Export Now](Settings)


screen Premium:
  header:
    ### 👑 Premium
    @ghost[i-ArrowLeft](-1)

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

      @primary-md[i-Crown Subscribe](Contacts)
      @ghost[Maybe Later](-1)

`

export default contactsAppExample
