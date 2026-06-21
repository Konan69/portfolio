import { createFileRoute } from "@tanstack/react-router";
import Work from "@/pages/Work";
import { person } from "@/resources";

export const Route = createFileRoute("/work/")({
  head: () => ({
    meta: [
      { title: "Work" },
      { name: "description", content: `Projects and experience by ${person.name}` },
    ],
  }),
  component: Work,
});
