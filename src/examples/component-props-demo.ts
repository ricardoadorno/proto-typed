/**
 * Demo example showing component props functionality
 * This example demonstrates the new component props syntax: $Component: prop1 | prop2 | prop3
 * And variable substitution with %prop syntax
 */

export const componentPropsDemo = `component SimpleCard:
  card:
    # %title
    > %content

component UserCard:
  card:
    # %name
    > Email: %email
    > Role: %role
    @[Edit Profile](edit-%userId)

screen ComponentPropsDemo:
  # Component Props Demo
  > This demonstrates the new component props feature
  
  ## Simple Test
  $SimpleCard: Hello World | This is a test message
  
  ## User Cards  
  $UserCard: João Silva | joao@email.com | Admin | user123
  $UserCard: Maria Santos | maria@email.com | User | user456
`;

export default componentPropsDemo;