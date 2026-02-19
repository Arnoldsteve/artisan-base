import { Module, Global } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import KeyvRedis from '@keyv/redis';
import { CacheHelperService } from './cache-helper.service';

/**
 * Global Cache Module
 * Provides the Redis store and CacheHelperService to the entire application.
 */
@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const redisUrl = configService.get<string>('REDIS_URL');
        
        if (!redisUrl) {
          throw new Error('REDIS_URL is not configured in the environment variables');
        }

        return {
          store: new KeyvRedis(redisUrl),
          ttl: 300, // Default global TTL: 5 minutes
        };
      },
    }),
  ],
  providers: [CacheHelperService],
  exports: [CacheHelperService, CacheModule],
})
export class CommonCacheModule {}