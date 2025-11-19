import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailTemplateRegistry } from './templates/registry';
import { EmailRenderer } from './utils/email-renderer';
import { IEmailProvider } from './providers/email-provider.interface';
import { SendEmailOptions } from './interfaces/email-template.interface';
import { ZodError } from 'zod';
import { EMAIL_PROVIDER } from './constants';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(
    private readonly registry: EmailTemplateRegistry,
    private readonly renderer: EmailRenderer,
    @Inject(EMAIL_PROVIDER) private readonly emailProvider: IEmailProvider, 
    private readonly configService: ConfigService,
  ) {}

  /**
   * Send an email using a registered template
   */
  async send<TProps = any>(
    options: SendEmailOptions<TProps>,
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const { templateId, props, to, subject, from, replyTo, cc, bcc } = options;
    this.logger.log('sending email with options', options)

    try {
      // 1. Get template from registry
      const template = this.registry.get<TProps>(templateId);
      if (!template) {
        throw new NotFoundException(
          `Email template with ID "${templateId}" not found`,
        );
      }

      this.logger.log(`Sending email using template: ${templateId}`);

      // 2. Validate props against schema
      let validatedProps: TProps;
      try {
        validatedProps = template.schema.parse(props);
      } catch (error) {
        if (error instanceof ZodError) {
          const errorMessages = error.issues
            .map((e) => `${e.path.join('.')}: ${e.message}`)
            .join(', ');
          throw new Error(`Invalid email props: ${errorMessages}`);
        }
        throw error;
      }

      // 3. Transform props if needed
      const finalProps = template.transformProps
        ? template.transformProps(validatedProps)
        : validatedProps;

      // 4. Render template to HTML
      const component = template.component(finalProps);
      const html = await this.renderer.renderToHtml(component);

      // 5. Prepare email options
      const emailFrom =
        from ||
        template.config.defaultFrom ||
        this.configService.get<string>('EMAIL_FROM', 'noreply@artisan-base.com');

      const emailTo = to || template.config.defaultTo;
      if (!emailTo) {
        throw new Error(
          `No recipient specified for template "${templateId}" and no default recipient configured`,
        );
      }

      // 6. Interpolate subject line with props
      const emailSubject =
        subject ||
        this.renderer.interpolateVariables(
          template.config.defaultSubject,
          finalProps as any,
        );

      // 7. Handle replyTo - interpolate if it contains variables
      let emailReplyTo = replyTo || template.config.defaultReplyTo;
      if (emailReplyTo) {
        emailReplyTo = this.renderer.interpolateVariables(
          emailReplyTo,
          finalProps as any,
        );
      }

      // 8. Send email via provider
      const result = await this.emailProvider.send({
        from: emailFrom,
        to: emailTo,
        subject: emailSubject,
        html,
        replyTo: emailReplyTo,
        cc,
        bcc,
      });

      if (result.success) {
        this.logger.log(
          `Email sent successfully. Template: ${templateId}, MessageId: ${result.messageId}`,
        );
      } else {
        this.logger.error(
          `Failed to send email. Template: ${templateId}, Error: ${result.error}`,
        );
      }

      return result;
    } catch (error) {
      this.logger.error(
        `Error sending email with template "${templateId}":`,
        error,
      );
      return {
        success: false,
        error: error.message || 'Unknown error',
      };
    }
  }

  /**
   * Send multiple emails (batch)
   */
  async sendBatch<TProps = any>(
    options: SendEmailOptions<TProps>[],
  ): Promise<Array<{ success: boolean; messageId?: string; error?: string }>> {
    const results = await Promise.all(options.map((opt) => this.send(opt)));
    return results;
  }

  /**
   * Get all registered template IDs (useful for debugging)
   */
  getRegisteredTemplates(): string[] {
    return this.registry.getAll();
  }

  /**
   * Check if a template is registered
   */
  hasTemplate(templateId: string): boolean {
    return this.registry.has(templateId);
  }
}