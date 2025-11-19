import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Row,
  Section,
  Text,
  Img,
} from "@react-email/components";
import * as React from "react";

interface OrderItem {
  productName: string;
  quantity: number;
  unitPrice: string | number;
  image?: string | null;
  sku?: string | null;
}

interface OrderConfirmationEmailProps {
  orderNumber: string;
  customerName?: string;
  items: OrderItem[];
  subtotal: string | number;
  taxAmount: string | number;
  shippingAmount: string | number;
  totalAmount: string | number;
  currency: string;
  createdAt: string;
}

export const OrderConfirmationEmail = ({
  orderNumber,
  customerName = "Customer",
  items,
  subtotal,
  taxAmount,
  shippingAmount,
  totalAmount,
  currency,
  createdAt,
}: OrderConfirmationEmailProps) => (
  <Html>
    <Head />

    {/* @ts-ignore */}
    <Preview>Your order {orderNumber} has been received</Preview>

    <Body style={main}>
      <Container style={container}>
        {/* Header */}
        <Section style={header}>
          <Heading style={heading}>🛒 Order Confirmation</Heading>
          <Text style={timestampStyle}>Order Date: {createdAt}</Text>
        </Section>

        {/* Greeting */}
        <Section style={section}>
          <Text style={greeting}>Hello {customerName},</Text>
          <Text style={paragraph}>
            Thank you for your order! We have successfully received order
            <strong> {orderNumber}</strong>.
            Below is a summary of your purchase:
          </Text>
        </Section>

        {/* Order Items */}
        <Section style={itemsContainer}>
          <Heading as="h2" style={itemsHeading}>
            Order Summary
          </Heading>

          {items.map((item, index) => (
            // @ts-expect-error - react-email Row component type issue
            <Row key={index} style={itemRow}>
                <Column style={itemImageColumn}>
                  {item.image ? (
                    <Img
                      src={item.image}
                      width="60"
                      height="60"
                      style={itemImage}
                    />
                  ) : (
                    <div style={placeholderImage}></div>
                  )}
                </Column>

                <Column style={itemInfoColumn}>
                  <Text style={itemName}>{item.productName}</Text>
                  {item.sku && <Text style={itemSku}>SKU: {item.sku}</Text>}
                  <Text style={itemQuantity}>Qty: {item.quantity}</Text>
                </Column>

                <Column style={itemPriceColumn}>
                  <Text style={itemPrice}>
                    {currency}{" "}
                    {(Number(item.unitPrice) * item.quantity).toFixed(2)}
                  </Text>
                </Column>
            </Row>
          ))}
        </Section>

        <Hr style={hr} />

        {/* Totals */}
        <Section style={totalsSection}>
          {/* @ts-expect-error - react-email Row component type issue */}
          <Row>
              <Column>
                <Text style={totalsLabel}>Subtotal:</Text>
              </Column>
              <Column style={totalsValueColumn}>
                <Text style={totalsValue}>
                  {currency} {subtotal}
                </Text>
              </Column>
          </Row>

          {/* @ts-expect-error - react-email Row component type issue */}
          <Row>
              <Column>
                <Text style={totalsLabel}>Tax:</Text>
              </Column>
              <Column style={totalsValueColumn}>
                <Text style={totalsValue}>
                  {currency} {taxAmount}
                </Text>
              </Column>
          </Row>

          {/* @ts-expect-error - react-email Row component type issue */}
          <Row>
              <Column>
                <Text style={totalsLabel}>Shipping:</Text>
              </Column>
              <Column style={totalsValueColumn}>
                <Text style={totalsValue}>
                  {currency} {shippingAmount}
                </Text>
              </Column>
          </Row>

          <Hr style={hrSmall} />

          {/* @ts-expect-error - react-email Row component type issue */}
          <Row>
              <Column>
                <Text style={totalsLabelTotal}>Grand Total:</Text>
              </Column>
              <Column style={totalsValueColumn}>
                <Text style={totalsValueTotal}>
                  {currency} {totalAmount}
                </Text>
              </Column>
          </Row>
        </Section>

        <Hr style={hr} />

        {/* Next Steps */}
        <Section style={section}>
          <Text style={paragraph}>
            Our team will begin processing your order shortly.  
            You will receive another notification when your package is shipped.
          </Text>
        </Section>

        {/* Button */}
        <Section style={buttonContainer}>
          <Button style={primaryButton} href="#">
            View Your Order
          </Button>
        </Section>

        <Hr style={hr} />

        {/* Footer */}
        <Section style={footerSection}>
          <Text style={footer}>If you have any questions, reply to this email.</Text>
          <Text style={footerSmall}>Thank you for shopping with us!</Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

// -------------------
// Styles
// -------------------

const main = {
  backgroundColor: "#f8fafc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  lineHeight: "1.6",
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  marginBottom: "32px",
  borderRadius: "12px",
  boxShadow:
    "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  maxWidth: "600px",
  overflow: "hidden",
};

const header = {
  backgroundColor: "#4f46e5",
  padding: "32px 24px",
  textAlign: "center" as const,
};

const heading = {
  fontSize: "28px",
  fontWeight: "700",
  margin: 0,
  color: "#ffffff",
};

const timestampStyle = {
  fontSize: "14px",
  color: "#e0e7ff",
  margin: "8px 0 0 0",
};

const section = {
  padding: "24px",
};

const greeting = {
  fontSize: "18px",
  fontWeight: 600,
  marginBottom: "8px",
};

const paragraph = {
  fontSize: "16px",
  color: "#374151",
  marginBottom: "16px",
};

const itemsContainer = {
  padding: "24px",
};

const itemsHeading = {
  fontSize: "20px",
  fontWeight: 600,
  marginBottom: "16px",
};

const itemRow = {
  marginBottom: "16px",
};

const itemImageColumn = { width: "70px" };
const itemInfoColumn = { width: "100%" };
const itemPriceColumn = { textAlign: "right" as const };

const itemImage = {
  borderRadius: "6px",
};

const placeholderImage = {
  width: "60px",
  height: "60px",
  backgroundColor: "#e5e7eb",
  borderRadius: "6px",
};

const itemName = {
  fontSize: "16px",
  fontWeight: 600,
  color: "#1e293b",
};

const itemSku = {
  fontSize: "13px",
  color: "#64748b",
};

const itemQuantity = {
  fontSize: "14px",
  color: "#374151",
};

const itemPrice = {
  fontSize: "16px",
  fontWeight: 600,
  color: "#1e293b",
};

const hr = {
  borderColor: "#e2e8f0",
  margin: "32px 0",
};

const hrSmall = {
  borderColor: "#e2e8f0",
  margin: "16px 0",
};

const totalsSection = { padding: "0 24px 24px" };

const totalsLabel = {
  fontSize: "14px",
  fontWeight: 500,
  color: "#64748b",
};

const totalsLabelTotal = {
  fontSize: "16px",
  fontWeight: 700,
};

const totalsValueColumn = { textAlign: "right" as const };

const totalsValue = {
  fontSize: "14px",
  fontWeight: 500,
};

const totalsValueTotal = {
  fontSize: "18px",
  fontWeight: 700,
  color: "#4f46e5",
};

const buttonContainer = {
  textAlign: "center" as const,
  padding: "0 24px 24px",
};

const primaryButton = {
  backgroundColor: "#4f46e5",
  borderRadius: "8px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: 600,
  padding: "14px 28px",
  textDecoration: "none",
};

const footerSection = {
  padding: "24px",
  textAlign: "center" as const,
  backgroundColor: "#f8fafc",
};

const footer = {
  color: "#64748b",
  fontSize: "14px",
  marginBottom: "8px",
};

const footerSmall = {
  color: "#94a3b8",
  fontSize: "12px",
  fontStyle: "italic",
};

export default OrderConfirmationEmail;