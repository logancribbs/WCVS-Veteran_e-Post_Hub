"use client";

import React, { useEffect, useState } from "react";
import { pdfjs } from "react-pdf";

// Use a worker served from /public to avoid Webpack/Terser issues on Vercel.
// This file will be created at build/install time by scripts/copy-pdf-worker.mjs
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

interface PdfViewerProps {
  fileUrl: string;
  containerHeight?: number;
}

export default function PdfPreview({ fileUrl, containerHeight }: PdfViewerProps) {
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  const renderPdfThumbnail = async (url: string) => {
    const loadingTask = pdfjs.getDocument(url);
    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(1);

    const viewport = page.getViewport({ scale: 0.5 });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) return;

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({ canvasContext: context, viewport }).promise;

    setThumbnail(canvas.toDataURL());
  };

  useEffect(() => {
    setThumbnail(null);
    renderPdfThumbnail(fileUrl);
  }, [fileUrl]);

  return (
    <div style={{ height: containerHeight || 400, overflow: "hidden" }}>
      {thumbnail ? (
        <img
          src={thumbnail}
          alt="PDF Thumbnail"
          style={{ width: "100%", height: "auto", borderRadius: "8px" }}
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
