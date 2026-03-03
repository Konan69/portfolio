import type { About, Blog, Gallery, Home, Newsletter, Person, Social, Work } from "@/types";
import { Line, Row, Text } from "@once-ui-system/core";

const person: Person = {
  firstName: "Suleman",
  lastName: "Mualim",
  name: "Suleman Mualim",
  role: "Senior Product Engineer & AI Architect",
  avatar: "/images/avatar.png",
  email: "kixeyems0@gmail.com",
  location: "Etc/UTC",
  languages: ["English"],
};

const newsletter: Newsletter = {
  display: false,
  title: <>Build with {person.firstName}</>,
  description: <>Dispatches on AI infrastructure, web3, and side experiments.</>,
};

const social: Social = [
  // Set essentials: true for links you want to show on the about page
  {
    name: "GitHub",
    icon: "github",
    link: "https://github.com/Konan69/",
    essential: true,
  },
  {
    name: "LinkedIn",
    icon: "linkedin",
    link: "https://www.linkedin.com/in/Konandev/",
    essential: true
  },
  {
    name: "Email",
    icon: "email",
    link: `mailto:${person.email}`,
    essential: true,
  },
];

const home: Home = {
  path: "/",
  image: "/images/og/home.jpg",
  label: "Home",
  title: `${person.name}'s Portfolio`,
  description: `Portfolio website showcasing my work as a ${person.role}`,
  headline: <>Shipping AI-native platforms for recruiting, trading, and payments</>,
  featured: {
    display: true,
    title: (
      <Row gap="12" vertical="center">
        <strong className="ml-4">Athena.chat</strong>{" "}
        <Line background="brand-alpha-strong" vert height="20" />
        <Text marginRight="4" onBackground="brand-medium">
          In progress
        </Text>
      </Row>
    ),
    href: "/work/athena-chat-ai-agent-platform",
  },
  subline: (
    <>
      I'm Suleman, a full-stack engineer specializing in AI-powered systems and high-performance
      infrastructure. Built and scaled fintech, recruiting, and Web3 products using microservices,
      LLM orchestration, and distributed systems that cut costs while improving performance.
    </>
  ),
};

