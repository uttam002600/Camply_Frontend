import { Link } from "react-router-dom";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[var(--bg-black-100)] border-t border-[var(--bg-black-50)] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link
              to="/"
              className="text-2xl font-bold text-[var(--skin-color)]"
            >
              CamplyCRM
            </Link>
            <p className="text-sm text-[var(--text-black-700)]">
              CRM app made with ❤️--{" "}
              <span className="font-bold text-[var(--skin-color)]">
                UTTAM UPADHYAY
              </span>
              .
            </p>
            <p className="text-xs text-[var(--text-black-700)]">
              © {new Date().getFullYear()} Camply Inc. All rights reserved.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[var(--text-black-900)] font-medium mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/dashboard"
                  className="text-[var(--text-black-700)] hover:text-[var(--skin-color)] text-sm"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/campaigns"
                  className="text-[var(--text-black-700)] hover:text-[var(--skin-color)] text-sm"
                >
                  Campaigns
                </Link>
              </li>
              <li>
                <Link
                  to="/customers"
                  className="text-[var(--text-black-700)] hover:text-[var(--skin-color)] text-sm"
                >
                  Customers
                </Link>
              </li>
              <li>
                <Link
                  to="/account"
                  className="text-[var(--text-black-700)] hover:text-[var(--skin-color)] text-sm"
                >
                  Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-[var(--text-black-900)] font-medium mb-4">
              Resources
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-[var(--text-black-700)] hover:text-[var(--skin-color)] text-sm"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[var(--text-black-700)] hover:text-[var(--skin-color)] text-sm"
                >
                  API Reference
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[var(--text-black-700)] hover:text-[var(--skin-color)] text-sm"
                >
                  Help Center
                </a>
              </li>
            </ul>
          </div>

          {/* CTA Section */}
          <div>
            <h3 className="text-[var(--text-black-900)] font-medium mb-4">
              Get Started
            </h3>
            <div className="space-y-4">
              <Link
                to="/campaigns/new"
                className="inline-block w-full md:w-auto px-4 py-2 bg-[var(--skin-color)] text-white rounded-md text-center hover:opacity-90 transition"
              >
                Create Campaign
              </Link>
              <a
                href="mailto:support@camply.com"
                className="inline-block w-full md:w-auto px-4 py-2 border border-[var(--skin-color)] text-[var(--skin-color)] rounded-md text-center hover:bg-[var(--bg-black-50)] transition"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[var(--bg-black-50)] pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-4 mb-4 md:mb-0">
            <a
              href="https://github.com/uttam002600"
              className="text-[var(--text-black-700)] hover:text-[var(--skin-color)]"
            >
              <span className="sr-only">GitHub</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </div>

          <div className="flex flex-col md:flex-row md:space-x-6 space-y-2 md:space-y-0 text-sm text-[var(--text-black-700)]">
            <a href="#" className="hover:text-[var(--skin-color)]">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-[var(--skin-color)]">
              Terms of Service
            </a>
            <a href="#" className="hover:text-[var(--skin-color)]">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
