"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export type ChatMessage = { role: "user" | "opponent"; content: string };

export function ChatThread({
  simulationId,
  initialMessages,
}: {
  simulationId: string;
  initialMessages: ChatMessage[];
}) {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [ending, setEnding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  async function send() {
    const text = input.trim();
    if (!text || streaming) return;
    setInput("");
    setError(null);
    setStreaming(true);
    setMessages((m) => [...m, { role: "user", content: text }, { role: "opponent", content: "" }]);

    try {
      const res = await fetch(`/api/spar/${simulationId}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      if (!res.ok || !res.body) throw new Error();

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        const current = acc;
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = { role: "opponent", content: current };
          return copy;
        });
      }
    } catch {
      setError("Marcus lost his train of thought — send that again.");
      setMessages((m) => m.slice(0, -1));
    } finally {
      setStreaming(false);
    }
  }

  async function endConversation() {
    setEnding(true);
    setError(null);
    const res = await fetch(`/api/spar/${simulationId}/end`, { method: "POST" });
    if (!res.ok) {
      setError("The coach couldn't finish the review — try ending again.");
      setEnding(false);
      return;
    }
    router.push(`/spar/${simulationId}/review`);
  }

  const userTurns = messages.filter((m) => m.role === "user").length;

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex flex-1 flex-col gap-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={cn(
              "max-w-[85%] whitespace-pre-wrap rounded-card px-4 py-3 text-[0.9375rem] leading-relaxed",
              m.role === "user"
                ? "self-end bg-accent text-white"
                : "self-start border border-line-soft bg-surface",
            )}
          >
            {m.content || <span className="opacity-60">…</span>}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {error && <p className="text-sm text-accent">{error}</p>}

      <div className="sticky bottom-0 flex flex-col gap-2 border-t border-line-soft bg-background pb-4 pt-3">
        <div className="flex items-end gap-2">
          <Textarea
            rows={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder="Say it like you would in the driveway…"
            disabled={streaming || ending}
          />
          <Button onClick={send} disabled={streaming || ending || !input.trim()}>
            Send
          </Button>
        </div>
        {userTurns > 0 && (
          <Button
            variant="outline"
            onClick={endConversation}
            disabled={streaming || ending}
          >
            {ending ? "Coach is reviewing the tape…" : "End conversation → get coached"}
          </Button>
        )}
      </div>
    </div>
  );
}
