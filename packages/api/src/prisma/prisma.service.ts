import { Injectable, OnModuleInit } from '@nestjs/common';
// IMPORTANT: Import the client from its specific generated folder
import { PrismaClient } from '../../generated/management';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    // This hook ensures we connect to the database when the module starts.
    await this.$connect();
    console.log('Management Prisma Service Connected.');
  }
}