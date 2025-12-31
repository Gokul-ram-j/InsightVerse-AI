"use client";

import { useState } from "react";

export default function InsightChat({ jobId }: { jobId: string }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    const res = await fetch("http://127.0.0.1:8000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId, message: input }),
    });

    const data = await res.json();

    setMessages((m) => [
      ...m,
      { role: "assistant", text: data.answer },
    ]);

    setLoading(false);
  }

  return (
    <div className="space-y-4">
      <div className="h-80 overflow-y-auto border border-zinc-800 rounded p-4 space-y-3 bg-zinc-900">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-3 rounded max-w-[80%]
              ${
                m.role === "user"
                  ? "ml-auto bg-yellow-400 text-black"
                  : "mr-auto bg-zinc-800 text-white"
              }`}
          >
            {m.text}
          </div>
        ))}
        {loading && (
          <div className="text-sm text-gray-400">
            InsightChat is thinking…
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your uploaded content…"
          className="flex-1 p-2 rounded bg-black border border-zinc-700"
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-yellow-400 text-black rounded"
        >
          Send
        </button>
      </div>

      <p className="text-xs text-gray-400">
        🔒 Answers are limited to your uploaded content
      </p>
    </div>
  );
}
