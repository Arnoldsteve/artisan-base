import React from "react";
import { Truck } from "lucide-react";

function ShippingTruckIcon() {
  return (
    <span className="inline-block animate-bounce">
      <Truck className="w-16 h-16 text-blue-600" aria-hidden="true" />
    </span>
  );
}

export function ShippingHero() {
  return (
    <section className="flex justify-center mb-10">
      <div className="flex flex-col md:flex-row items-center gap-6 max-w-6xl w-full px-4">
        {/* Left Section */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Shipping Information
          </h1>
          <h2 className="text-2xl font-bold text-blue-700 mb-2">
            Fast, Reliable Shipping Worldwide
          </h2>
          <p className="text-gray-600 mb-4">
            Get your orders delivered quickly and securely, Learn more about our
            shipping methods, delivery, and tracking
          </p>
        </div>

        {/* Right Section */}
        {/* <div className="flex-1 flex items-center justify-center">
      <ShippingTruckIcon />
    </div> */}
      </div>
    </section>
  );
}
