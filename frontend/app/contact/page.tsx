export const metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-24">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6">Contact Us</h1>

        <p className="text-slate-400 mb-12">
          Have questions, feedback, or collaboration ideas?
          <br />
          We’d love to hear from you.
        </p>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-10 space-y-6 text-left">
          {/* Email */}
          <div className="flex items-center gap-4">
            <span className="text-xl">📧</span>
            <div>
              <p className="text-slate-400 text-sm">Email</p>
              <a
                href="mailto:gokulram2221@gmail.com"
                className="text-white font-medium hover:underline"
              >
                gokulram2221@gmail.com
              </a>
            </div>
          </div>

          {/* Website */}
          <div className="flex items-center gap-4">
            <span className="text-xl">🌐</span>
            <div>
              <p className="text-slate-400 text-sm">Website</p>
              <a
                href="https://gokul-ram-j.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white font-medium hover:underline"
              >
                gokul-ram-j.vercel.app
              </a>
            </div>
          </div>

          {/* LinkedIn */}
          <div className="flex items-center gap-4">
            <span className="text-xl">💼</span>
            <div>
              <p className="text-slate-400 text-sm">LinkedIn</p>
              <a
                href="https://www.linkedin.com/in/gokul-ram-j/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white font-medium hover:underline"
              >
                linkedin.com/in/gokul-ram-j
              </a>
            </div>
          </div>

          {/* GitHub */}
          <div className="flex items-center gap-4">
            <span className="text-xl">🐙</span>
            <div>
              <p className="text-slate-400 text-sm">GitHub</p>
              <a
                href="https://github.com/Gokul-ram-j"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white font-medium hover:underline"
              >
                github.com/Gokul-ram-j
              </a>
            </div>
          </div>

          {/* Footer note */}
          <div className="pt-6 border-t border-zinc-800 text-slate-500 text-sm text-center">
            📍 Built with ❤️ using AI
          </div>
        </div>
      </div>
    </main>
  );
}
