"use client";

import { Suspense, type ReactNode, useEffect } from "react";
import { useDesignTheme } from "./DesignThemeProvider";
import { RenaissanceHeader } from "./RenaissanceHeader";
import { TerminalHeader } from "./TerminalHeader";
import { TerminalFooter } from "./TerminalFooter";

function ShellInner({ children }: { children: ReactNode }) {
  const { designTheme } = useDesignTheme();

  // When terminal mode is active, strip once-ui classes from html and body
  useEffect(() => {
    if (designTheme === "terminal") {
      const html = document.documentElement;
      const body = document.body;

      // Save original classes to restore later
      const htmlClasses = html.className;
      const bodyClasses = body.className;

      // Strip all once-ui / flex / column classes — keep only font variables
      html.setAttribute("data-theme", "dark");
      body.style.cssText = `
        background-color: #000000 !important;
        color: #FFFFFF !important;
        font-family: 'JetBrains Mono', monospace !important;
        -webkit-font-smoothing: antialiased;
        overflow-x: hidden;
        min-height: 100vh;
        margin: 0;
        padding: 0;
        display: block !important;
        flex-direction: unset !important;
        align-items: unset !important;
      `;

      return () => {
        html.className = htmlClasses;
        body.style.cssText = "";
        html.setAttribute("data-theme", "light");
      };
    }
  }, [designTheme]);

  if (designTheme === "terminal") {
    return (
      <>
        {/* Nuclear CSS reset — override ALL once-ui global styles */}
        <style>{`
          html[data-theme="dark"] body {
            background-color: #000000 !important;
            color: #FFFFFF !important;
            font-family: 'JetBrains Mono', monospace !important;
          }
          html[data-theme="dark"] body * {
            border-color: rgba(255, 255, 255, 0.1);
          }
          html[data-theme="dark"] a,
          html[data-theme="dark"] button {
            font-family: 'JetBrains Mono', monospace !important;
            text-decoration: none !important;
            color: inherit !important;
            border-radius: 0 !important;
          }
          /* Override once-ui Flex/Column display forcing */
          html[data-theme="dark"] body > [class*="flex"],
          html[data-theme="dark"] body > div {
            display: contents !important;
          }
          #terminal-root {
            display: flex !important;
            flex-direction: column !important;
            min-height: 100vh !important;
          }
          #terminal-root * {
            font-family: 'JetBrains Mono', monospace;
          }
          #terminal-root a {
            text-decoration: none !important;
          }
          #terminal-root a[data-t-btn="primary"] {
            background: #FFFFFF !important;
            color: #000000 !important;
            border-radius: 6px !important;
          }
          #terminal-root a[data-t-btn="primary"]:hover {
            background: #F2C94C !important;
          }
          #terminal-root a[data-t-btn="secondary"] {
            color: #FFFFFF !important;
            border-radius: 6px !important;
          }
          #terminal-root a[data-t-link] {
            color: #FFFFFF !important;
            text-decoration: none !important;
          }
          /* Nav pill overrides */
          #terminal-root [data-t-nav-active] {
            background: #FFFFFF !important;
            color: #000000 !important;
            border-radius: 9999px !important;
          }
          #terminal-root [data-t-nav-inactive] {
            background: transparent !important;
            color: #9CA3AF !important;
            border-radius: 9999px !important;
          }
          /* Footer social links */
          #terminal-root footer a {
            color: #6B7280 !important;
          }
          #terminal-root footer a:hover {
            color: #FFFFFF !important;
          }
          /* Email link in header */
          #terminal-root header a[data-t-link] {
            color: #FFFFFF !important;
          }
          /* Scrollbar */
          body::-webkit-scrollbar { width: 6px; }
          body::-webkit-scrollbar-track { background: #000000; }
          body::-webkit-scrollbar-thumb { background: #333333; border-radius: 3px; }
        `}</style>

        <div
          id="terminal-root"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            backgroundColor: "#000000",
            color: "#FFFFFF",
            minHeight: "100vh",
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
              paddingBottom: "64px",
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
      </>
    );
  }

  return (
    <>
      <RenaissanceHeader />
      {children}
    </>
  );
}

export function DesignShell({ children }: { children: ReactNode }) {
  return (
    <Suspense>
      <ShellInner>{children}</ShellInner>
    </Suspense>
  );
}
