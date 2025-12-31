import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    jobId: string;
  }>;
  searchParams: Promise<{
    type?: string;
  }>;
};

export default async function SummaryViewPage({
  params,
  searchParams,
}: Props) {
  // ✅ FIX: await both
  const { jobId } = await params;
  const { type } = await searchParams;

  if (!type) notFound();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/status/${jobId}`,
    { cache: "no-store" }
  );

  if (!res.ok) notFound();

  const data = await res.json();
  const summary = data?.result?.summary?.[type];

  if (!summary) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Summary not available.
      </div>
    );
  }

  const LABELS: Record<string, string> = {
    short: "Short Summary",
    medium: "Medium Summary",
    detailed: "Detailed Summary",
    key_takeaways: "Key Takeaways",
  };

  return (
    <main className="min-h-screen bg-black text-white px-6 py-12">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-yellow-400">
          {LABELS[type] ?? type}
        </h1>

        {Array.isArray(summary) ? (
          <ul className="list-disc list-inside space-y-2 text-gray-200">
            {summary.map((item: string, idx: number) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-200 whitespace-pre-line">
            {summary}
          </p>
        )}
      </div>
    </main>
  );
}
