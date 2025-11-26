import { Redis } from '@upstash/redis';
import { Logger } from '@nestjs/common';

const NULL_CACHE_TTL_SECONDS = 60; // Cache "not found" results for 1 minute

/**
 * Cacheable decorator for method-level caching
 * @param ttlSeconds Time to live in seconds for successful results
 * @param keyGenerator Function to generate cache key based on method arguments
 */
export function Cacheable(
  ttlSeconds: number,
  keyGenerator: (...args: any[]) => string,
) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;
    const logger = new Logger(`${target.constructor.name} (Cacheable)`);

    descriptor.value = async function (...args: any[]) {
      // Expect Redis client injected as this.redis
      const redis: Redis = this.redis;
      if (!redis || !(redis instanceof Redis)) {
        logger.error(
          `Redis client ('this.redis') not found or invalid on ${target.constructor.name}. Skipping cache.`,
        );
        return originalMethod.apply(this, args);
      }

      const key = keyGenerator(...args);

      try {
        const cached = await redis.get<string | null>(key);

        if (cached !== null) {
          logger.debug(`Cache hit for key: ${key}`);
          try {
            return cached;
          } catch (err) {
            logger.warn(`Failed to parse cache for key: ${key}. Deleting corrupted cache.`, err);
            // Delete corrupted cache so next request repopulates
            try {
              await redis.del(key);
            } catch (delErr) {
              logger.error(`Failed to delete corrupted cache for key: ${key}`, delErr);
            }
          }
        }
      } catch (err) {
        logger.error(`Redis GET failed for key: ${key}`, err);
      }

      // Cache miss or corrupted cache, call original method
      logger.debug(`Cache miss for key: ${key}`);
      const result = await originalMethod.apply(this, args);

      try {
        const valueToCache = result === undefined ? null : result;
        const expire = result === null || result === undefined ? NULL_CACHE_TTL_SECONDS : ttlSeconds;

        await redis.set(key, valueToCache, { ex: expire });
      } catch (err) {
        logger.error(`Redis SET failed for key: ${key}`, err);
      }

      return result;
    };

    return descriptor;
  };
}
