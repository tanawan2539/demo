"use client";

import { useEffect, useRef, useState } from "react";
import { getBrokersClient, type Broker } from "@/lib/api.client";
import BrokerCard from "./BrokerCard";

const LIMIT = 10;

interface Props {
  initialBrokers: Broker[];
  initialTotal: number;
  brokerType?: string;
  search?: string;
}

export default function InfiniteScrollBrokers({
  initialBrokers,
  initialTotal,
  brokerType,
  search,
}: Props) {
  const [brokers, setBrokers] = useState<Broker[]>(initialBrokers);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const hasMore = brokers.length < total;

  const loadMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const nextPage = page + 1;
      const res = await getBrokersClient({
        page: nextPage,
        limit: LIMIT,
        search,
        broker_type: brokerType,
      });
      setBrokers((prev) => [...prev, ...res.data.data]);
      setTotal(res.data.meta.total);
      setPage(nextPage);
    } catch (err) {
      console.error("[InfiniteScroll] loadMore failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // Intersection Observer — trigger loadMore เมื่อ sentinel เข้า viewport
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { threshold: 0.1 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, loading, hasMore, brokerType, search]);

  if (brokers.length === 0) {
    return (
      <div className="text-center py-24">
        <p className="text-lg font-medium" style={{ color: "#64748b" }}>
          No brokers found
        </p>
        <p className="text-sm mt-2" style={{ color: "#475569" }}>
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {brokers.map((broker) => (
          <BrokerCard key={broker.id} broker={broker} />
        ))}
      </div>

      {/* Sentinel element */}
      <div ref={sentinelRef} className="mt-8 flex justify-center items-center h-12">
        {loading && (
          <div className="flex items-center gap-3" style={{ color: "#4a6a8a" }}>
            <div
              className="w-5 h-5 rounded-full border-2 animate-spin"
              style={{ borderColor: "#1e3a56", borderTopColor: "#60a5fa" }}
            />
            <span className="text-sm">Loading more...</span>
          </div>
        )}
        {!hasMore && brokers.length > 0 && (
          <p className="text-xs tracking-widest uppercase" style={{ color: "#2a4060" }}>
            — End of results —
          </p>
        )}
      </div>
    </>
  );
}
