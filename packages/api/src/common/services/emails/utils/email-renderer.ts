import { Injectable, Logger } from '@nestjs/common';
import { render } from '@react-email/render';
import { JSX } from 'react';

@Injectable()
export class EmailRenderer {
  private readonly logger = new Logger(EmailRenderer.name);

  /**
   * Render a React email component to HTML string
   */
  async renderToHtml(component: JSX.Element): Promise<string> {
    try {
      const html = await render(component, {
        pretty: false, // Set to true for development/debugging
      });
      return html;
    } catch (error) {
      this.logger.error('Failed to render email template', error);
      throw new Error(`Email rendering failed: ${error.message}`);
    }
  }

  /**
   * Render to plain text (optional, for email clients that don't support HTML)
   */
  async renderToPlainText(component: JSX.Element): Promise<string> {
    try {
      const plainText = await render(component, {
        plainText: true,
      });
      return plainText;
    } catch (error) {
      this.logger.error('Failed to render email to plain text', error);
      throw new Error(`Plain text rendering failed: ${error.message}`);
    }
  }

  /**
   * Replace template variables in strings
   * Example: "Hello {{name}}" with { name: "John" } becomes "Hello John"
   */
  interpolateVariables(template: string, variables: Record<string, any>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return variables[key]?.toString() || match;
    });
  }
}