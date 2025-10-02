/**
 * Data Gateway Implementation
 * Central orchestrator for data operations with event-driven architecture
 */

import {
  DataStrategy,
  DataResult,
  QueryLayer,
  MutationLayer,
  EventManager,
  DataGatewayConfig,
  QueryParams,
  MutationParams,
  RenderUpdateTrigger
} from './data-gateway-types';

import { DataEventManager, DataEventEmitters } from './data-event-manager';
import { SessionStorageStrategy } from './session-storage-strategy';

/**
 * Query Layer Implementation
 */
class DataQueryLayer implements QueryLayer {
  constructor(
    private strategy: DataStrategy,
    private source: string = 'query-layer'
  ) {}

  async get<T>(key: string): Promise<DataResult<T>> {
    try {
      const result = await this.strategy.get<T>(key);
      
      if (result.success && result.data !== undefined) {
        DataEventEmitters.queried(key, result.data, this.source);
      }
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      DataEventEmitters.error(key, errorMessage, this.source);
      
      return {
        success: false,
        error: errorMessage,
        timestamp: Date.now()
      };
    }
  }

  async getAll<T>(params?: QueryParams): Promise<DataResult<T[]>> {
    try {
      const allDataResult = await this.strategy.getAll<T>();
      
      if (!allDataResult.success || !allDataResult.data) {
        return {
          success: false,
          error: allDataResult.error || 'Failed to retrieve all data',
          timestamp: Date.now()
        };
      }

      let items = Object.entries(allDataResult.data).map(([key, value]) => ({
        key,
        value
      }));

      // Apply filtering if provided
      if (params?.filter) {
        items = items.filter(item => {
          const filterEntries = Object.entries(params.filter!);
          return filterEntries.every(([filterKey, filterValue]) => {
            const itemValue = (item.value as any)?.[filterKey];
            return itemValue === filterValue;
          });
        });
      }

      // Apply sorting if provided
      if (params?.sort) {
        items.sort((a, b) => {
          const aValue = (a.value as any)?.[params.sort!.field];
          const bValue = (b.value as any)?.[params.sort!.field];
          
          if (aValue < bValue) return params.sort!.direction === 'asc' ? -1 : 1;
          if (aValue > bValue) return params.sort!.direction === 'asc' ? 1 : -1;
          return 0;
        });
      }

      // Apply pagination if provided
      if (params?.offset !== undefined || params?.limit !== undefined) {
        const offset = params.offset || 0;
        const limit = params.limit || items.length;
        items = items.slice(offset, offset + limit);
      }

      const result = items.map(item => item.value);

      // Emit query event for the operation
      DataEventEmitters.queried('__getAll__', result, this.source);

      return {
        success: true,
        data: result,
        timestamp: Date.now()
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      DataEventEmitters.error('__getAll__', errorMessage, this.source);
      
      return {
        success: false,
        error: errorMessage,
        timestamp: Date.now()
      };
    }
  }

  async exists(key: string): Promise<DataResult<boolean>> {
    const result = await this.get(key);
    return {
      success: true,
      data: result.success,
      timestamp: Date.now()
    };
  }

  async find<T>(filter: (item: T) => boolean): Promise<DataResult<T[]>> {
    try {
      const allDataResult = await this.strategy.getAll<T>();
      
      if (!allDataResult.success || !allDataResult.data) {
        return {
          success: false,
          error: allDataResult.error || 'Failed to retrieve data for filtering',
          timestamp: Date.now()
        };
      }

      const filteredItems = Object.values(allDataResult.data).filter(filter);

      DataEventEmitters.queried('__find__', filteredItems, this.source);

      return {
        success: true,
        data: filteredItems,
        timestamp: Date.now()
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      DataEventEmitters.error('__find__', errorMessage, this.source);
      
      return {
        success: false,
        error: errorMessage,
        timestamp: Date.now()
      };
    }
  }
}

/**
 * Mutation Layer Implementation
 */
class DataMutationLayer implements MutationLayer {
  constructor(
    private strategy: DataStrategy,
    private source: string = 'mutation-layer'
  ) {}

  async create<T>(params: MutationParams<T>): Promise<DataResult<T>> {
    try {
      // Check if key already exists
      const existsResult = await this.strategy.get(params.key);
      if (existsResult.success) {
        return {
          success: false,
          error: `Key '${params.key}' already exists. Use update or upsert instead.`,
          timestamp: Date.now()
        };
      }

      const result = await this.strategy.set(params.key, params.data!);
      
      if (result.success) {
        DataEventEmitters.created(params.key, params.data!, this.source);
      }
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      DataEventEmitters.error(params.key, errorMessage, this.source);
      
      return {
        success: false,
        error: errorMessage,
        timestamp: Date.now()
      };
    }
  }

  async update<T>(params: MutationParams<T>): Promise<DataResult<T>> {
    try {
      // Get existing data for event comparison
      const existingResult = await this.strategy.get<T>(params.key);
      
      let finalData: T = params.data!;
      
      // Handle merge if requested and existing data exists
      if (params.merge && existingResult.success && existingResult.data) {
        if (typeof params.data === 'object' && typeof existingResult.data === 'object' && params.data !== null && existingResult.data !== null) {
          finalData = { ...(existingResult.data as Record<string, any>), ...(params.data as Record<string, any>) } as T;
        }
      }

      const result = await this.strategy.set(params.key, finalData);
      
      if (result.success) {
        DataEventEmitters.updated(
          params.key, 
          finalData, 
          existingResult.success ? existingResult.data : undefined,
          this.source
        );
      }
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      DataEventEmitters.error(params.key, errorMessage, this.source);
      
      return {
        success: false,
        error: errorMessage,
        timestamp: Date.now()
      };
    }
  }

  async delete(key: string): Promise<DataResult<boolean>> {
    try {
      // Get existing data for event
      const existingResult = await this.strategy.get(key);
      
      const result = await this.strategy.remove(key);
      
      if (result.success) {
        DataEventEmitters.deleted(
          key, 
          existingResult.success ? existingResult.data : undefined,
          this.source
        );
      }
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      DataEventEmitters.error(key, errorMessage, this.source);
      
      return {
        success: false,
        error: errorMessage,
        timestamp: Date.now()
      };
    }
  }

  async upsert<T>(params: MutationParams<T>): Promise<DataResult<T>> {
    try {
      const existsResult = await this.strategy.get(params.key);
      
      if (existsResult.success) {
        // Update existing
        return this.update(params);
      } else {
        // Create new
        return this.create(params);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      DataEventEmitters.error(params.key, errorMessage, this.source);
      
      return {
        success: false,
        error: errorMessage,
        timestamp: Date.now()
      };
    }
  }

  async clear(): Promise<DataResult<boolean>> {
    try {
      const result = await this.strategy.clear();
      
      if (result.success) {
        DataEventEmitters.deleted('__all__', undefined, this.source);
      }
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      DataEventEmitters.error('__all__', errorMessage, this.source);
      
      return {
        success: false,
        error: errorMessage,
        timestamp: Date.now()
      };
    }
  }
}

/**
 * Main Data Gateway Class
 */
export class DataGateway {
  private strategy: DataStrategy;
  private eventManager: EventManager;
  private queryLayer: QueryLayer;
  private mutationLayer: MutationLayer;
  private renderUpdateTrigger?: RenderUpdateTrigger;
  private config: Required<DataGatewayConfig>;
  private isInitialized = false;

  constructor(config: DataGatewayConfig) {
    this.config = {
      strategy: config.strategy,
      enableEvents: config.enableEvents ?? true,
      autoRetry: config.autoRetry ?? true,
      retryAttempts: config.retryAttempts ?? 3,
      cacheTimeout: config.cacheTimeout ?? 0
    };

    this.strategy = this.config.strategy;
    this.eventManager = new DataEventManager();
    this.queryLayer = new DataQueryLayer(this.strategy);
    this.mutationLayer = new DataMutationLayer(this.strategy);
  }

  /**
   * Initialize the data gateway
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    await this.strategy.initialize();
    this.isInitialized = true;

    // Setup auto-render updates if events are enabled
    if (this.config.enableEvents && this.renderUpdateTrigger) {
      this.setupAutoRenderUpdates();
    }
  }

  /**
   * Get query layer for data retrieval operations
   */
  get query(): QueryLayer {
    this.ensureInitialized();
    return this.queryLayer;
  }

  /**
   * Get mutation layer for data modification operations
   */
  get mutation(): MutationLayer {
    this.ensureInitialized();
    return this.mutationLayer;
  }

  /**
   * Get event manager for subscribing to data changes
   */
  get events(): EventManager {
    return this.eventManager;
  }

  /**
   * Set render update trigger for automatic re-rendering
   */
  setRenderUpdateTrigger(trigger: RenderUpdateTrigger): void {
    this.renderUpdateTrigger = trigger;
    
    if (this.isInitialized && this.config.enableEvents) {
      this.setupAutoRenderUpdates();
    }
  }

  /**
   * Get strategy information
   */
  getStrategyInfo(): { name: string; available: boolean } {
    return {
      name: this.strategy.name,
      available: this.strategy.isAvailable()
    };
  }

  /**
   * Destroy the gateway and cleanup resources
   */
  async destroy(): Promise<void> {
    if (this.eventManager) {
      this.eventManager.clear();
    }
    
    if (this.strategy) {
      await this.strategy.destroy();
    }
    
    this.isInitialized = false;
  }

  /**
   * Setup automatic render updates on data changes
   */
  private setupAutoRenderUpdates(): void {
    if (!this.renderUpdateTrigger) {
      return;
    }

    const trigger = this.renderUpdateTrigger;

    // Subscribe to all data events that should trigger re-renders
    this.eventManager.subscribe(['data:created', 'data:updated', 'data:deleted'], 
      (event) => {
        // Trigger targeted update if possible, otherwise full update
        if (event.key && event.key !== '__all__') {
          trigger.triggerUpdate(event.key);
        } else {
          trigger.forceFullUpdate();
        }
      }
    );
  }

  /**
   * Ensure gateway is initialized
   */
  private ensureInitialized(): void {
    if (!this.isInitialized) {
      throw new Error('DataGateway must be initialized before use');
    }
  }
}

/**
 * Factory function to create a DataGateway with SessionStorage
 */
export function createSessionStorageGateway(config?: {
  keyPrefix?: string;
  enableEvents?: boolean;
}): DataGateway {
  const strategy = new SessionStorageStrategy({
    keyPrefix: config?.keyPrefix || 'proto-typed:data:'
  });

  return new DataGateway({
    strategy,
    enableEvents: config?.enableEvents ?? true
  });
}

/**
 * Global gateway instance
 */
export const globalDataGateway = createSessionStorageGateway();