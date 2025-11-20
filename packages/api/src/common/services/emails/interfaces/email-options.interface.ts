
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