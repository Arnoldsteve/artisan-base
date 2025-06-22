import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client'; 

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    // This is a NestJS lifecycle hook.
    // It ensures that we connect to the database when the module is initialized.
    await this.$connect();
  }
}