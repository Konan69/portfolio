import { createFileRoute } from "@tanstack/react-router";
import * as cookie from "cookie";

export const Route = createFileRoute("/api/authenticate")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.json() as { password?: string };
        const correctPassword = process.env.PAGE_ACCESS_PASSWORD;

        if (!correctPassword) {
          console.error("PAGE_ACCESS_PASSWORD environment variable is not set");
          return Response.json({ message: "Internal server error" }, { status: 500 });
        }

        if (body.password === correctPassword) {
          return Response.json(
            { success: true },
            {
              status: 200,
              headers: {
                "Set-Cookie": cookie.serialize("authToken", "authenticated", {
                  httpOnly: true,
                  secure: process.env.NODE_ENV === "production",
                  maxAge: 60 * 60,
                  sameSite: "strict",
                  path: "/",
                }),
              },
            },
          );
        }

        return Response.json({ message: "Incorrect password" }, { status: 401 });
      },
    },
  },
});
