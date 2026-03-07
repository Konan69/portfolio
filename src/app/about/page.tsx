import { baseURL, about, person } from "@/resources";
import { AboutSwitch } from "@/components/AboutSwitch";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: about.title,
  description: about.description,
};

export default function About() {
  // TODO: Rebuild Renaissance about with shadcn/Tailwind
  const renaissanceContent = (
    <div className="max-w-3xl mx-auto px-6 py-24">
      <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>
        {person.name}
      </h1>
      <p className="text-lg opacity-70" style={{ fontFamily: "var(--font-body)" }}>
        {person.role}
      </p>
    </div>
  );

  return <AboutSwitch renaissance={renaissanceContent} />;
}
