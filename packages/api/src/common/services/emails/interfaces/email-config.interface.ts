/**
 * Configuration for an email template
 */
export interface EmailTemplateConfig {
  /** Unique identifier for the template */
  id: string;

  /** Human-readable name */
  name: string;

  /** Template category */
  category: 'transactional' | 'marketing' | 'notification' | 'admin';

  /** Default subject line (can use {{variables}}) */
  defaultSubject: string;

  /** Default sender email */
  defaultFrom: string;

  /** Default recipient(s) - can be overridden */
  defaultTo?: string | string[];

  /** Default reply-to address */
  defaultReplyTo?: string;

  /** Priority level for queue processing */
  priority?: 'low' | 'normal' | 'high';
}