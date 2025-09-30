"use client";

import React from "react";
import { Button } from "@repo/ui/components/ui/button";
import { Card, CardContent } from "@repo/ui/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/ui/components/ui/accordion";

export function PolicyFaqTab() {
  return (
    <div className="max-w-2xl mx-auto space-y-10">
      {/* Return Policy */}
      <section>
        <h2 className="text-xl font-bold mb-4">Return Policy & FAQ</h2>
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-3">Return Policy</h3>
            <ul className="list-disc pl-5 text-sm space-y-1 text-muted-foreground">
              <li>
                Returns accepted within{" "}
                <span className="font-semibold">30 days</span> of delivery.
              </li>
              <li>Items must be unused and in original packaging.</li>
              <li>Refunds processed to original payment or store credit.</li>
              <li>Return shipping is free for eligible items.</li>
              <li>
                Processing time:{" "}
                <span className="font-semibold">3–5 business days</span> after
                item received.
              </li>
            </ul>
            <Button asChild size="sm" className="mt-4">
              <a href="/shipping-info">View Shipping Info</a>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* FAQ */}
      <section>
        <h3 className="font-semibold text-lg mb-3">Frequently Asked Questions</h3>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="start-return">
            <AccordionTrigger>How do I start a return?</AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              Go to the "Start New Return" tab and follow the steps to select
              your order and items.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="refund-time">
            <AccordionTrigger>How long does it take to get a refund?</AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              Refunds are processed within 3–5 business days after we receive
              your returned item.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="exchange">
            <AccordionTrigger>Can I exchange an item?</AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              Yes, you can request an exchange during the return process if the
              item is eligible.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="damaged">
            <AccordionTrigger>
              What if my item is damaged or defective?
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              Select "Defective/Damaged" as your reason and upload photos to
              help us process your return faster.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* Contact */}
      <section>
        <h3 className="font-semibold text-lg mb-2">Contact & Support</h3>
        <p className="text-sm text-muted-foreground mb-3">
          Need help? Our customer service team is here for you.
        </p>
        <Button asChild size="sm">
          <a href="mailto:satechs.solutions.com">Contact Support</a>
        </Button>
      </section>

      {/* Testimonials */}
      <section>
        <h3 className="font-semibold text-lg mb-2">What Our Customers Say</h3>
        <div className="space-y-3">
          {[
            {
              quote: "Return process was super easy and my refund was fast!",
              author: "Jamie L.",
            },
            {
              quote:
                "Customer service helped me with my exchange in no time.",
              author: "Alex P.",
            },
            {
              quote:
                "98% of returns processed within 5 days. Highly recommend!",
              author: "Verified Shopper",
            },
          ].map((t, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <p className="italic">"{t.quote}"</p>
                <p className="text-xs text-muted-foreground mt-1">- {t.author}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
