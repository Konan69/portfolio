"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { person } from "@/resources";

export const TerminalHeader = () => {
  const pathname = usePathname() ?? "";

  const isHome = pathname === "/";
  const isAbout = pathname === "/about";

  const pillBase: React.CSSProperties = {
    padding: "6px 16px",
    borderRadius: "9999px",
    fontSize: "0.75rem",
    fontWeight: 500,
    fontFamily: "'JetBrains Mono', monospace",
    textDecoration: "none",
    transition: "all 0.2s",
    display: "inline-block",
    lineHeight: "1.4",
  };

  const pillActive: React.CSSProperties = {
    ...pillBase,
    background: "#FFFFFF",
    color: "#000000",
  };

  const pillInactive: React.CSSProperties = {
    ...pillBase,
    background: "transparent",
    color: "#9CA3AF",
  };

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        width: "100%",
        zIndex: 50,
        padding: "16px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontFamily: "'JetBrains Mono', monospace",
        background:
          "linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 60%, transparent 100%)",
      }}
    >
      {/* Left — Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255,255,255,0.05)",
          }}
        >
          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#fff" }}>
            SM
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontSize: "0.875rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              color: "#fff",
            }}
          >
            KONAN.DEV
          </span>
          <span
            style={{
              fontSize: "0.65rem",
              letterSpacing: "0.05em",
              textTransform: "uppercase" as const,
              color: "#9CA3AF",
            }}
          >
            SYS_ARCHITECT // V.2.0.4
          </span>
        </div>
      </div>

      {/* Center — Nav pills */}
      <div
        style={{
          borderRadius: "9999px",
          padding: "4px",
          display: "flex",
          gap: "4px",
          background: "rgba(18, 18, 18, 0.85)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <Link href="/?theme=terminal" style={isHome ? pillActive : pillInactive} {...(isHome ? {"data-t-nav-active": ""} : {"data-t-nav-inactive": ""})}>
          INDEX
        </Link>
        <Link href="/about?theme=terminal" style={isAbout ? pillActive : pillInactive} {...(isAbout ? {"data-t-nav-active": ""} : {"data-t-nav-inactive": ""})}>
          DATA
        </Link>
      </div>

      {/* Right — Email + Available status */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <a
          href={`mailto:${person.email}`}
          data-t-link=""
          style={{
            fontSize: "0.75rem",
            color: "#fff",
            textDecoration: "none",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#F2C94C")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#fff")}
        >
          [ EMAIL ]
        </a>
        <div
          style={{
            padding: "6px 12px",
            borderRadius: "9999px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(18, 18, 18, 0.85)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#27AE60",
              animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            }}
          />
          <span
            style={{
              fontSize: "0.65rem",
              letterSpacing: "0.05em",
              textTransform: "uppercase" as const,
              fontWeight: 700,
              color: "#fff",
            }}
          >
            AVAILABLE
          </span>
        </div>
      </div>
    </header>
  );
};
