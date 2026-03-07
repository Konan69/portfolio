import "@/resources/custom.css";
import "@/app/globals.css";

import classNames from "classnames";
import { Suspense } from "react";
import type { Metadata } from "next";

import { DesignThemeProvider } from "@/components/DesignThemeProvider";
import { DesignShell } from "@/components/DesignShell";
import { fonts, monoFont, home } from "@/resources";
import { Geist, Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: home.title,
  description: home.description,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(classNames(
              fonts.heading.variable,
              fonts.body.variable,
              fonts.label.variable,
              fonts.code.variable,
              monoFont.variable,
            ), "font-sans", inter.variable)}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&family=Playfair+Display:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen m-0 p-0">
        <Suspense>
          <DesignThemeProvider>
            <DesignShell>
              {children}
            </DesignShell>
          </DesignThemeProvider>
        </Suspense>
      </body>
    </html>
  );
}
