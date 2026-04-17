import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBrokerBySlug } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BrokerDetailContent from "@/components/BrokerDetailContent";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// ── helpers ───────────────────────────────────────────────────────────────────
function truncate(text: string, max = 160) {
  return text.length <= max ? text : text.slice(0, max - 1).trimEnd() + "…";
}

// ── SSR SEO metadata per broker ───────────────────────────────────────────────
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { data: broker } = await getBrokerBySlug(slug);
    const desc = truncate(broker.description);
    const canonical = `/brokers/${broker.slug}`;    

    return {
      title: broker.name,
      description: desc,
      keywords: [broker.name, broker.broker_type, "broker", "Woxa"],
      alternates: { canonical },
      openGraph: {
        type: "website",
        siteName: "Woxa",
        title: `${broker.name} | Woxa`,
        description: desc,
        url: canonical,
        images: broker.logo_url
          ? [{ url: broker.logo_url, alt: broker.name }]
          : [],
      },
      twitter: {
        card: "summary_large_image",
        title: `${broker.name} | Woxa`,
        description: desc,
        images: broker.logo_url ? [broker.logo_url] : [],
      },
    };
  } catch {
    return { title: "Broker Not Found" };
  }
}

export default async function BrokerDetailPage({ params }: PageProps) {
  const { slug } = await params;

  let broker;
  try {
    const res = await getBrokerBySlug(slug);
    broker = res.data;
  } catch {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:1001";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: broker.name,
    url: broker.website,
    logo: broker.logo_url,
    description: broker.description,
    sameAs: [broker.website],
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/brokers/${broker.slug}`,
    },
  };

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: "#0a1526" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar active="brokers" />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12">
        <BrokerDetailContent broker={broker} />
      </main>
      <Footer />
    </div>
  );
}
