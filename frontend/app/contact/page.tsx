export const metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-24">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6">Contact Us</h1>

        <p className="text-slate-400 mb-10">
          Have questions, feedback, or collaboration ideas?
          <br />
          We’d love to hear from you.
        </p>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 space-y-4">
          <p className="text-slate-300">
            📧 Email:{" "}
            <span className="text-white font-medium">
              gokulram2221@gmail.com
            </span>
          </p>

          <p className="text-slate-300">
            🌐 Website:{" "}
            <span className="text-white font-medium">
              https://gokul-ram-j.vercel.app/
            </span>
          </p>

          <p className="text-slate-300">
            📍 Built with ❤️ using AI
          </p>
        </div>
      </div>
    </main>
  );
}
