const contactsAppExample = `styles:
  --primary: #3b82f6;
  --accent: #8b5cf6;


component ContactCard:
  card-p4-m2:
    row-between-center:
      col-gap1:
        >> %name
        >>> %email
      row:
        @@@+[i-Edit](EditContact)


screen Contacts:
  header-h100-between-p4:
    >> My Contacts
    @@@_[i-Menu](MainDrawer)

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
  card-p6:
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

    row-between-p4:
      @@-[Cancel](-1)
      @@[i-Save Save](Contacts)


modal ConfirmDelete:
  card-p6:
    ### Delete Contact?
    > This action cannot be undone

    *> All contact data will be permanently removed

    "> Consider archiving instead of deleting

    row-between-p4:
      @@+[Cancel](-1)
      @@=[i-Trash Delete](Contacts)


drawer MainDrawer:
  col-p6-gap4:
    ![App Logo](https://via.placeholder.com/150x50)
    
    ###### Main Menu

    list:
      - #[i-Users Contacts](Contacts)
      - #[i-Star Favorites](Favorites)
      - #[i-Folder Groups](Groups)
      - #[i-Settings Settings](Settings)

    ---

    card-p4:
      >> Premium Features
      >>> Unlock advanced tools
      @@[i-Crown Upgrade](Premium)

    ---

    @@=[i-LogOut Sign Out](Contacts)


screen Favorites:
  header-p4:
    ## ⭐ Favorites
    @[i-Menu](MainDrawer)

  container-wfull-center-p8:
    col-center-gap4:
      ![Star](https://via.placeholder.com/100)
      
      > No favorites yet
      
      *> Tap the star icon to add contacts

      @@[i-ArrowLeft Back](Contacts)

  navigator:
    - i-Users Contacts | Contacts
    - i-Star Favorites | Favorites
    - i-Settings Settings | Settings


screen Groups:
  header-p4:
    ## Groups
    @[i-Menu](MainDrawer)

  col-p4:
    > Organize contacts by groups

    list:
      - #[Family](Contacts) >>> 5 members
      - #[Work](Contacts) >>> 12 members
      - #[Friends](Contacts) >>> 8 members

    ---

    @@[i-Plus New Group](Contacts)

  navigator:
    - i-Users Contacts | Contacts
    - i-Star Favorites | Favorites
    - i-Settings Settings | Settings


screen Settings:
  header-p4:
    ## Settings
    @[i-Menu](MainDrawer)

  col-p4:
    card-p4-m2:
      #### Account
      
      list:
        - #[Sync Settings](Contacts)
        - #[Backup Settings](Contacts)
        - #[Import Contacts](ImportScreen)
        - #[Export Contacts](ExportScreen)

    ---

    card-p4-m2:
      #### Preferences
      
      [X] Dark mode
      [X] Notifications
      [ ] Auto-backup

    ---

    row-center-p4:
      @@=[Clear Cache](Contacts)

  navigator:
    - i-Users Contacts | Contacts
    - i-Star Favorites | Favorites
    - i-Settings Settings | Settings


screen ImportScreen:
  header-p4:
    ### Import Contacts
    @_[i-ArrowLeft](Settings)

  col-p4:
    > Import from other sources

    list:
      - #[i-FileText CSV File](Settings)
      - #[i-Smartphone Google](Settings)
      - #[i-Cloud iCloud](Settings)

    *> Existing contacts won't be replaced


screen ExportScreen:
  header-p4:
    ### Export Contacts
    @_[i-ArrowLeft](Settings)

  col-p4:
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
  header-p4:
    ### 👑 Premium
    @_[i-ArrowLeft](-1)

  container-wfull-center-p8:
    col-center-gap4:
      ![Crown](https://via.placeholder.com/100)
      
      ## Unlock Premium
      
      > Get exclusive features

      ---

      grid-cols2-gap3:
        card-p4:
          >> ∞
          >>> Unlimited contacts
        card-p4:
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