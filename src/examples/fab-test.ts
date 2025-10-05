export const fabTestExample = `
screen TestFAB:
  header:
    # FAB Test Screen
    > Testing the new FAB syntax

  container:
    ## Example FAB Elements
    > Below are examples of FAB with different icons and actions:
    
    ### Basic FAB
    > A FAB with plus icon that navigates to TestScreen
    
    ### Multiple FABs
    > Multiple FABs can be placed in different sections
    
  card:
    > This card shows how FAB works in the new syntax
    > fab{icon}(action) - where icon is the content and action is the navigation target
    
  fab{+}(TestScreen)

screen TestScreen:
  header:
    # Target Screen
    > This is the screen the FAB navigates to
    
  container:
    > FAB navigation worked!
    @[Go Back](TestFAB)
    
  fab{←}(TestFAB)
`;