import type { Metadata } from "next";
import Link from "next/link";
import { getBrokers } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BrokerTable from "@/components/BrokerTable";

export const metadata: Metadata = {
  title: "Manage Brokers",
  description: "Manage broker listings",
  robots: { index: false, follow: false },
};

export default async function ManagePage() {
  let brokers: Awaited<ReturnType<typeof getBrokers>>["data"]["data"] = [];
  let fetchError = "";

  try {
    // โหลดทั้งหมด (limit สูง) สำหรับ client-side table
    const result = await getBrokers({ page: 1, limit: 100 });
    brokers = result.data.data;
  } catch (err) {
    console.error("[ManagePage] getBrokers failed:", err);
    fetchError = err instanceof Error ? err.message : "Cannot connect to API";
  }

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: "#0a1526" }}>
      <Navbar active="manage" />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
              Manage Brokers
            </h1>
            <p className="text-sm mt-1" style={{ color: "#4a6a8a" }}>
              View, edit and delete broker listings
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
            Add Broker
          </Link>
        </div>

        {/* Error */}
        {fetchError && (
          <div
            className="mb-6 px-4 py-3 rounded-lg text-sm"
            style={{
              backgroundColor: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
              color: "#f87171",
            }}
          >
            ⚠ {fetchError}
          </div>
        )}

        {/* Table */}
        <BrokerTable initialBrokers={brokers} />
      </main>

      <Footer />
    </div>
  );
}
