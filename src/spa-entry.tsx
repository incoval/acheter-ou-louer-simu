/**
 * Pure SPA entry used only by the GitHub Pages build.
 * Lovable's preview continues to use TanStack Start (SSR) — this file is
 * only loaded by the static index.html generated in scripts/build-spa.mjs.
 */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import "./styles.css";

const basepath = (import.meta.env.VITE_BASE_PATH as string | undefined)?.replace(/\/$/, "") || "/";

const router = createRouter({
  routeTree,
  basepath,
  defaultPreload: "intent",
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const container = document.getElementById("root");
if (container) {
  createRoot(container).render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
}
