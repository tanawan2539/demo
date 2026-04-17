"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useLang } from "@/context/LangContext";

export default function BrokerFilterBar({
  activeType,
  activeSearch,
}: {
  activeType?: string;
  activeSearch?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLang();
  const [search, setSearch] = useState(activeSearch ?? "");
  const [isPending, startTransition] = useTransition();
  const isUserInput = useRef(false);

  const FILTERS = [
    { value: "all", label: t.filter.all },
    { value: "cfd", label: "CFD" },
    { value: "bond", label: "Bond" },
    { value: "stock", label: "Stock" },
    { value: "crypto", label: "Crypto" },
  ];

  useEffect(() => {
    isUserInput.current = false;
    setSearch(activeSearch ?? "");
  }, [activeSearch]);

  const updateUrl = useCallback(
    (type?: string, q?: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", "1");
      if (type && type !== "all") params.set("broker_type", type);
      else params.delete("broker_type");
      if (q && q.trim()) params.set("search", q.trim());
      else params.delete("search");
      startTransition(() => router.push(`/?${params.toString()}`));
    },
    [router, searchParams]
  );

  useEffect(() => {
    if (!isUserInput.current) return;
    const timer = setTimeout(() => {
      updateUrl(activeType || "all", search || undefined);
    }, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const currentType = activeType ?? "all";

  return (
    <div className="space-y-3">
      {/* Search bar */}
      <div
        className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 w-full sm:max-w-md"
        style={{ backgroundColor: "#0d1b2e", border: "1px solid #1a3050" }}
      >
        {isPending ? (
          <div
            className="w-4 h-4 rounded-full border-2 animate-spin flex-shrink-0"
            style={{ borderColor: "#3b82f6", borderTopColor: "transparent" }}
          />
        ) : (
          <svg className="w-4 h-4 flex-shrink-0" style={{ color: "#334e68" }}
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        )}
        <input
          type="text"
          value={search}
          onChange={(e) => { isUserInput.current = true; setSearch(e.target.value); }}
          placeholder={t.filter.placeholder}
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-[#334e68]"
          style={{ color: "#e2e8f0" }}
        />
        {search && (
          <button
            type="button"
            onClick={() => { isUserInput.current = true; setSearch(""); }}
            className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full transition-colors"
            style={{ backgroundColor: "#1a3050", color: "#64748b" }}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Filter pills */}
      <div
        className="flex items-center gap-2 overflow-x-auto pb-0.5"
        style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" } as React.CSSProperties}
      >
        {FILTERS.map((f) => {
          const isActive = currentType === f.value;
          return (
            <button
              key={f.value}
              onClick={() => updateUrl(f.value, search || undefined)}
              className="flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-150"
              style={
                isActive
                  ? {
                      backgroundColor: "#1d4ed8",
                      color: "#ffffff",
                      border: "1px solid #2563eb",
                    }
                  : {
                      backgroundColor: "transparent",
                      color: "#475569",
                      border: "1px solid #1a3050",
                    }
              }
            >
              {f.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
