export interface ICacheService<K, V> {
  get(key: K): V | undefined;
  set(key: K, value: V, ttl?: number): void;
  delete(key: K): void;
  clear(): void;
}
