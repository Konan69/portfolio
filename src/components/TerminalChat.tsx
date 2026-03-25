"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useRef, useState } from "react";

function getTextContent(message: { parts: Array<{ type: string; text?: string }> }): string {
  return message.parts
    .filter((part) => part.type === "text" && part.text)
    .map((part) => part.text)
    .join("");
}

export const TerminalChat = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [input, setInput] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);
  const prevMessagesLength = useRef(0);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  if (messages.length !== prevMessagesLength.current && chatRef.current) {
    chatRef.current.scrollTop = chatRef.current.scrollHeight;
    prevMessagesLength.current = messages.length;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && status !== "streaming") {
      sendMessage({ parts: [{ type: "text", text: input }] });
      setInput("");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "80px",
        right: "1rem",
        width: "min(90%, 384px)",
        height: "400px",
        background: "rgba(18, 18, 18, 0.95)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        borderRadius: "12px",
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
        fontFamily: "'JetBrains Mono', monospace",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "rgba(0,0,0,0.8)",
          padding: "12px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#F2C94C" }} />
          <span style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.05em" }}>
            KONAN_AI (RAG)
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          style={{
            fontSize: "0.65rem",
            color: "#6B7280",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          [ESC]
        </button>
      </div>

      {/* Messages */}
      <div
        ref={chatRef}
        style={{
          flexGrow: 1,
          padding: "16px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          fontSize: "0.75rem",
          background: "rgba(0,0,0,0.5)",
        }}
      >
        {messages.length === 0 && (
          <div style={{ display: "flex", gap: "12px" }}>
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: 4,
                background: "rgba(255,255,255,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "10px",
                flexShrink: 0,
              }}
            >
              AI
            </div>
            <div
              style={{
                background: "rgba(255,255,255,0.05)",
                padding: "12px",
                borderRadius: "8px",
                borderTopLeftRadius: 0,
                border: "1px solid rgba(255,255,255,0.05)",
                maxWidth: "85%",
                color: "#D1D5DB",
              }}
            >
              <p>
                System initialized. I have full context on Suleman&apos;s work history, skills, and
                availability. Ask me anything!
              </p>
              <div style={{ marginTop: "8px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {["What's his tech stack?", "Book a call"].map((q) => (
                  <button
                    type="button"
                    key={q}
                    onClick={() => setInput(q)}
                    style={{
                      fontSize: "0.65rem",
                      border: "1px solid rgba(255,255,255,0.2)",
                      padding: "4px 8px",
                      borderRadius: 4,
                      background: "transparent",
                      color: "#9CA3AF",
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: "flex",
              gap: "12px",
              flexDirection: msg.role === "user" ? "row-reverse" : "row",
            }}
          >
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: 4,
                background: msg.role === "user" ? "#F2C94C" : "rgba(255,255,255,0.1)",
                color: msg.role === "user" ? "#000" : "#FFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "10px",
                flexShrink: 0,
              }}
            >
              {msg.role === "user" ? "ME" : "AI"}
            </div>
            <div
              style={{
                padding: "12px",
                borderRadius: "8px",
                borderTopRightRadius: msg.role === "user" ? 0 : undefined,
                borderTopLeftRadius: msg.role === "assistant" ? 0 : undefined,
                border: `1px solid ${msg.role === "user" ? "rgba(242,201,76,0.3)" : "rgba(255,255,255,0.05)"}`,
                background: msg.role === "user" ? "rgba(242,201,76,0.1)" : "rgba(255,255,255,0.05)",
                color: msg.role === "user" ? "#F2C94C" : "#D1D5DB",
                maxWidth: "85%",
              }}
            >
              {getTextContent(msg)}
            </div>
          </div>
        ))}

        {status === "streaming" && (
          <div style={{ display: "flex", gap: "12px" }}>
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: 4,
                background: "rgba(255,255,255,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "10px",
                flexShrink: 0,
              }}
            >
              AI
            </div>
            <div
              style={{
                background: "rgba(255,255,255,0.05)",
                padding: "12px",
                borderRadius: "8px",
                borderTopLeftRadius: 0,
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <span style={{ animation: "t-blink 1s step-start infinite", color: "#F2C94C" }}>
                ▌
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div
        style={{
          padding: "12px",
          background: "rgba(0,0,0,0.8)",
          borderTop: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <form onSubmit={handleSubmit} style={{ position: "relative" }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about Suleman's work..."
            disabled={status === "streaming"}
            style={{
              width: "100%",
              background: "#111",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 4,
              padding: "8px 32px 8px 12px",
              fontSize: "0.75rem",
              color: "#FFF",
              fontFamily: "'JetBrains Mono', monospace",
              outline: "none",
            }}
          />
          <button
            type="submit"
            disabled={status === "streaming" || !input.trim()}
            style={{
              position: "absolute",
              right: 8,
              top: 6,
              background: "none",
              border: "none",
              color: status === "streaming" ? "#444" : "#6B7280",
              cursor: status === "streaming" ? "not-allowed" : "pointer",
              fontSize: "0.875rem",
              fontFamily: "inherit",
            }}
          >
            ↵
          </button>
        </form>
      </div>
    </div>
  );
};
