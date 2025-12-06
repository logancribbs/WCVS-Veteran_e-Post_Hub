// app/api/edgestore/route.ts
import { initEdgeStore } from "@edgestore/server";
import { createEdgeStoreNextHandler } from "@edgestore/server/adapters/next/app";

// Create instance
const es = initEdgeStore.create();

// Configure buckets; allow images + PDFs
const edgeStoreRouter = es.router({
  myPublicImages: es.fileBucket({
    // optional constraints; uncomment if you want limits
    // maxSize: "10MB",
    // acceptedMimeTypes: ["image/*", "application/pdf"],
  }),
});

// Build handler
const handler = createEdgeStoreNextHandler({
  router: edgeStoreRouter,
});

export { handler as GET, handler as POST };
export type EdgeStoreRouter = typeof edgeStoreRouter;
