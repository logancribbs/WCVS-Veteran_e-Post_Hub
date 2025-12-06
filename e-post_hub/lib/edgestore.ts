"use client";

import { createEdgeStoreProvider } from "@edgestore/react";

// Local provider + hook for client-side uploads.
// No global layout change required if you wrap the page locally.
export const { EdgeStoreProvider, useEdgeStore } = createEdgeStoreProvider();
