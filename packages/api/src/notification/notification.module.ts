import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { MailService } from '../common/mail/mail.service';
import { NotificationService } from './notification.service';
import { NotificationListener } from './listeners/notification.listener';
import { NotificationProcessor } from './processors/notification.processor';
import { QUEUES } from '../common/queues/queue.constants';
import { PrismaModule } from '../prisma/prisma.module';
import { TenantContextModule } from '../common/tenant-context/tenant-context.module';
import { PaymentRepository } from '@/payment/repositories/payment.repository';

/**
 * SOLID Principle: Encapsulation
 * This module bundles the entire notification infrastructure.
 * It is decoupled from the Order and Payment modules via Events.
 */
@Module({
  imports: [
    PrismaModule,        
    TenantContextModule, 
  ],
  providers: [
    MailService,           // SMTP Infrastructure
    NotificationService,   // Content Generation Logic
    NotificationListener,  // Event Bridge (Producer)
    NotificationProcessor, // Background Worker (Consumer)
    PaymentRepository,    // For fetching payment details in listeners
  ],
  exports: [
    NotificationService,   // Allows other modules to trigger manual emails
  ],
})
export class NotificationModule {}