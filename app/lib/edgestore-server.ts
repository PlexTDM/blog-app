// lib/edgestore-server.ts (FOR BACKEND USE ONLY)
import { initEdgeStore } from "@edgestore/server";
import { createEdgeStoreNextHandler } from "@edgestore/server/adapters/next/app";
import { initEdgeStoreClient } from "@edgestore/server/core";

const es = initEdgeStore.create();

export const edgeStoreRouter = es.router({
  publicFiles: es.fileBucket(),
  publicImages: es.imageBucket({
    maxSize: 5 * 1024 * 1024,
    accept: ["image/*"],
  }),
});

export const handler = createEdgeStoreNextHandler({
  router: edgeStoreRouter,
});

// Backend client (for API routes)
export const backendClient = initEdgeStoreClient({
  router: edgeStoreRouter,
});

export type EdgeStoreRouter = typeof edgeStoreRouter;
