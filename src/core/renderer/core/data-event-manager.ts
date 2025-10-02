/**
 * Event Manager Implementation
 * Provides pub/sub mechanism for data change notifications
 */

import { 
  EventManager, 
  DataEvent, 
  DataEventType, 
  DataEventListener 
} from './data-gateway-types';

/**
 * Subscription information
 */
interface Subscription<T = any> {
  id: string;
  eventTypes: Set<DataEventType>;
  listener: DataEventListener<T>;
  keyFilter?: string;
  createdAt: number;
}

/**
 * Event Manager implementation using pub/sub pattern
 */
export class DataEventManager implements EventManager {
  private subscriptions: Map<string, Subscription> = new Map();
  private subscriptionCounter = 0;
  private isDestroyed = false;

  /**
   * Subscribe to data events with optional key filtering
   */
  subscribe<T>(
    eventType: DataEventType | DataEventType[], 
    listener: DataEventListener<T>,
    key?: string
  ): () => void {
    if (this.isDestroyed) {
      console.warn('DataEventManager: Cannot subscribe after destruction');
      return () => {};
    }

    const subscriptionId = `sub_${++this.subscriptionCounter}`;
    const eventTypes = Array.isArray(eventType) ? new Set(eventType) : new Set([eventType]);
    
    const subscription: Subscription<T> = {
      id: subscriptionId,
      eventTypes,
      listener,
      keyFilter: key,
      createdAt: Date.now()
    };

    this.subscriptions.set(subscriptionId, subscription);

    // Return unsubscribe function
    return () => {
      this.subscriptions.delete(subscriptionId);
    };
  }

  /**
   * Emit data event to all matching subscribers
   */
  emit<T>(event: DataEvent<T>): void {
    if (this.isDestroyed) {
      console.warn('DataEventManager: Cannot emit after destruction');
      return;
    }

    if (!event || !event.type) {
      console.warn('DataEventManager: Invalid event received', event);
      return;
    }

    // Find matching subscriptions
    const matchingSubscriptions = Array.from(this.subscriptions.values())
      .filter(subscription => this.shouldNotifySubscription(subscription, event));

    // Notify all matching subscribers
    matchingSubscriptions.forEach(subscription => {
      try {
        subscription.listener(event);
      } catch (error) {
        console.error('DataEventManager: Error in event listener', {
          subscriptionId: subscription.id,
          eventType: event.type,
          error
        });
      }
    });

    // Log event for debugging
    if (import.meta.env?.DEV) {
      console.debug('DataEventManager: Event emitted', {
        type: event.type,
        key: event.key,
        notifiedSubscriptions: matchingSubscriptions.length,
        totalSubscriptions: this.subscriptions.size
      });
    }
  }

  /**
   * Remove all listeners
   */
  clear(): void {
    this.subscriptions.clear();
  }

  /**
   * Get active listeners count
   */
  getListenerCount(): number {
    return this.subscriptions.size;
  }

  /**
   * Get subscription details for debugging
   */
  getSubscriptionDetails(): Array<{
    id: string;
    eventTypes: string[];
    keyFilter?: string;
    age: number;
  }> {
    const now = Date.now();
    return Array.from(this.subscriptions.values()).map(sub => ({
      id: sub.id,
      eventTypes: Array.from(sub.eventTypes),
      keyFilter: sub.keyFilter,
      age: now - sub.createdAt
    }));
  }

  /**
   * Destroy the event manager and cleanup resources
   */
  destroy(): void {
    this.clear();
    this.isDestroyed = true;
  }

  /**
   * Check if a subscription should be notified for an event
   */
  private shouldNotifySubscription<T>(subscription: Subscription, event: DataEvent<T>): boolean {
    // Check event type match
    if (!subscription.eventTypes.has(event.type)) {
      return false;
    }

    // Check key filter if specified
    if (subscription.keyFilter && subscription.keyFilter !== event.key) {
      return false;
    }

    return true;
  }
}

/**
 * Global event manager instance
 */
export const globalDataEventManager = new DataEventManager();

/**
 * Helper function to create data events
 */
export function createDataEvent<T>(
  type: DataEventType,
  key: string,
  options: {
    data?: T;
    oldData?: T;
    source?: string;
  } = {}
): DataEvent<T> {
  return {
    type,
    key,
    data: options.data,
    oldData: options.oldData,
    timestamp: Date.now(),
    source: options.source || 'unknown'
  };
}

/**
 * Utility function to emit common events
 */
export const DataEventEmitters = {
  created<T>(key: string, data: T, source = 'data-gateway'): void {
    globalDataEventManager.emit(createDataEvent('data:created', key, { data, source }));
  },

  updated<T>(key: string, data: T, oldData?: T, source = 'data-gateway'): void {
    globalDataEventManager.emit(createDataEvent('data:updated', key, { data, oldData, source }));
  },

  deleted<T>(key: string, oldData?: T, source = 'data-gateway'): void {
    globalDataEventManager.emit(createDataEvent('data:deleted', key, { oldData, source }));
  },

  queried<T>(key: string, data?: T, source = 'data-gateway'): void {
    globalDataEventManager.emit(createDataEvent('data:queried', key, { data, source }));
  },

  error(key: string, error: string, source = 'data-gateway'): void {
    globalDataEventManager.emit(createDataEvent('data:error', key, { data: error, source }));
  }
};