"use client";

import { useCallback, useRef } from "react";
import { flushSync } from "react-dom";
import { useDesignTheme, type DesignTheme } from "./DesignThemeProvider";

export const DesignThemeSwitcher = () => {
  const { designTheme, navigateTheme, setImmediateTheme } = useDesignTheme();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const isTerminal = designTheme === "terminal";

  const toggleTheme = useCallback(() => {
    const button = buttonRef.current;
    if (!button) return;

    const newTheme: DesignTheme = isTerminal ? "renaissance" : "terminal";

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (
      prefersReducedMotion ||
      typeof document.startViewTransition !== "function"
    ) {
      navigateTheme(newTheme);
      return;
    }

    const { top, left, width, height } = button.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const viewportWidth = window.visualViewport?.width ?? window.innerWidth;
    const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
    const maxRadius = Math.hypot(
      Math.max(x, viewportWidth - x),
      Math.max(y, viewportHeight - y)
    );

    const transition = document.startViewTransition(() => {
      flushSync(() => {
        setImmediateTheme(newTheme);
      });
    });

    transition.finished?.then(() => {
      navigateTheme(newTheme);
    });

    const ready = transition?.ready;
    if (ready && typeof ready.then === "function") {
      ready.then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${maxRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 400,
            easing: "ease-in-out",
            pseudoElement: "::view-transition-new(root)",
          }
        );
      });
    }
  }, [isTerminal, navigateTheme, setImmediateTheme]);

  return (
    <button
      ref={buttonRef}
      onClick={toggleTheme}
      className="group relative overflow-hidden px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-[0.15em] transition-all duration-300 cursor-pointer border"
      style={{
        fontFamily: isTerminal
          ? "'JetBrains Mono', monospace"
          : "var(--font-accent)",
        background: isTerminal
          ? "linear-gradient(135deg, #111 0%, #1a1a1a 100%)"
          : "linear-gradient(135deg, #1a1612 0%, #2a2218 100%)",
        color: isTerminal ? "#F2C94C" : "#daa520",
        borderColor: isTerminal ? "rgba(242, 201, 76, 0.5)" : "rgba(218, 165, 32, 0.5)",
        boxShadow: isTerminal
          ? "0 0 20px rgba(242, 201, 76, 0.15), inset 0 1px 0 rgba(255,255,255,0.05)"
          : "0 0 20px rgba(218, 165, 32, 0.15), inset 0 1px 0 rgba(255,255,255,0.05)",
        textShadow: "0 1px 2px rgba(0,0,0,0.4)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = isTerminal
          ? "0 0 28px rgba(242, 201, 76, 0.3), inset 0 1px 0 rgba(255,255,255,0.1)"
          : "0 0 28px rgba(218, 165, 32, 0.3), inset 0 1px 0 rgba(255,255,255,0.1)";
        e.currentTarget.style.borderColor = isTerminal
          ? "rgba(242, 201, 76, 0.8)"
          : "rgba(218, 165, 32, 0.8)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = isTerminal
          ? "0 0 20px rgba(242, 201, 76, 0.15), inset 0 1px 0 rgba(255,255,255,0.05)"
          : "0 0 20px rgba(218, 165, 32, 0.15), inset 0 1px 0 rgba(255,255,255,0.05)";
        e.currentTarget.style.borderColor = isTerminal
          ? "rgba(242, 201, 76, 0.5)"
          : "rgba(218, 165, 32, 0.5)";
      }}
      aria-label="Switch design theme"
    >
      {isTerminal ? "Prod" : "Workshop"}
    </button>
  );
};
