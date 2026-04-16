import Image from "next/image";
import Link from "next/link";
import type { Broker } from "@/lib/api";

const TYPE_LABEL: Record<string, string> = {
  cfd: "TIER 1 LICENSED",
  bond: "FCA REGULATED",
  stock: "LOCAL REACH",
  crypto: "CRYPTO CERTIFIED",
};

const TYPE_BADGE: Record<string, string> = {
  cfd: "PREMIUM TIER",
  bond: "FIXED INCOME",
  stock: "EQUITY",
  crypto: "DIGITAL ASSET",
};

export default function BrokerCard({ broker }: { broker: Broker }) {
  const label = TYPE_LABEL[broker.broker_type] ?? broker.broker_type.toUpperCase();
  const badge = TYPE_BADGE[broker.broker_type] ?? "VERIFIED";

  return (
    <Link
      href={`/brokers/${broker.slug}`}
      className="group relative block rounded-lg overflow-hidden"
      style={{ border: "1px solid #1e3a56" }}
    >
      {/* Full image */}
      <div className="relative h-52 sm:h-64 w-full bg-slate-900">
        <Image
          src={broker.logo_url}
          alt={broker.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1526] via-[#0a1526]/40 to-transparent" />
      </div>

      {/* Badge top-right */}
      <div className="absolute top-3 right-3">
        <span
          className="text-[10px] font-semibold tracking-widest px-2 py-1 rounded"
          style={{
            backgroundColor: "rgba(15,30,53,0.85)",
            color: "#94c9f0",
            border: "1px solid #2e5a80",
          }}
        >
          {badge}
        </span>
      </div>

      {/* Text overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h3 className="text-white font-bold text-lg leading-snug mb-1">
          {broker.name}
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 mb-3">
          {broker.description}
        </p>

        {/* Footer row */}
        <div
          className="flex items-center justify-between pt-3"
          style={{ borderTop: "1px solid rgba(30,58,86,0.6)" }}
        >
          <div className="flex items-center gap-1.5">
            <svg
              className="w-3.5 h-3.5"
              style={{ color: "#64748b" }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <span
              className="text-[10px] font-semibold tracking-widest uppercase"
              style={{ color: "#64748b" }}
            >
              {label}
            </span>
          </div>

          <span
            className="flex items-center gap-1 text-sm font-medium transition-colors group-hover:text-blue-300"
            style={{ color: "#60a5fa" }}
          >
            View Details
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
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
