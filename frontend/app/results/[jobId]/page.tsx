import Link from "next/link";

type Props = {
  params: Promise<{
    jobId: string;
  }>;
};

export default async function ResultDashboard({ params }: Props) {
  // ✅ unwrap params
  const { jobId } = await params;

  const res = await fetch(
    `http://localhost:8000/api/status/${jobId}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Failed to load result
      </div>
    );
  }

  const data = await res.json();
  const result = data.result ?? {};

  // ✅ ONLY generated services
  const SERVICE_UI: Record<string, any> = {
    summary: {
      title: "Summary",
      icon: "📝",
      path: "summary",
    },
    quiz: {
      title: "Quiz",
      icon: "🎯",
      path: "quiz",
    },
  };

  const services = Object.keys(result);

  return (
    <main className="min-h-screen bg-black text-white px-6 py-14">
      <div className="max-w-5xl mx-auto mb-10">
        <h1 className="text-3xl font-bold">Generated Results</h1>
        <p className="text-gray-400 text-sm mt-1">
          Job ID: <span className="font-mono">{jobId}</span>
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 🔹 Generated services */}
        {services.map((key) => {
          const ui = SERVICE_UI[key];
          if (!ui) return null;

          return (
            <Link
              key={key}
              href={`/results/${jobId}/${ui.path}`}
              className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 hover:border-yellow-400 transition"
            >
              <div className="text-3xl mb-3">{ui.icon}</div>
              <h2 className="text-lg font-semibold">{ui.title}</h2>
            </Link>
          );
        })}

        {/* 💬 InsightChat — DEFAULT & ALWAYS AVAILABLE */}
        <Link
          href={`/results/${jobId}/chat`}
          className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 hover:border-yellow-400 transition"
        >
          <div className="text-3xl mb-3">💬</div>
          <h2 className="text-lg font-semibold">InsightChat</h2>
          <p className="text-sm text-gray-400 mt-1">
            Ask questions based on your uploaded content
          </p>
        </Link>
      </div>
    </main>
  );
}
