"use client";

import {
  createContext,
  useContext,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export type DesignTheme = "renaissance" | "terminal";

interface DesignThemeContextValue {
  designTheme: DesignTheme;
  setDesignTheme: (theme: DesignTheme) => void;
  toggleDesignTheme: () => void;
}

const DesignThemeContext = createContext<DesignThemeContextValue>({
  designTheme: "renaissance",
  setDesignTheme: () => {},
  toggleDesignTheme: () => {},
});

export const useDesignTheme = () => useContext(DesignThemeContext);

export function DesignThemeProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const designTheme: DesignTheme =
    searchParams.get("theme") === "terminal" ? "terminal" : "renaissance";

  const navigate = useCallback(
    (theme: DesignTheme) => {
      const params = new URLSearchParams(searchParams.toString());
      if (theme === "renaissance") {
        params.delete("theme");
      } else {
        params.set("theme", theme);
      }
      const qs = params.toString();
      router.push(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  const setDesignTheme = useCallback(
    (theme: DesignTheme) => {
      // Use View Transitions API if available for smooth cross-fade
      if (typeof document !== "undefined" && "startViewTransition" in document) {
        (document as any).startViewTransition(() => {
          navigate(theme);
        });
      } else {
        navigate(theme);
      }
    },
    [navigate],
  );

  const toggleDesignTheme = useCallback(() => {
    setDesignTheme(designTheme === "renaissance" ? "terminal" : "renaissance");
  }, [designTheme, setDesignTheme]);

  const value = useMemo(
    () => ({ designTheme, setDesignTheme, toggleDesignTheme }),
    [designTheme, setDesignTheme, toggleDesignTheme],
  );

  return (
    <DesignThemeContext.Provider value={value}>
      {children}
    </DesignThemeContext.Provider>
  );
}
