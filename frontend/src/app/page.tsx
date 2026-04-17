import type { Metadata } from "next";
import { Suspense } from "react";
import { getBrokers } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BrokerFilterBar from "@/components/BrokerFilterBar";
import InfiniteScrollBrokers from "@/components/InfiniteScrollBrokers";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: {
    url: "/",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

interface PageProps {
  searchParams: Promise<{
    broker_type?: string;
    search?: string;
  }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams;

  // SSR — โหลดหน้าแรก 10 รายการ
  let initialBrokers: Awaited<ReturnType<typeof getBrokers>>["data"]["data"] = [];
  let initialTotal = 0;
  let fetchError = "";

  try {
    const result = await getBrokers({
      page: 1,
      limit: 10,
      search: params.search,
      broker_type: params.broker_type,
    });
    initialBrokers = result.data.data;
    initialTotal = result.data.meta.total;
  } catch (err) {
    console.error("[getBrokers] failed:", err);
    fetchError = err instanceof Error ? err.message : "Cannot connect to API";
  }

  // key บังคับ remount InfiniteScrollBrokers เมื่อ filter หรือ search เปลี่ยน
  const scrollKey = `${params.broker_type ?? "all"}-${params.search ?? ""}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Woxa",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    description:
      "Access global liquidity through our curated network of elite financial institutions and market makers.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: "#0a1526" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar active="Brokers" />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12">
        {/* Hero */}
        <div className="mb-8 sm:mb-10">
          <h1
            className="text-2xl sm:text-4xl font-bold mb-2 sm:mb-3 leading-tight"
            style={{ color: "#ffffff" }}
          >
            Institutional Brokers
          </h1>
          <p className="text-sm sm:text-base max-w-lg leading-relaxed" style={{ color: "#94a3b8" }}>
            Access global liquidity through our curated network of elite
            financial institutions and market makers.
          </p>
        </div>

        {/* Filter bar */}
        <div className="mb-6 sm:mb-8">
          <Suspense fallback={<div style={{ height: "88px" }} />}>
            <BrokerFilterBar
              activeType={params.broker_type}
              activeSearch={params.search}
            />
          </Suspense>
        </div>

        {/* API error banner */}
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

        {/* Infinite scroll grid */}
        <InfiniteScrollBrokers
          key={scrollKey}
          initialBrokers={initialBrokers}
          initialTotal={initialTotal}
          brokerType={params.broker_type}
          search={params.search}
        />
      </main>

      <Footer />
    </div>
  );
}
