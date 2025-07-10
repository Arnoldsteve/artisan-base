import React from "react";
import { Button } from "@repo/ui/components/ui/button";

export function PolicyFaqTab() {
  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Return Policy & FAQ</h2>
      <section className="mb-8">
        <h3 className="font-semibold text-lg mb-2">Return Policy</h3>
        <ul className="list-disc ml-6 text-sm mb-2">
          <li>
            Returns accepted within{" "}
            <span className="font-semibold">30 days</span> of delivery.
          </li>
          <li>Items must be unused and in original packaging.</li>
          <li>Refunds processed to original payment or store credit.</li>
          <li>Return shipping is free for eligible items.</li>
          <li>
            Processing time:{" "}
            <span className="font-semibold">3-5 business days</span> after item
            received.
          </li>
        </ul>
        <Button asChild size="sm" className="mt-2">
          <a href="/shipping-info">View Shipping Info</a>
        </Button>
      </section>
      <section className="mb-8">
        <h3 className="font-semibold text-lg mb-2">
          Frequently Asked Questions
        </h3>
        <div className="mb-2">
          <div className="font-medium">How do I start a return?</div>
          <div className="text-sm text-gray-600">
            Go to the "Start New Return" tab and follow the steps to select your
            order and items.
          </div>
        </div>
        <div className="mb-2">
          <div className="font-medium">
            How long does it take to get a refund?
          </div>
          <div className="text-sm text-gray-600">
            Refunds are processed within 3-5 business days after we receive your
            returned item.
          </div>
        </div>
        <div className="mb-2">
          <div className="font-medium">Can I exchange an item?</div>
          <div className="text-sm text-gray-600">
            Yes, you can request an exchange during the return process if the
            item is eligible.
          </div>
        </div>
        <div className="mb-2">
          <div className="font-medium">
            What if my item is damaged or defective?
          </div>
          <div className="text-sm text-gray-600">
            Select "Defective/Damaged" as your reason and upload photos to help
            us process your return faster.
          </div>
        </div>
      </section>
      <section className="mb-8">
        <h3 className="font-semibold text-lg mb-2">Contact & Support</h3>
        <div className="text-sm mb-2">
          Need help? Our customer service team is here for you.
        </div>
        <Button asChild size="sm">
          <a href="mailto:support@example.com">Contact Support</a>
        </Button>
      </section>
      <section className="mb-8">
        <h3 className="font-semibold text-lg mb-2">What Our Customers Say</h3>
        <div className="bg-gray-50 rounded p-4 shadow mb-2">
          <div className="italic">
            "Return process was super easy and my refund was fast!"
          </div>
          <div className="text-xs text-gray-500 mt-1">- Jamie L.</div>
        </div>
        <div className="bg-gray-50 rounded p-4 shadow mb-2">
          <div className="italic">
            "Customer service helped me with my exchange in no time."
          </div>
          <div className="text-xs text-gray-500 mt-1">- Alex P.</div>
        </div>
        <div className="bg-gray-50 rounded p-4 shadow">
          <div className="italic">
            "98% of returns processed within 5 days. Highly recommend!"
          </div>
          <div className="text-xs text-gray-500 mt-1">- Verified Shopper</div>
        </div>
      </section>
    </div>
  );
}
