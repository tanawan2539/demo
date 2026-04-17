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

  const FILTERS = [
    { value: "all", label: t.filter.all },
    { value: "cfd", label: "CFD" },
    { value: "bond", label: "Bond" },
    { value: "stock", label: "Stock" },
    { value: "crypto", label: "Crypto" },
  ];
  const [isPending, startTransition] = useTransition();
  // ใช้ ref ระบุว่า search เปลี่ยนจาก user พิมพ์ ไม่ใช่จาก URL sync
  const isUserInput = useRef(false);

  // sync input เมื่อ URL เปลี่ยน (เช่น กด back/forward / เปลี่ยน filter)
  useEffect(() => {
    isUserInput.current = false;
    setSearch(activeSearch ?? "");
  }, [activeSearch]);

  const updateUrl = useCallback(
    (type?: string, q?: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", "1");

      if (type && type !== "all") {
        params.set("broker_type", type);
      } else {
        params.delete("broker_type");
      }

      if (q && q.trim()) {
        params.set("search", q.trim());
      } else {
        params.delete("search");
      }

      startTransition(() => {
        router.push(`/?${params.toString()}`);
      });
    },
    [router, searchParams]
  );

  // debounce 500ms — ยิง API เฉพาะเมื่อ user พิมพ์เอง ไม่ยิงซ้ำเมื่อ URL sync
  useEffect(() => {
    if (!isUserInput.current) return;
    const timer = setTimeout(() => {
      updateUrl(activeType || "all", search || undefined);
    }, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleFilter = (value: string) => {
    updateUrl(value, search || undefined);
  };

  const currentType = activeType ?? "all";

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div
        className="flex items-center gap-3 rounded-lg px-4 py-3 w-full sm:max-w-lg"
        style={{
          backgroundColor: "#0f1e35",
          border: "1px solid #1e3a56",
        }}
      >
        {isPending ? (
          <div
            className="w-4 h-4 rounded-full border-2 animate-spin flex-shrink-0"
            style={{ borderColor: "#60a5fa", borderTopColor: "transparent" }}
          />
        ) : (
          <svg
            className="w-4 h-4 flex-shrink-0"
            style={{ color: "#4a6a8a" }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        )}
        <input
          type="text"
          value={search}
          onChange={(e) => {
            isUserInput.current = true;
            setSearch(e.target.value);
          }}
          placeholder={t.filter.placeholder}
          className="flex-1 bg-transparent text-sm outline-none"
          style={{ color: "#e2e8f0" }}
        />
        {/* Clear button */}
        {search && (
          <button
            type="button"
            onClick={() => {
              isUserInput.current = true;
              setSearch("");
            }}
            className="flex-shrink-0 transition-colors"
            style={{ color: "#4a6a8a" }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Filter buttons */}
      <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none"
        style={{ WebkitOverflowScrolling: "touch" } as React.CSSProperties}
      >
        <span
          className="text-xs font-semibold tracking-widest uppercase flex-shrink-0"
          style={{ color: "#4a6a8a" }}
        >
          {t.filter.assetFocus}
        </span>
        <div className="flex items-center gap-2 flex-shrink-0">
          {FILTERS.map((f) => {
            const isActive = currentType === f.value;
            return (
              <button
                key={f.value}
                onClick={() => handleFilter(f.value)}
                className="px-4 py-1.5 rounded text-sm font-medium transition-colors"
                style={
                  isActive
                    ? { backgroundColor: "#ffffff", color: "#0a1526" }
                    : {
                        backgroundColor: "transparent",
                        color: "#94a3b8",
                        border: "1px solid #1e3a56",
                      }
                }
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
