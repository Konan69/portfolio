"use client";

import { useDesignTheme } from "@/components/DesignThemeProvider";
import { TerminalHome } from "@/components/TerminalHome";
import { about, person } from "@/resources";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const HeroScene = dynamic(() => import("@/components/HeroScene"), {
  ssr: false,
});

const darkTag: React.CSSProperties = {
  fontFamily: "var(--font-tech)",
  fontSize: "0.7rem",
  letterSpacing: "0.03em",
  color: "#d4c9a8",
  background: "rgba(218, 165, 32, 0.06)",
  borderRadius: "2px",
  padding: "4px 10px",
};

const lightTag: React.CSSProperties = {
  fontFamily: "var(--font-tech)",
  fontSize: "0.7rem",
  letterSpacing: "0.03em",
  color: "#8b6914",
  background: "rgba(184, 134, 11, 0.05)",
  borderRadius: "2px",
  padding: "4px 10px",
};

function ScrollReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold: 0.1, rootMargin: "0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const transforms: Record<string, string> = {
    up: "translate-y-8",
    down: "-translate-y-8",
    left: "translate-x-8",
    right: "-translate-x-8",
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out-quart ${isVisible ? "opacity-100" : `opacity-0 ${transforms[direction]}`} ${className}`}
      style={{ transitionDelay: isVisible ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}

export default function Home() {
  const { designTheme } = useDesignTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (designTheme === "terminal") {
    return <TerminalHome />;
  }

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[100dvh] flex items-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/images/renaissance/school_of_athens.jpg"
            alt="The School of Athens by Raphael - a Renaissance fresco depicting ancient Greek philosophers"
            fill
            className="object-cover"
            priority
            quality={90}
          />
          {/* Single unified overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to bottom,
                rgba(18, 14, 10, 0.5) 0%,
                rgba(18, 14, 10, 0.2) 30%,
                rgba(18, 14, 10, 0.4) 65%,
                rgba(18, 14, 10, 0.92) 100%
              )`,
            }}
          />
          {/* Left readability zone */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(105deg, rgba(18, 14, 10, 0.55) 0%, rgba(18, 14, 10, 0.25) 35%, transparent 60%)",
            }}
          />
        </div>

        <HeroScene />

        {/* Hero content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
          <div className="max-w-xl lg:max-w-2xl">
            {/* Role label */}
            <p
              className={`font-accent text-[11px] tracking-[0.3em] uppercase mb-5 text-[#c4a455] transition-all duration-700 ease-out-quart ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
              style={{ transitionDelay: mounted ? "100ms" : "0ms" }}
            >
              {person.role}
            </p>

            {/* Main heading */}
            <h1
              className={`font-display text-5xl md:text-7xl lg:text-[5.5rem] font-medium tracking-tighter leading-[0.95] text-[#f4efe4] mb-6 transition-all duration-700 ease-out-quart gold-shimmer ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: mounted ? "200ms" : "0ms" }}
            >
              Konan<span className="text-[#c4a455]">.dev</span>
            </h1>

            {/* Tagline */}
            <p
              className={`font-display text-lg md:text-xl lg:text-2xl text-[#bfb094] max-w-md leading-relaxed mb-10 transition-all duration-700 ease-out-quart ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
              style={{ transitionDelay: mounted ? "350ms" : "0ms" }}
            >
              Startups don&apos;t fail at code.{" "}
              <span className="text-[#d4a846]">They fail at systems.</span>
            </p>

            {/* CTAs */}
            <div
              className={`flex flex-wrap gap-4 transition-all duration-700 ease-out-quart ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
              style={{ transitionDelay: mounted ? "500ms" : "0ms" }}
            >
              <a
                href="https://cal.com/konandev"
                target="_blank"
                rel="noopener noreferrer"
                className="r-button r-button-primary group inline-flex items-center gap-2"
              >
                <span>Schedule a Call</span>
                <svg
                  className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </a>
              <Link
                href="/about"
                className="r-button r-button-ghost inline-flex items-center gap-2"
              >
                <span>See My Work</span>
                <svg
                  className="w-4 h-4 transition-transform duration-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-[10px] tracking-[0.2em] uppercase text-[#bfb094]/40 font-accent">
            Scroll
          </span>
          <div className="w-px h-8 bg-gradient-to-b from-[#c4a455]/40 to-transparent scroll-bounce" />
        </div>
      </section>

      {/* Main Content */}
      <div className="relative bg-[#f4efe4]">
        {/* CTA Band */}
        <section
          className="py-20 md:py-28 px-6 md:px-16 lg:px-20"
          style={{
            background: "linear-gradient(180deg, #1a1612 0%, #2a2218 50%, #1a1612 100%)",
          }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-3">
                <ScrollReveal delay={0}>
                  {/* Currently badge */}
                  <div className="flex items-center gap-3 mb-6">
                    <span
                      className="text-[10px] tracking-[0.25em] uppercase px-3 py-1.5"
                      style={{
                        fontFamily: "var(--font-tech)",
                        color: "#c9a84a",
                        border: "1px solid rgba(218, 165, 32, 0.3)",
                        borderRadius: "2px",
                        fontSize: "0.65rem",
                      }}
                    >
                      Currently
                    </span>
                    <span
                      className="text-sm"
                      style={{ fontFamily: "var(--font-body)", color: "#bfb094" }}
                    >
                      Building AI for venture capital at{" "}
                      <a
                        href="https://enteroverdrive.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors duration-200 hover:text-[#daa520]"
                        style={{
                          color: "#daa520",
                          borderBottom: "1px solid rgba(218, 165, 32, 0.3)",
                        }}
                      >
                        Overdrive
                      </a>
                    </span>
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={100}>
                  <h2
                    className="text-2xl md:text-3xl lg:text-4xl font-medium mb-6 tracking-tight leading-tight"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "#f4efe4",
                    }}
                  >
                    I&apos;ve shipped across AI, fintech, and Web3.
                    <br />
                    <span style={{ color: "#daa520" }}>
                      Your project gets that depth from day one.
                    </span>
                  </h2>
                </ScrollReveal>

                <ScrollReveal delay={200}>
                  <div className="flex flex-wrap gap-4">
                    <a
                      href="https://cal.com/konandev"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="r-button r-button-primary"
                    >
                      Schedule a Call
                    </a>
                    <Link
                      href="/about"
                      className="r-button"
                      style={{
                        background: "transparent",
                        borderColor: "rgba(218, 165, 32, 0.4)",
                        color: "#e8e0d0",
                      }}
                    >
                      See My Work
                    </Link>
                  </div>
                </ScrollReveal>
              </div>

              <ScrollReveal
                delay={300}
                direction="right"
                className="lg:col-span-2 hidden lg:flex flex-col gap-6"
              >
                <p
                  className="text-xs tracking-[0.2em] uppercase mb-1"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "#8b6914",
                  }}
                >
                  What that looks like
                </p>
                {[
                  "One engineer instead of three hires",
                  "Frontend, backend, infra, and AI under one roof",
                  "Production-grade from the first deploy",
                  "Async, fast, no hand-holding required",
                ].map((line, i) => (
                  <div
                    key={line}
                    className="flex items-start gap-3 text-sm leading-relaxed"
                    style={{ fontFamily: "var(--font-body)", color: "#bfb094" }}
                  >
                    <span
                      className="mt-2 block w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: "#daa520" }}
                    />
                    {line}
                  </div>
                ))}
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* About */}
        <section className="py-20 md:py-28 px-6 md:px-16 lg:px-20">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
              <ScrollReveal
                direction="left"
                className="lg:col-span-4 flex justify-center lg:justify-start"
              >
                <div className="relative">
                  <div className="absolute -inset-3 rounded-full bg-gradient-to-br from-[#daa520] via-[#b8860b] to-[#8b6914] opacity-80" />
                  <div className="absolute -inset-2 rounded-full bg-[#f4efe4]" />
                  <div className="relative w-52 h-52 md:w-60 md:h-60 rounded-full overflow-hidden border-4 border-[#daa520]/30">
                    <Image
                      src="/images/renaissance/fallen_angel.jpg"
                      alt="Suleman Mualim - Senior Product Engineer"
                      fill
                      className="object-cover object-[center_35%]"
                      quality={90}
                    />
                  </div>
                </div>
              </ScrollReveal>

              <div className="lg:col-span-8">
                <ScrollReveal>
                  <span
                    className="text-xs tracking-[0.3em] uppercase font-medium block mb-5"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "var(--r-gold)",
                    }}
                  >
                    About
                  </span>
                </ScrollReveal>

                <ScrollReveal delay={100}>
                  <h2 className="r-display text-3xl md:text-4xl lg:text-5xl mb-8">
                    One engineer.
                    <br />
                    <span style={{ color: "#8b5a2b" }}>The output of a team.</span>
                  </h2>
                </ScrollReveal>

                <ScrollReveal delay={200}>
                  <div className="space-y-6">
                    <p className="r-body text-base md:text-lg" style={{ maxWidth: "58ch" }}>
                      AI infrastructure for venture capital, recruiting platforms, cross-chain
                      trading systems, fintech processing millions monthly. Each built for scale
                      from day one, each still running in production.
                    </p>
                    <p className="r-body text-base md:text-lg" style={{ maxWidth: "58ch" }}>
                      Frontend to infrastructure. Mobile to blockchain. I don&apos;t specialize in
                      one layer because your product doesn&apos;t live in one layer.
                    </p>
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={300}>
                  <div className="mt-8 flex flex-wrap gap-4">
                    <Link href="/about" className="r-button r-button-primary">
                      Full Profile
                    </Link>
                    <a
                      href="https://cal.com/konandev"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="r-button"
                      style={{
                        background: "transparent",
                        borderColor: "rgba(184, 134, 11, 0.4)",
                        color: "var(--r-sepia)",
                      }}
                    >
                      Schedule a Call
                    </a>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="max-w-4xl mx-auto px-6">
          <div className="r-hr" />
        </div>

        {/* Capabilities */}
        <section className="py-20 md:py-28 px-6 md:px-16 lg:px-20">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12 md:mb-16">
              <ScrollReveal>
                <span
                  className="text-xs tracking-[0.3em] uppercase font-medium block mb-5"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "var(--r-gold)",
                  }}
                >
                  What I Ship
                </span>
              </ScrollReveal>
              <ScrollReveal delay={100}>
                <h2 className="r-display text-3xl md:text-4xl">
                  Technical Depth,
                  <br />
                  <span style={{ color: "#8b5a2b" }}>Delivered End-to-End</span>
                </h2>
              </ScrollReveal>
            </div>

            {/* Bento Grid */}
            <div className="grid gap-4 md:gap-5">
              {/* Row 1 */}
              <div className="grid md:grid-cols-5 gap-4 md:gap-5">
                <ScrollReveal delay={0} className="md:col-span-3 group">
                  <div
                    className="h-full relative overflow-hidden px-6 pt-6 pb-5 md:px-8 md:pt-8 md:pb-6 transition-all duration-300 group-hover:-translate-y-1"
                    style={{
                      background: "linear-gradient(135deg, #1a1612, #2a2218)",
                      borderRadius: "6px",
                      border: "1px solid rgba(184, 134, 11, 0.15)",
                    }}
                  >
                    <div
                      className="absolute top-0 left-0 right-0 h-px"
                      style={{
                        background: "linear-gradient(90deg, transparent, #b8860b, transparent)",
                        opacity: 0.4,
                      }}
                    />
                    <h3
                      className="text-sm tracking-[0.2em] uppercase mb-4"
                      style={{
                        fontFamily: "var(--font-display)",
                        color: "#c9a84a",
                      }}
                    >
                      Web & Mobile
                    </h3>
                    <p
                      className="text-sm mb-5 leading-relaxed"
                      style={{ fontFamily: "var(--font-body)", color: "#bfb094" }}
                    >
                      Apps that feel right on every screen. Fast loads, clean code, zero compromise.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {["React & Next.js", "TypeScript", "Tailwind CSS", "React Native"].map(
                        (item) => (
                          <span key={item} style={darkTag}>
                            {item}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={100} className="md:col-span-2 group">
                  <div
                    className="h-full relative overflow-hidden px-6 pt-6 pb-5 md:px-8 md:pt-8 md:pb-6 transition-all duration-300 group-hover:-translate-y-1"
                    style={{
                      background: "#faf8f0",
                      borderRadius: "6px",
                      border: "1px solid rgba(184, 134, 11, 0.2)",
                    }}
                  >
                    <h3
                      className="text-sm tracking-[0.2em] uppercase mb-4 transition-colors duration-300 group-hover:text-[#b8860b]"
                      style={{
                        fontFamily: "var(--font-display)",
                        color: "#3d2914",
                      }}
                    >
                      Scalable Backends
                    </h3>
                    <p
                      className="text-sm mb-5 leading-relaxed"
                      style={{ fontFamily: "var(--font-body)", color: "#704214" }}
                    >
                      APIs that don&apos;t fall over at 3 AM.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {["Node.js & Go", "Rust", "PostgreSQL", "Redis & MongoDB"].map((item) => (
                        <span
                          key={item}
                          className="transition-colors duration-200 hover:bg-[#b8860b]/10"
                          style={lightTag}
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              </div>

              {/* Row 2 */}
              <div className="grid md:grid-cols-5 gap-4 md:gap-5">
                <ScrollReveal delay={0} className="md:col-span-2 group">
                  <div
                    className="h-full relative overflow-hidden px-6 pt-6 pb-5 md:px-8 md:pt-8 md:pb-6 transition-all duration-300 group-hover:-translate-y-1"
                    style={{
                      background: "#faf8f0",
                      borderRadius: "6px",
                      border: "1px solid rgba(184, 134, 11, 0.2)",
                    }}
                  >
                    <h3
                      className="text-sm tracking-[0.2em] uppercase mb-4 transition-colors duration-300 group-hover:text-[#b8860b]"
                      style={{
                        fontFamily: "var(--font-display)",
                        color: "#3d2914",
                      }}
                    >
                      AI Engineering
                    </h3>
                    <p
                      className="text-sm mb-5 leading-relaxed"
                      style={{ fontFamily: "var(--font-body)", color: "#704214" }}
                    >
                      Beyond the ChatGPT wrapper.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {["LangChain", "RAG Pipelines", "LLM Orchestration", "Vector DBs"].map(
                        (item) => (
                          <span
                            key={item}
                            className="transition-colors duration-200 hover:bg-[#b8860b]/10"
                            style={lightTag}
                          >
                            {item}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={100} className="md:col-span-3 group">
                  <div
                    className="h-full relative overflow-hidden px-6 pt-6 pb-5 md:px-8 md:pt-8 md:pb-6 transition-all duration-300 group-hover:-translate-y-1"
                    style={{
                      background: "linear-gradient(135deg, #1a1612, #2a2218)",
                      borderRadius: "6px",
                      border: "1px solid rgba(184, 134, 11, 0.15)",
                    }}
                  >
                    <div
                      className="absolute top-0 left-0 right-0 h-px"
                      style={{
                        background: "linear-gradient(90deg, transparent, #b8860b, transparent)",
                        opacity: 0.4,
                      }}
                    />
                    <h3
                      className="text-sm tracking-[0.2em] uppercase mb-4"
                      style={{
                        fontFamily: "var(--font-display)",
                        color: "#c9a84a",
                      }}
                    >
                      Cloud &amp; DevOps
                    </h3>
                    <p
                      className="text-sm mb-5 leading-relaxed"
                      style={{ fontFamily: "var(--font-body)", color: "#bfb094" }}
                    >
                      Ship daily without breaking production.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {["AWS & GCP", "Kubernetes", "Docker", "CI/CD Pipelines"].map((item) => (
                        <span key={item} style={darkTag}>
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              </div>

              {/* Row 3 */}
              <div className="grid md:grid-cols-5 gap-4 md:gap-5">
                <ScrollReveal delay={0} className="md:col-span-3 group">
                  <div
                    className="h-full relative overflow-hidden px-6 pt-6 pb-5 md:px-8 md:pt-8 md:pb-6 transition-all duration-300 group-hover:-translate-y-1"
                    style={{
                      background: "#faf8f0",
                      borderRadius: "6px",
                      border: "1px solid rgba(184, 134, 11, 0.2)",
                    }}
                  >
                    <h3
                      className="text-sm tracking-[0.2em] uppercase mb-4 transition-colors duration-300 group-hover:text-[#b8860b]"
                      style={{
                        fontFamily: "var(--font-display)",
                        color: "#3d2914",
                      }}
                    >
                      Web3 &amp; Blockchain
                    </h3>
                    <p
                      className="text-sm mb-5 leading-relaxed"
                      style={{ fontFamily: "var(--font-body)", color: "#704214" }}
                    >
                      Smart contracts that handle real money.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {["Solidity", "Rust (Anchor)", "Smart Contracts", "Cross-chain"].map(
                        (item) => (
                          <span
                            key={item}
                            className="transition-colors duration-200 hover:bg-[#b8860b]/10"
                            style={lightTag}
                          >
                            {item}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={100} className="md:col-span-2 group">
                  <div
                    className="h-full relative overflow-hidden px-6 pt-6 pb-5 md:px-8 md:pt-8 md:pb-6 transition-all duration-300 group-hover:-translate-y-1"
                    style={{
                      background: "linear-gradient(135deg, #1a1612, #2a2218)",
                      borderRadius: "6px",
                      border: "1px solid rgba(184, 134, 11, 0.15)",
                    }}
                  >
                    <div
                      className="absolute top-0 left-0 right-0 h-px"
                      style={{
                        background: "linear-gradient(90deg, transparent, #b8860b, transparent)",
                        opacity: 0.4,
                      }}
                    />
                    <h3
                      className="text-sm tracking-[0.2em] uppercase mb-4"
                      style={{
                        fontFamily: "var(--font-display)",
                        color: "#c9a84a",
                      }}
                    >
                      System Architecture
                    </h3>
                    <p
                      className="text-sm mb-5 leading-relaxed"
                      style={{ fontFamily: "var(--font-body)", color: "#bfb094" }}
                    >
                      Built to grow with the business, not against it.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {["Microservices", "Event-Driven", "API Design", "System Design"].map(
                        (item) => (
                          <span key={item} style={darkTag}>
                            {item}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="py-16 md:py-20">
          <div className="ornament">
            <span className="ornament-symbol">&Omega;</span>
          </div>
        </div>
      </div>

      <div className="grain-overlay" />
    </main>
  );
}
