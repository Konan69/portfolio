"use client";

import { useDesignTheme } from "@/components/DesignThemeProvider";
import { TerminalAbout } from "@/components/TerminalAbout";
import type { ReactNode } from "react";

export function AboutSwitch({ renaissance }: { renaissance: ReactNode }) {
  const { designTheme } = useDesignTheme();

  if (designTheme === "terminal") {
    return <TerminalAbout />;
  }

  return <>{renaissance}</>;
}
