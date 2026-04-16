// Server-side only — uses private API_URL (never sent to browser)
import "server-only";

const API_URL = process.env.API_URL ?? "http://localhost:1001";

export interface Broker {
  id: number;
  name: string;
  slug: string;
  description: string;
  logo_url: string;
  website: string;
  broker_type: "cfd" | "bond" | "stock" | "crypto";
  created_at: string;
}

export interface BrokerMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface BrokerListResult {
  data: Broker[];
  meta: BrokerMeta;
}

// ── GET /brokers ──────────────────────────────────────────────────────────────
export async function getBrokers(params: {
  page?: number;
  limit?: number;
  search?: string;
  broker_type?: string;
}): Promise<{ data: BrokerListResult }> {
  const query = new URLSearchParams();
  query.set("page", String(params.page ?? 1));
  query.set("limit", String(params.limit ?? 12));
  if (params.search) query.set("search", params.search);
  if (params.broker_type && params.broker_type !== "all")
    query.set("broker_type", params.broker_type);

  const res = await fetch(`${API_URL}/brokers?${query}`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch brokers");
  return res.json();
}

// ── GET /brokers/:slug ────────────────────────────────────────────────────────
export async function getBrokerBySlug(
  slug: string
): Promise<{ data: Broker }> {
  const res = await fetch(`${API_URL}/brokers/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Broker not found");
  return res.json();
}
