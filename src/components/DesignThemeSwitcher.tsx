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

    // Persist in URL AFTER the animation finishes — calling router.push
    // immediately would trigger a second view transition (Next.js
    // experimental.viewTransition) which aborts this one.
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
      className={`
        px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 cursor-pointer
        ${
          isTerminal
            ? "bg-white/10 text-[#F2C94C] border border-[#F2C94C]/30 hover:bg-[#F2C94C]/10"
            : "bg-[#b8860b]/10 text-[#b8860b] border border-[#b8860b]/30 hover:bg-[#b8860b]/20"
        }
      `}
      style={{
        fontFamily: isTerminal
          ? "'JetBrains Mono', monospace"
          : "var(--font-accent)",
      }}
      aria-label="Switch design theme"
    >
      {isTerminal ? "Prod" : "Workshop"}
    </button>
  );
};
