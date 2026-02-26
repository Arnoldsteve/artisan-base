import * as React from 'react';
import {
  Body, Container, Head, Heading, Hr, Html,
  Preview, Section, Text,
} from '@react-email/components';

interface PaymentConfirmationEmailProps {
  customerName: string;
  paymentReference: string;
  mpesaReceiptNumber: string;
  amount: string;
  currency: string;
}

export const PaymentConfirmationEmail = ({
  customerName,
  paymentReference,
  mpesaReceiptNumber,
  amount,
  currency,
}: PaymentConfirmationEmailProps) => (
  <Html>
    <Head />
    <Preview>Payment confirmed ✓ — Your order is now being processed</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={logo}>Artisan Base</Heading>

        <Section style={successBox}>
          <Text style={successIcon}>✓</Text>
          <Text style={successTitle}>Payment Confirmed</Text>
        </Section>

        <Text style={paragraph}>Hi {customerName},</Text>
        <Text style={paragraph}>
          We have received your payment. Your artisans have been notified and
          are now preparing your order.
        </Text>

        <Section style={refBox}>
          <Text style={refLabel}>Payment Reference</Text>
          <Text style={refValue}>{paymentReference}</Text>
          <Hr style={hr} />
          <Text style={refLabel}>Mpesa Receipt</Text>
          <Text style={refValue}>{mpesaReceiptNumber}</Text>
          <Hr style={hr} />
          <Text style={refLabel}>Amount Paid</Text>
          <Text style={refValue}>{currency} {amount}</Text>
        </Section>

        <Text style={footer}>
          &copy; 2026 Artisan Base. Handcrafted excellence from Africa to the World.
        </Text>
      </Container>
    </Body>
  </Html>
);

const main = { backgroundColor: '#f6f9fc', fontFamily: 'Helvetica, Arial, sans-serif' };
const container = { margin: '0 auto', padding: '20px 0 48px', maxWidth: '580px' };
const logo = { color: '#2563eb', fontSize: '24px', fontWeight: '900', textAlign: 'center' as const };
const successBox = { textAlign: 'center' as const, margin: '30px 0' };
const successIcon = { fontSize: '48px', color: '#16a34a', margin: '0', textAlign: 'center' as const };
const successTitle = { fontSize: '24px', fontWeight: 'bold', color: '#16a34a', margin: '10px 0' };
const paragraph = { fontSize: '16px', lineHeight: '26px', color: '#484848' };
const refBox = { background: '#f1f5f9', padding: '16px', borderRadius: '4px', margin: '20px 0' };
const refLabel = { fontSize: '10px', color: '#64748b', textTransform: 'uppercase' as const, fontWeight: 'bold', margin: '0' };
const refValue = { fontSize: '14px', fontWeight: 'bold', fontFamily: 'monospace', margin: '4px 0 8px 0' };
const hr = { borderColor: '#e2e8f0', margin: '8px 0' };
const footer = { color: '#8898aa', fontSize: '12px', textAlign: 'center' as const, marginTop: '40px' };

export default PaymentConfirmationEmail;