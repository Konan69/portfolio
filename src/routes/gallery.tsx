import { createFileRoute } from "@tanstack/react-router";
import Gallery from "@/pages/Gallery";
import { gallery } from "@/resources";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: gallery.title },
      { name: "description", content: gallery.description },
    ],
  }),
  component: Gallery,
});
