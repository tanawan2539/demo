"use client";

import Link from "next/link";
import { useLang } from "@/context/LangContext";

export default function ManageHeader() {
  const { t } = useLang();
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
          {t.manage.title}
        </h1>
        <p className="text-sm mt-1" style={{ color: "#4a6a8a" }}>
          {t.manage.subtitle}
        </p>
      </div>
      <Link
        href="/brokers/add"
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors self-start sm:self-auto"
        style={{ backgroundColor: "#1e3f6e", border: "1px solid #3b72b8", color: "#fff" }}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        {t.manage.addBroker}
      </Link>
    </div>
  );
}
