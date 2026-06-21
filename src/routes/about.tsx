import { createFileRoute } from "@tanstack/react-router";
import About from "@/pages/About";
import { about } from "@/resources";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: about.title },
      { name: "description", content: about.description },
    ],
  }),
  component: About,
});
