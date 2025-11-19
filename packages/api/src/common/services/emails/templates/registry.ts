import { Injectable, Logger } from '@nestjs/common';
import { EmailTemplate } from '../interfaces/email-template.interface';

@Injectable()
export class EmailTemplateRegistry {
  private readonly logger = new Logger(EmailTemplateRegistry.name);
  private readonly templates = new Map<string, EmailTemplate>();

  /**
   * Register a new email template
   */
  register<TProps>(template: EmailTemplate<TProps>): void {
    if (this.templates.has(template.config.id)) {
      this.logger.warn(
        `Template with id "${template.config.id}" is already registered. Overwriting.`,
      );
    }

    this.templates.set(template.config.id, template);
    this.logger.log(`Registered email template: ${template.config.id}`);
  }

  /**
   * Get a template by ID
   */
  get<TProps = any>(templateId: string): EmailTemplate<TProps> | undefined {
    return this.templates.get(templateId) as EmailTemplate<TProps> | undefined;
  }

  /**
   * Check if a template exists
   */
  has(templateId: string): boolean {
    return this.templates.has(templateId);
  }

  /**
   * Get all registered template IDs
   */
  getAll(): string[] {
    return Array.from(this.templates.keys());
  }

  /**
   * Get all templates
   */
  getAllTemplates(): EmailTemplate[] {
    return Array.from(this.templates.values());
  }
}