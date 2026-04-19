"use client";

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { hasReactViewTransition } from "./MaybeViewTransition";

export type DesignTheme = "renaissance" | "terminal";

interface DesignThemeContextValue {
  designTheme: DesignTheme;
  setDesignTheme: (theme: DesignTheme) => void;
  toggleDesignTheme: () => void;
}

const DesignThemeContext = React.createContext<DesignThemeContextValue>({
  designTheme: "renaissance",
  setDesignTheme: () => {},
  toggleDesignTheme: () => {},
});

export const useDesignTheme = () => React.useContext(DesignThemeContext);

export function DesignThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const designTheme: DesignTheme =
    searchParams.get("theme") === "terminal" ? "terminal" : "renaissance";

  const navigate = React.useCallback(
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

  const setDesignTheme = React.useCallback(
    (theme: DesignTheme) => {
      if (hasReactViewTransition) {
        React.startTransition(() => {
          navigate(theme);
        });
        return;
      }

      if (typeof document !== "undefined" && "startViewTransition" in document) {
        (document as any).startViewTransition(() => {
          navigate(theme);
        });
        return;
      }

      navigate(theme);
    },
    [navigate],
  );

  const toggleDesignTheme = React.useCallback(() => {
    setDesignTheme(designTheme === "renaissance" ? "terminal" : "renaissance");
  }, [designTheme, setDesignTheme]);

  const value = React.useMemo(
    () => ({ designTheme, setDesignTheme, toggleDesignTheme }),
    [designTheme, setDesignTheme, toggleDesignTheme],
  );

  return (
    <DesignThemeContext.Provider value={value}>
      {children}
    </DesignThemeContext.Provider>
  );
}
