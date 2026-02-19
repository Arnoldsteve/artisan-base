import { Module, Global } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheHelperService } from './cache-helper.service';
import { createCacheStore } from './cache.config';

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
      useFactory: async (configService: ConfigService) => createCacheStore(configService),
    }),
  ],
  providers: [CacheHelperService],
  exports: [CacheHelperService, CacheModule],
})
export class CommonCacheModule {}