import { Injectable, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CACHE_NAMESPACE } from './cache.constants';
import { CACHE_TTLS } from './cache-ttls.config';

export interface CacheOptions {
  ttl?: number;
  refresh?: boolean;
}

@Injectable()
export class CacheHelperService {
  private readonly logger = new Logger(CacheHelperService.name);
  
  // High-Performance Optimization: 5-second local safety for version pointers
  private versionLocalCache = new Map<string, { version: number; expiresAt: number }>();
  private readonly VERSION_LOCAL_TTL = 5000; 

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  private async getNamespaceVersion(tenantId: string, namespace: CACHE_NAMESPACE): Promise<number> {
    const vKey = `v_ptr:${tenantId}:${namespace}`;
    const now = Date.now();
    const local = this.versionLocalCache.get(vKey);

    if (local && local.expiresAt > now) return local.version;

    let version = await this.cacheManager.get<number>(vKey);
    if (!version) {
      version = 1;
      await this.cacheManager.set(vKey, version, 0); 
    }

    this.versionLocalCache.set(vKey, { version, expiresAt: now + this.VERSION_LOCAL_TTL });
    return version;
  }

  async getOrSet<T>(
    tenantId: string,
    namespace: CACHE_NAMESPACE,
    subKey: string,
    factory: () => Promise<T>,
    options?: CacheOptions,
  ): Promise<T> {
    const version = await this.getNamespaceVersion(tenantId, namespace);
    const dataKey = `d:${tenantId}:${namespace}:v${version}:${subKey}`;

    // 1. Try Cache Lookup
    if (!options?.refresh) {
      const cached = await this.cacheManager.get<T>(dataKey);
      
      // FIX: Only log HIT if the data actually exists
      if (cached !== undefined && cached !== null) {
        this.logger.debug(`[CACHE HIT] ${dataKey}`);
        return cached;
      }
    }

    // 2. Cache Miss
    this.logger.debug(`[CACHE MISS] ${dataKey}`);
    const result = await factory();

    // 3. Store in Cache
    const ttl = options?.ttl ?? CACHE_TTLS[namespace] ?? CACHE_TTLS['DEFAULT' as any];
    await this.cacheManager.set(dataKey, result, ttl);

    return result;
  }

  async invalidateNamespace(tenantId: string, namespace: CACHE_NAMESPACE): Promise<void> {
    const vKey = `v_ptr:${tenantId}:${namespace}`;
    const current = (await this.cacheManager.get<number>(vKey)) ?? 1;
    
    await this.cacheManager.set(vKey, current + 1, 0);
    this.versionLocalCache.delete(vKey);
    this.logger.debug(`[INVALIDATED] ${tenantId}:${namespace} to v${current + 1}`);
  }
}