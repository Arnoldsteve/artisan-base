export interface EmailSendOptions {
  from: string;
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
  cc?: string | string[];
  bcc?: string | string[];
}

export interface EmailSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface IEmailProvider {
  send(options: EmailSendOptions): Promise<EmailSendResult>;
  sendBatch?(options: EmailSendOptions[]): Promise<EmailSendResult[]>;
}