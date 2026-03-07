"use client";

import { person, about } from "@/resources";

export const TerminalAbout = () => {
  // Flatten all skill tags into a single list like the design
  const allSkillTags = about.technical.skills.flatMap(
    (skill) => skill.tags?.map((tag) => tag.name) ?? [],
  );

  return (
    <div className="space-y-12">
      {/* Bio header — 12-col grid matching design */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-8 border-b border-white/10 pb-12 mx-4 md:mx-0">
        <div className="md:col-span-4">
          <div className="aspect-square bg-[#111] rounded-lg border border-white/10 flex items-center justify-center relative overflow-hidden">
            {/* Abstract avatar wireframe */}
            <div className="absolute inset-0 grid grid-cols-8 grid-rows-8">
              <div className="col-start-3 col-end-7 row-start-2 row-end-6 border border-white/20 rounded-full" />
              <div className="col-start-2 col-end-8 row-start-6 row-end-9 border-t border-white/20 rounded-t-full" />
            </div>
            <div
              className="absolute bottom-4 left-4 bg-black px-2 py-1 rounded border border-white/20"
              style={{ fontSize: "0.65rem", letterSpacing: "0.05em", textTransform: "uppercase" }}
            >
              IMG_8992.RAW
            </div>
          </div>
        </div>
        <div className="md:col-span-8 space-y-6">
          <h1 className="text-3xl font-bold">ONE-PERSON ENGINEERING TEAM</h1>
          <p className="text-gray-400 text-sm leading-relaxed max-w-2xl">
            I operate at the intersection of systems engineering and product
            strategy. My philosophy is simple: complex problems do not require
            complex code&mdash;they require robust mental models. I specialize
            in taking 0 to 1 products to market with a focus on AI-driven
            architectures.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
            <div className="border-l border-[#F2C94C] pl-3">
              <div
                className="text-gray-500 mb-1"
                style={{ fontSize: "0.65rem", letterSpacing: "0.05em", textTransform: "uppercase" }}
              >
                LOCATION
              </div>
              <div className="text-sm">{person.location}</div>
            </div>
            <div className="border-l border-gray-700 pl-3">
              <div
                className="text-gray-500 mb-1"
                style={{ fontSize: "0.65rem", letterSpacing: "0.05em", textTransform: "uppercase" }}
              >
                FOCUS
              </div>
              <div className="text-sm">AI / Infra</div>
            </div>
            <div className="border-l border-gray-700 pl-3">
              <div
                className="text-gray-500 mb-1"
                style={{ fontSize: "0.65rem", letterSpacing: "0.05em", textTransform: "uppercase" }}
              >
                EXP
              </div>
              <div className="text-sm">8 Years</div>
            </div>
            <div className="border-l border-gray-700 pl-3">
              <div
                className="text-gray-500 mb-1"
                style={{ fontSize: "0.65rem", letterSpacing: "0.05em", textTransform: "uppercase" }}
              >
                STATUS
              </div>
              <div className="text-sm text-[#27AE60]">Online</div>
            </div>
          </div>
        </div>
      </section>

      {/* Runtime history */}
      {about.work.display && (
        <section className="px-2">
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-xs font-bold tracking-widest text-gray-500">
              RUNTIME_HISTORY
            </h2>
            <span
              className="text-gray-600"
              style={{ fontSize: "0.65rem", letterSpacing: "0.05em", textTransform: "uppercase" }}
            >
              SORT: DESC
            </span>
          </div>

          <div className="border border-white/10 bg-[#0A0A0A] rounded-lg overflow-hidden">
            {/* Table header */}
            <div
              className="grid grid-cols-12 gap-4 px-5 py-3 bg-white/5 border-b border-white/10 text-gray-500 font-bold uppercase"
              style={{ fontSize: "0.65rem", letterSpacing: "0.05em" }}
            >
              <div className="col-span-3">Duration</div>
              <div className="col-span-3">Entity</div>
              <div className="col-span-4">Role</div>
              <div className="col-span-2 text-right">Tech</div>
            </div>

            {about.work.experiences.map((exp) => (
              <div
                key={`${exp.company}-${exp.timeframe}`}
                className="grid grid-cols-12 gap-4 px-5 py-5 border-b border-white/5 hover:bg-white/5 transition-colors items-center text-sm"
              >
                <div className="col-span-3 text-gray-500 text-xs">
                  {exp.timeframe}
                </div>
                <div className="col-span-3 font-bold text-white">
                  {exp.company}
                </div>
                <div className="col-span-4 text-gray-400">{exp.role}</div>
                <div className="col-span-2 text-right">
                  <span
                    className="border border-white/10 px-1.5 py-0.5 rounded text-gray-500"
                    style={{ fontSize: "0.65rem", letterSpacing: "0.05em", textTransform: "uppercase" }}
                  >
                    {exp.company.split(" ")[0].toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills + Education — flat tag layout like the design */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 px-2 pb-12">
        {about.technical.display && (
          <div>
            <h2 className="text-xs font-bold tracking-widest text-gray-500 mb-4">
              SKILL_SET
            </h2>
            <div className="flex flex-wrap gap-2">
              {allSkillTags.map((tag) => (
                <span
                  key={tag}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded text-xs text-gray-300 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {about.studies.display && (
          <div>
            <h2 className="text-xs font-bold tracking-widest text-gray-500 mb-4">
              EDUCATION
            </h2>
            {about.studies.institutions.map((inst) => (
              <div
                key={inst.name}
                className="bg-[#0A0A0A] border border-white/10 p-4 rounded mb-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm font-bold">{inst.name}</div>
                    <div className="text-xs text-gray-500">
                      {inst.description}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
