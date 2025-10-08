import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../../generated/management';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private static globalConnectionFlag = false;

  constructor() {
    super({
      log: ['error', 'warn'],
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
  }

  async onModuleInit() {
    if (!PrismaService.globalConnectionFlag) {
      PrismaService.globalConnectionFlag = true;
      await this.$connect();
      // ❌ REMOVED - This line was causing the error
      console.log('Management Prisma Service Connected.');
    } else {
      console.log('Management Prisma Service already connected - skipping.');
    }
  }

  async onModuleDestroy() {
    if (PrismaService.globalConnectionFlag) {
      await this.$disconnect();
      PrismaService.globalConnectionFlag = false;
      console.log('Management Prisma Service Disconnected.');
    }
  }
}