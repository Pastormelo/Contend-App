"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export type ChatMessage = {
  id: string;
  author: string;
  body: string;
  mine: boolean;
};

export function GroupChat({
  groupId,
  lessonId = null,
  messages,
  placeholder = "Share what stood out…",
}: {
  groupId: string;
  lessonId?: string | null;
  messages: ChatMessage[];
  placeholder?: string;
}) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (body.trim().length === 0) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/groups/${groupId}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: body.trim(), lessonId }),
      });
      if (res.ok) {
        setBody("");
        router.refresh();
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {messages.length === 0 ? (
        <p className="text-sm text-muted-fg">
          No messages yet. Start the conversation.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {messages.map((m) => (
            <li
              key={m.id}
              className={
                "rounded-card border px-4 py-3 " +
                (m.mine
                  ? "border-accent/30 bg-accent/[0.05]"
                  : "border-line-soft bg-surface")
              }
            >
              <p className="text-xs font-semibold tracking-wide text-muted-fg">
                {m.mine ? "You" : m.author}
              </p>
              <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed">{m.body}</p>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={send} className="flex gap-2">
        <input
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={placeholder}
          maxLength={2000}
          className="h-10 flex-1 rounded-lg border border-line-strong bg-transparent px-3 text-sm outline-none focus:border-accent/50"
        />
        <Button type="submit" disabled={busy || body.trim().length === 0}>
          {busy ? "…" : "Post"}
        </Button>
      </form>
    </div>
  );
}
