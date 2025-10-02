/**
 * Data Gateway Types and Interfaces
 * Defines the contract for data persistence strategies and event-driven architecture
 */

/**
 * Generic data operation result
 */
export interface DataResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
}

/**
 * Query parameters for data retrieval
 */
export interface QueryParams {
  key?: string;
  filter?: Record<string, any>;
  sort?: { field: string; direction: 'asc' | 'desc' };
  limit?: number;
  offset?: number;
}

/**
 * Mutation parameters for data modification
 */
export interface MutationParams<T = any> {
  key: string;
  data?: T;
  merge?: boolean; // For updates, whether to merge or replace
}

/**
 * Event types for data changes
 */
export type DataEventType = 
  | 'data:created'
  | 'data:updated'
  | 'data:deleted'
  | 'data:queried'
  | 'data:error';

/**
 * Data change event payload
 */
export interface DataEvent<T = any> {
  type: DataEventType;
  key: string;
  data?: T;
  oldData?: T;
  timestamp: number;
  source: string; // Which component/operation triggered the event
}

/**
 * Event listener function
 */
export type DataEventListener<T = any> = (event: DataEvent<T>) => void;

/**
 * Query Layer Interface - Handles data retrieval operations
 */
export interface QueryLayer {
  /**
   * Get single item by key
   */
  get<T>(key: string): Promise<DataResult<T>>;
  
  /**
   * Get multiple items with optional filtering
   */
  getAll<T>(params?: QueryParams): Promise<DataResult<T[]>>;
  
  /**
   * Check if key exists
   */
  exists(key: string): Promise<DataResult<boolean>>;
  
  /**
   * Get filtered items based on criteria
   */
  find<T>(filter: (item: T) => boolean): Promise<DataResult<T[]>>;
}

/**
 * Mutation Layer Interface - Handles data modification operations
 */
export interface MutationLayer {
  /**
   * Create new data entry
   */
  create<T>(params: MutationParams<T>): Promise<DataResult<T>>;
  
  /**
   * Update existing data entry
   */
  update<T>(params: MutationParams<T>): Promise<DataResult<T>>;
  
  /**
   * Delete data entry
   */
  delete(key: string): Promise<DataResult<boolean>>;
  
  /**
   * Upsert (create or update) data entry
   */
  upsert<T>(params: MutationParams<T>): Promise<DataResult<T>>;
  
  /**
   * Clear all data
   */
  clear(): Promise<DataResult<boolean>>;
}

/**
 * Event Manager Interface - Handles pub/sub for data changes
 */
export interface EventManager {
  /**
   * Subscribe to data events
   */
  subscribe<T>(
    eventType: DataEventType | DataEventType[], 
    listener: DataEventListener<T>,
    key?: string // Optional key filter
  ): () => void; // Returns unsubscribe function
  
  /**
   * Emit data event
   */
  emit<T>(event: DataEvent<T>): void;
  
  /**
   * Remove all listeners
   */
  clear(): void;
  
  /**
   * Get active listeners count
   */
  getListenerCount(): number;
}

/**
 * Data Strategy Interface - Defines the persistence mechanism
 */
export interface DataStrategy {
  /**
   * Strategy name/identifier
   */
  readonly name: string;
  
  /**
   * Initialize the strategy
   */
  initialize(): Promise<void>;
  
  /**
   * Store data
   */
  set<T>(key: string, data: T): Promise<DataResult<T>>;
  
  /**
   * Retrieve data
   */
  get<T>(key: string): Promise<DataResult<T>>;
  
  /**
   * Remove data
   */
  remove(key: string): Promise<DataResult<boolean>>;
  
  /**
   * Get all keys
   */
  getAllKeys(): Promise<DataResult<string[]>>;
  
  /**
   * Get all data as key-value pairs
   */
  getAll<T>(): Promise<DataResult<Record<string, T>>>;
  
  /**
   * Clear all data
   */
  clear(): Promise<DataResult<boolean>>;
  
  /**
   * Check if strategy is available/supported
   */
  isAvailable(): boolean;
  
  /**
   * Cleanup strategy resources
   */
  destroy(): Promise<void>;
}

/**
 * Data Gateway Configuration
 */
export interface DataGatewayConfig {
  strategy: DataStrategy;
  enableEvents?: boolean;
  autoRetry?: boolean;
  retryAttempts?: number;
  cacheTimeout?: number;
}

/**
 * Render update trigger interface
 */
export interface RenderUpdateTrigger {
  /**
   * Trigger a re-render of specific components/screens
   */
  triggerUpdate(target?: string): void;
  
  /**
   * Force a full re-render
   */
  forceFullUpdate(): void;
}