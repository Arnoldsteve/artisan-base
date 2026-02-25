import { ConfigService } from '@nestjs/config';
import KeyvRedis from '@keyv/redis';

export const createCacheStore = (configService: ConfigService) => {
  const redisUrl = configService.get<string>('REDIS_URL');

  if (!redisUrl) {
    throw new Error('REDIS_URL is not configured in the environment variables');
  }

  return {
    store: new KeyvRedis(redisUrl),
    ttl: 60, // default TTL (can be overridden per key)
  };
};
