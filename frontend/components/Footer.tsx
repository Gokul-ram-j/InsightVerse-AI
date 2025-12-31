import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-zinc-800 py-8 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row
        items-center justify-between gap-4 text-slate-500 text-sm">

        <p>© {new Date().getFullYear()} InsightVerse AI. All rights reserved.</p>

        <div className="flex gap-6">
          <Link href="/privacy" className="hover:text-white">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-white">
            Terms
          </Link>
          <Link href="/contact" className="hover:text-white">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
