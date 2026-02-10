"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

interface PdfViewerProps {
  fileUrl: string;
  containerHeight?: number;
}

export default function PdfViewer({ fileUrl, containerHeight }: PdfViewerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const heightPx = useMemo(() => containerHeight ?? 400, [containerHeight]);

  useEffect(() => {
    if (!containerRef.current) return;

    const el = containerRef.current;
    const update = () => setContainerWidth(el.getBoundingClientRect().width);
    update();

    const ro = new ResizeObserver(() => update());
    ro.observe(el);

    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function renderPdfPreview(url: string, boxW: number, boxH: number) {
      try {
        setError(null);
        setThumbnail(null);

        // Wait until we know our container size.
        if (!boxW || boxW <= 0) return;

        const loadingTask = pdfjs.getDocument(url);
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);

        // Base viewport at scale=1 for dimensions.
        const vp1 = page.getViewport({ scale: 1 });

        // CONTAIN scale (fits entire page within the box; no cropping).
        const containScale = Math.min(boxW / vp1.width, boxH / vp1.height);

        // Render sharper on high-DPI screens.
        const dpr =
          typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;

        const renderScale = containScale * dpr;
        const viewport = page.getViewport({ scale: renderScale });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (!context) return;

        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);

        await page.render({ canvasContext: context, viewport }).promise;
        if (cancelled) return;

        setThumbnail(canvas.toDataURL("image/png"));
      } catch (e) {
        console.error("Failed to render PDF preview", e);
        if (cancelled) return;
        setError("Unable to preview PDF");
      }
    }

    renderPdfPreview(fileUrl, containerWidth, heightPx);

    return () => {
      cancelled = true;
    };
  }, [fileUrl, containerWidth, heightPx]);

  return (
    <div
      ref={containerRef}
      style={{
        height: heightPx,
        width: "100%",
        overflow: "hidden",
        borderRadius: "8px",
      }}
    >
      {thumbnail ? (
        <img
          src={thumbnail}
          alt="PDF Preview"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            objectPosition: "center",
            display: "block",
          }}
        />
      ) : error ? (
        <div className="w-full h-full flex items-center justify-center text-sm text-red-500">
          {error}
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">
          Loading...
        </div>
      )}
    </div>
  );
}
