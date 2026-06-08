"use client";

import { useChat } from "@ai-sdk/react";
import { useRef, useEffect, useState } from "react";

export function ChatInterface() {
  const { messages, sendMessage, status } = useChat();

  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const isLoading = status === "streaming" || status === "submitted";

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const text = input;
    setInput("");
    await sendMessage({ text });
  }

  return (
    <div className="flex flex-col h-full">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 mt-20">
            <p className="text-lg font-semibold mb-2">What do you want to work on?</p>
            <p className="text-sm">Ask me anything — research, planning, tasks, training, fishing.</p>
            <div className="mt-6 space-y-2 text-sm text-left max-w-md mx-auto">
              <SuggestedPrompt text="Help me plan my rehab for this week" />
              <SuggestedPrompt text="What should I know about ASU's outfield depth chart?" />
              <SuggestedPrompt text="Create a task to review film before Thursday's game" />
            </div>
          </div>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                m.role === "user"
                  ? "bg-maroon text-white"
                  : "bg-gray-100 text-dark"
              }`}
            >
              {m.parts?.map((part, i) => {
                if (part.type === "text") return <span key={i}>{part.text}</span>;
                if (part.type.startsWith("tool-")) {
                  const toolPart = part as { type: string; state: string; toolCallId: string };
                  const toolName = toolPart.type.replace("tool-", "");
                  return (
                    <span key={i} className="block text-xs text-gold-dark font-medium mt-1">
                      {toolPart.state === "result"
                        ? `Done: ${toolName}`
                        : `Working: ${toolName}...`}
                    </span>
                  );
                }
                return null;
              })}
            </div>
          </div>
        ))}
        {isLoading && messages.length > 0 && messages[messages.length - 1]?.role === "user" && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl px-4 py-3 text-sm text-gray-400">
              Thinking...
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="border-t border-gray-100 p-4 flex gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask your AI coach anything..."
          className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-maroon/40 focus:ring-2 focus:ring-maroon/10 transition-all"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-maroon text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-maroon-light disabled:opacity-40 transition-all"
        >
          Send
        </button>
      </form>
    </div>
  );
}

function SuggestedPrompt({ text }: { text: string }) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-500 cursor-default">
      {text}
    </div>
  );
}
