"use client";

import { useState } from "react";
import { social } from "@/resources";
import { TerminalChat } from "./TerminalChat";

export const TerminalFooter = () => {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <>
      <footer
        className="w-full py-4 px-6"
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          background: "#121212",
          borderTop: "1px solid rgba(255, 255, 255, 0.15)",
          position: "fixed",
          bottom: 0,
          left: 0,
          zIndex: 40,
        }}
      >
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex gap-4">
            {social.map(
              (item) =>
                item.link && (
                  <a
                    key={item.name}
                    href={item.link}
                    target={item.link.startsWith("mailto:") ? undefined : "_blank"}
                    rel={item.link.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                    className="text-xs text-gray-500 hover:text-white transition-colors"
                  >
                    {item.name.toUpperCase()}
                  </a>
                ),
            )}
          </div>

          <div
            className="hidden md:flex gap-6 text-gray-600"
            style={{
              fontSize: "0.65rem",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            <span>F 4.2 -0.5EV</span>
            <span>ISO 600</span>
            <span>RAW+J</span>
          </div>

          <button
            onClick={() => setChatOpen(!chatOpen)}
            className="flex items-center gap-2 bg-[#F2C94C] text-black px-4 py-2 rounded-full text-xs font-bold hover:bg-white transition-colors"
          >
            {chatOpen ? "CLOSE TERMINAL" : "ASK KONAN AI"}
            <div className="w-1.5 h-1.5 bg-black rounded-full animate-pulse" />
          </button>
        </div>
      </footer>

      <TerminalChat isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  );
};
