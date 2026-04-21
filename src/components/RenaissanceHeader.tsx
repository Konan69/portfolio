"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, useRef, useCallback } from "react";
import gsap from "gsap";
import { routes, about, blog, work, gallery } from "@/resources";
import { DesignThemeSwitcher } from "./DesignThemeSwitcher";

const TimeDisplay = () => {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const seconds = now.getSeconds().toString().padStart(2, "0");
      setCurrentTime(`${hours}:${minutes}:${seconds}`);
    };

    updateTime();
    const intervalId = setInterval(updateTime, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <span
      className="text-[#d4a846] text-xs tracking-[0.12em] tabular-nums whitespace-nowrap"
      style={{ fontFamily: "var(--font-accent)" }}
    >
      {currentTime}
    </span>
  );
};

export const RenaissanceHeader = () => {
  const pathname = usePathname() ?? "";
  const [isCompact, setIsCompact] = useState(false);
  const currentState = useRef<"expanded" | "compact">("expanded");

  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const goldLineRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const leftHederaRef = useRef<HTMLSpanElement>(null);
  const rightHederaRef = useRef<HTMLSpanElement>(null);
  const timeRightRef = useRef<HTMLDivElement>(null);
  const timeInlineRef = useRef<HTMLDivElement>(null);
  const dividerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const navItemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const navItems = [
    { href: "/", label: "Home", show: routes["/"] },
    { href: "/about", label: about.label, show: routes["/about"] },
    { href: "/work", label: work.label, show: routes["/work"] },
    { href: "/blog", label: blog.label, show: routes["/blog"] },
    { href: "/gallery", label: gallery.label, show: routes["/gallery"] },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const visibleItems = navItems.filter((i) => i.show);

  const getAllTargets = useCallback(() => {
    return [
      containerRef.current,
      bgRef.current,
      borderRef.current,
      shadowRef.current,
      contentRef.current,
      navRef.current,
      goldLineRef.current,
      leftHederaRef.current,
      rightHederaRef.current,
      timeRightRef.current,
      timeInlineRef.current,
      ...dividerRefs.current.filter(Boolean),
      ...navItemRefs.current.filter(Boolean),
    ].filter(Boolean);
  }, []);

  const animateToCompact = useCallback(() => {
    if (currentState.current === "compact") return;
    currentState.current = "compact";

    gsap.killTweensOf(getAllTargets());

    const duration = 0.35;
    const ease = "power2.inOut";
    const tl = gsap.timeline();

    tl.to(containerRef.current, {
      maxWidth: "340px",
      marginTop: 12,
      duration,
      ease,
    }, 0);

    tl.to([bgRef.current, borderRef.current, shadowRef.current], {
      borderRadius: 999,
      duration,
      ease,
    }, 0);

    tl.to(borderRef.current, {
      opacity: 0,
      duration,
      ease,
    }, 0);

    tl.to(contentRef.current, {
      paddingTop: 10,
      paddingBottom: 10,
      duration,
      ease,
    }, 0);

    tl.to(navRef.current, {
      scale: 0.92,
      duration,
      ease,
    }, 0);

    tl.to(navItemRefs.current.filter(Boolean), {
      paddingLeft: 10,
      paddingRight: 10,
      duration,
      ease,
    }, 0);

    tl.to(dividerRefs.current.filter(Boolean), {
      width: 10,
      opacity: 0.2,
      duration,
      ease,
    }, 0);

    tl.to(goldLineRef.current, {
      opacity: 0,
      duration,
      ease,
    }, 0);

    tl.to([leftHederaRef.current, rightHederaRef.current], {
      opacity: 0,
      scale: 0.7,
      duration,
      ease,
    }, 0);

    tl.to(timeRightRef.current, {
      opacity: 0,
      x: 12,
      duration,
      ease,
    }, 0);

    tl.to(timeInlineRef.current, {
      opacity: 1,
      x: 0,
      duration,
      ease,
      onComplete: () => setIsCompact(true),
    }, 0);
  }, [getAllTargets]);

  const animateToExpanded = useCallback(() => {
    if (currentState.current === "expanded") return;
    currentState.current = "expanded";

    gsap.killTweensOf(getAllTargets());

    const duration = 0.35;
    const ease = "power2.inOut";
    const tl = gsap.timeline();

    tl.to(containerRef.current, {
      maxWidth: "3000px",
      marginTop: 0,
      duration,
      ease,
    }, 0);

    tl.to([bgRef.current, borderRef.current, shadowRef.current], {
      borderRadius: 0,
      duration,
      ease,
    }, 0);

    tl.to(borderRef.current, {
      opacity: 0.15,
      duration,
      ease,
    }, 0);

    tl.to(contentRef.current, {
      paddingTop: 20,
      paddingBottom: 20,
      duration,
      ease,
    }, 0);

    tl.to(navRef.current, {
      scale: 1,
      duration,
      ease,
    }, 0);

    tl.to(navItemRefs.current.filter(Boolean), {
      paddingLeft: 16,
      paddingRight: 16,
      duration,
      ease,
    }, 0);

    tl.to(dividerRefs.current.filter(Boolean), {
      width: 20,
      opacity: 0.3,
      duration,
      ease,
    }, 0);

    tl.to(goldLineRef.current, {
      opacity: 0.6,
      duration,
      ease,
    }, 0);

    tl.to([leftHederaRef.current, rightHederaRef.current], {
      opacity: 0.5,
      scale: 1,
      duration,
      ease,
    }, 0);

    tl.to(timeInlineRef.current, {
      opacity: 0,
      x: -8,
      duration,
      ease,
    }, 0);

    tl.to(timeRightRef.current, {
      opacity: 1,
      x: 0,
      duration,
      ease,
      onComplete: () => setIsCompact(false),
    }, 0);
  }, [getAllTargets]);

  useEffect(() => {
    const threshold = 20;

    const handleScroll = () => {
      const shouldBeCompact = window.scrollY > threshold;

      if (shouldBeCompact && currentState.current === "expanded") {
        animateToCompact();
      } else if (!shouldBeCompact && currentState.current === "compact") {
        animateToExpanded();
      }
    };

    if (window.scrollY > threshold) {
      currentState.current = "compact";
      gsap.set(containerRef.current, { maxWidth: "340px", marginTop: 12 });
      gsap.set([bgRef.current, borderRef.current, shadowRef.current], { borderRadius: 999 });
      gsap.set(borderRef.current, { opacity: 0 });
      gsap.set(contentRef.current, { paddingTop: 10, paddingBottom: 10 });
      gsap.set(navRef.current, { scale: 0.92 });
      gsap.set(goldLineRef.current, { opacity: 0 });
      gsap.set([leftHederaRef.current, rightHederaRef.current], { opacity: 0, scale: 0.7 });
      gsap.set(timeRightRef.current, { opacity: 0, x: 12 });
      gsap.set(timeInlineRef.current, { opacity: 1, x: 0 });
      navItemRefs.current.filter(Boolean).forEach((ref) => {
        gsap.set(ref, { paddingLeft: 10, paddingRight: 10 });
      });
      dividerRefs.current.filter(Boolean).forEach((ref) => {
        gsap.set(ref, { width: 10, opacity: 0.2 });
      });
      setIsCompact(true);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [animateToCompact, animateToExpanded]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
      {/* Theme switcher — stays static, never morphs */}
      <div className="absolute left-6 top-4 hidden lg:block pointer-events-auto">
        <DesignThemeSwitcher />
      </div>

      <div
        ref={containerRef}
        className="relative pointer-events-auto w-full"
        style={{ maxWidth: "3000px" }}
      >
        {/* Background layer */}
        <div
          ref={bgRef}
          className="absolute inset-0 overflow-hidden"
          style={{
            background:
              "linear-gradient(180deg, rgba(26, 22, 18, 0.92) 0%, rgba(32, 26, 20, 0.90) 100%)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
          }}
        />

        {/* Border glow */}
        <div
          ref={borderRef}
          className="absolute inset-0 border border-[#b8860b] pointer-events-none"
          style={{ opacity: 0.15 }}
        />

        {/* Shadow layer */}
        <div
          ref={shadowRef}
          className="absolute inset-0 pointer-events-none"
          style={{
            boxShadow:
              "0 4px 30px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(212, 168, 70, 0.08) inset",
          }}
        />

        {/* Top gold accent line */}
        <div
          ref={goldLineRef}
          className="absolute top-0 left-0 right-0 h-[1px] pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent 5%, #8b6914 30%, #d4a846 50%, #8b6914 70%, transparent 95%)",
            opacity: 0.6,
          }}
        />

        {/* Content wrapper */}
        <div
          ref={contentRef}
          className="relative z-10 flex items-center justify-center"
          style={{ padding: "20px" }}
        >
          {/* Navigation container */}
          <nav
            ref={navRef}
            className="flex items-center justify-center"
            style={{ transformOrigin: "center center" }}
          >
            {/* Left ornamental hedera */}
            <span
              ref={leftHederaRef}
              className="text-[#8b6914] text-base mr-3 select-none pointer-events-none"
              style={{ fontFamily: "var(--font-display)" }}
            >
              ❧
            </span>

            {/* Nav items */}
            <div className="flex items-center">
              {visibleItems.map((item, index) => {
                const active = isActive(item.href);
                const isLast = index === visibleItems.length - 1;

                return (
                  <div key={item.href} className="flex items-center">
                    <Link href={item.href} className="group relative block">
                      <div
                        ref={(el) => {
                          navItemRefs.current[index] = el;
                        }}
                        className="py-1.5"
                        style={{ paddingLeft: 16, paddingRight: 16 }}
                      >
                        <span
                          className={`
                            relative z-10 uppercase block text-xs tracking-[0.2em]
                            transition-colors duration-200
                            ${
                              active
                                ? "text-[#f0d078]"
                                : "text-[#bfb094] group-hover:text-[#dcc9a3]"
                            }
                          `}
                          style={{ fontFamily: "var(--font-accent)" }}
                        >
                          {item.label}
                        </span>

                        {/* Active underline */}
                        <span
                          className={`
                            absolute bottom-0.5 left-1/2 -translate-x-1/2 h-[1px]
                            transition-all duration-300 ease-out
                            ${
                              active
                                ? "w-3/5 opacity-100"
                                : "w-0 opacity-0 group-hover:w-2/5 group-hover:opacity-50"
                            }
                          `}
                          style={{
                            background:
                              "linear-gradient(90deg, transparent, #c9a84a, transparent)",
                          }}
                        />
                      </div>
                    </Link>

                    {/* Divider dot */}
                    {!isLast && (
                      <div
                        ref={(el) => {
                          dividerRefs.current[index] = el;
                        }}
                        className="flex items-center justify-center"
                        style={{ width: 20, opacity: 0.3 }}
                      >
                        <div className="w-[3px] h-[3px] rounded-full bg-[#d4a846]" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Right ornamental hedera */}
            <span
              ref={rightHederaRef}
              className="text-[#8b6914] text-base ml-3 select-none scale-x-[-1] pointer-events-none"
              style={{ fontFamily: "var(--font-display)" }}
            >
              ❧
            </span>

            {/* Time display - inline (compact mode) */}
            <div
              ref={timeInlineRef}
              className="flex items-center ml-3 pl-3 border-l border-[#8b6914]/30"
              style={{
                opacity: 0,
                pointerEvents: isCompact ? "auto" : "none",
              }}
            >
              <TimeDisplay />
            </div>
          </nav>

          {/* Time display - absolute right (expanded mode) */}
          <div
            ref={timeRightRef}
            className="absolute right-6 top-1/2 -translate-y-1/2 hidden lg:block"
            style={{ pointerEvents: isCompact ? "none" : "auto" }}
          >
            <TimeDisplay />
          </div>
        </div>
      </div>
    </header>
  );
};