const about: About = {
  path: "/about",
  label: "About",
  title: `About – ${person.name}`,
  description: `Meet ${person.name}, ${person.role}`,
  tableOfContent: {
    display: true,
    subItems: false,
  },
  avatar: {
    display: true,
  },
  calendar: {
    display: true,
    link: "https://cal.com/konandev",
  },
  intro: {
    display: true,
    title: "Introduction",
    description: (
      <>
        Full-stack engineer specializing in AI-powered products, payments infrastructure, and
        distributed systems. I build high-leverage platforms that blend microservices architecture,
        LLM orchestration, and resilient DevOps so teams can deliver faster with tighter budgets.
      </>
    ),
  },
  work: {
    display: true,
    title: "Work Experience",
    experiences: [
      {
        company: "Clive AI (Juno HR)",
        timeframe: "Jun 2025 – Present",
        role: "Senior Product Engineer & AI Architect",
        achievements: [
          <>Redesigned the AI processing platform to handle 1,000+ concurrent requests, 28× faster processing, and 99.8% uptime while saving $10K per year.</>,
          <>Guided technical product strategy across five service integrations, mentoring four engineers and speeding delivery by 35%.</>,
          <>Built microservice-based React + Node.js systems with Docker and PostgreSQL that deliver &lt;200 ms response times to 50K+ MAU.</>,
          <>Shipped revenue-focused features that trimmed churn by 18% and unlocked $30K in recurring revenue.</>,
          <>Implemented observability pipelines with automated alerts that detect bottlenecks 70% faster and avoid $10K/month outages.</>,
        ],
        images: [],
      },
      {
        company: "Clive AI",
        timeframe: "Oct 2024 – Jun 2025",
        role: "Backend & Infrastructure Engineer",
        achievements: [
          <>Scaled fintech infrastructure for 5M+ monthly transactions, cutting latency by 60% and adding $5M annual volume.</>,
          <>Designed Node.js, Go, and Python microservices that improved system resilience by 50% and reduced incident recovery time by 35%.</>,
          <>Built a recursive web scraper spanning 10K+ sources, boosting data accuracy 35% and saving 120+ engineering hours monthly.</>,
          <>Optimized RAG pipelines with smarter indexing and caching to improve retrieval efficiency 40% and cut API spend by $2K per month.</>,
          <>Automated GCP deployments with CI/CD for daily releases and 80% less downtime.</>,
        ],
        images: [],
      },
      {
        company: "Fusion Block Labs",
        timeframe: "Nov 2023 – Oct 2024",
        role: "Lead Software Engineer",
        achievements: [
          <>Built cross-chain execution modules in Rust and Go that improved arbitrage routing 30% and processed $3.2M monthly volume.</>,
          <>Directed development of an AI contract-audit agent that uncovered 900+ vulnerabilities and cut turnaround time 65%.</>,
          <>Launched community management agents with RAG pipelines across Telegram and Discord, boosting engagement 40%.</>,
          <>Deployed Kubernetes/Docker infrastructure that scaled to 1,200+ containers with zero-downtime rollouts.</>,
          <>Architected high-availability NestJS and Go backends sustaining 99.9% uptime across 20M+ daily requests.</>,
        ],
        images: [],
      },
      {
        company: "HNG Tech",
        timeframe: "Jul 2023 – Oct 2023",
        role: "Backend Software Engineer Intern",
        achievements: [
          <>Ranked in the top 1% of 20,000+ participants for AI and backend leadership.</>,
          <>Coordinated a 60-member cohort to ship "AI for Homework," supporting 10K+ students in beta.</>,
          <>Optimized OpenRouter-based LLM personas via prompt tuning, caching, and ranking to boost efficiency 35%.</>,
          <>Architected a multi-tenant NestJS + PostgreSQL backend for a reusable SaaS boilerplate.</>,
          <>Implemented RAG pipelines to deliver 35% faster knowledge retrieval with 28% better response relevance.</>,
        ],
        images: [],
      },
      {
        company: "Light Alpha Dao",
        timeframe: "Dec 2021 – Aug 2023",
        role: "Full-Stack Software Developer",
        achievements: [
          <>Architected gas-optimized smart contracts that reduced transaction costs 35% and enabled ~$0.01 microtransactions across EVM and L2.</>,
          <>Scaled marketing and loyalty systems to power token airdrops and analytics that increased engagement and campaign revenue.</>,
          <>Deployed ERC-20/721 contracts with referral logic powering 50K+ active wallets and 2.4× more daily transactions.</>,
          <>Built Express.js + MongoDB APIs supporting 150K requests per day with 99.9% uptime.</>,
        ],
        images: [],
      },
    ],
  },
  studies: {
    display: true,
    title: "Education",
    institutions: [
      {
        name: "Afe Babalola University",
        description: <>B.Eng. Mechanical Engineering.</>,
      },
    ],
  },
  technical: {
    display: true,
    title: "Technical Skills",
    skills: [
      {
        title: "Frontend & Product Engineering",
        description: (
          <>React, Next.js, TypeScript, Tailwind CSS, Shadcn UI, React Native (Expo), HTML, CSS.</>
        ),
        tags: [
          { name: "React" },
          { name: "Next.js", icon: "nextjs" },
          { name: "TypeScript", icon: "javascript" },
        ],
      },
      {
        title: "Backend & Infrastructure",
        description: (
          <>Node.js, Go, Rust, Python, PostgreSQL, MySQL, MongoDB, REST APIs, TRPC, AWS, microservices.</>
        ),
        tags: [
          { name: "Node.js", icon: "javascript" },
          { name: "Go" },
          { name: "Rust" },
          { name: "PostgreSQL" },
        ],
      },
      {
        title: "AI Systems",
        description: (
          <>LangChain, LangGraph, PydanticAI, OpenAI/OpenRouter tooling, intelligent RAG pipelines, LLM orchestration.</>
        ),
        tags: [
          { name: "LangChain" },
          { name: "LangGraph" },
          { name: "PydanticAI" },
        ],
      },
      {
        title: "Blockchain Engineering",
        description: (
          <>Solidity, Hardhat, Foundry, Anchor, viem/web3.js, contract automation, cross-chain execution.</>
        ),
        tags: [
          { name: "Solidity" },
          { name: "Hardhat" },
          { name: "Foundry" },
        ],
      },
      {
        title: "Testing, Ops & Deployment",
        description: (
          <>Jest, Docker, Kubernetes, CI/CD, AWS, GCP, Linux administration, production monitoring.</>
        ),
        tags: [
          { name: "Docker" },
          { name: "Kubernetes" },
          { name: "AWS" },
        ],
      },
    ],
  },
};

const blog: Blog = {
  path: "/blog",
  label: "Blog",
  title: "Writing about AI systems, infra, and design...",
  description: `Read what ${person.name} has been exploring recently`,
};

const work: Work = {
  path: "/work",
  label: "Work",
  title: `Projects – ${person.name}`,
  description: `AI, infra, and product experiments by ${person.name}`,
};

const gallery: Gallery = {
  path: "/gallery",
  label: "Gallery",
  title: `Photo gallery – ${person.name}`,
  description: `A photo collection by ${person.name}`,
  images: [
    {
      src: "/images/gallery/horizontal-1.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-4.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/horizontal-3.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-1.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/vertical-2.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/horizontal-2.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/horizontal-4.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-3.jpg",
      alt: "image",
      orientation: "vertical",
    },
  ],
};

export { person, social, newsletter, home, about, blog, work, gallery };
