/**
 * Data Gateway Demo Example
 * Demonstrates the complete data gateway system with SessionStorage
 */

import { createSessionStorageGateway } from '../core/renderer/core/data-gateway';

export const dataGatewayDemo = `
screen DataGatewayDemo:
  container:
    # Data Gateway Demo
    > This demo shows how to use the Data Gateway system for persistent data management.

    row:
      col:
        ## User Management
        
        > Create new user:
        ___:Name{Enter user name}
        ___:Email{Enter email address}
        @[Create User](create-user)
        
        ---
        
        ## User List
        > Current users in storage:
        list:
          - [John Doe](view-john){john@example.com}[Edit](edit-john)@=[Delete](delete-john)
          - [Jane Smith](view-jane){jane@example.com}[Edit](edit-jane)@=[Delete](delete-jane)
          - [Bob Wilson](view-bob){bob@example.com}[Edit](edit-bob)@=[Delete](delete-bob)
        
        @[Refresh List](refresh-users)
        @_[Clear All](clear-all-users)
        
      col:
        ## Storage Information
        
        > Session Storage Status:
        - Total items: 15
        - Our data items: 3
        - Estimated size: 2.1KB
        
        ---
        
        ## Event Log
        > Recent data events:
        
        card:
          *> [14:32:15] Created user: john@example.com
          *> [14:31:48] Updated user: jane@example.com  
          *> [14:30:22] Deleted user: old-user@example.com
          *> [14:29:55] Queried all users
          
modal UserForm:
  container:
    # Edit User
    > Update user information:
    
    ___:Name{User name}
    ___:Email{Email address}
    [X] Active
    [ ] Admin
    
    row:
      @[Save Changes](save-user)
      @_[Cancel](close-modal)

drawer DataEvents:
  container:
    # Live Data Events
    > Real-time data change notifications:
    
    list:
      - Event: data:created{Key: user:123, Timestamp: 14:32:15}
      - Event: data:updated{Key: user:456, Timestamp: 14:31:48}  
      - Event: data:deleted{Key: user:789, Timestamp: 14:30:22}
      - Event: data:queried{Key: __getAll__, Timestamp: 14:29:55}
    
    @[Clear Events](clear-events)
`;

/**
 * Demo implementation showing how to integrate the Data Gateway
 */
export class DataGatewayDemoImplementation {
  private gateway = createSessionStorageGateway({
    keyPrefix: 'demo:users:',
    enableEvents: true
  });

  private eventLog: Array<{ timestamp: string; event: string; key: string }> = [];

  async initialize() {
    // Initialize the data gateway
    await this.gateway.initialize();
    
    // Setup event listeners for demo
    this.setupEventListeners();
    
    // Create some demo data
    await this.createDemoData();
  }

  private setupEventListeners() {
    // Listen to all data events
    this.gateway.events.subscribe(
      ['data:created', 'data:updated', 'data:deleted', 'data:queried'],
      (event) => {
        const timestamp = new Date().toLocaleTimeString();
        this.eventLog.unshift({
          timestamp,
          event: event.type,
          key: event.key
        });
        
        // Keep only last 10 events
        this.eventLog = this.eventLog.slice(0, 10);
        
        console.log(`[${timestamp}] ${event.type}: ${event.key}`, event.data);
      }
    );
  }

  private async createDemoData() {
    // Create demo users
    const demoUsers = [
      { id: 'john', name: 'John Doe', email: 'john@example.com', active: true },
      { id: 'jane', name: 'Jane Smith', email: 'jane@example.com', active: true },
      { id: 'bob', name: 'Bob Wilson', email: 'bob@example.com', active: false }
    ];

    for (const user of demoUsers) {
      await this.gateway.mutation.create({
        key: `user:${user.id}`,
        data: user
      });
    }
  }

  // Demo methods that would be called by DSL actions
  async createUser(name: string, email: string) {
    const id = Math.random().toString(36).substr(2, 9);
    
    const result = await this.gateway.mutation.create({
      key: `user:${id}`,
      data: {
        id,
        name,
        email,
        active: true,
        createdAt: new Date().toISOString()
      }
    });

    return result.success;
  }

