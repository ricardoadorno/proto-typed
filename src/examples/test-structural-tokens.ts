/**
 * Test example for structural tokens
 * Tests Separator, OrderedListItem and UnorderedListItem
 */

export const testStructuralTokens = `screen TestStructural:
  # Testing Structural Tokens

  > Testing separator:
  ---
  
  > Testing ordered list:
  1. First item
  2. Second item  
  3. Third item
  
  > Testing unordered list:
  - First bullet point
  - Second bullet point
  - Third bullet point
  
  ---
  
  > End of test
`;

export default testStructuralTokens;