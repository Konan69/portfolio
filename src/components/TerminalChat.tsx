"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "ai";
  content: string;
}

const CANNED_RESPONSES: Record<string, string> = {
  "what is his tech stack?":
    "Primary stack: <strong>TypeScript, React/Next.js, Node.js, Python</strong>. AI: LangChain, RAG pipelines, vector DBs. Infra: AWS, Docker, Kubernetes. Web3: Solidity, Rust (Anchor). Full details on the DATA page.",
  "book a call":
    'You can schedule directly at <a href="https://cal.com/konandev" target="_blank" style="color:#F2C94C;text-decoration:underline">cal.com/konandev</a>. Typical response time: &lt;24h.',
  default:
    "I can help with questions about Suleman's experience, tech stack, availability, or past projects. Try asking something specific.",
};

function getResponse(input: string): string {
  const lower = input.toLowerCase().trim();
  for (const [key, val] of Object.entries(CANNED_RESPONSES)) {
    if (key !== "default" && lower.includes(key)) return val;
  }
  if (lower.includes("stack") || lower.includes("tech")) return CANNED_RESPONSES["what is his tech stack?"];
  if (lower.includes("call") || lower.includes("schedule") || lower.includes("book")) return CANNED_RESPONSES["book a call"];
  if (lower.includes("available") || lower.includes("hire"))
    return "Currently open to new engagements. Best way to connect: <a href='https://cal.com/konandev' target='_blank' style='color:#F2C94C;text-decoration:underline'>book a call</a>.";
  if (lower.includes("experience") || lower.includes("years"))
    return "8+ years across AI, fintech, Web3, and SaaS. Currently Senior Product Engineer & AI Architect at Clive AI (Juno HR).";
  return CANNED_RESPONSES["default"];
}

export const TerminalChat = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSubmit = (text: string) => {
    if (!text.trim()) return;
    const userMsg = text.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [...prev, { role: "ai", content: getResponse(userMsg) }]);
    }, 800 + Math.random() * 600);
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
            KONAN_AI_AGENT
          </span>
        </div>
        <button
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
        {/* Initial message */}
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
              availability. How can I assist?
            </p>
            <div style={{ marginTop: "8px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {["Tech Stack?", "Book Call"].map((q) => (
                <button
                  key={q}
                  onClick={() => handleSubmit(q)}
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

        {/* Chat history */}
        {messages.map((msg, i) => (
          <div
            key={i}
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
                borderTopLeftRadius: msg.role === "ai" ? 0 : undefined,
                border: `1px solid ${msg.role === "user" ? "rgba(242,201,76,0.3)" : "rgba(255,255,255,0.05)"}`,
                background: msg.role === "user" ? "rgba(242,201,76,0.1)" : "rgba(255,255,255,0.05)",
                color: msg.role === "user" ? "#F2C94C" : "#D1D5DB",
                maxWidth: "85%",
              }}
              dangerouslySetInnerHTML={{ __html: msg.content }}
            />
          </div>
        ))}

        {isTyping && (
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
      <div style={{ padding: "12px", background: "rgba(0,0,0,0.8)", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(input);
          }}
          style={{ position: "relative" }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter command..."
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
            onFocus={(e) => (e.currentTarget.style.borderColor = "#F2C94C")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
          />
          <button
            type="submit"
            style={{
              position: "absolute",
              right: 8,
              top: 6,
              background: "none",
              border: "none",
              color: "#6B7280",
              cursor: "pointer",
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
