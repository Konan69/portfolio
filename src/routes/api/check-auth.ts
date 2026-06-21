import { createFileRoute } from "@tanstack/react-router";
import * as cookie from "cookie";

export const Route = createFileRoute("/api/check-auth")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const cookieHeader = request.headers.get("cookie") || "";
        const cookies = cookie.parse(cookieHeader);

        if (cookies.authToken === "authenticated") {
          return Response.json({ authenticated: true }, { status: 200 });
        }

        return Response.json({ authenticated: false }, { status: 401 });
      },
    },
  },
});
