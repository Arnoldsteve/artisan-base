"use client";

import { Order } from "@/types/orders";

interface InvoiceDocumentProps {
  order: Order;
}

export function InvoiceDocument({ order }: InvoiceDocumentProps) {
  return (
    <div style={{ padding: "40px", fontFamily: "Arial, sans-serif", color: "#333" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        Invoice #{order.orderNumber}
      </h1>

      <section style={{ marginBottom: "20px" }}>
        <h3>Customer Details</h3>
        <p>{order.customerName}</p>
        <p>{order.customerEmail}</p>
      </section>

      <section style={{ marginBottom: "20px" }}>
        <h3>Order Items</h3>
        <table width="100%" border={1} cellPadding={6} style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th align="left">Item</th>
              <th align="right">Qty</th>
              <th align="right">Price</th>
              <th align="right">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items?.map((item, i) => (
              <tr key={i}>
                <td>{item.name}</td>
                <td align="right">{item.quantity}</td>
                <td align="right">{item.price.toFixed(2)}</td>
                <td align="right">{(item.quantity * item.price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section style={{ textAlign: "right", marginTop: "40px" }}>
        <h3>Total: ${order.total.toFixed(2)}</h3>
      </section>

      <footer style={{ marginTop: "60px", textAlign: "center", fontSize: "12px", color: "#888" }}>
        <p>Thank you for your business!</p>
      </footer>
    </div>
  );
}
