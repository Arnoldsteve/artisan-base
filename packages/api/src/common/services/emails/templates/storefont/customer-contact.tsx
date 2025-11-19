import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Heading,
  Preview,
  Section,
  Text,
  Row,
  Column,
} from '@react-email/components';
import * as React from 'react';

interface ContactFormEmailProps {
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp?: string;
  source?: string;
}

export const ContactFormEmail = ({
  name,
  email,
  subject,
  message,
  timestamp = new Date().toLocaleString(),
  source = 'Artisan-Base storefront',
}: ContactFormEmailProps) => (
  <Html>
    <Head />
    {/* @ts-ignore */}
    <Preview>New contact: {subject}</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header Section */}
        <Section style={header}>
          <Heading style={heading}>📧 New Contact Submission</Heading>
          <Text style={timestampStyle}>Received: {timestamp}</Text>
        </Section>

        {/* Contact Information Card */}
        <Section style={contactCard}>
          <Heading as="h2" style={cardHeading}>Contact Information</Heading>
          <Row
            children={[
              <Column style={labelColumn} key="name-label">
                <Text style={infoLabel}>👤 Name:</Text>
              </Column>,
              <Column key="name-value">
                <Text style={infoText}>{name}</Text>
              </Column>
            ]}
          />
          <Row
            children={[
              <Column style={labelColumn} key="email-label">
                <Text style={infoLabel}>📧 Email:</Text>
              </Column>,
              <Column key="email-value">
                <Text style={infoTextEmail}>{email}</Text>
              </Column>
            ]}
          />
        </Section>

        <Hr style={hr} />

        {/* Subject Section */}
        <Section style={subjectSection}>
          <Heading as="h2" style={subjectHeading}>
            📝 Subject: {subject}
          </Heading>
        </Section>

        {/* Message Section */}
        <Section style={messageSection}>
          <Heading as="h3" style={messageHeading}>Message:</Heading>
          <Text style={messageText}>{message}</Text>
        </Section>

        {/* Action Buttons */}
        <Section style={buttonContainer}>
          <Button style={primaryButton} href={`mailto:${email}?subject=Re: ${subject}`}>
            📧 Reply to {name}
          </Button>
        </Section>

        <Section style={buttonContainer}>
          <Button style={secondaryButton} href={`mailto:${email}`}>
            ✉️ Start New Conversation
          </Button>
        </Section>

        <Hr style={hr} />

        {/* Footer */}
        <Section style={footerSection}>
          <Text style={footer}>
            This message was sent from your {source}.
          </Text>
          <Text style={footerSmall}>
            Please respond within 24 hours for the best customer experience.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

// Enhanced Styles
const main = {
  backgroundColor: '#f8fafc',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  lineHeight: '1.6',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '0',
  marginBottom: '32px',
  borderRadius: '12px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  overflow: 'hidden',
  maxWidth: '600px',
};

const header = {
  backgroundColor: '#4f46e5',
  padding: '32px 24px',
  textAlign: 'center' as const,
};

const heading = {
  fontSize: '28px',
  fontWeight: '700',
  margin: '0 0 8px 0',
  color: '#ffffff',
  letterSpacing: '-0.025em',
};

const timestampStyle = {
  fontSize: '14px',
  color: '#e0e7ff',
  margin: '0',
  fontWeight: '500',
};

const contactCard = {
  backgroundColor: '#f8fafc',
  margin: '24px',
  padding: '24px',
  borderRadius: '8px',
  border: '1px solid #e2e8f0',
};

const cardHeading = {
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 16px 0',
  color: '#1e293b',
};

const labelColumn = {
  width: '100px',
  verticalAlign: 'top',
};

const infoLabel = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#64748b',
  margin: '0 0 8px 0',
};

const infoText = {
  fontSize: '16px',
  fontWeight: '500',
  color: '#1e293b',
  margin: '0 0 8px 0',
};

const infoTextEmail = {
  fontSize: '16px',
  fontWeight: '500',
  color: '#4f46e5',
  margin: '0 0 8px 0',
  textDecoration: 'none',
};

const subjectSection = {
  padding: '0 24px',
  margin: '16px 0',
};

const subjectHeading = {
  fontSize: '20px',
  fontWeight: '600',
  color: '#1e293b',
  margin: '0',
  lineHeight: '1.4',
};

const messageSection = {
  padding: '0 24px',
  margin: '24px 0',
};

const messageHeading = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#374151',
  margin: '0 0 12px 0',
};

const messageText = {
  fontSize: '16px',
  lineHeight: '1.7',
  color: '#374151',
  margin: '0',
  padding: '16px',
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  border: '1px solid #e5e7eb',
  borderLeft: '4px solid #4f46e5',
};

const hr = {
  borderColor: '#e2e8f0',
  margin: '32px 24px',
  borderWidth: '1px',
};

const buttonContainer = {
  textAlign: 'center' as const,
  padding: '0 24px',
  margin: '16px 0',
};

const primaryButton = {
  backgroundColor: '#4f46e5',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  padding: '14px 28px',
  display: 'inline-block',
  border: '2px solid #4f46e5',
  transition: 'all 0.2s ease',
};

const secondaryButton = {
  backgroundColor: 'transparent',
  borderRadius: '8px',
  color: '#4f46e5',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  padding: '14px 28px',
  display: 'inline-block',
  border: '2px solid #4f46e5',
};

const footerSection = {
  padding: '24px',
  backgroundColor: '#f8fafc',
  textAlign: 'center' as const,
  borderTop: '1px solid #e2e8f0',
};

const footer = {
  color: '#64748b',
  fontSize: '14px',
  margin: '0 0 8px 0',
  fontWeight: '500',
};

const footerSmall = {
  color: '#94a3b8',
  fontSize: '12px',
  margin: '0',
  fontStyle: 'italic',
};