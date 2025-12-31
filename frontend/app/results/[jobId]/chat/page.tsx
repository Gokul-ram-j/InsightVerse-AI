"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function InsightChatPage() {
  const { jobId } = useParams<{ jobId: string }>();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobId,
          question: userMessage.content, // ✅ FIX HERE
        }),
      });

      const data = await res.json();

      const aiMessage: Message = {
        role: "assistant",
        content: data.answer,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Something went wrong while answering. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-4xl mx-auto flex flex-col h-[85vh]">
        <div className="mb-4">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            💬 InsightChat
          </h1>
          <p className="text-sm text-gray-400">
            Answers are limited to your uploaded content
          </p>
        </div>

        <div className="flex-1 overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-900 p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-20">
              Ask a question related to your uploaded document.
            </div>
          )}

          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`max-w-[75%] px-4 py-3 rounded-lg text-sm whitespace-pre-wrap
                ${
                  msg.role === "user"
                    ? "ml-auto bg-yellow-400 text-black"
                    : "mr-auto bg-zinc-800 text-white"
                }`}
            >
              {msg.content}
            </div>
          ))}

          {loading && (
            <div className="mr-auto bg-zinc-800 text-gray-400 px-4 py-3 rounded-lg text-sm">
              InsightChat is thinking…
            </div>
          )}
        </div>

        <div className="mt-4 flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask a question about your uploaded content…"
            className="flex-1 rounded-lg bg-black border border-zinc-700 px-4 py-3 focus:outline-none focus:border-yellow-400"
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="rounded-lg bg-yellow-400 text-black px-6 py-3 font-medium disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </main>
  );
}
