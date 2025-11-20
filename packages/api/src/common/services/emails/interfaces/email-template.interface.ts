import { JSX } from 'react';
import { z } from 'zod';
import { EmailTemplateConfig } from './email-config.interface';


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