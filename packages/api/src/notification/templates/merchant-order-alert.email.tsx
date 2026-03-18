import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  Link,
  Button,
} from '@react-email/components';
import * as React from 'react';

interface MerchantOrderAlertEmailProps {
  merchantName: string;
  orderNumber: string;
  totalAmount: string;
  currency: string;
  itemsCount: number;
  orderId: string;
}

/**
 * Enterprise Standard: Merchant Sale Alert
 * Focuses on clarity and driving the merchant to take action (fulfillment).
 */
export const MerchantOrderAlertEmail = ({
  merchantName,
  orderNumber,
  totalAmount,
  currency,
  itemsCount,
  orderId,
}: MerchantOrderAlertEmailProps) => {
  const baseUrl =
    process.env.FRONTEND_URL ?? 'https://dashboard.artisanbase.com';

  const dashboardUrl = `${baseUrl}/orders/${orderId}`;
  const settingsUrl = `${baseUrl}/settings/store`;

  return (
    <Html>
      <Head />
      <Preview>New Sale! Order #{orderNumber} has been placed.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={logo}>Artisan Base</Heading>

          <Text style={paragraph}>Hello {merchantName},</Text>
          <Heading style={subHeading}>You have a new sale!</Heading>
          <Text style={paragraph}>
            Good news! A customer just placed an order in your store. Here is a
            summary of the transaction:
          </Text>

          <Section style={statsBox}>
            <div style={statRow}>
              <span style={statLabel}>Order Number:</span>
              <span style={statValue}>#{orderNumber}</span>
            </div>
            <div style={statRow}>
              <span style={statLabel}>Total Amount:</span>
              <span style={statValue}>
                {currency} {totalAmount}
              </span>
            </div>
            <div style={statRow}>
              <span style={statLabel}>Items:</span>
              <span style={statValue}>{itemsCount}</span>
            </div>
          </Section>

          <Section style={buttonContainer}>
            <Button
              style={{ ...button, padding: '12px 20px' }}
              href={dashboardUrl}
            >
              Prepare for Fulfillment
            </Button>
          </Section>

          <Text style={footerText}>
            Or copy and paste this URL into your browser: <br />
            <Link href={dashboardUrl} style={link}>
              {dashboardUrl}
            </Link>
          </Text>

          <Hr style={hr} />

          <Text style={footer}>
            Manage your store settings and notifications at any time from your
            <Link href={settingsUrl} style={link}>
              dashboard
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

// --- Styles ---
const main = {
  backgroundColor: '#ffffff',
  fontFamily: 'Helvetica, Arial, sans-serif',
};
const container = { margin: '0 auto', padding: '40px 20px', maxWidth: '580px' };
const logo = {
  color: '#2563eb',
  fontSize: '20px',
  fontWeight: '900',
  textAlign: 'center' as const,
  marginBottom: '40px',
};
const subHeading = {
  fontSize: '22px',
  fontWeight: 'bold',
  color: '#1e293b',
  margin: '20px 0',
};
const paragraph = { fontSize: '16px', lineHeight: '24px', color: '#475569' };
const statsBox = {
  background: '#f8fafc',
  border: '1px solid #e2e8f0',
  padding: '20px',
  borderRadius: '8px',
  margin: '30px 0',
};
const statRow = {
  marginBottom: '10px',
  display: 'flex',
  justifyContent: 'space-between',
};
const statLabel = {
  fontWeight: 'bold',
  color: '#64748b',
  fontSize: '12px',
  textTransform: 'uppercase' as const,
};
const statValue = { fontWeight: 'bold', color: '#0f172a', fontSize: '14px' };
const buttonContainer = { textAlign: 'center' as const, margin: '30px 0' };
const button = {
  backgroundColor: '#2563eb',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
};
const link = { color: '#2563eb', textDecoration: 'underline' };
const footerText = {
  fontSize: '12px',
  color: '#94a3b8',
  textAlign: 'center' as const,
};
const hr = { borderColor: '#e2e8f0', margin: '40px 0' };
const footer = {
  color: '#94a3b8',
  fontSize: '12px',
  textAlign: 'center' as const,
};

export default MerchantOrderAlertEmail;
