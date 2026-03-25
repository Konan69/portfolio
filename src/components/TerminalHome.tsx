"use client";

import Link from "next/link";

const capabilities = [
  {
    title: "AI ENGINEERING",
    desc: "LLM Orchestration, RAG Pipelines, Vector DBs, Fine-tuning models.",
  },
  { title: "FULL STACK WEB", desc: "React/Next.js, Vue, Node.js, TypeScript, WebAssembly." },
  { title: "CLOUD INFRA", desc: "AWS, Docker, Kubernetes, Terraform, Serverless Architectures." },
  {
    title: "SYSTEM ARCHITECTURE",
    desc: "Microservices, Event-driven systems, High-availability design.",
  },
  { title: "WEB3 / BLOCKCHAIN", desc: "Smart Contracts (Solidity), dApps, IPFS integration." },
  { title: "MOBILE DEV", desc: "React Native, Flutter, Native iOS/Android bridges." },
];

const projects = [
  {
    name: "Athena.chat",
    desc: "Enterprise RAG conversational agent for legal discovery.",
    tags: ["PYTHON", "OPENAI", "PINECONE"],
  },
  {
    name: "Galaxy Quest",
    desc: "DeFi visualization dashboard tracking $50M+ TVL.",
    tags: ["WEB3", "D3.JS", "REACT"],
  },
  {
    name: "x402 Demo",
    desc: "Experimental WebGL portfolio engine with physics.",
    tags: ["THREE.JS", "GLSL"],
  },
];

export const TerminalHome = () => {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <section
        className="relative mx-4 md:mx-0"
        style={{
          paddingTop: "clamp(4rem, 10vh, 8rem)",
          paddingBottom: "clamp(4rem, 10vh, 8rem)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        {/* Corner brackets */}
        <div className="absolute top-0 left-0 w-4 h-4 border-l border-t border-white/30" />
        <div className="absolute top-0 right-0 w-4 h-4 border-r border-t border-white/30" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-l border-b border-white/30" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-r border-b border-white/30" />

        <div className="text-center space-y-6 max-w-3xl mx-auto">
          {/* Status badge */}
          <div
            className="inline-flex items-center gap-2 px-3 py-1 border border-[#F2C94C] text-[#F2C94C] rounded"
            style={{ fontSize: "0.65rem", letterSpacing: "0.05em", textTransform: "uppercase" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#F2C94C]" />
            Currently: AI Infrastructure @ Overdrive
          </div>

          {/* Heading */}
          <h1
            className="font-bold leading-tight"
            style={{ fontSize: "clamp(1.875rem, 4vw, 3rem)" }}
          >
            <span className="text-white">&quot;STARTUPS DON&apos;T FAIL AT CODE.</span>
            <br />
            <span className="text-gray-500">THEY FAIL AT SYSTEMS.&quot;</span>
          </h1>

          {/* Subline */}
          <p className="text-gray-400 max-w-xl mx-auto text-sm md:text-base">
            Scaling technical infrastructure for high-growth ventures. Building AI architecture at{" "}
            <a
              href="https://enteroverdrive.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-[#F2C94C] transition-colors duration-200"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.3)" }}
            >
              Overdrive
            </a>
            .
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <a
              href="https://cal.com/konandev"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded font-bold text-xs hover:bg-[#F2C94C] transition-colors duration-200"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              INITIATE_CONTACT()
              <span>→</span>
            </a>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-white rounded text-xs hover:bg-white/5 transition-colors duration-200"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              VIEW_LOGS →
            </Link>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="px-2">
        <div className="flex justify-between items-end mb-6 max-w-5xl">
          <h2 className="text-xs font-bold tracking-widest text-gray-500">CAPABILITIES_MATRIX</h2>
          <span
            className="text-gray-600"
            style={{ fontSize: "0.65rem", letterSpacing: "0.05em", textTransform: "uppercase" }}
          >
            6 MODULES LOADED
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 border border-white/10 max-w-5xl">
          {capabilities.map((cap) => (
            <div
              key={cap.title}
              className="bg-black p-6 hover:bg-[#0A0A0A] transition-colors group relative"
            >
              <div className="absolute top-0 left-0 w-1 h-1 bg-[#F2C94C] opacity-0 group-hover:opacity-100 transition-opacity" />
              <h3 className="text-sm font-bold mb-2 text-white group-hover:text-[#F2C94C] transition-colors">
                {cap.title}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">{cap.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section className="px-2">
        <div className="flex justify-between items-end mb-6 max-w-5xl">
          <h2 className="text-xs font-bold tracking-widest text-gray-500">PROJECT_FILES</h2>
          <span
            className="text-gray-600"
            style={{ fontSize: "0.65rem", letterSpacing: "0.05em", textTransform: "uppercase" }}
          >
            DIR: /PUBLIC/WORK
          </span>
        </div>

        <div className="space-y-3 max-w-5xl">
          {projects.map((project, index) => (
            <div key={project.name} className="t-hover-target relative group block">
              <div
                className="p-5 md:p-6 rounded-lg md:flex justify-between items-center group-hover:bg-white/5 transition-colors"
                style={{
                  background: "rgba(18, 18, 18, 0.85)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                <div className="flex items-start gap-4">
                  <div className="text-xs text-gray-600 font-mono pt-0.5 w-5">0{index + 1}</div>
                  <div>
                    <h3 className="text-base md:text-lg font-bold mb-1 text-white">
                      {project.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3">{project.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="border border-white/10 px-2 py-0.5 rounded text-gray-400 bg-black/50"
                          style={{
                            fontSize: "0.6rem",
                            letterSpacing: "0.05em",
                            textTransform: "uppercase",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 flex items-center justify-end pl-4">
                  <span className="text-xs text-gray-500 group-hover:text-[#F2C94C] transition-colors duration-200">
                    ACCESS →
                  </span>
                </div>
              </div>

              {/* Focus brackets */}
              <div className="t-focus-bracket t-focus-bracket-tl" />
              <div className="t-focus-bracket t-focus-bracket-tr" />
              <div className="t-focus-bracket t-focus-bracket-bl" />
              <div className="t-focus-bracket t-focus-bracket-br" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
