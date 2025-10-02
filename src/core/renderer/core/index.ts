/**
 * Data Gateway Module Export
 * Centralized exports for the data gateway system
 */

// Core interfaces and types
export type {
  DataStrategy,
  DataResult,
  QueryLayer,
  MutationLayer,
  EventManager,
  DataGatewayConfig,
  QueryParams,
  MutationParams,
  RenderUpdateTrigger,
  DataEvent,
  DataEventType,
  DataEventListener
} from './data-gateway-types';

// Event system
export {
  DataEventManager,
  globalDataEventManager,
  createDataEvent,
  DataEventEmitters
} from './data-event-manager';

// Session storage strategy
export {
  SessionStorageStrategy
} from './session-storage-strategy';

// Main data gateway
export {
  DataGateway,
  createSessionStorageGateway,
  globalDataGateway
} from './data-gateway';

// Usage example and documentation
export const DataGatewayUsage = {
  /**
   * Basic Query Operations
   */
  async exampleQueries() {
    const { createSessionStorageGateway } = await import('./data-gateway');
    const gateway = createSessionStorageGateway();
    await gateway.initialize();

    // Get single item
    const userResult = await gateway.query.get<{ name: string; email: string }>('user:1');
    
    // Get all items with filtering
    const usersResult = await gateway.query.getAll<{ name: string; active: boolean }>({
      filter: { active: true },
      sort: { field: 'name', direction: 'asc' },
      limit: 10
    });

    // Check if item exists
    const existsResult = await gateway.query.exists('user:1');

    // Find items with custom filter
    const activeUsersResult = await gateway.query.find<{ active: boolean }>(
      (user: { active: boolean }) => user.active === true
    );

    return { userResult, usersResult, existsResult, activeUsersResult };
  },

  /**
   * Basic Mutation Operations
   */
  async exampleMutations() {
    const { createSessionStorageGateway } = await import('./data-gateway');
    const gateway = createSessionStorageGateway();
    await gateway.initialize();

    // Create new item
    const createResult = await gateway.mutation.create({
      key: 'user:1',
      data: { name: 'John Doe', email: 'john@example.com', active: true }
    });

    // Update existing item
    const updateResult = await gateway.mutation.update({
      key: 'user:1',
      data: { name: 'John Smith' },
      merge: true // Merge with existing data
    });

    // Upsert (create or update)
    const upsertResult = await gateway.mutation.upsert({
      key: 'user:2',
      data: { name: 'Jane Doe', email: 'jane@example.com', active: true }
    });

    // Delete item
    const deleteResult = await gateway.mutation.delete('user:1');

    return { createResult, updateResult, upsertResult, deleteResult };
  },

  /**
 * Event Subscription Examples
 */
  async setupEventListeners() {
    const { createSessionStorageGateway } = await import('./data-gateway');
    const gateway = createSessionStorageGateway();

    // Listen to all data changes
    const unsubscribeAll = gateway.events.subscribe(
      ['data:created', 'data:updated', 'data:deleted'],
      (event) => {
        console.log('Data changed:', event);
      }
    );

    // Listen to specific key changes
    const unsubscribeUser = gateway.events.subscribe(
      'data:updated',
      (event) => {
        console.log('User updated:', event.data);
      },
      'user:1' // Only for this specific key
    );

    // Listen to creation events only
    const unsubscribeCreated = gateway.events.subscribe(
      'data:created',
      (event) => {
        console.log('New item created:', event.key, event.data);
      }
    );

    return () => {
      unsubscribeAll();
      unsubscribeUser();
      unsubscribeCreated();
    };
  },

  /**
   * Integration with RouteManager for automatic re-rendering
   */
  setupRouteManagerIntegration() {
    // RouteManager will automatically be set as render update trigger
    // when passed to the constructor or via setDataGateway method
    
    // Example usage in a component or application setup:
    /*
    const gateway = createSessionStorageGateway();
    const routeManager = new RouteManager(gateway);
    
    // Add render callback to trigger UI updates
    const unsubscribe = routeManager.addRenderCallback((target) => {
      if (target) {
        console.log('Re-render specific target:', target);
        // Trigger targeted component update
      } else {
        console.log('Re-render full application');
        // Trigger full application re-render
      }
    });
    
    return unsubscribe;
    */
  }
};

/**
 * Type definitions for DSL data operations
 * These types can be used in DSL syntax for data-driven components
 */
export interface DSLDataOperations {
  // For use in DSL syntax like: data.query.get('user:1')
  query: {
    get: <T>(key: string) => Promise<T | null>;
    getAll: <T>(params?: {
      filter?: Record<string, any>;
      sort?: { field: string; direction: 'asc' | 'desc' };
      limit?: number;
      offset?: number;
    }) => Promise<T[]>;
    find: <T>(filter: (item: T) => boolean) => Promise<T[]>;
  };
  
  // For use in DSL syntax like: data.mutation.create('user:1', userData)
  mutation: {
    create: <T>(key: string, data: T) => Promise<boolean>;
    update: <T>(key: string, data: Partial<T>, merge?: boolean) => Promise<boolean>;
    delete: (key: string) => Promise<boolean>;
  };
}