"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { addBroker } from "@/lib/api.client";
import { alertSuccess } from "@/lib/swal";
import { useLang } from "@/context/LangContext";

const BROKER_TYPES = [
  { value: "cfd", label: "CFD" },
  { value: "bond", label: "Bond" },
  { value: "stock", label: "Stock" },
  { value: "crypto", label: "Crypto" },
];

export default function SubmitBrokerForm() {
  const router = useRouter();
  const { t } = useLang();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    slug: "",
    broker_type: "cfd",
    logo_url: "",
    website: "",
    description: "",
  });

  const set = (field: string, value: string) => {
    if (error) setError("");
    setForm((prev) => ({ ...prev, [field]: value }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await addBroker(form);
      await alertSuccess("submitted");
      router.push("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    backgroundColor: "#162032",
    border: "1px solid #1e3a56",
    color: "#e2e8f0",
    borderRadius: "6px",
    padding: "10px 14px",
    fontSize: "14px",
    width: "100%",
    outline: "none",
  };

  const labelStyle = {
    fontSize: "11px",
    fontWeight: "600" as const,
    letterSpacing: "0.1em",
    color: "#94a3b8",
    textTransform: "uppercase" as const,
    marginBottom: "8px",
    display: "block",
  };

  return (
    <>
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1
          className="text-2xl sm:text-3xl font-bold mb-2 leading-tight"
          style={{ color: "#ffffff", fontFamily: "Georgia, serif" }}
        >
          {t.submitPage.title}
        </h1>
        <p className="text-sm leading-relaxed" style={{ color: "#94a3b8" }}>
          {t.submitPage.subtitle}
          <br />
          {t.submitPage.subtitleSub}
        </p>
      </div>

    <form onSubmit={handleSubmit}>
      {error && (
        <div
          className="flex items-start gap-3 px-4 py-3 rounded-lg mb-4 text-sm"
          style={{
            backgroundColor: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.3)",
            color: "#f87171",
          }}
        >
          <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          {error}
        </div>
      )}

      <div
        className="rounded-xl p-6 sm:p-8 space-y-6"
        style={{
          backgroundColor: "#0f1e35",
          border: "1px solid #1e3a56",
        }}
      >
        {/* Row 1: Name + Slug */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label style={labelStyle}>{t.form.brokerName}</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Sterling Capital Markets"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>{t.form.slug}</label>
            <input
              type="text"
              required
              value={form.slug}
              onChange={(e) => set("slug", e.target.value)}
              placeholder="sterling-capital-markets"
              style={inputStyle}
            />
          </div>
        </div>

        {/* Row 2: Broker Type */}
        <div>
          <label style={labelStyle}>{t.form.brokerType}</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            {BROKER_TYPES.map((t) => {
              const isActive = form.broker_type === t.value;
              return (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => set("broker_type", t.value)}
                  className="w-full py-3 rounded-md text-sm font-medium transition-colors"
                  style={
                    isActive
                      ? {
                          backgroundColor: "#1e3f6e",
                          border: "1px solid #3b72b8",
                          color: "#ffffff",
                        }
                      : {
                          backgroundColor: "#162032",
                          border: "1px solid #1e3a56",
                          color: "#64748b",
                        }
                  }
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 3: Logo URL + Website */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label style={labelStyle}>{t.form.logoUrl}</label>
            <div className="relative">
              <span
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: "#4a6a8a" }}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </span>
              <input
                type="url"
                required
                value={form.logo_url}
                onChange={(e) => set("logo_url", e.target.value)}
                placeholder="https://assets.sterling.com/logo.png"
                style={{ ...inputStyle, paddingLeft: "36px" }}
              />
            </div>
          </div>
          <div>
            <label style={labelStyle}>{t.form.website}</label>
            <div className="relative">
              <span
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: "#4a6a8a" }}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9"
                  />
                </svg>
              </span>
              <input
                type="url"
                required
                value={form.website}
                onChange={(e) => set("website", e.target.value)}
                placeholder="https://sterlingmidnight.com"
                style={{ ...inputStyle, paddingLeft: "36px" }}
              />
            </div>
          </div>
        </div>

        {/* Row 4: Description */}
        <div>
          <label style={labelStyle}>{t.form.description}</label>
          <textarea
            required
            rows={5}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Provide a comprehensive institutional overview..."
            style={{ ...inputStyle, resize: "vertical" }}
          />
        </div>

      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-end gap-4 mt-6">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="text-sm font-medium transition-colors"
          style={{ color: "#94a3b8" }}
        >
          {t.form.discard}
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-60"
          style={{
            backgroundColor: "#1e3f6e",
            border: "1px solid #3b72b8",
            color: "#ffffff",
          }}
        >
          {loading ? t.form.submitting : t.form.submit}
        </button>
      </div>
    </form>
    </>
  );
}
