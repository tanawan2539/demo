// Client-side only — uses NEXT_PUBLIC_API_URL (exposed to browser)

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:1001";

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

export interface BrokerListResult {
  data: Broker[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ── GET /brokers ──────────────────────────────────────────────────────────────
export async function getBrokersClient(params: {
  page?: number;
  limit?: number;
  search?: string;
  broker_type?: string;
}): Promise<{ data: BrokerListResult }> {
  const query = new URLSearchParams();
  query.set("page", String(params.page ?? 1));
  query.set("limit", String(params.limit ?? 10));
  if (params.search) query.set("search", params.search);
  if (params.broker_type && params.broker_type !== "all")
    query.set("broker_type", params.broker_type);

  const res = await fetch(`${API_URL}/brokers?${query}`);
  if (!res.ok) throw new Error("Failed to fetch brokers");
  return res.json();
}

// ── POST /brokers/add ─────────────────────────────────────────────────────────
export async function addBroker(body: {
  name: string;
  slug: string;
  description: string;
  logo_url: string;
  website: string;
  broker_type: string;
}): Promise<{ data: Broker }> {
  const res = await fetch(`${API_URL}/brokers/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message ?? "Failed to submit broker");
  return json;
}

// ── PUT /brokers/:id ──────────────────────────────────────────────────────────
export async function updateBroker(
  id: number,
  body: Partial<Omit<Broker, "id" | "created_at">>
): Promise<{ data: Broker }> {
  const res = await fetch(`${API_URL}/brokers/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message ?? "Failed to update broker");
  return json;
}

// ── DELETE /brokers/:id ───────────────────────────────────────────────────────
export async function deleteBroker(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/brokers/${id}`, {
    method: "DELETE",
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message ?? "Failed to delete broker");
}
