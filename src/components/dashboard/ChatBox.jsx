// ChatBox component.
import React, { useEffect, useState } from "react";

function ChatBox() {
  const [draft, setDraft] = useState("");
  const [dotCount, setDotCount] = useState(1);

  const [messages, setMessages] = useState([
    {
      id: 1,
      from: "user",
      text: "Hello, how are you doing?",
      time: "08:15 AM",
    },
    {
      id: 2,
      from: "assistant",
      text: "I'm doing well, thank you! How can I help you today?",
      time: "08:16 AM",
    },
    {
      id: 3,
      from: "user",
      text: "I have a question about the return policy for a product I purchased.",
      time: "Just Now",
    },
  ]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed) return;
    const timestamp = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        from: "user",
        text: trimmed,
        time: timestamp,
      },
    ]);
    setDraft("");
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDotCount((prev) => (prev % 3) + 1);
    }, 500);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="w-full max-w-[420px] overflow-hidden rounded-[28px] bg-white shadow-2xl">
      <div className="relative px-6 pt-7 pb-6 bg-gradient-to-br from-[#2b1a07] via-[#6a4315] to-[#d19a3b] text-white">
        <button
          type="button"
          aria-label="Close"
          className="absolute right-4 top-4 w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M18 6L6 18M6 6l12 12"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-[#f4b400] flex items-center justify-center shrink-0">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M7 10h.01M17 10h.01"
                stroke="#3b2406"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M8 14c1.2 1 2.6 1.5 4 1.5s2.8-.5 4-1.5"
                stroke="#3b2406"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a6 6 0 0 1-6 6H10a6 6 0 0 1-6-6V6z"
                stroke="#3b2406"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-semibold">Hi! I'm Auction Scout AI.</h2>
            <p className="text-sm text-white/80">
              I can help you find property auctions, explain filters, and guide
              you through the platform.
            </p>
          </div>
        </div>
      </div>

      <div className="h-[360px] overflow-y-auto bg-white px-5 py-4 space-y-4 sm:h-[520px]">
        {messages.map((message) => (
          <div
            key={message.id}
            className={
              message.from === "user" ? "flex flex-col items-end" : "flex gap-3"
            }
          >
            {message.from === "assistant" && (
              <div className="w-9 h-9 rounded-full bg-[#f4b400] flex items-center justify-center shrink-0 mt-1">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M7 10h.01M17 10h.01"
                    stroke="#3b2406"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M8 14c1.2 1 2.6 1.5 4 1.5s2.8-.5 4-1.5"
                    stroke="#3b2406"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            )}
            <div
              className={
                message.from === "user" ? "max-w-[80%]" : "max-w-[70%]"
              }
            >
              <div
                className={
                  message.from === "user"
                    ? "bg-[#f4b400] text-[#5c3a0b] rounded-[18px] rounded-tr-[6px] px-4 py-3 text-sm"
                    : "bg-[#f3f6fb] text-[#5e6b7e] rounded-[18px] rounded-tl-[6px] px-4 py-3 text-sm"
                }
              >
                {message.text}
              </div>
              <p
                className={
                  message.from === "user"
                    ? "text-xs text-zinc-400 mt-1 text-right"
                    : "text-xs text-zinc-400 mt-1"
                }
              >
                {message.time}
              </p>
            </div>
          </div>
        ))}

        <div className="flex gap-3 items-end">
          <div className="w-9 h-9 rounded-full bg-[#f4b400] flex items-center justify-center shrink-0">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M7 10h.01M17 10h.01"
                stroke="#3b2406"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M8 14c1.2 1 2.6 1.5 4 1.5s2.8-.5 4-1.5"
                stroke="#3b2406"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="bg-[#f4c64d] rounded-[18px] rounded-tl-[6px] px-4 py-3">
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((dot) => (
                <span
                  key={dot}
                  className="w-2 h-2 rounded-full bg-[#5c3a0b]"
                  style={{
                    opacity: dot <= dotCount ? 1 : 0.3,
                    transition: "opacity 150ms",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <form
        className="px-4 py-3 border-t border-zinc-100 flex items-center gap-3"
        onSubmit={handleSubmit}
      >
        <button
          type="button"
          aria-label="Emoji picker"
          className="w-10 h-10 rounded-full border border-zinc-200 flex items-center justify-center text-amber-500"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M8.5 10.5h.01M15.5 10.5h.01"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M8 14.5c1.2 1 2.6 1.5 4 1.5s2.8-.5 4-1.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle
              cx="12"
              cy="12"
              r="9"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </button>
        <input
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Reply ..."
          className="flex-1 text-sm text-zinc-600 placeholder:text-zinc-400 focus:outline-none"
        />
        <button
          type="submit"
          aria-label="Send message"
          className="w-10 h-10 rounded-full bg-[#f4b400] flex items-center justify-center text-white"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M5 12h12"
              stroke="#5c3a0b"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M13 6l6 6-6 6"
              stroke="#5c3a0b"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </form>
    </div>
  );
}

export default ChatBox;
