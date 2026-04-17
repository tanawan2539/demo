import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SubmitBrokerForm from "@/components/SubmitBrokerForm";

export const metadata: Metadata = {
  title: "Submit Broker",
  description:
    "Register a new institutional entity within the Woxa ecosystem. Please ensure all data points align with regulatory documentation.",
  alternates: { canonical: "/brokers/add" },
  openGraph: {
    title: "Submit Broker | Woxa",
    description:
      "Register a new institutional entity within the Woxa ecosystem.",
    url: "/brokers/add",
  },
  robots: { index: false, follow: false },
};

export default function AddBrokerPage() {
  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: "#0a1526" }}>
      <Navbar active="Submit Broker" />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1
            className="text-2xl sm:text-3xl font-bold mb-2 leading-tight"
            style={{ color: "#ffffff", fontFamily: "Georgia, serif" }}
          >
            Submit Broker
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: "#94a3b8" }}>
            Register a new institutional entity within the Woxa ecosystem.
            <br />
            Please ensure all data points align with regulatory documentation.
          </p>
        </div>

        {/* Form */}
        <SubmitBrokerForm />
      </main>

      <Footer />
    </div>
  );
}
