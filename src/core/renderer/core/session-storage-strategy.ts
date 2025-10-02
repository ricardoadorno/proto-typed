/**
 * SessionStorage Data Strategy Implementation
 * Provides browser session storage as persistence mechanism
 */

import { 
  DataStrategy, 
  DataResult
} from './data-gateway-types';

/**
 * SessionStorage strategy configuration
 */
export interface SessionStorageConfig {
  keyPrefix?: string;
  maxRetries?: number;
  retryDelay?: number;
  enableSerialization?: boolean;
}

/**
 * SessionStorage implementation of DataStrategy
 */
export class SessionStorageStrategy implements DataStrategy {
  readonly name = 'session-storage';
  
  private config: Required<SessionStorageConfig>;
  private isInitialized = false;
  private isAvailableCache?: boolean;

  constructor(config: SessionStorageConfig = {}) {
    this.config = {
      keyPrefix: config.keyPrefix || 'proto-typed:',
      maxRetries: config.maxRetries || 3,
      retryDelay: config.retryDelay || 100,
      enableSerialization: config.enableSerialization ?? true
    };
  }

  /**
   * Initialize the strategy
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    if (!this.isAvailable()) {
      throw new Error('SessionStorage is not available in this environment');
    }

    this.isInitialized = true;
  }

  /**
   * Store data in session storage
   */
  async set<T>(key: string, data: T): Promise<DataResult<T>> {
    try {
      this.ensureInitialized();
      const fullKey = this.getFullKey(key);
      
      const serializedData = this.config.enableSerialization 
        ? JSON.stringify(data)
        : String(data);

      await this.withRetry(() => {
        sessionStorage.setItem(fullKey, serializedData);
      });

      return {
        success: true,
        data,
        timestamp: Date.now()
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to store data: ${error instanceof Error ? error.message : String(error)}`,
        timestamp: Date.now()
      };
    }
  }

  /**
   * Retrieve data from session storage
   */
  async get<T>(key: string): Promise<DataResult<T>> {
    try {
      this.ensureInitialized();
      const fullKey = this.getFullKey(key);
      
      const storedData = await this.withRetry(() => 
        sessionStorage.getItem(fullKey)
      );

      if (storedData === null) {
        return {
          success: false,
          error: `Key '${key}' not found`,
          timestamp: Date.now()
        };
      }

      const data = this.config.enableSerialization 
        ? JSON.parse(storedData) as T
        : storedData as T;

      return {
        success: true,
        data,
        timestamp: Date.now()
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to retrieve data: ${error instanceof Error ? error.message : String(error)}`,
        timestamp: Date.now()
      };
    }
  }

  /**
   * Remove data from session storage
   */
  async remove(key: string): Promise<DataResult<boolean>> {
    try {
      this.ensureInitialized();
      const fullKey = this.getFullKey(key);
      
      await this.withRetry(() => {
        sessionStorage.removeItem(fullKey);
      });

      return {
        success: true,
        data: true,
        timestamp: Date.now()
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to remove data: ${error instanceof Error ? error.message : String(error)}`,
        timestamp: Date.now()
      };
    }
  }

  /**
   * Get all keys that match our prefix
   */
  async getAllKeys(): Promise<DataResult<string[]>> {
    try {
      this.ensureInitialized();
      
      const keys: string[] = [];
      const prefixLength = this.config.keyPrefix.length;
      
      await this.withRetry(() => {
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          if (key && key.startsWith(this.config.keyPrefix)) {
            keys.push(key.slice(prefixLength));
          }
        }
      });

      return {
        success: true,
        data: keys,
        timestamp: Date.now()
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to get keys: ${error instanceof Error ? error.message : String(error)}`,
        timestamp: Date.now()
      };
    }
  }

  /**
   * Get all data as key-value pairs
   */
  async getAll<T>(): Promise<DataResult<Record<string, T>>> {
    try {
      this.ensureInitialized();
      
      const keysResult = await this.getAllKeys();
      if (!keysResult.success || !keysResult.data) {
        return {
          success: false,
          error: keysResult.error || 'Failed to get keys',
          timestamp: Date.now()
        };
      }

      const data: Record<string, T> = {};
      
      for (const key of keysResult.data) {
        const result = await this.get<T>(key);
        if (result.success && result.data !== undefined) {
          data[key] = result.data;
        }
      }

      return {
        success: true,
        data,
        timestamp: Date.now()
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to get all data: ${error instanceof Error ? error.message : String(error)}`,
        timestamp: Date.now()
      };
    }
  }

  /**
   * Clear all data with our prefix
   */
  async clear(): Promise<DataResult<boolean>> {
    try {
      this.ensureInitialized();
      
      const keysResult = await this.getAllKeys();
      if (!keysResult.success || !keysResult.data) {
        return {
          success: false,
          error: keysResult.error || 'Failed to get keys for clearing',
          timestamp: Date.now()
        };
      }

      await this.withRetry(() => {
        keysResult.data!.forEach(key => {
          sessionStorage.removeItem(this.getFullKey(key));
        });
      });

      return {
        success: true,
        data: true,
        timestamp: Date.now()
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to clear data: ${error instanceof Error ? error.message : String(error)}`,
        timestamp: Date.now()
      };
    }
  }

  /**
   * Check if session storage is available
   */
  isAvailable(): boolean {
    if (this.isAvailableCache !== undefined) {
      return this.isAvailableCache;
    }

    try {
      if (typeof window === 'undefined' || !window.sessionStorage) {
        this.isAvailableCache = false;
        return false;
      }

      // Test session storage functionality
      const testKey = '__test_session_storage__';
      sessionStorage.setItem(testKey, 'test');
      sessionStorage.removeItem(testKey);
      
      this.isAvailableCache = true;
      return true;
    } catch {
      this.isAvailableCache = false;
      return false;
    }
  }

  /**
   * Cleanup strategy resources
   */
  async destroy(): Promise<void> {
    this.isInitialized = false;
    this.isAvailableCache = undefined;
  }

  /**
   * Get storage size information
   */
  getStorageInfo(): { 
    totalItems: number; 
    ourItems: number; 
    estimatedSize: number; 
  } {
    if (!this.isAvailable()) {
      return { totalItems: 0, ourItems: 0, estimatedSize: 0 };
    }

    let totalItems = 0;
    let ourItems = 0;
    let estimatedSize = 0;

    try {
      totalItems = sessionStorage.length;
      
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key) {
          const value = sessionStorage.getItem(key);
          if (value) {
            estimatedSize += key.length + value.length;
            if (key.startsWith(this.config.keyPrefix)) {
              ourItems++;
            }
          }
        }
      }
    } catch (error) {
      console.warn('Failed to get storage info:', error);
    }

    return { totalItems, ourItems, estimatedSize };
  }

  /**
   * Get full storage key with prefix
   */
  private getFullKey(key: string): string {
    return `${this.config.keyPrefix}${key}`;
  }

  /**
   * Ensure strategy is initialized
   */
  private ensureInitialized(): void {
    if (!this.isInitialized) {
      throw new Error('SessionStorageStrategy must be initialized before use');
    }
  }

  /**
   * Execute operation with retry logic
   */
  private async withRetry<T>(operation: () => T): Promise<T> {
    let lastError: Error | undefined;
    
    for (let attempt = 0; attempt <= this.config.maxRetries; attempt++) {
      try {
        return operation();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        if (attempt < this.config.maxRetries) {
          await new Promise(resolve => setTimeout(resolve, this.config.retryDelay));
        }
      }
    }

    throw lastError;
  }
}