import Link from "next/link";

type Props = {
  params: Promise<{
    jobId: string;
  }>;
};

export default async function SummaryDashboard({ params }: Props) {
  const { jobId } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/status/${jobId}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Failed to load summary data
      </div>
    );
  }

  const data = await res.json();

  const summaryResult = data?.result?.summary;
  const selectedTypes: string[] =
    data?.payload?.services?.summary ?? [];

  if (!summaryResult || selectedTypes.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        No summary was generated for this job.
      </div>
    );
  }

  const SUMMARY_CONFIG: Record<string, any> = {
    short: {
      title: "Short Summary",
      icon: "📝",
    },
    medium: {
      title: "Medium Summary",
      icon: "📄",
    },
    detailed: {
      title: "Detailed Summary",
      icon: "📚",
    },
    key_takeaways: {
      title: "Key Takeaways",
      icon: "📌",
    },
  };

  return (
    <main className="min-h-screen bg-black text-white px-6 py-14">
      <div className="max-w-5xl mx-auto mb-10">
        <h1 className="text-3xl font-bold mb-2">Summary</h1>
        <p className="text-gray-400">
          Choose a summary type to view
        </p>

        <p className="text-xs text-gray-500 mt-2">
          Job ID: <span className="font-mono">{jobId}</span>
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {selectedTypes.map((type) => {
          const config = SUMMARY_CONFIG[type];
          if (!config) return null;

          return (
            <Link
              key={type}
              href={`/results/${jobId}/summary/view?type=${type}`}
              className="group rounded-xl border border-zinc-800 bg-zinc-900 p-6 hover:border-yellow-400 hover:scale-[1.02] transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">{config.icon}</span>
                <span className="text-xs px-2 py-1 rounded bg-green-600/20 text-green-400">
                  Ready
                </span>
              </div>

              <h2 className="text-lg font-semibold mb-1">
                {config.title}
              </h2>

              <p className="text-sm text-gray-400">
                View AI-generated {config.title.toLowerCase()}
              </p>

              <div className="mt-4 text-sm text-yellow-400 group-hover:underline">
                Open →
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
