import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { SentMessageInfo } from 'nodemailer';
import { lookup } from 'dns/promises';

export interface MailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

/**
 * SOLID Principle: Single Responsibility
 * This service is a robust infrastructure wrapper for high-throughput email delivery.
 */
@Injectable()
export class MailService implements OnModuleInit {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter<SentMessageInfo>;

  constructor(private readonly config: ConfigService) {}

  /**
   * Initializes the SMTP transporter with pooling and IPv4 enforcement.
   * millions of users: Pooling keeps connections alive to reduce handshake overhead.
   */
  async onModuleInit() {
    // Force IPv4 DNS resolution
    const host =
      this.config.get<string>('MAIL_HOST') ?? 'sandbox.smtp.mailtrap.io';
    let resolvedHost = host;

    try {
      const { address } = await lookup(host, { family: 4 });
      resolvedHost = address;
      this.logger.debug(`Mail host resolved to IPv4: ${resolvedHost}`);
    } catch {
      this.logger.warn(`DNS lookup failed, using hostname directly: ${host}`);
    }

    const transportConfig: any = {
      host: resolvedHost,
      port: this.config.get<number>('MAIL_PORT') ?? 2525,
      secure: false,
      auth: {
        user: this.config.get<string>('MAIL_USER'),
        pass: this.config.get<string>('MAIL_PASS'),
      },
      tls: {
        rejectUnauthorized: false, // ← fix SSL wrong version error
      },
      pool: true,
      maxConnections: 10,
      maxMessages: 100,
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 30000,
    };
    this.transporter = nodemailer.createTransport(transportConfig);

    try {
      // Perform a verification handshake at startup to catch credential issues early
      await this.transporter.verify();
      this.logger.log(
        '📧 Mail Transport initialized and verified (IPv4 Pooling active)',
      );
    } catch (error) {
      this.logger.error(
        '❌ Mail Transport failed to initialize. Check .env and network route.',
        error.stack,
      );
    }
  }

  /**
   * Generic mail sender method.
   * millions of users: Designed to be called by BullMQ processors for non-blocking execution.
   */
  async sendMail(options: MailOptions): Promise<SentMessageInfo> {
    const from = options.from || this.config.get<string>('MAIL_FROM_DEFAULT');

    try {
      const info = await this.transporter.sendMail({
        from,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text || this.stripHtml(options.html),
      });

      this.logger.debug(
        `Email delivered to ${options.to} [ID: ${info.messageId}]`,
      );
      return info;
    } catch (error) {
      this.logger.error(
        `Critical failure sending email to ${options.to}`,
        error.stack,
      );
      // Re-throw to ensure the background worker (BullMQ) triggers its retry logic
      throw error;
    }
  }

  /**
   * Enterprise Utility: Basic HTML to text fallback.
   * Improves deliverability if the recipient's mail client blocks HTML.
   */
  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>?/gm, '');
  }
}
