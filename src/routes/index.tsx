import { createFileRoute } from "@tanstack/react-router";
import Home from "@/pages/Home";
import { home } from "@/resources";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: home.title },
      { name: "description", content: home.description },
    ],
  }),
  component: Home,
});
