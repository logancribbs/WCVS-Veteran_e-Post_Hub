"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

interface PdfViewerProps {
  fileUrl: string;
  containerHeight?: number;
  altText?: string;
}

export default function PdfPreview({
  fileUrl,
  containerHeight,
  altText,
}: PdfViewerProps) {
export default function PdfViewer({ fileUrl, containerHeight }: PdfViewerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const heightPx = useMemo(() => containerHeight ?? 400, [containerHeight]);

  useEffect(() => {
    if (!containerRef.current) return;

    const viewport = page.getViewport({ scale: 0.5 }); // scale for image size
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const el = containerRef.current;
    const update = () => setContainerWidth(el.getBoundingClientRect().width);
    update();

    const ro = new ResizeObserver(() => update());
    ro.observe(el);

      const imageUrl = canvas.toDataURL();
      setThumbnail(imageUrl);
    }
  };
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function renderPdfPreview(url: string, boxW: number, boxH: number) {
      try {
        setError(null);
        setThumbnail(null);

        if (!boxW || boxW <= 0) return;

        const loadingTask = pdfjs.getDocument(url);
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);

        const vp1 = page.getViewport({ scale: 1 });

        const containScale = Math.min(boxW / vp1.width, boxH / vp1.height);

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
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "10px",
      }}
    >
      {thumbnail ? (
        <img
          src={thumbnail}
          alt="PDF Preview"
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            width: "auto",
            height: "auto",
            display: "block",

            border: "2px solid rgba(0, 0, 0, 0.65)",
            borderRadius: "6px",
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
