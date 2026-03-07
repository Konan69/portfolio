"use client";

import { social } from "@/resources";
import { useDesignTheme } from "./DesignThemeProvider";

export const TerminalFooter = () => {
  const { toggleDesignTheme } = useDesignTheme();

  return (
    <footer
      className="w-full py-6 px-6"
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        background: "#0A0A0A",
        borderTop: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        {/* Left — Social links (matching design: GITHUB LINKEDIN X / TWITTER) */}
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

        {/* Center — Camera metadata (decorative) */}
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

        {/* Right — ASK KONAN AI (switches back to renaissance for now) */}
        <button
          onClick={toggleDesignTheme}
          className="flex items-center gap-2 bg-[#F2C94C] text-black px-4 py-2 rounded-full text-xs font-bold hover:bg-white transition-colors"
        >
          ASK KONAN AI
          <div className="w-1.5 h-1.5 bg-black rounded-full animate-pulse" />
        </button>
      </div>
    </footer>
  );
};
