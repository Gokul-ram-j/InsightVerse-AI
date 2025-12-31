export const metadata = {
  title: "Terms & Conditions",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Terms & Conditions</h1>

        <p className="text-slate-400 mb-6">
          By accessing or using InsightVerse AI, you agree to the following
          terms and conditions. Please read them carefully.
        </p>

        <section className="space-y-4 text-slate-400">
          <p>
            <strong className="text-white">Usage:</strong> You may use the
            platform only for lawful purposes and in accordance with these
            terms.
          </p>

          <p>
            <strong className="text-white">Content:</strong> You retain ownership
            of your uploaded content. InsightVerse AI is not responsible for
            user-generated data.
          </p>

          <p>
            <strong className="text-white">Service Availability:</strong> We may
            update or discontinue features at any time without notice.
          </p>
        </section>
      </div>
    </main>
  );
}