  async updateUser(userId: string, updates: Partial<{ name: string; email: string; active: boolean }>) {
    const result = await this.gateway.mutation.update({
      key: `user:${userId}`,
      data: updates,
      merge: true
    });

    return result.success;
  }

  async deleteUser(userId: string) {
    const result = await this.gateway.mutation.delete(`user:${userId}`);
    return result.success;
  }

  async getAllUsers() {
    const result = await this.gateway.query.getAll<{
      id: string;
      name: string;
      email: string;
      active: boolean;
    }>({
      sort: { field: 'name', direction: 'asc' }
    });

    return result.success ? result.data : [];
  }

  async getActiveUsers() {
    const result = await this.gateway.query.find<{ active: boolean }>(
      user => user.active === true
    );

    return result.success ? result.data : [];
  }

  async clearAllUsers() {
    const result = await this.gateway.mutation.clear();
    return result.success;
  }

  getEventLog() {
    return this.eventLog;
  }

  getStorageInfo() {
    // This would call the SessionStorage strategy's getStorageInfo method
    return {
      totalItems: 15,
      ourItems: this.eventLog.length,
      estimatedSize: '2.1KB'
    };
  }
}

/**
 * Integration example showing how to connect with RouteManager
 */
export function setupDataGatewayWithRouting() {
  // Example of how to integrate with the existing RouteManager
  /*
  import { RouteManager } from '../core/route-manager';
  
  const gateway = createSessionStorageGateway();
  const routeManager = new RouteManager(gateway);
  
  // Add render callback for automatic re-rendering on data changes
  const unsubscribe = routeManager.addRenderCallback((target) => {
    if (target?.startsWith('user:')) {
      // Re-render user-specific components
      console.log('Re-rendering user component:', target);
    } else {
      // Re-render the entire user list
      console.log('Re-rendering full user interface');
    }
  });
  
  // The gateway will now automatically trigger re-renders when:
  // - New users are created
  // - Existing users are updated
  // - Users are deleted
  // - User queries are performed
  
  return { gateway, routeManager, unsubscribe };
  */
}

/**
 * Usage patterns for different data operations
 */
export const DataGatewayPatterns = {
  // Pattern 1: Simple CRUD operations
  async simpleCrud() {
    const gateway = createSessionStorageGateway();
    await gateway.initialize();

    // Create
    await gateway.mutation.create({
      key: 'settings:theme',
      data: { mode: 'dark', primaryColor: 'blue' }
    });

    // Read
    const result = await gateway.query.get('settings:theme');
    
    // Update
    await gateway.mutation.update({
      key: 'settings:theme',
      data: { primaryColor: 'green' },
      merge: true
    });

    // Delete
    await gateway.mutation.delete('settings:theme');
  },

  // Pattern 2: List management with filtering
  async listManagement() {
    const gateway = createSessionStorageGateway();
    await gateway.initialize();

    // Get all active items
    const activeItems = await gateway.query.getAll({
      filter: { active: true },
      sort: { field: 'name', direction: 'asc' },
      limit: 10
    });

    // Find items with custom criteria
    const recentItems = await gateway.query.find((item: any) => 
      Date.now() - new Date(item.createdAt).getTime() < 86400000 // 24 hours
    );

    return { activeItems, recentItems };
  },

  // Pattern 3: Event-driven UI updates
  setupReactiveUI() {
    const gateway = createSessionStorageGateway();
    
    // Auto-update user count display
    gateway.events.subscribe(['data:created', 'data:deleted'], (event: any) => {
      if (event.key.startsWith('user:')) {
        // Update user count in UI
        console.log('User count changed');
      }
    });

    // Auto-refresh user list
    gateway.events.subscribe('data:updated', (event: any) => {
      if (event.key.startsWith('user:')) {
        // Refresh user list display
        console.log('User list needs refresh');
      }
    });
  }
};