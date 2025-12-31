export const metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>

        <p className="text-slate-400 mb-6">
          At InsightVerse AI, we respect your privacy and are committed to
          protecting your personal data. This policy explains how we collect,
          use, and safeguard your information.
        </p>

        <section className="space-y-4 text-slate-400">
          <p>
            <strong className="text-white">Data Collection:</strong> We collect
            only the data required to provide our services, such as uploaded
            content and account-related information.
          </p>

          <p>
            <strong className="text-white">Data Usage:</strong> Your data is used
            solely to generate summaries, quizzes, and insights. We do not sell
            or share your data with third parties.
          </p>

          <p>
            <strong className="text-white">Data Handling:</strong>  InsightVerse AI does not retain user content in its database. Uploaded data is used only for real-time processing and is automatically discarded after the requested output is generated.
          </p>
        </section>
      </div>
    </main>
  );
}
