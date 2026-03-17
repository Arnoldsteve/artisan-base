"use client";

import { Order } from "@/types/orders";
import { formatMoney } from "@/utils/money";
import { formatDate } from "@/utils/date";

export function InvoiceDocument({ order }: { order: Order }) {
  return (
    <div className="p-8 max-w-4xl mx-auto bg-white text-slate-900 border">
      <div className="flex justify-between items-start mb-12">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-blue-600 mb-1">INVOICE</h1>
          <p className="text-sm font-mono text-slate-500 uppercase">#{order.orderNumber}</p>
        </div>
        <div className="text-right">
          <h2 className="font-bold text-lg">GradeHub Enterprise</h2>
          <p className="text-xs text-slate-500">Nairobi, Kenya</p>
          <p className="text-xs text-slate-500">billing@gradehub.io</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-12 mb-12">
        <div>
          <p className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Bill To</p>
          <p className="font-bold text-slate-900">{order.customer?.firstName} {order.customer?.lastName}</p>
          <p className="text-sm text-slate-600">{order.customer?.email}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Details</p>
          <p className="text-sm text-slate-600">Date: <span className="font-bold">{formatDate(order.createdAt)}</span></p>
          <p className="text-sm text-slate-600">Status: <span className="font-bold uppercase text-blue-600">{order.paymentStatus}</span></p>
        </div>
      </div>

      <table className="w-full mb-12 border-collapse">
        <thead>
          <tr className="border-b-2 border-slate-900 text-left">
            <th className="py-3 text-[10px] font-black uppercase">Product Description</th>
            <th className="py-3 text-[10px] font-black uppercase text-center">Qty</th>
            <th className="py-3 text-[10px] font-black uppercase text-right">Unit Price</th>
            <th className="py-3 text-[10px] font-black uppercase text-right">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {order.items.map((item) => (
            <tr key={item.id}>
              <td className="py-4 text-sm font-bold">{item.productName}</td>
              <td className="py-4 text-sm text-center font-mono">{item.quantity}</td>
              <td className="py-4 text-sm text-right font-mono">{formatMoney(Number(item.unitPrice), order.currency)}</td>
              <td className="py-4 text-sm text-right font-black">{formatMoney(Number(item.unitPrice) * item.quantity, order.currency)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end">
        <div className="w-64 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500 uppercase font-bold text-[10px]">Subtotal</span>
            <span className="font-mono">{formatMoney(Number(order.subtotal), order.currency)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500 uppercase font-bold text-[10px]">Shipping</span>
            <span className="font-mono">{formatMoney(Number(order.shippingAmount), order.currency)}</span>
          </div>
          <div className="flex justify-between text-xl border-t-2 border-slate-900 pt-4 mt-4">
            <span className="font-black uppercase tracking-tighter">Total</span>
            <span className="font-black text-blue-600">{formatMoney(Number(order.totalAmount), order.currency)}</span>
          </div>
        </div>
      </div>

      <div className="mt-20 pt-8 border-t text-center">
        <p className="text-[10px] uppercase font-bold text-slate-400">Thank you for choosing GradeHub.</p>
      </div>
    </div>
  );
}