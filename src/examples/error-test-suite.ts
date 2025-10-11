/**
 * Error Test Suite - Comprehensive DSL with intentional errors
 * 
 * This file contains intentional errors to test the error handling system:
 * - Lexer errors (invalid tokens)
 * - Parser errors (syntax issues)
 * - Builder errors (semantic validation failures)
 * - Render errors (runtime issues)
 * 
 * Expected: Monaco markers + Error terminal display + Partial preview
 */

export const errorTestSuite = `screen ValidContent
  header:
    # Error Test Suite
    @ghost[Navigate](NavigationTest)
  
  container:
    card:
      ## Valid Content Section
      > This screen should render perfectly with zero errors
      > Use this as a baseline for comparison
      @primary-lg[Navigate to Tests](NavigationTest)
      @secondary[View Input Errors](InputErrors)
    
    card:
      ## Test Categories
      > 1. Invalid screen names (lowercase_invalid, 123Invalid)
      > 2. Invalid button variants (invalid-variant, primary-xxxl)
      > 3. Invalid input types (invalid-type)
      > 4. Invalid component names (lowercase_component)
      > 5. Duplicate screen names (DuplicateTest)
      > 6. Component props mismatch
      @outline[See All Tests](NavigationTest)
  
  navigator:
    - Valid | ValidContent
    - Tests | NavigationTest
    - Inputs | InputErrors

screen lowercase_invalid:
  container:
    card:
      # Test 1: Invalid Screen Names
      > This screen name should trigger PT-BLD-002 (must start uppercase)
      > Expected error: Screen names must start with uppercase letter

screen 123Invalid:
  container:
    card:
      # Test 1b: Invalid Screen Names  
      > This screen name should trigger PT-BLD-002 (invalid characters)
      > Expected error: Screen names must start with letter

screen ButtonErrors:
  container:
    card:
      # Test 2: Invalid Button Variants
      > These buttons have invalid variants and sizes
      @invalid-variant[Invalid Variant](action)
      @primary-xxxl[Invalid Size](action)
      @ghost[Valid Button](ValidContent)

screen InputErrors:
  container:
    card:
      # Test 3: Invalid Input Types
      > These inputs have invalid type specifiers
      ___invalid-type: Label{Enter value}
      ___text: Valid Text Input{Type here}
      ___email: Valid Email{Enter email}

component lowercase_component:
  container:
    card:
      # Test 4: Invalid Component Names
      > Component names must start uppercase

component 123Component:
  container:
    card:
      > Component names cannot start with numbers

screen DuplicateTest:
  container:
    card:
      # Test 5: Duplicate Screen Names (First)
      > First declaration of DuplicateTest

screen DuplicateTest:
  container:
    card:
      # Test 5: Duplicate Screen Names (Second)
      > Duplicate screen name - should trigger PT-BLD-003

component UserCard:
  container:
    card:
      > Name: %name
      > Email: %email
      > Phone: %phone

screen PropsTest:
  container:
    card:
      # Test 6: Component Props Mismatch
      > Lists below have wrong number of prop values
    
    list $UserCard:
      - John | john@email.com
      - Jane | jane@email.com | 555-5678 | ExtraValue

screen ValidScreen:
  container:
    card:
      # Additional Valid Screen
      > This screen also has no errors
      @primary[Back to Main](ValidContent)
  
  navigator:
    - Main | ValidContent
    - Valid | ValidScreen
    - Nav Test | NavigationTest

screen NavigationTest:
  container:
    card:
      # Test 8: Navigation to Non-Existent Screen
      > Button below navigates to screen that does not exist
      @warning[Go to NonExistent](NonExistentScreen)
      @secondary[Go back](-1)
      @primary[Back to Valid](ValidContent)

`;

export default errorTestSuite;
