import { Suspense, type ReactNode } from "react";
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";

import { DesignShell } from "@/components/DesignShell";
import { DesignThemeProvider } from "@/components/DesignThemeProvider";
import { home } from "@/resources";
import appCss from "../styles/globals.css?url";
import customCss from "../resources/custom.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: home.title },
      { name: "description", content: home.description },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "stylesheet", href: customCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&family=Playfair+Display:wght@400;500;600;700;800&display=swap",
      },
      { rel: "icon", href: "/favicon.ico" },
    ],
  }),
  notFoundComponent: NotFound,
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Suspense>
        <DesignThemeProvider>
          <DesignShell>
            <Outlet />
          </DesignShell>
        </DesignThemeProvider>
      </Suspense>
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className="font-sans">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen m-0 p-0">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Page not found</p>
    </div>
  );
}
