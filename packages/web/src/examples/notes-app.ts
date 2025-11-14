const notesAppExample = `component NoteCard:
  card:
    stack-tight:
      ## $title
      > $preview
      >>> $date
    @ghost-small[i-Eye View](NoteDetail)


screen Home:
  header:
    >> My Notes
    @ghost-icon[i-Plus](NewNote)

  container:
    # Quick Notes
    > Your thoughts, organized

    list $NoteCard:
      - Meeting Notes | Discussed project timeline and deliverables | Today
      - Ideas for Blog | New post about productivity tips | Yesterday
      - Shopping List | Milk, eggs, bread, coffee | 2 days ago

    ---

    @primary[i-Plus Create New Note](NewNote)

  navigator:
    - i-Home | Home
    - i-Search | Search
    - i-FolderOpen | Folders


modal NewNote:
  card:
    ## New Note

    ___[Title][Give your note a title] | required
    ___textarea[Content][Start writing...]

    ---

    #### Tag
    ( ) Personal
    (X) Work
    ( ) Ideas
    ( ) Important

    ---

    row-between:
      @ghost[Cancel](-1)
      @primary[i-Save Save Note](Home)


screen NoteDetail:
  header:
    ## Note Details
    @ghost-icon[i-ArrowLeft](Home)

  container:
    # Meeting Notes
    >>> Created: Today at 2:30 PM

    ---

    > Discussed project timeline and deliverables with the team.
    > Key points:

    card:
      >> Action Items:
      >>> - Review mockups by Friday
      >>> - Schedule follow-up meeting
      >>> - Send updated proposal

    ---

    row:
      @outline[i-Edit Edit](EditNote)
      @ghost[i-Share Share](Home)
      @destructive[i-Trash Delete](ConfirmDelete)


modal EditNote:
  card:
    ## Edit Note

    ___[Title][Meeting Notes]
    ___textarea[Content][Your note content here...]

    ---

    row-between:
      @ghost[Cancel](-1)
      @primary[i-Save Update](NoteDetail)


screen Search:
  header:
    ## Search Notes
    @ghost-icon[i-ArrowLeft](Home)

  container:
    ___[Search][Type to search...]

    ---

    > Search results will appear here

    card-compact:
      >> Meeting Notes
      >>> Matches: "project timeline"

  navigator:
    - i-Home | Home
    - i-Search | Search
    - i-FolderOpen | Folders


screen Folders:
  header:
    ## Folders
    @ghost-icon[i-Plus](NewFolder)

  container:
    # Organize Your Notes

    card:
      row-between:
        stack-tight:
          >> Work
          >>> 8 notes
        @ghost-small[i-ChevronRight](Home)

    card:
      row-between:
        stack-tight:
          >> Personal
          >>> 12 notes
        @ghost-small[i-ChevronRight](Home)

    card:
      row-between:
        stack-tight:
          >> Ideas
          >>> 5 notes
        @ghost-small[i-ChevronRight](Home)

  navigator:
    - i-Home | Home
    - i-Search | Search
    - i-FolderOpen | Folders


modal NewFolder:
  card:
    ## Create Folder

    ___[Folder Name][Enter name] | required

    #### Color
    (X) Blue
    ( ) Purple
    ( ) Green
    ( ) Orange

    row-between:
      @ghost[Cancel](-1)
      @primary[Create](Folders)


modal ConfirmDelete:
  card:
    ## Delete Note?
    > This note will be moved to trash

    *> You can restore it within 30 days

    row-between:
      @outline[Cancel](-1)
      @destructive[i-Trash Delete](Home)
`

export default notesAppExample
