import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  title: {
    default: "Woxa — Institutional Broker Network",
    template: "%s | Woxa",
  },
  description:
    "Access global liquidity through our curated network of elite financial institutions and market makers.",
  keywords: ["broker", "institutional", "CFD", "bonds", "stocks", "crypto"],
  openGraph: {
    type: "website",
    siteName: "Woxa",
    title: "Woxa — Institutional Broker Network",
    description:
      "Access global liquidity through our curated network of elite financial institutions and market makers.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Woxa — Institutional Broker Network",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={geist.variable}>
      <body suppressHydrationWarning className="min-h-screen flex flex-col" style={{ backgroundColor: "#0a1526" }}>
        {children}
      </body>
    </html>
  );
}
