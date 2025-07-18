import { ICacheService } from '../interfaces/cache-service.interface';

interface CacheEntry<V> {
  value: V;
  expires: number;
}

export class InMemoryCacheService<K, V> implements ICacheService<K, V> {
  private cache = new Map<K, CacheEntry<V>>();
  private maxSize: number;

  constructor(maxSize = 100) {
    this.maxSize = maxSize;
  }

  get(key: K): V | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;
    if (entry.expires < Date.now()) {
      this.cache.delete(key);
      return undefined;
    }
    // LRU: re-insert to update order
    this.cache.delete(key);
    this.cache.set(key, entry);
    return entry.value;
  }

  set(key: K, value: V, ttl = 10000): void {
    if (this.cache.size >= this.maxSize) {
      // Remove oldest
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
    this.cache.set(key, { value, expires: Date.now() + ttl });
  }

  delete(key: K): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }
}
