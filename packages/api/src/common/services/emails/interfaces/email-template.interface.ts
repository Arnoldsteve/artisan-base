import { JSX } from 'react';
import { z } from 'zod';

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

/**
 * Complete email template definition
 */
export interface EmailTemplate<TProps = any> {
  /** Template configuration */
  config: EmailTemplateConfig;

  /** React component that renders the email */
  component: (props: TProps) => JSX.Element;

  /** Zod schema for validating props */
  schema: z.ZodSchema<TProps>;

  /** Optional: Transform props before rendering */
  transformProps?: (props: any) => TProps;
}

/**
 * Options when sending an email
 */
export interface SendEmailOptions<TProps = any> {
  /** Template ID to use */
  templateId: string;

  /** Props to pass to the template */
  props: TProps;

  /** Override recipient(s) */
  to?: string | string[];

  /** Override subject */
  subject?: string;

  /** Override from address */
  from?: string;

  /** Override reply-to address */
  replyTo?: string;

  /** Add CC recipients */
  cc?: string | string[];

  /** Add BCC recipients */
  bcc?: string | string[];
}