import { about, person } from "@/resources";
import { type ContentChunk, upsertContent } from "./vector";

const portfolioContent: ContentChunk[] = [
  {
    id: "about-1",
    content: `${person.name} is a ${person.role}. They have extensive experience across AI, fintech, and Web3. Currently working at Overdrive building AI infrastructure for venture capital. Open to new engagements.`,
    source: "about",
    type: "about",
  },
  {
    id: "about-2",
    content: `Technologies: TypeScript, React, Next.js, Node.js, Python, LangChain, RAG Pipelines, Vector Databases, AWS, Docker, Kubernetes, Solidity, Rust. Full-stack engineer with AI/ML expertise.`,
    source: "about",
    type: "about",
  },
  {
    id: "about-3",
    content: `8+ years of experience building AI infrastructure, fintech systems processing millions monthly, recruiting platforms, cross-chain trading systems, and Web3 applications. Each built for scale from day one, still running in production.`,
    source: "about",
    type: "about",
  },
  {
    id: "work-1",
    content: `Currently: Senior Product Engineer & AI Architect at Clive AI (Juno HR). Building AI for venture capital.`,
    source: "about",
    type: "about",
  },
  {
    id: "work-2",
    content: `Experience includes AI infrastructure for venture capital, recruiting platforms, cross-chain trading systems, fintech processing millions monthly.`,
    source: "about",
    type: "about",
  },
  {
    id: "philosophy-1",
    content: `Philosophy: Startups don't fail at code. They fail at systems. Specializes in full-stack development from frontend to infrastructure, mobile to blockchain.`,
    source: "about",
    type: "about",
  },
  {
    id: "philosophy-2",
    content: `Approach: One engineer instead of three hires. Frontend, backend, infra, and AI under one roof. Production-grade from the first deploy. Async, fast, no hand-holding required.`,
    source: "about",
    type: "about",
  },
  {
    id: "contact-1",
    content: `Schedule a call at cal.com/konandev. Email: ${person.email}. Available for new engagements.`,
    source: "about",
    type: "about",
  },
];

async function ingest() {
  console.log("Ingesting content into vector database...");

  try {
    await upsertContent(portfolioContent);
    console.log("Successfully ingested", portfolioContent.length, "chunks");
  } catch (error) {
    console.error("Ingestion failed:", error);
    process.exit(1);
  }
}

ingest();
