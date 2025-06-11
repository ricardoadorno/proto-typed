import { ExampleCategory } from '../types';

/**
 * Layout component examples showcasing grid, flexbox, cards, and list layouts
 */
export const layoutExamples: ExampleCategory = {
  title: "Layout Elements",
  examples: [
    {
      name: "Grid Layout",
      code: `screen GridExample:
  row:
    col:
      # First Column
      > Content in first column
    col:
      # Second Column
      > Content in second column`,
      description: "Create responsive layouts with rows and columns for grid-based designs"
    },
    {
      name: "Card Container",
      code: `screen CardExample:
  card:
    # Card Title
    > Card content goes here with multiple lines
    > More content in the same card
    @[Action Button](action)`,
      description: "Group related content in a container with header and actions"
    },
    {
      name: "Simple List",
      code: `screen SimpleListExample:
  list:
    - User Profile
    - Task Status
    - Project Update
    - Settings
    - Help Center`,
      description: "Create simple lists with basic text items"
    },
    {
      name: "Advanced Interactive List",
      code: `screen AdvancedListExample:
  list:
    - [User](user-profile)John Doe{Software Engineer}@+[Edit](edit)@-[View](view)
    - [Star](star)Important Task{Complete by Friday}@![Priority](priority)@=[Complete](complete)
    - [Project](project-page)Bug Report{Fix login validation}@_[Assign](assign)@+[Comment](comment)
    - Simple text item
    - [Settings](settings)Account Settings{Update preferences}@-[Change](change)`,
      description: "Create rich interactive list items with links, subtitles, and action buttons with variants"
    },
    {
      name: "Content Separators",
      code: `screen SeparatorExample:
  # First Section
  > Content above separator
  ---
  # Second Section
  > Content below separator
  --
  # Third Section
  > Content with empty space above`,
      description: "Use separators (---) for visual breaks and empty divs (--) for spacing"
    },
    {
      name: "Nested Layout",
      code: `screen NestedLayoutExample:
  card:
    # Main Container
    row:
      col:
        ## Left Side
        list:
          - Dashboard
          - Analytics
          - Reports
      col:
        ## Right Side
        card:
          ### Metrics
          > Key performance indicators
          @[View Details](details)`,
      description: "Combine multiple layout elements for complex nested structures"
    }
  ]
};

export default layoutExamples;
