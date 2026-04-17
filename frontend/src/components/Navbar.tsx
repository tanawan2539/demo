"use client";

import Link from "next/link";
import { useState } from "react";
import { useLang } from "@/context/LangContext";

const NAV_LINKS = [
  { href: "/", key: "brokers" },
  { href: "/brokers/add", key: "submitBroker" },
  { href: "/manage", key: "manage" },
] as const;

export default function Navbar({ active }: { active?: string }) {
  const [open, setOpen] = useState(false);
  const { lang, setLang, t } = useLang();

  const navLabels: Record<string, string> = {
    brokers: t.nav.brokers,
    submitBroker: t.nav.submitBroker,
    manage: t.nav.manage,
  };

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

        {/* Desktop links + lang toggle */}
        <div className="hidden sm:flex items-center gap-7">
          {NAV_LINKS.map((link) => {
            const isActive = active === link.key;
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
                {navLabels[link.key]}
              </Link>
            );
          })}

          {/* Language toggle */}
          <div
            className="flex items-center rounded overflow-hidden"
            style={{ border: "1px solid #1e3a56" }}
          >
            {(["en", "th"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className="px-2.5 py-1 text-xs font-semibold uppercase tracking-wider transition-colors"
                style={
                  lang === l
                    ? { backgroundColor: "#1e3f6e", color: "#ffffff" }
                    : { backgroundColor: "transparent", color: "#64748b" }
                }
              >
                {l}
              </button>
            ))}
          </div>
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
          {NAV_LINKS.map((link) => {
            const isActive = active === link.key;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="py-3 text-sm font-medium transition-colors"
                style={{ color: isActive ? "#ffffff" : "#94a3b8" }}
              >
                {navLabels[link.key]}
              </Link>
            );
          })}

          {/* Mobile lang toggle */}
          <div className="flex items-center gap-2 pt-3 border-t mt-1" style={{ borderColor: "#1e3a56" }}>
            {(["en", "th"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className="px-3 py-1 rounded text-xs font-semibold uppercase tracking-wider transition-colors"
                style={
                  lang === l
                    ? { backgroundColor: "#1e3f6e", color: "#ffffff", border: "1px solid #3b72b8" }
                    : { backgroundColor: "transparent", color: "#64748b", border: "1px solid #1e3a56" }
                }
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
