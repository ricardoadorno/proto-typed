export const fabTestExample = `
screen TestFab:
  header:
    # Fab Test Screen
    > Testing the new Fab syntax

  container:
    ## Example Fab Elements
    > Below are examples of Fab with different icons and actions:
    
    ### Basic Fab
    > A Fab with plus icon that navigates to TestScreen
    
    ### Multiple Fabs
    > Multiple Fabs can be placed in different sections
    
  card:
    > This card shows how Fab works in the new syntax
    > fab:
    >   - icon | destination
    
  fab:
    - + | TestScreen

screen TestScreen:
  header:
    # Target Screen
    > This is the screen the Fab navigates to
    
  container:
    > Fab navigation worked!
    @primary[Go Back](TestFab)
    
  fab:
    - ← | TestFab
`;