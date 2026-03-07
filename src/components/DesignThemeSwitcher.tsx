"use client";

import { useDesignTheme } from "./DesignThemeProvider";

export const DesignThemeSwitcher = () => {
  const { designTheme, toggleDesignTheme } = useDesignTheme();

  const isTerminal = designTheme === "terminal";

  return (
    <button
      onClick={toggleDesignTheme}
      className={`
        px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300
        ${
          isTerminal
            ? "bg-white/10 text-[#F2C94C] border border-[#F2C94C]/30 hover:bg-[#F2C94C]/10"
            : "bg-[#b8860b]/10 text-[#b8860b] border border-[#b8860b]/30 hover:bg-[#b8860b]/20"
        }
      `}
      style={{ fontFamily: isTerminal ? "'JetBrains Mono', monospace" : "var(--font-accent)" }}
      aria-label="Switch design theme"
    >
      {isTerminal ? "PROD_BUILD" : "The Workshop"}
    </button>
  );
};
