import { Link, useLocation } from "react-router-dom";
import { useApi } from "../../context/ApiContext";
import React, { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { FiBarChart2 } from "react-icons/fi";
import AiInsightModal from "../Campaign/AIInsight";

const Navbar = () => {
  const { authUser, logout } = useApi();
  const location = useLocation();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showInsights, setShowInsights] = useState(false);

  const navItems = [
    { path: "/dashboard", icon: "📊", label: "Dashboard" },
    { path: "/campaigns", icon: "📢", label: "Campaign" },
    { path: "/customers", icon: "👥", label: "Customers" },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-[var(--bg-black-100)] border-b border-[var(--bg-black-50)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/dashboard" className="flex items-center">
              <span className="text-2xl">🎯</span>
              <span className="ml-2 text-xl font-bold text-[var(--text-black-900)]">
                CamplyCRM
              </span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md text-[var(--text-black-900)] hover:bg-[var(--bg-black-50)]"
            >
              <span className="sr-only">Open menu</span>
              <span className="text-lg">☰</span>
            </button>
          </div>

          {/* Main Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${
                    location.pathname === item.path
                      ? "bg-[var(--skin-color)] text-white"
                      : "text-[var(--text-black-700)] hover:bg-[var(--bg-black-50)]"
                  }`}
                >
                  <span className="mr-1">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            {/* AI Assistant Button */}
            <button
              onClick={() => setShowInsights(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              <FiBarChart2 />
              AI Insights
            </button>

            {showInsights && (
              <AiInsightModal onClose={() => setShowInsights(false)} />
            )}

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Dropdown */}
            <div className="relative">
              <button className="flex items-center" onClick={toggleMobileMenu}>
                <div className="h-8 w-8 rounded-full bg-[var(--skin-color)] flex items-center justify-center text-white">
                  {authUser?.name?.charAt(0) || "U"}
                </div>
                <span className="ml-2 text-sm font-medium text-[var(--text-black-900)]">
                  Account
                </span>
              </button>
              {/* Popup Menu */}
              <div
                className={`absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ${
                  isMobileMenuOpen ? "block" : "hidden"
                }`}
              >
                <div className="py-2 bg-[var(--bg-black-900)]">
                  <div className="flex items-center p-2">
                    <div className="h-8 w-8 rounded-full bg-[var(--skin-color)] flex items-center justify-center text-white">
                      {authUser?.name?.charAt(0) || "U"}
                    </div>
                    <span className="ml-2 text-sm font-medium text-[var(--text-black-900)]">
                      {authUser?.name || "User "}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm font-medium text-[var(--skin-color)] hover:bg-[var(--bg-black-50)]"
                  >
                    <span className="mr-2 ">🚪</span> Logout
                  </button>
                  <button className="block w-full text-left px-4 py-2 text-sm font-medium text-[var(--text-black-700)] hover:bg-[var(--bg-black-50)]">
                    Button
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isMobileMenuOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === item.path
                  ? "bg-[var(--skin-color)] text-white"
                  : "text-[var(--text-black-700)] hover:bg-[var(--bg-black-50)]"
              }`}
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </Link>
          ))}
          <button
            onClick={logout}
            className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-[var(--text-black-700)] hover:bg-[var(--bg-black-50)]"
          >
            <span className="mr-2">🚪</span> Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
