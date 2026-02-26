import * as React from 'react';  
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
  Row,
  Column,
} from '@react-email/components';

interface OrderItem {
  productName: string;
  quantity: number;
  unitPrice: number;
}

interface VendorGroup {
  merchantName: string;
  items: OrderItem[];
}

interface BuyerReceiptEmailProps {
  customerName: string;
  paymentReference: string;
  totalAmount: string;
  currency: string;
  vendors: VendorGroup[];
}

/**
 * Enterprise Standard: Multi-Vendor Receipt Template
 * Using React Email components for responsive, consistent layout.
 */
export const BuyerReceiptEmail = ({
  customerName,
  paymentReference,
  totalAmount,
  currency,
  vendors,
}: BuyerReceiptEmailProps) => (
  <Html>
    <Head />
    <Preview>Your Artisan Base order is confirmed: ${paymentReference}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={logo}>Artisan Base</Heading>
        </Section>

        <Text style={paragraph}>Hi {customerName},</Text>
        <Text style={paragraph}>
          Thank you for your purchase. We've notified our artisans and they are
          preparing your handcrafted goods.
        </Text>

        <Section style={refBox}>
          <Text style={refLabel}>Payment Reference</Text>
          <Text style={refValue}>{paymentReference}</Text>
        </Section>

        {vendors.map((vendor, index) => (
          <Section key={index} style={vendorSection}>
            <Text style={vendorTitle}>SOLD BY: {vendor.merchantName}</Text>
            {vendor.items.map((item, i) => (
              <Row key={i} style={itemRow}>
                <Column>
                  <Text style={itemName}>{item.productName}</Text>
                  <Text style={itemQty}>Qty: {item.quantity}</Text>
                </Column>
                <Column align="right">
                  <Text style={itemPrice}>
                    {currency}{' '}
                    {(item.unitPrice * item.quantity).toLocaleString()}
                  </Text>
                </Column>
              </Row>
            ))}
          </Section>
        ))}

        <Hr style={hr} />

        <Row>
          <Column align="right">
            <Text style={totalLabel}>Total Amount Paid</Text>
            <Text style={totalValue}>
              {currency} {totalAmount}
            </Text>
          </Column>
        </Row>

        <Text style={footer}>
          &copy; 2026 Artisan Base. Handcrafted excellence from Africa to the
          World.
        </Text>
      </Container>
    </Body>
  </Html>
);

// --- Top 1% Design System (Inlined Styles) ---
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: 'Helvetica, Arial, sans-serif',
};
const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '580px',
};
const header = { padding: '30px' };
const logo = {
  color: '#2563eb',
  fontSize: '24px',
  fontWeight: '900',
  textAlign: 'center' as const,
};
const paragraph = { fontSize: '16px', lineHeight: '26px', color: '#484848' };
const refBox = {
  background: '#f1f5f9',
  padding: '12px',
  borderRadius: '4px',
  margin: '20px 0',
};
const refLabel = {
  fontSize: '10px',
  color: '#64748b',
  textTransform: 'uppercase' as const,
  fontWeight: 'bold',
};
const refValue = {
  fontSize: '14px',
  fontWeight: 'bold',
  fontFamily: 'monospace',
};
const vendorSection = {
  marginBottom: '20px',
  border: '1px solid #e2e8f0',
  borderRadius: '4px',
  padding: '15px',
  backgroundColor: '#ffffff',
};
const vendorTitle = {
  fontSize: '10px',
  fontWeight: 'bold',
  color: '#475569',
  margin: '0 0 10px 0',
  borderBottom: '1px solid #f1f5f9',
  paddingBottom: '5px',
};
const itemRow = { padding: '8px 0' };
const itemName = { fontSize: '14px', fontWeight: '600', margin: '0' };
const itemQty = { fontSize: '12px', color: '#64748b', margin: '2px 0 0 0' };
const itemPrice = { fontSize: '14px', fontWeight: 'bold' };
const hr = { borderColor: '#e2e8f0', margin: '20px 0' };
const totalLabel = { fontSize: '14px', color: '#64748b' };
const totalValue = {
  fontSize: '24px',
  fontWeight: '900',
  color: '#2563eb',
  margin: '5px 0 0 0',
};
const footer = {
  color: '#8898aa',
  fontSize: '12px',
  textAlign: 'center' as const,
  marginTop: '40px',
};

export default BuyerReceiptEmail;
