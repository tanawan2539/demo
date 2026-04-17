"use client";

import { useLang } from "@/context/LangContext";

export default function Footer() {
  const { t } = useLang();
  return (
    <footer
      className="w-full border-t mt-auto py-5"
      style={{ borderColor: "#1e3a56", backgroundColor: "#0a1526" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap justify-center sm:justify-start items-center gap-4 sm:gap-6 text-xs text-slate-500 uppercase tracking-wider">
          <span className="text-white font-semibold">Woxa</span>
          <a href="#" className="hover:text-slate-300 transition-colors">{t.footer.privacy}</a>
          <a href="#" className="hover:text-slate-300 transition-colors">{t.footer.terms}</a>
          <a href="#" className="hover:text-slate-300 transition-colors">{t.footer.risk}</a>
          <a href="#" className="hover:text-slate-300 transition-colors">{t.footer.contact}</a>
        </div>
        <p className="text-xs text-slate-500 uppercase tracking-wider">{t.footer.rights}</p>
      </div>
    </footer>
  );
}
