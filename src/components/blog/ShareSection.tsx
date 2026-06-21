"use client";

import { useEffect, useState } from "react";
import { useLocation } from "@tanstack/react-router";

export function ShareSection() {
  const { pathname } = useLocation();
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const url = origin ? `${origin}${pathname}` : pathname;

  return (
    <div
      className="mt-16 pt-8 border-t"
      style={{ borderColor: "rgba(184, 134, 11, 0.2)" }}
    >
      <div className="flex items-center gap-4">
        <span
          className="text-xs tracking-[0.2em] uppercase"
          style={{ fontFamily: "var(--font-display)", color: "var(--r-gold)" }}
        >
          Share
        </span>
        <a
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm hover:opacity-70 transition-opacity"
          style={{ fontFamily: "var(--font-body)", color: "var(--r-sepia)" }}
        >
          X / Twitter
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm hover:opacity-70 transition-opacity"
          style={{ fontFamily: "var(--font-body)", color: "var(--r-sepia)" }}
        >
          LinkedIn
        </a>
      </div>
    </div>
  );
}
