"use client";

import { Suspense, type ReactNode } from "react";
import { useDesignTheme } from "./DesignThemeProvider";
import { MaybeViewTransition } from "./MaybeViewTransition";
import { RenaissanceHeader } from "./RenaissanceHeader";
import { TerminalHeader } from "./TerminalHeader";
import { TerminalFooter } from "./TerminalFooter";

function ShellInner({ children }: { children: ReactNode }) {
  const { designTheme } = useDesignTheme();

  return (
    <MaybeViewTransition
      transitionKey={designTheme}
      enter="fade-in"
      exit="fade-out"
      default="none"
    >
      {designTheme === "terminal" ? (
      <div
        id="terminal-root"
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          backgroundColor: "#000000",
          color: "#FFFFFF",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          lineHeight: 1.6,
          position: "relative",
          backgroundSize: "100px 100px",
          backgroundImage:
            "linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)",
        }}
      >
        {/* Scanline overlay */}
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100vh",
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0) 50%, rgba(0,0,0,0.02) 50%)",
            backgroundSize: "100% 4px",
            pointerEvents: "none",
            zIndex: 9999,
          }}
        />

        <TerminalHeader />

        <main
          style={{
            flexGrow: 1,
            paddingLeft: "1rem",
            paddingRight: "1rem",
            paddingTop: "96px",
            paddingBottom: "120px",
            maxWidth: "64rem",
            marginLeft: "auto",
            marginRight: "auto",
            width: "100%",
          }}
        >
          {children}
        </main>

        <TerminalFooter />
      </div>
      ) : (
        <>
          <RenaissanceHeader />
          {children}
        </>
      )}
    </MaybeViewTransition>
  );
}

export function DesignShell({ children }: { children: ReactNode }) {
  return (
    <Suspense>
      <ShellInner>{children}</ShellInner>
    </Suspense>
  );
}
