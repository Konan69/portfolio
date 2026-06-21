"use client";

import { useEffect } from "react";
import { useLocation } from "@tanstack/react-router";

export function ScrollToHash() {
  const location = useLocation();

  useEffect(() => {
    const hash = window.location.hash || (location.hash ? `#${location.hash}` : "");
    if (hash) {
      const id = hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location.hash]);

  return null;
}
