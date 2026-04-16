"use client";

import { useState } from "react";
import { deleteBroker, type Broker } from "@/lib/api.client";
import { confirmDelete, alertSuccess } from "@/lib/swal";
import EditBrokerModal from "./EditBrokerModal";

const PAGE_SIZE = 10;

const TYPE_COLOR: Record<string, string> = {
  cfd: "#3b82f6",
  bond: "#10b981",
  stock: "#f59e0b",
  crypto: "#8b5cf6",
};

export default function BrokerTable({ initialBrokers }: { initialBrokers: Broker[] }) {
  const [brokers, setBrokers] = useState<Broker[]>(initialBrokers);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [editTarget, setEditTarget] = useState<Broker | null>(null);

  // ── Filter ────────────────────────────────────────────────────────────────
  const filtered = brokers.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.slug.toLowerCase().includes(search.toLowerCase()) ||
      b.broker_type.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearch = (v: string) => {
    setSearch(v);
    setPage(1);
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async (broker: Broker) => {
    const confirmed = await confirmDelete(broker.name);
    if (!confirmed) return;
    try {
      await deleteBroker(broker.id);
      setBrokers((prev) => prev.filter((b) => b.id !== broker.id));
      alertSuccess("Deleted successfully");
      const q = search.toLowerCase();
      const newFiltered = brokers
        .filter((b) => b.id !== broker.id)
        .filter(
          (b) =>
            b.name.toLowerCase().includes(q) ||
            b.slug.toLowerCase().includes(q) ||
            b.broker_type.toLowerCase().includes(q)
        );
      const newTotal = Math.ceil(newFiltered.length / PAGE_SIZE);
      if (page > newTotal && newTotal > 0) setPage(newTotal);
    } catch (err) {
      console.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  // ── Edit saved ────────────────────────────────────────────────────────────
  const handleSaved = (updated: Broker) => {
    setBrokers((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
    setEditTarget(null);
    alertSuccess("Broker updated successfully");
  };

  const borderStyle = { borderColor: "#1e3a56" };

  return (
    <>
      {/* Search + count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <p className="text-sm" style={{ color: "#4a6a8a" }}>
          {filtered.length} broker{filtered.length !== 1 ? "s" : ""}
          {search && ` matching "${search}"`}
        </p>
        <div
          className="flex items-center gap-2 rounded-lg px-3 py-2 w-full sm:w-64"
          style={{ backgroundColor: "#0f1e35", border: "1px solid #1e3a56" }}
        >
          <svg className="w-4 h-4 flex-shrink-0" style={{ color: "#4a6a8a" }}
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search..."
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: "#e2e8f0" }}
          />
          {search && (
            <button onClick={() => handleSearch("")} style={{ color: "#4a6a8a" }}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #1e3a56" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr style={{ backgroundColor: "#0f1e35", borderBottom: "1px solid #1e3a56" }}>
                {["#", "Name", "Slug", "Type", "Website", "Created", "Actions"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left font-semibold tracking-wider"
                    style={{ color: "#4a6a8a", fontSize: "11px", textTransform: "uppercase" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12" style={{ color: "#4a6a8a" }}>
                    No records found
                  </td>
                </tr>
              ) : (
                paginated.map((broker, idx) => {
                  return (
                    <tr
                      key={broker.id}
                      style={{
                        backgroundColor: idx % 2 === 0 ? "#0a1526" : "#0c1830",
                        borderBottom: "1px solid #1a2e45",
                      }}
                    >
                      <td className="px-4 py-3" style={{ color: "#4a6a8a" }}>
                        {(page - 1) * PAGE_SIZE + idx + 1}
                      </td>
                      <td className="px-4 py-3 font-medium" style={{ color: "#e2e8f0" }}>
                        <div className="max-w-[160px] truncate" title={broker.name}>
                          {broker.name}
                        </div>
                      </td>
                      <td className="px-4 py-3" style={{ color: "#64748b" }}>
                        <div className="max-w-[140px] truncate font-mono text-xs" title={broker.slug}>
                          {broker.slug}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider"
                          style={{
                            backgroundColor: `${TYPE_COLOR[broker.broker_type]}18`,
                            color: TYPE_COLOR[broker.broker_type],
                            border: `1px solid ${TYPE_COLOR[broker.broker_type]}40`,
                          }}
                        >
                          {broker.broker_type}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <a
                          href={broker.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="max-w-[140px] truncate block text-xs hover:underline"
                          style={{ color: "#60a5fa" }}
                          title={broker.website}
                        >
                          {broker.website.replace(/^https?:\/\//, "")}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: "#4a6a8a" }}>
                        {new Date(broker.created_at).toLocaleDateString("en-GB")}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditTarget(broker)}
                            className="px-3 py-1.5 rounded text-xs font-medium transition-colors"
                            style={{ backgroundColor: "#1e3a56", color: "#94c9f0", border: "1px solid #2a4f72" }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(broker)}
                            className="px-3 py-1.5 rounded text-xs font-medium transition-colors"
                            style={{ backgroundColor: "rgba(239,68,68,0.08)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            className="flex items-center justify-between px-4 py-3 border-t"
            style={{ ...borderStyle, backgroundColor: "#0f1e35" }}
          >
            <p className="text-xs" style={{ color: "#4a6a8a" }}>
              Page {page} of {totalPages}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-8 h-8 flex items-center justify-center rounded text-sm transition-colors disabled:opacity-30"
                style={{ color: "#64748b", border: "1px solid #1e3a56" }}
              >
                ‹
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => Math.abs(p - page) <= 2)
                .map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className="w-8 h-8 flex items-center justify-center rounded text-xs font-medium transition-colors"
                    style={
                      p === page
                        ? { backgroundColor: "#1e3f6e", color: "#fff", border: "1px solid #3b72b8" }
                        : { color: "#64748b", border: "1px solid #1e3a56" }
                    }
                  >
                    {p}
                  </button>
                ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded text-sm transition-colors disabled:opacity-30"
                style={{ color: "#64748b", border: "1px solid #1e3a56" }}
              >
                ›
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editTarget && (
        <EditBrokerModal
          broker={editTarget}
          onClose={() => setEditTarget(null)}
          onSaved={handleSaved}
        />
      )}
    </>
  );
}
