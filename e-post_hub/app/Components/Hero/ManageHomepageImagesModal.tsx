"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useEdgeStore } from "@/lib/edgestore";

type ManageHomepageImagesModalProps = {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  onSaved: (images: string[]) => void;
};

export default function ManageHomepageImagesModal({
  isOpen,
  onClose,
  images,
  onSaved,
}: ManageHomepageImagesModalProps) {
  const { edgestore } = useEdgeStore();

  const [editingImages, setEditingImages] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setEditingImages(images);
      setMessage("");
    }
  }, [isOpen, images]);

  if (!isOpen) return null;

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setMessage("Uploading images...");

    try {
      const uploadedUrls: string[] = [];

      for (const file of Array.from(files)) {
        const response = await edgestore.myPublicImages.upload({
          file,
          input: {},
        });

        uploadedUrls.push(response.url);
      }

      setEditingImages((prev) => [...prev, ...uploadedUrls]);
      setMessage("Images uploaded.");
    } catch {
      setMessage("Failed to upload images.");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const handleDelete = (index: number) => {
    setEditingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (editingImages.length === 0) {
      setMessage("Please keep at least one image.");
      return;
    }

    setIsSaving(true);
    setMessage("Saving changes...");

    try {
      const response = await fetch("/api/slideshow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ images: editingImages }),
      });

      if (!response.ok) {
        throw new Error("Failed to save images.");
      }

      onSaved(editingImages);
      setMessage("");
      onClose();
    } catch {
      setMessage("Failed to save images.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-4xl rounded-2xl border-2 border-black/70 bg-[#f7f1e8] shadow-[0_6px_16px_rgba(0,0,0,0.35)]">
        <div className="border-b border-black/20 px-6 py-4">
          <h2 className="text-2xl font-semibold text-black">
            Manage Homepage Images
          </h2>
          <p className="mt-1 text-sm text-black/70">
            Upload, remove, and save the images used in the sidebar slideshow.
          </p>
        </div>

        <div className="max-h-[65vh] overflow-y-auto p-6">
          {message && (
            <div className="mb-4 rounded-lg border border-black/20 bg-white px-4 py-3 text-sm text-black">
              {message}
            </div>
          )}

          <div className="mb-6">
            <label className="mb-2 block text-sm font-semibold text-black">
              Upload Images
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleUpload}
              disabled={isUploading || isSaving}
              className="block w-full rounded-lg border border-black/20 bg-white p-3 text-sm text-black"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {editingImages.map((imageUrl, index) => (
              <div
                key={`${imageUrl}-${index}`}
                className="rounded-xl border border-black/20 bg-white p-4 shadow-sm"
              >
                <div className="relative w-full aspect-[4/3] overflow-hidden rounded-lg border border-gray-300">
                  <Image
                    src={imageUrl}
                    alt={`Slideshow image ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-cover"
                    unoptimized
                  />
                </div>

                <div className="mt-3 flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-black">
                    Image {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDelete(index)}
                    disabled={isUploading || isSaving}
                    className="rounded-lg border border-red-300 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {editingImages.length === 0 && (
            <div className="rounded-xl border border-black/20 bg-white p-4 text-sm text-black">
              No slideshow images selected.
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t border-black/20 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isUploading || isSaving}
            className="rounded-lg border border-black/20 bg-white px-4 py-2 font-semibold text-black hover:bg-black/5"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isUploading || isSaving}
            className="rounded-lg border border-black/30 bg-[#A32626] px-4 py-2 font-semibold text-white hover:bg-[#8C1F1F]"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
