"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/context/LangContext";
import type { Broker } from "@/lib/api";

const TYPE_COLOR_MAP: Record<string, string> = {
  cfd: "#3b82f6",
  bond: "#10b981",
  stock: "#f59e0b",
  crypto: "#8b5cf6",
};

export default function BrokerDetailContent({ broker }: { broker: Broker }) {
  const { t } = useLang();
  const typeLabel = t.detail.typeLabel[broker.broker_type] ?? broker.broker_type.toUpperCase();

  return (
    <>
      {/* Back */}
      <Link
        href="/"
        className="flex items-center gap-2 text-sm mb-6 sm:mb-8 transition-colors"
        style={{ color: "#60a5fa" }}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
        </svg>
        {t.detail.back}
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Cover image */}
        <div
          className="md:col-span-2 rounded-xl overflow-hidden relative"
          style={{ height: "220px", backgroundColor: "#0f1e35", border: "1px solid #1e3a56" }}
        >
          <Image
            src={broker.logo_url}
            alt={broker.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1526]/70 to-transparent" />
        </div>

        {/* Info card */}
        <div
          className="rounded-xl p-6 flex flex-col gap-4"
          style={{ backgroundColor: "#0f1e35", border: "1px solid #1e3a56" }}
        >
          <div>
            <p
              className="text-xs font-semibold tracking-widest uppercase mb-1"
              style={{ color: "#4a6a8a" }}
            >
              {broker.broker_type.toUpperCase()}
            </p>
            <h1 className="text-2xl font-bold text-white leading-snug">{broker.name}</h1>
          </div>

          <div className="flex items-center gap-2 py-2 border-y" style={{ borderColor: "#1e3a56" }}>
            <svg
              className="w-4 h-4"
              style={{ color: TYPE_COLOR_MAP[broker.broker_type] ?? "#60a5fa" }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <span className="text-sm font-medium" style={{ color: "#94a3b8" }}>
              {typeLabel}
            </span>
          </div>

          <a
            href={broker.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm transition-colors"
            style={{ color: "#60a5fa" }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9"
              />
            </svg>
            {broker.website.replace(/^https?:\/\//, "")}
          </a>

          <p className="text-xs" style={{ color: "#475569" }}>
            {t.detail.listed}{" "}
            {new Date(broker.created_at).toLocaleDateString("th-TH", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Description */}
      <div
        className="mt-6 rounded-xl p-6"
        style={{ backgroundColor: "#0f1e35", border: "1px solid #1e3a56" }}
      >
        <h2
          className="text-sm font-semibold uppercase tracking-widest mb-3"
          style={{ color: "#4a6a8a" }}
        >
          {t.detail.about}
        </h2>
        <p className="text-base leading-relaxed" style={{ color: "#cbd5e1" }}>
          {broker.description}
        </p>
      </div>
    </>
  );
}
