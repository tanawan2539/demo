import type { Metadata } from "next";
import { getBrokers } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BrokerTable from "@/components/BrokerTable";
import ManageHeader from "@/components/ManageHeader";

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
        <ManageHeader />

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
