/**
 * Data-Driven Components Demo
 * Shows how to use components with SessionStorage data sources
 */

export const dataComponentDemo = `
screen DataComponentDemo:
  container:
    # Data-Driven Components Demo
    > This demo shows components that fetch data from SessionStorage
    
    row:
      col:
        ## User Profile Component
        > Regular component with props:
        $UserCard: John Doe | john@example.com | Software Engineer
        
        ---
        
        ## User Profile with Data Source
        > Component fetching data from SessionStorage:
        $UserCard(st://user-john)
        
        ---
        
        ## Product Card with Data
        > Product information from storage:
        $ProductCard(st://product-laptop)
        
      col:
        ## Data Setup
        > SessionStorage should contain:
        
        card:
          # user-john
          \`\`\`json
          {
            "name": "John Doe",
            "email": "john@example.com", 
            "role": "Software Engineer",
            "avatar": "/avatars/john.jpg"
          }
          \`\`\`
          
        card:
          # product-laptop
          \`\`\`json
          {
            "name": "MacBook Pro",
            "price": "$2,499",
            "category": "Laptops",
            "rating": "4.8",
            "image": "/products/macbook.jpg"
          }
          \`\`\`

component UserCard:
  card:
    row:
      col:
        ![User Avatar](%avatar)
      col:
        # %name
        > %email
        *> %role

component ProductCard:
  card:
    ![Product Image](%image)
    # %name
    > Category: %category
    > Price: %price
    > Rating: %rating ⭐
    
    @[Add to Cart](add-to-cart)
    @_[View Details](view-details)
`;

/**
 * Helper function to setup demo data in SessionStorage
 */
export function setupDataComponentDemoData() {
  // Setup user data
  const userData = {
    name: "John Doe",
    email: "john@example.com",
    role: "Software Engineer",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
  };
  
  // Setup product data
  const productData = {
    name: "MacBook Pro",
    price: "$2,499",
    category: "Laptops", 
    rating: "4.8",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=200&fit=crop"
  };
  
  // Store in SessionStorage with the proto-typed prefix
  sessionStorage.setItem('proto-typed:data:user-john', JSON.stringify(userData));
  sessionStorage.setItem('proto-typed:data:product-laptop', JSON.stringify(productData));
  
  console.log('Demo data stored in SessionStorage:');
  console.log('- user-john:', userData);
  console.log('- product-laptop:', productData);
}

/**
 * Clear demo data from SessionStorage
 */
export function clearDataComponentDemoData() {
  sessionStorage.removeItem('proto-typed:data:user-john');
  sessionStorage.removeItem('proto-typed:data:product-laptop');
  console.log('Demo data cleared from SessionStorage');
}

/**
 * Usage instructions
 */
export const dataComponentUsageInstructions = `
# Data-Driven Components Usage

## Setup Data Source
Components can fetch data from SessionStorage using the \`st://key\` syntax:

\`\`\`dsl
$ComponentName(st://data-key)
\`\`\`

## Variable Substitution
Inside the component, use \`%variableName\` to reference data properties:

\`\`\`dsl
component UserCard:
  # %name          // Will be replaced with data.name
  > %email         // Will be replaced with data.email
  *> %role         // Will be replaced with data.role
\`\`\`

## SessionStorage Format
Data should be stored as JSON in SessionStorage with the key pattern:
\`proto-typed:data:your-key\`

## Example
\`\`\`javascript
// Store data
const userData = { name: "John", email: "john@example.com" };
sessionStorage.setItem('proto-typed:data:user-123', JSON.stringify(userData));

// Use in DSL
$UserCard(st://user-123)
\`\`\`

## Benefits
- **Dynamic Content**: Components automatically update when data changes
- **Reusable**: Same component can display different data
- **Type Safe**: Data structure is validated at runtime
- **Event-Driven**: Changes trigger re-renders automatically
`;