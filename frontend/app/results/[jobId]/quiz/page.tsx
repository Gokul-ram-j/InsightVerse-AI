import Link from "next/link";

type Props = {
  params: Promise<{
    jobId: string;
  }>;
};

export default async function QuizDashboard({ params }: Props) {
  const { jobId } = await params;

  const res = await fetch(
    "http://127.0.0.1:8000/api/status/" + jobId,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Failed to load quiz data
      </div>
    );
  }

  const data = await res.json();

  const quizResult = data?.result?.quiz;
  const selectedTypes: string[] =
    data?.payload?.services?.quiz?.types ?? [];

  // 🔑 CASE 1: No quiz generated at all
  if (!quizResult) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        No quiz was generated for this job.
      </div>
    );
  }

  // 🔑 CASE 2: Quiz exists, but no types selected → fallback
  const quizCards =
    selectedTypes.length > 0
      ? selectedTypes.map((t) => ({
          label: t,
          type: t.toLowerCase().replace(/\s+/g, "_"),
        }))
      : [
          {
            label: "Quiz",
            type: "default",
          },
        ];

  return (
    <main className="min-h-screen bg-black text-white px-6 py-14">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-10">
        <h1 className="text-3xl font-bold mb-2">Quiz</h1>
        <p className="text-gray-400">
          {selectedTypes.length > 0
            ? "Choose a quiz type"
            : "Quiz generated from your document"}
        </p>

        <p className="text-xs text-gray-500 mt-2">
          Job ID: <span className="font-mono">{jobId}</span>
        </p>
      </div>

      {/* Quiz Cards */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizCards.map((quiz) => (
          <Link
            key={quiz.type}
            href={`/results/${jobId}/quiz/play?type=${quiz.type}`}
            className="group rounded-xl border border-zinc-800 bg-zinc-900 p-6 hover:border-yellow-400 hover:scale-[1.02] transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl">🎯</span>
              <span className="text-xs px-2 py-1 rounded bg-purple-600/20 text-purple-400">
                Ready
              </span>
            </div>

            <h2 className="text-lg font-semibold mb-1">
              {quiz.label}
            </h2>

            <p className="text-sm text-gray-400">
              Start the quiz generated from your document
            </p>

            <div className="mt-4 text-sm text-yellow-400 group-hover:underline">
              Start →
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
