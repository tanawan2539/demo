"use client";

import { useLang } from "@/context/LangContext";

export default function HeroSection() {
  const { t } = useLang();
  return (
    <div className="mb-8 sm:mb-10">
      <h1
        className="text-2xl sm:text-4xl font-bold mb-2 sm:mb-3 leading-tight"
        style={{ color: "#ffffff" }}
      >
        {t.home.title}
      </h1>
      <p
        className="text-sm sm:text-base max-w-lg leading-relaxed"
        style={{ color: "#94a3b8" }}
      >
        {t.home.subtitle}
      </p>
    </div>
  );
}
