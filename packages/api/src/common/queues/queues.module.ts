import { Global, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { QUEUES } from './queue.constants';
import { QueueRateLimiter } from './rate-limiter';

/**
 * Enterprise Queues Module
 * Configures the connection to Redis and registers all system queues globally.
 */
@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const redisUrl = configService.get<string>('REDIS_URL');

        if (!redisUrl) {
          throw new Error('REDIS_URL is not defined in the environment variables');
        }

        return {
          connection: {
            url: redisUrl,
            // ⚡ TOP 0.001% FIX: Handle secure Redis (rediss://)
            tls: redisUrl.startsWith('rediss') ? {} : undefined,
            maxRetriesPerRequest: null,
            // ⚡ Performance: Disable ready check for cloud providers (Upstash)
            enableReadyCheck: false,
            connectTimeout: 300000,
            keepAlive: 300000,
          },
          defaultJobOptions: {
            // ⚡ Resilience: Exponential backoff for failed jobs (Email/API failure)
            attempts: 3,
            backoff: {
              type: 'exponential',
              delay: 5000,
            },
            // ⚡ Housekeeping: Keep history for debugging but clean up old data
            removeOnComplete: { count: 100, age: 3600 }, // 1 hour
            removeOnFail: { count: 500, age: 86400 },   // 24 hours
          },
        };
      },
    }),

    // Register all queues defined in constants
    BullModule.registerQueue(
      { name: QUEUES.NOTIFICATIONS },
      { name: QUEUES.ORDER_PROCESSING },
      { name: QUEUES.PAYMENTS },
      { name: QUEUES.ANALYTICS },
      { name: QUEUES.IMAGE_PROCESSING },
    ),
  ],
   providers: [
    {
      provide: QueueRateLimiter,
      useValue: new QueueRateLimiter(50, 10), // 50 jobs/sec, 10 concurrent
    },
  ],
  
  exports: [BullModule, QueueRateLimiter],
})
export class QueuesModule {}