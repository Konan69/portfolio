"use client";

import Link from "next/link";

const capabilities = [
  { title: "AI ENGINEERING", desc: "LLM Orchestration, RAG Pipelines, Vector DBs, Fine-tuning models." },
  { title: "FULL STACK WEB", desc: "React/Next.js, Vue, Node.js, TypeScript, WebAssembly." },
  { title: "CLOUD INFRA", desc: "AWS, Docker, Kubernetes, Terraform, Serverless Architectures." },
  { title: "SYSTEM ARCHITECTURE", desc: "Microservices, Event-driven systems, High-availability design." },
  { title: "WEB3 / BLOCKCHAIN", desc: "Smart Contracts (Solidity), dApps, IPFS integration." },
  { title: "MOBILE DEV", desc: "React Native, Flutter, Native iOS/Android bridges." },
];

const projects = [
  { name: "Athena.chat", desc: "Enterprise RAG conversational agent for legal discovery.", tags: ["PYTHON", "OPENAI", "PINECONE"] },
  { name: "Galaxy Quest", desc: "DeFi visualization dashboard tracking $50M+ TVL.", tags: ["WEB3", "D3.JS", "REACT"] },
  { name: "x402 Demo", desc: "Experimental WebGL portfolio engine with physics.", tags: ["THREE.JS", "GLSL"] },
];

export const TerminalHome = () => {
  return (
    <div className="space-y-12">
      {/* Hero — generous vertical padding to match design */}
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

        <div className="text-center space-y-6">
          <div
            className="inline-block px-3 py-1 border border-[#F2C94C] text-[#F2C94C] rounded mb-4"
            style={{ fontSize: "0.65rem", letterSpacing: "0.05em", textTransform: "uppercase" }}
          >
            &#9888; SYSTEM OPTIMIZATION REQUIRED
          </div>
          <h1
            className="font-bold leading-tight max-w-3xl mx-auto"
            style={{ fontSize: "clamp(1.875rem, 4vw, 3rem)" }}
          >
            &quot;MOST STARTUPS DON&apos;T FAIL AT CODE.
            <br />
            <span className="text-gray-500">THEY FAIL AT SYSTEMS.&quot;</span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto text-sm md:text-base">
            Scaling technical infrastructure for high-growth ventures.
            Currently deploying AI architecture at{" "}
            <a
              href="https://enteroverdrive.com"
              target="_blank"
              rel="noopener noreferrer"
              data-t-link=""
              style={{
                color: "#FFFFFF",
                borderBottom: "1px solid rgba(255,255,255,0.3)",
                paddingBottom: "2px",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#F2C94C")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#FFFFFF")}
            >
              Overdrive
            </a>
            .
          </p>

          <div style={{ paddingTop: "2rem", display: "flex", justifyContent: "center", gap: "1rem" }}>
            <a
              href="https://cal.com/konandev"
              target="_blank"
              rel="noopener noreferrer"
              data-t-btn="primary"
              style={{
                background: "#FFFFFF",
                color: "#000000",
                padding: "12px 24px",
                borderRadius: "6px",
                fontSize: "0.75rem",
                fontWeight: 700,
                fontFamily: "'JetBrains Mono', monospace",
                textDecoration: "none",
                transition: "background 0.2s",
                display: "inline-block",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#F2C94C")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#FFFFFF")}
            >
              INITIATE_CONTACT()
            </a>
            <Link
              href="/about?theme=terminal"
              data-t-btn="secondary"
              style={{
                border: "1px solid rgba(255,255,255,0.2)",
                color: "#FFFFFF",
                padding: "12px 24px",
                borderRadius: "6px",
                fontSize: "0.75rem",
                fontWeight: 700,
                fontFamily: "'JetBrains Mono', monospace",
                textDecoration: "none",
                transition: "background 0.2s",
                display: "inline-block",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              VIEW_LOGS
            </Link>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="px-2">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-xs font-bold tracking-widest text-gray-500">
            CAPABILITIES_MATRIX
          </h2>
          <span
            className="text-gray-600"
            style={{ fontSize: "0.65rem", letterSpacing: "0.05em", textTransform: "uppercase" }}
          >
            6 MODULES LOADED
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 border border-white/10">
          {capabilities.map((cap) => (
            <div
              key={cap.title}
              className="bg-black p-6 hover:bg-[#0A0A0A] transition-colors group relative overflow-hidden"
            >
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-[#F2C94C] text-xs">
                &#9679;
              </div>
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
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-xs font-bold tracking-widest text-gray-500">
            PROJECT_FILES
          </h2>
          <span
            className="text-gray-600"
            style={{ fontSize: "0.65rem", letterSpacing: "0.05em", textTransform: "uppercase" }}
          >
            DIR: /PUBLIC/WORK
          </span>
        </div>

        <div className="space-y-4">
          {projects.map((project, index) => (
            <div key={project.name} className="t-hover-target relative group block">
              <div
                className="p-6 rounded-lg md:flex justify-between items-center group-hover:bg-white/5 transition-colors"
                style={{
                  background: "rgba(18, 18, 18, 0.85)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                <div className="flex items-start gap-4">
                  <div className="text-xs text-gray-600 pt-1">0{index + 1}</div>
                  <div>
                    <h3 className="text-lg font-bold mb-1">{project.name}</h3>
                    <p className="text-sm text-gray-400 mb-3">{project.desc}</p>
                    <div className="flex gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="border border-white/10 px-2 py-0.5 rounded text-gray-400 bg-black/50"
                          style={{ fontSize: "0.65rem", letterSpacing: "0.05em", textTransform: "uppercase" }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 flex items-center justify-end">
                  <span className="text-xs group-hover:text-[#F2C94C] transition-colors">
                    ACCESS &#8599;
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
