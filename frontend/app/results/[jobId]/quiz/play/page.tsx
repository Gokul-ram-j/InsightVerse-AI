"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";

type Question = {
  question?: string;
  statement?: string;
  options?: string[];
  answer?: string | boolean;
};

export default function QuizPlayPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const searchParams = useSearchParams();
  const type = searchParams.get("type") ?? "default";

  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<any>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);

  // -------------------------
  // Fetch quiz questions
  // -------------------------
  useEffect(() => {
    async function loadQuiz() {
      setLoading(true);

      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/status/${jobId}`
        );
        const data = await res.json();

        const quiz = data?.result?.quiz;
        if (!quiz) {
          setQuestions([]);
          return;
        }

        let loaded: Question[] = [];

        // Specific quiz type
        if (type !== "default" && Array.isArray(quiz[type])) {
          loaded = quiz[type];
        } else {
          // Fallback: merge all quiz arrays
          Object.keys(quiz).forEach((k) => {
            if (Array.isArray(quiz[k])) {
              loaded.push(...quiz[k]);
            }
          });
        }

        setQuestions(loaded);
      } catch (err) {
        console.error("Failed to load quiz", err);
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    }

    loadQuiz();
  }, [jobId, type]);

  // -------------------------
  // Reset state when questions change
  // -------------------------
  useEffect(() => {
    if (questions.length > 0) {
      setCurrent(0);
      setSelected(null);
      setShowAnswer(false);
    }
  }, [questions]);

  // -------------------------
  // Loading & empty states
  // -------------------------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading quiz…
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        No questions available for this quiz.
      </div>
    );
  }

  const q = questions[current];

  if (!q) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Preparing question…
      </div>
    );
  }

  const progress = Math.round(((current + 1) / questions.length) * 100);

  // -------------------------
  // Render per quiz type
  // -------------------------
  const renderQuestionUI = () => {
    // MCQ
    if (type === "mcq" && q.options) {
      return (
        <div className="space-y-3">
          {q.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => setSelected(opt)}
              className={`w-full p-3 rounded border text-left transition
                ${
                  selected === opt
                    ? "border-yellow-400 bg-yellow-400/10"
                    : "border-zinc-700 hover:border-zinc-500"
                }`}
            >
              {opt}
            </button>
          ))}
        </div>
      );
    }

    // True / False
    if (type === "true_false") {
      return (
        <div className="flex gap-4">
          {[true, false].map((v) => (
            <button
              key={String(v)}
              onClick={() => setSelected(v)}
              className={`px-6 py-3 rounded border transition
                ${
                  selected === v
                    ? "border-green-400 bg-green-400/10"
                    : "border-zinc-700 hover:border-zinc-500"
                }`}
            >
              {String(v)}
            </button>
          ))}
        </div>
      );
    }

    // Short / Long Answer
    return (
      <textarea
        rows={5}
        placeholder="Type your answer…"
        value={selected ?? ""}
        onChange={(e) => setSelected(e.target.value)}
        className="w-full p-3 rounded bg-zinc-900 border border-zinc-700 focus:outline-none focus:border-yellow-400"
      />
    );
  };

  // -------------------------
  // Main UI
  // -------------------------
  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Progress */}
        <div className="flex justify-between text-sm text-gray-400">
          <span>
            Question {current + 1} / {questions.length}
          </span>
          <span>{progress}%</span>
        </div>

        <div className="h-2 bg-zinc-800 rounded">
          <div
            className="h-2 bg-yellow-400 rounded transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Question Card */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 space-y-4">
          <h2 className="text-lg font-semibold">
            {type === "true_false"
              ? q.statement
              : q.question}
          </h2>

          {renderQuestionUI()}

          {showAnswer && q.answer !== undefined && (
            <div className="text-green-400 text-sm">
              Correct answer: {String(q.answer)}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex justify-between">
          <button
            disabled={current === 0}
            onClick={() => {
              setCurrent((c) => c - 1);
              setSelected(null);
              setShowAnswer(false);
            }}
            className="px-4 py-2 rounded border border-zinc-700 disabled:opacity-40"
          >
            Prev
          </button>

          <div className="flex gap-3">
            <button
              onClick={() => setShowAnswer(true)}
              className="px-4 py-2 rounded border border-blue-400 text-blue-400"
            >
              Check
            </button>

            <button
              disabled={current === questions.length - 1}
              onClick={() => {
                setCurrent((c) => c + 1);
                setSelected(null);
                setShowAnswer(false);
              }}
              className="px-4 py-2 rounded bg-yellow-400 text-black disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
