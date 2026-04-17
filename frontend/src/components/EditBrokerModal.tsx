"use client";

import { useEffect, useState } from "react";
import { updateBroker, type Broker } from "@/lib/api.client";
import { useLang } from "@/context/LangContext";

const BROKER_TYPES = ["cfd", "bond", "stock", "crypto"] as const;

interface Props {
  broker: Broker;
  onClose: () => void;
  onSaved: (updated: Broker) => void;
}

export default function EditBrokerModal({ broker, onClose, onSaved }: Props) {
  const [form, setForm] = useState({
    name: broker.name,
    slug: broker.slug,
    broker_type: broker.broker_type,
    logo_url: broker.logo_url,
    website: broker.website,
    description: broker.description,
  });
  const { t } = useLang();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (field: string, value: string) => {
    if (error) setError("");
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // ปิดด้วย Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await updateBroker(broker.id, form);
      onSaved(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    backgroundColor: "#0a1526",
    border: "1px solid #1e3a56",
    color: "#e2e8f0",
    borderRadius: "6px",
    padding: "9px 12px",
    fontSize: "13px",
    width: "100%",
    outline: "none",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "10px",
    fontWeight: 600,
    letterSpacing: "0.1em",
    color: "#64748b",
    textTransform: "uppercase",
    marginBottom: "6px",
    display: "block",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-lg rounded-xl shadow-2xl overflow-hidden"
        style={{ backgroundColor: "#0f1e35", border: "1px solid #1e3a56" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: "#1e3a56" }}
        >
          <h2 className="text-base font-semibold text-white">{t.modal.title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
            style={{ color: "#64748b" }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {error && (
            <div
              className="flex items-start gap-3 mx-6 mt-4 px-4 py-3 rounded-lg text-sm"
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
          <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label style={labelStyle}>{t.modal.name}</label>
                <input type="text" required value={form.name}
                  onChange={(e) => set("name", e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>{t.modal.slug}</label>
                <input type="text" required value={form.slug}
                  onChange={(e) => set("slug", e.target.value)} style={inputStyle} />
              </div>
            </div>

            <div>
              <label style={labelStyle}>{t.modal.brokerType}</label>
              <div className="grid grid-cols-4 gap-2">
                {BROKER_TYPES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => set("broker_type", t)}
                    className="py-2 rounded text-xs font-medium transition-colors"
                    style={
                      form.broker_type === t
                        ? { backgroundColor: "#1e3f6e", border: "1px solid #3b72b8", color: "#fff" }
                        : { backgroundColor: "#0a1526", border: "1px solid #1e3a56", color: "#64748b" }
                    }
                  >
                    {t.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label style={labelStyle}>{t.modal.logoUrl}</label>
                <input type="url" required value={form.logo_url}
                  onChange={(e) => set("logo_url", e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>{t.modal.website}</label>
                <input type="url" required value={form.website}
                  onChange={(e) => set("website", e.target.value)} style={inputStyle} />
              </div>
            </div>

            <div>
              <label style={labelStyle}>{t.modal.description}</label>
              <textarea required rows={3} value={form.description}
                onChange={(e) => set("description", e.target.value)}
                style={{ ...inputStyle, resize: "vertical" }} />
            </div>
          </div>

          {/* Footer */}
          <div
            className="flex items-center justify-end gap-3 px-6 py-4 border-t"
            style={{ borderColor: "#1e3a56" }}
          >
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm transition-colors"
              style={{ color: "#94a3b8" }}
            >
              {t.modal.cancel}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-60"
              style={{ backgroundColor: "#1e3f6e", border: "1px solid #3b72b8", color: "#fff" }}
            >
              {loading ? t.modal.saving : t.modal.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
