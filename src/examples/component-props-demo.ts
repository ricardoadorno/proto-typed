/**
 * Demo example showing component props functionality
 * This example demonstrates the new component props syntax: $Component: prop1 | prop2 | prop3
 * And variable substitution with %prop syntax
 * Plus the new list with component functionality: list $Component:
 */

export const componentPropsDemo = `component ContactItem:
  card:
    # %name
    > Phone: %phone
    > Email: %email
    @primary[Call](call-%phone)
    @secondary[Email](mailto-%email)

component ProductItem:
  card:
    # %title
    > Price: R$ %price
    > %description
    @primary[Buy Now](buy-%id)

component TaskItem:
  container:
    > %title - Status: %status
    > Due: %deadline
    @success[Complete](complete-%id)

screen ComponentPropsDemo:
  # Component Props & Lists Demo
  > This demonstrates component props and componentized lists
  
  ## Contact List (Using Component Template)
  list $ContactItem:
    - João Silva | (11) 99999-9999 | joao@email.com
    - Maria Santos | (11) 88888-8888 | maria@email.com
    - Pedro Costa | (11) 77777-7777 | pedro@email.com
    - Ana Lima | (11) 66666-6666 | ana@email.com
  
  ## Product Catalog (Using Component Template)
  list $ProductItem:
    - iPhone 15 | 5499 | Latest Apple smartphone with advanced features | iphone15
    - MacBook Pro | 8999 | Powerful laptop for professionals | macbook-pro
    - AirPods Pro | 1299 | Wireless earbuds with noise cancellation | airpods-pro
    - iPad Air | 3999 | Versatile tablet for work and play | ipad-air
  
  ## Task List (Using Component Template)
  list $TaskItem:
    - Review Code | In Progress | Today | task001
    - Deploy to Production | Pending | Tomorrow | task002
    - Update Documentation | Completed | Yesterday | task003
    - Write Tests | Not Started | Next Week | task004
  
  ## Individual Components (Traditional Way)
  > For comparison, here are individual component instances:
  
  $ContactItem: Ricardo Adorno | (11) 55555-5555 | ricardo@email.com
  $ProductItem: Apple Watch | 2499 | Smart watch with health features | apple-watch
`;

export default componentPropsDemo;