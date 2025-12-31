import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-zinc-800 py-12 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-sm text-slate-400">

        {/* Brand */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-3">
            InsightVerse AI
          </h3>
          <p className="leading-relaxed">
            AI-powered platform to analyze content and generate summaries,
            quizzes, and key insights.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-medium mb-3">Quick Links</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/privacy" className="hover:text-white transition">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-white transition">
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white transition">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-white font-medium mb-3">Contact</h4>
          <ul className="space-y-2">
            <li>
              📧{" "}
              <a
                href="mailto:gokulram2221@gmail.com"
                className="hover:text-white transition"
              >
                gokulram2221@gmail.com
              </a>
            </li>
            <li>
              🌐{" "}
              <a
                href="https://gokul-ram-j.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition"
              >
                gokul-ram-j.vercel.app
              </a>
            </li>
            <li className="pt-2 text-slate-500">
              Built with ❤️ using AI
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-10 pt-6 border-t border-zinc-800 text-center text-slate-500 text-xs">
        © {new Date().getFullYear()} InsightVerse AI. All rights reserved.
      </div>
    </footer>
  );
}
