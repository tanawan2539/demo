"use client";

import Image from "next/image";
import Link from "next/link";
import type { Broker } from "@/lib/api";
import { useLang } from "@/context/LangContext";

const TYPE_DOT: Record<string, string> = {
  cfd: "#3b82f6",
  bond: "#10b981",
  stock: "#f59e0b",
  crypto: "#8b5cf6",
};

export default function BrokerCard({ broker }: { broker: Broker }) {
  const { t } = useLang();
  const label = t.card.typeLabel[broker.broker_type] ?? broker.broker_type.toUpperCase();
  const badge = t.card.typeBadge[broker.broker_type] ?? "VERIFIED";
  const dot = TYPE_DOT[broker.broker_type] ?? "#60a5fa";

  return (
    <Link href={`/brokers/${broker.slug}`} className="group block">
      {/* ── Mobile: horizontal card ─────────────────────────── */}
      <div
        className="flex sm:hidden items-stretch rounded-xl overflow-hidden transition-all duration-200 active:scale-[0.98]"
        style={{
          backgroundColor: "#0d1b2e",
          border: "1px solid #1a3050",
        }}
      >
        {/* Thumbnail */}
        <div className="relative w-24 flex-shrink-0">
          <Image
            src={broker.logo_url}
            alt={broker.name}
            fill
            className="object-cover"
            sizes="96px"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0d1b2e]/30" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 px-3 py-3 flex flex-col justify-between">
          {/* Top */}
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: dot }}
              />
              <span
                className="text-[9px] font-bold tracking-widest uppercase truncate"
                style={{ color: dot }}
              >
                {badge}
              </span>
            </div>
            <p className="text-sm font-semibold leading-snug text-white truncate">
              {broker.name}
            </p>
            <p
              className="text-xs leading-relaxed line-clamp-1 mt-0.5"
              style={{ color: "#64748b" }}
            >
              {broker.description}
            </p>
          </div>

          {/* Bottom row */}
          <div className="flex items-center justify-between mt-2">
            <span
              className="text-[9px] font-semibold tracking-wider uppercase"
              style={{ color: "#334e68" }}
            >
              {label}
            </span>
            <span
              className="flex items-center gap-0.5 text-xs font-medium"
              style={{ color: "#3b82f6" }}
            >
              {t.card.viewDetails}
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </div>

      {/* ── Desktop: vertical card ───────────────────────────── */}
      <div
        className="hidden sm:block relative rounded-xl overflow-hidden transition-all duration-300 group-hover:border-[#2e5a80]"
        style={{ border: "1px solid #1e3a56" }}
      >
        {/* Image */}
        <div className="relative h-52 sm:h-60 w-full bg-slate-900">
          <Image
            src={broker.logo_url}
            alt={broker.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1526] via-[#0a1526]/30 to-transparent" />
        </div>

        {/* Badge */}
        <div className="absolute top-3 right-3">
          <span
            className="text-[10px] font-semibold tracking-widest px-2 py-1 rounded"
            style={{
              backgroundColor: "rgba(15,30,53,0.85)",
              color: "#94c9f0",
              border: "1px solid #2e5a80",
            }}
          >
            {badge}
          </span>
        </div>

        {/* Text overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className="text-white font-bold text-base leading-snug mb-1">
            {broker.name}
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 mb-3">
            {broker.description}
          </p>
          <div
            className="flex items-center justify-between pt-3"
            style={{ borderTop: "1px solid rgba(30,58,86,0.6)" }}
          >
            <div className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: dot }}
              />
              <span
                className="text-[10px] font-semibold tracking-widest uppercase"
                style={{ color: "#64748b" }}
              >
                {label}
              </span>
            </div>
            <span
              className="flex items-center gap-1 text-sm font-medium group-hover:text-blue-300 transition-colors"
              style={{ color: "#60a5fa" }}
            >
              {t.card.viewDetails}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
