"use client";

import { useLang } from "@/context/LangContext";

export default function HeroSection() {
  const { t } = useLang();
  return (
    <div className="mb-7 sm:mb-10">
      {/* Badge */}
      <div className="flex items-center gap-2 mb-3">
        <span
          className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.15em] uppercase px-2.5 py-1 rounded-full"
          style={{
            backgroundColor: "rgba(96,165,250,0.08)",
            border: "1px solid rgba(96,165,250,0.2)",
            color: "#60a5fa",
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ backgroundColor: "#60a5fa" }}
          />
          Woxa Network
        </span>
      </div>

      {/* Title */}
      <h1
        className="text-3xl sm:text-4xl font-bold leading-tight mb-2 sm:mb-3"
        style={{ color: "#ffffff", letterSpacing: "-0.02em" }}
      >
        {t.home.title}
      </h1>

      {/* Subtitle */}
      <p
        className="text-sm sm:text-base max-w-md leading-relaxed"
        style={{ color: "#64748b" }}
      >
        {t.home.subtitle}
      </p>
    </div>
  );
}
