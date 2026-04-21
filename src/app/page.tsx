"use client";

import { useDesignTheme } from "@/components/DesignThemeProvider";
import { TerminalHome } from "@/components/TerminalHome";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

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
      <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/images/renaissance/school_of_athens.jpg"
            alt="The School of Athens by Raphael"
            fill
            className="object-cover"
            priority
            quality={90}
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to bottom,
                rgba(18, 14, 10, 0.4) 0%,
                rgba(18, 14, 10, 0.2) 40%,
                rgba(18, 14, 10, 0.4) 100%
              )`,
            }}
          />
        </div>

        <HeroScene />

        <div className="relative z-10 w-full flex justify-center px-6">
          <h1
            className={`font-display text-6xl md:text-8xl lg:text-9xl font-medium tracking-tighter leading-none text-[#f4efe4] transition-all duration-700 ease-out-quart gold-shimmer ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            Konan<span className="text-[#c4a455]" style={{ textShadow: "0 0 40px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.4)" }}>.dev</span>
          </h1>
        </div>
      </section>

      {/* Main Content */}
      <div className="relative bg-[#f4efe4]">
        {/* CTA Band */}
        <section
          className="py-16 md:py-20 px-6 md:px-16 lg:px-20"
          style={{
            background: "linear-gradient(180deg, #1a1612 0%, #2a2218 50%, #1a1612 100%)",
          }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <ScrollReveal>
              <p
                className="text-sm md:text-base mb-6"
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
                . AI, fintech, Web3. Shipped end-to-end.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <div className="flex flex-wrap justify-center gap-4">
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
        </section>

        {/* About */}
        <section className="py-24 md:py-32 px-6 md:px-16 lg:px-20">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              <ScrollReveal
                direction="left"
                className="lg:col-span-4 flex justify-center lg:justify-start"
              >
                <div className="relative">
                  <div className="absolute -inset-3 rounded-full bg-gradient-to-br from-[#daa520] via-[#b8860b] to-[#8b6914] opacity-80" />
                  <div className="absolute -inset-2 rounded-full bg-[#f4efe4]" />
                  <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-[#daa520]/30">
                    <Image
                      src="/images/renaissance/fallen_angel.jpg"
                      alt="Suleman Mualim"
                      fill
                      className="object-cover object-[center_35%]"
                      quality={90}
                    />
                  </div>
                </div>
              </ScrollReveal>

              <div className="lg:col-span-8">
                <ScrollReveal>
                  <p
                    className="text-xs tracking-[0.3em] uppercase font-medium mb-5"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "var(--r-gold)",
                    }}
                  >
                    Suleman Mualim
                  </p>
                </ScrollReveal>

                <ScrollReveal delay={100}>
                  <h2 className="r-display text-3xl md:text-4xl lg:text-5xl mb-6">
                    One engineer.
                    <br />
                    <span style={{ color: "#8b5a2b" }}>The output of a team.</span>
                  </h2>
                </ScrollReveal>

                <ScrollReveal delay={200}>
                  <p className="r-body text-base md:text-lg mb-6" style={{ maxWidth: "54ch" }}>
                    AI infrastructure for venture capital, recruiting platforms, cross-chain
                    trading systems, fintech processing millions monthly. Frontend to infrastructure.
                    Mobile to blockchain.
                  </p>
                </ScrollReveal>

                <ScrollReveal delay={300}>
                  <div className="flex flex-wrap gap-4">
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

            <div className="grid gap-4 md:gap-5">
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
