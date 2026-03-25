import { person } from "@/resources";
import { about } from "@/resources/content";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Work",
  description: `Projects and experience by ${person.name}`,
};

const CheckIcon = () => (
  <svg
    className="w-4 h-4 text-[#b8860b] mt-0.5 shrink-0"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

export default function Work() {
  const experiences = about.work.experiences;

  return (
    <main className="min-h-screen bg-[#f4efe4] pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <header className="mb-20">
          <span
            className="text-xs tracking-[0.3em] uppercase font-medium block mb-4"
            style={{ fontFamily: "var(--font-display)", color: "var(--r-gold)" }}
          >
            Experience
          </span>
          <h1
            className="text-4xl md:text-5xl mb-6 tracking-tight"
            style={{ fontFamily: "var(--font-display)", color: "var(--r-umber)" }}
          >
            Where I&apos;ve shipped.
          </h1>
          <p
            className="text-lg max-w-xl leading-relaxed"
            style={{ fontFamily: "var(--font-body)", color: "var(--r-sepia)" }}
          >
            From AI infrastructure to blockchain protocols — each role taught me something about
            building systems that scale.
          </p>
        </header>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute left-[11px] top-0 bottom-0 w-px"
            style={{ background: "linear-gradient(to bottom, var(--r-gold), transparent)" }}
          />

          {/* Experience items */}
          <div className="space-y-16">
            {experiences.map((exp, index) => (
              <div key={exp.company} className="relative pl-12">
                {/* Dot */}
                <div
                  className="absolute left-0 top-1.5 w-6 h-6 rounded-full border-2 border-[#b8860b] bg-[#f4efe4]"
                  style={{ boxShadow: "0 0 0 4px rgba(184, 134, 11, 0.15)" }}
                />

                {/* Content */}
                <div className="group">
                  <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 mb-4">
                    <h2
                      className="text-xl md:text-2xl font-medium"
                      style={{ fontFamily: "var(--font-display)", color: "var(--r-umber)" }}
                    >
                      {exp.company}
                    </h2>
                    <span
                      className="text-sm tracking-wide"
                      style={{ fontFamily: "var(--font-tech)", color: "var(--r-gold)" }}
                    >
                      {exp.timeframe}
                    </span>
                  </div>

                  <p
                    className="text-base mb-5"
                    style={{ fontFamily: "var(--font-body)", color: "var(--r-sepia-light)" }}
                  >
                    {exp.role}
                  </p>

                  <ul className="space-y-3">
                    {exp.achievements.map((achievement, i) => (
                      <li key={`${exp.company}-${i}`} className="flex gap-3">
                        <CheckIcon />
                        <span
                          className="text-sm leading-relaxed"
                          style={{ fontFamily: "var(--font-body)", color: "var(--r-sepia)" }}
                        >
                          {achievement}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-24 pt-16 text-center border-t border-[rgba(184,134,11,0.2)]">
          <p
            className="text-lg mb-8"
            style={{ fontFamily: "var(--font-body)", color: "var(--r-sepia)" }}
          >
            Want to work together?
          </p>
          <a
            href="https://cal.com/konandev"
            target="_blank"
            rel="noopener noreferrer"
            className="r-button r-button-primary"
          >
            Schedule a Call
          </a>
        </div>
      </div>
    </main>
  );
}
