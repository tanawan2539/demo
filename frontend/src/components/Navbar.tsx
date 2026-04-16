"use client";

import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Brokers" },
  { href: "/brokers/add", label: "Submit Broker" },
];

export default function Navbar({ active }: { active?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <nav
      className="w-full border-b sticky top-0 z-50"
      style={{ borderColor: "#1e3a56", backgroundColor: "#0a1526" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-white font-semibold text-lg tracking-wide"
          onClick={() => setOpen(false)}
        >
          Woxa
        </Link>

        {/* Desktop links */}
        <div className="hidden sm:flex items-center gap-7">
          {navLinks.map((link) => {
            const isActive = active === link.label;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium pb-1 transition-colors ${
                  isActive
                    ? "text-white border-b-2 border-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span
            className="block w-5 h-0.5 transition-all duration-200"
            style={{
              backgroundColor: "#94a3b8",
              transform: open ? "rotate(45deg) translateY(7px)" : "none",
            }}
          />
          <span
            className="block w-5 h-0.5 transition-all duration-200"
            style={{
              backgroundColor: "#94a3b8",
              opacity: open ? 0 : 1,
            }}
          />
          <span
            className="block w-5 h-0.5 transition-all duration-200"
            style={{
              backgroundColor: "#94a3b8",
              transform: open ? "rotate(-45deg) translateY(-7px)" : "none",
            }}
          />
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div
          className="sm:hidden border-t px-4 py-3 flex flex-col gap-1"
          style={{ borderColor: "#1e3a56", backgroundColor: "#0a1526" }}
        >
          {navLinks.map((link) => {
            const isActive = active === link.label;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="py-3 text-sm font-medium transition-colors"
                style={{ color: isActive ? "#ffffff" : "#94a3b8" }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
