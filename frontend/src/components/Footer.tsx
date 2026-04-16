export default function Footer() {
  return (
    <footer
      className="w-full border-t mt-auto py-5"
      style={{ borderColor: "#1e3a56", backgroundColor: "#0a1526" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap justify-center sm:justify-start items-center gap-4 sm:gap-6 text-xs text-slate-500 uppercase tracking-wider">
          <span className="text-white font-semibold">Woxa</span>
          <a href="#" className="hover:text-slate-300 transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-slate-300 transition-colors">
            Terms of Service
          </a>
          <a href="#" className="hover:text-slate-300 transition-colors">
            Risk Disclosure
          </a>
          <a href="#" className="hover:text-slate-300 transition-colors">
            Contact
          </a>
        </div>
        <p className="text-xs text-slate-500 uppercase tracking-wider">
          © 2024 Woxa. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
