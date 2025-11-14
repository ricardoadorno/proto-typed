const todoListExample = `component TaskItem:
  card-compact:
    row-between:
      stack-tight:
        >> $task
        >>> $category
      @ghost-small[i-Check](Home)


screen Home:
  header:
    >> My Tasks
    @ghost-icon[i-Menu](Menu)

  container:
    # Today's Tasks
    > Keep track of your daily activities

    list $TaskItem:
      - Finish project presentation | Work
      - Buy groceries | Personal
      - Call dentist | Health
      - Review pull requests | Work

    ---

    @primary[i-Plus Add New Task](NewTask)

  navigator:
    - i-Home | Home
    - i-CheckSquare | Completed
    - i-Settings | Settings


modal NewTask:
  card:
    ## Add New Task
    > Fill in the task details

    ___[Task][What needs to be done?] | required

    #### Category
    (X) Work
    ( ) Personal
    ( ) Health
    ( ) Other

    ---

    [X] High priority
    [ ] Send notification

    ---

    row-between:
      @secondary[Cancel](-1)
      @primary[i-Plus Add Task](Home)


screen Completed:
  header:
    ## Completed Tasks
    @ghost-icon[i-ArrowLeft](Home)

  container:
    > Tasks you've already finished

    card:
      stack-tight:
        >> ✓ Deploy to production
        >>> Work

    card:
      stack-tight:
        >> ✓ Morning workout
        >>> Health

    ---

    @outline[Clear All](Completed)

  navigator:
    - i-Home | Home
    - i-CheckSquare | Completed
    - i-Settings | Settings


drawer Menu:
  stack:
    # Menu
    >> Task Manager

    ---

    > [Home](Home)
    > [Completed Tasks](Completed)
    > [Settings](Settings)

    ---

    card:
      >> Need help?
      >>> Check our documentation
      @primary-small[Learn More](Home)


screen Settings:
  header:
    ## Settings
    @ghost-icon[i-ArrowLeft](Home)

  container:
    card:
      ## Preferences

      [X] Show notifications
      [X] Dark mode
      [ ] Auto-archive completed
      [ ] Weekly summary email

    ---

    card:
      ## Data Management

      row:
        @outline[Export Tasks](Settings)
        @destructive[Clear All Data](ConfirmClear)

  navigator:
    - i-Home | Home
    - i-CheckSquare | Completed
    - i-Settings | Settings


modal ConfirmClear:
  card:
    ## Clear All Data?
    > This action cannot be undone

    *> All your tasks and settings will be permanently deleted.

    row-between:
      @secondary[Cancel](-1)
      @destructive[Delete Everything](Settings)
`

export default todoListExample
