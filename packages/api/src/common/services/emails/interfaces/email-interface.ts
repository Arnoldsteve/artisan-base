import { JSX } from 'react';

export interface EmailOptions<TProps = any> {
  /** Recipient email address */
  to: string;

  /** Email subject line */
  subject: string;

  /** The React template function that returns JSX */
  template: (props: TProps) => JSX.Element;

  /** Props to pass to the template */
  props: TProps;

  /** Optional: reply-to address */
  replyTo?: string;
}
