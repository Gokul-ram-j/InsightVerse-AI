const services = [
  {
    title: "Content Analysis",
    description:
      "Upload PDFs, videos, documents, or links and let AI understand and process the content deeply.",
  },
  {
    title: "AI Summaries",
    description:
      "Generate short, medium, or detailed summaries instantly with high accuracy.",
  },
  {
    title: "Smart Quizzes",
    description:
      "Create AI-powered quizzes with difficulty levels to test understanding effectively.",
  },
  {
    title: "Key Notes",
    description:
      "Extract important points and structured notes for faster learning and revision.",
  },
];

export default function Services() {
  return (
    <section className="bg-black py-20 px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
        What InsightVerse AI Does
      </h2>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service, idx) => (
          <div
            key={idx}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6
              hover:border-orange-500 transition-colors duration-300"
          >
            <h3 className="text-xl font-semibold text-white mb-3">
              {service.title}
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              {service.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
