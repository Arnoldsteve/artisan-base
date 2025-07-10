import React from "react";

export function FooterSection() {
  return (
    <footer className="bg-white border-t py-8 mt-12 text-sm text-gray-600">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row md:justify-between gap-6">
        <div>
          <div className="font-bold mb-2">Quick Links</div>
          <ul className="space-y-1">
            <li>
              <a href="/help-center" className="hover:underline">
                Help Center Home
              </a>
            </li>
            <li>
              <a href="/shipping-info" className="hover:underline">
                Shipping Information
              </a>
            </li>
            <li>
              <a href="/returns-exchanges" className="hover:underline">
                Returns & Exchanges
              </a>
            </li>
            <li>
              <a href="/account" className="hover:underline">
                Account & Profile
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:underline">
                Contact Support
              </a>
            </li>
          </ul>
        </div>
        <div>
          <div className="font-bold mb-2">Contact Information</div>
          <div>
            Email:{" "}
            <a href="mailto:support@example.com" className="hover:underline">
              support@example.com
            </a>
          </div>
          <div>
            Phone:{" "}
            <a href="tel:1-800-555-1234" className="hover:underline">
              1-800-555-1234
            </a>
          </div>
          <div>Business Hours: Mon-Fri 8AM-8PM EST</div>
        </div>
        <div>
          <div className="font-bold mb-2">Language</div>
          <select className="border rounded px-3 py-2 text-sm">
            <option>English</option>
            <option>Español</option>
            <option>Français</option>
            <option>Deutsch</option>
          </select>
        </div>
        <div>
          <div className="font-bold mb-2">Accessibility</div>
          <ul className="space-y-1">
            <li>Screen reader support</li>
            <li>High contrast mode</li>
            <li>Keyboard navigation</li>
            <li>Text scaling up to 200%</li>
          </ul>
        </div>
      </div>
      <div className="text-center text-xs text-gray-400 mt-8">
        &copy; {new Date().getFullYear()} Your Company. All rights reserved.
      </div>
    </footer>
  );
}
