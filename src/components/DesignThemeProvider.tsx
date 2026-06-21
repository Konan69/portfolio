"use client";

import * as React from "react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { hasReactViewTransition } from "./MaybeViewTransition";

export type DesignTheme = "renaissance" | "terminal";

interface DesignThemeContextValue {
  designTheme: DesignTheme;
  setDesignTheme: (theme: DesignTheme) => void;
  toggleDesignTheme: () => void;
  /** Raw URL navigation without view-transition wrapping.
   *  Use when you control the view transition yourself (e.g. circular reveal). */
  navigateTheme: (theme: DesignTheme) => void;
  /** Synchronous theme setter — call inside flushSync() for view-transition
   *  animations that need an instant DOM update. */
  setImmediateTheme: React.Dispatch<React.SetStateAction<DesignTheme | null>>;
}

type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => void;
};

const DesignThemeContext = React.createContext<DesignThemeContextValue>({
  designTheme: "renaissance",
  setDesignTheme: () => {},
  toggleDesignTheme: () => {},
  navigateTheme: () => {},
  setImmediateTheme: () => {},
});

export const useDesignTheme = () => React.useContext(DesignThemeContext);

export function DesignThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigateRouter = useNavigate();
  const location = useLocation();

  // Synchronous override — set by flushSync in the animated toggler,
  // cleared once the URL catches up.
  const [immediateTheme, setImmediateTheme] =
    React.useState<DesignTheme | null>(null);

  const searchParams = React.useMemo(() => {
    const search = new URLSearchParams();
    Object.entries(location.search).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        search.set(key, String(value));
      }
    });
    return search;
  }, [location.search]);

  const urlTheme: DesignTheme =
    searchParams.get("theme") === "terminal" ? "terminal" : "renaissance";

  // Effective theme: synchronous override wins while URL is catching up
  const designTheme = immediateTheme ?? urlTheme;

  // Once the URL reflects the override, clear it
  React.useEffect(() => {
    if (immediateTheme !== null && immediateTheme === urlTheme) {
      setImmediateTheme(null);
    }
  }, [urlTheme, immediateTheme]);

  const navigate = React.useCallback(
    (theme: DesignTheme) => {
      const params = new URLSearchParams(searchParams.toString());
      if (theme === "renaissance") {
        params.delete("theme");
      } else {
        params.set("theme", theme);
      }
      const qs = params.toString();
      const href = `${location.pathname}${qs ? `?${qs}` : ""}`;
      void navigateRouter({ href, resetScroll: false });
    },
    [navigateRouter, location.pathname, searchParams],
  );

  const setDesignTheme = React.useCallback(
    (theme: DesignTheme) => {
      if (hasReactViewTransition) {
        React.startTransition(() => {
          navigate(theme);
        });
        return;
      }

      const viewTransitionDocument = document as ViewTransitionDocument;
      if (typeof document !== "undefined" && viewTransitionDocument.startViewTransition) {
        viewTransitionDocument.startViewTransition(() => {
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
    () => ({
      designTheme,
      setDesignTheme,
      toggleDesignTheme,
      navigateTheme: navigate,
      setImmediateTheme,
    }),
    [designTheme, setDesignTheme, toggleDesignTheme, navigate],
  );

  return (
    <DesignThemeContext.Provider value={value}>
      {children}
    </DesignThemeContext.Provider>
  );
}
