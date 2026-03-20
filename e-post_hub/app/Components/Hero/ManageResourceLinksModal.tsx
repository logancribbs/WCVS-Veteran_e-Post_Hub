"use client";

import { useEffect, useRef, useState } from "react";

type ResourceLink = {
  label: string;
  href: string;
};

type ManageResourceLinksModalProps = {
  isOpen: boolean;
  onClose: () => void;
  links: ResourceLink[];
  onSaved: (links: ResourceLink[]) => void;
};

export default function ManageResourceLinksModal({
  isOpen,
  onClose,
  links,
  onSaved,
}: ManageResourceLinksModalProps) {
  const [editingLinks, setEditingLinks] = useState<ResourceLink[]>([]);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const topInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setEditingLinks(links);
      setMessage("");
    }
  }, [isOpen, links]);

  if (!isOpen) return null;

  const handleChange = (
    index: number,
    field: "label" | "href",
    value: string
  ) => {
    setEditingLinks((prev) =>
      prev.map((link, i) => (i === index ? { ...link, [field]: value } : link))
    );
  };

  const handleAddLink = () => {
    setEditingLinks((prev) => [{ label: "", href: "" }, ...prev]);

    setTimeout(() => {
      topInputRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      topInputRef.current?.focus();
    }, 50);
  };

  const handleDelete = (index: number) => {
    setEditingLinks((prev) => prev.filter((_, i) => i !== index));
  };

  const moveLinkUp = (index: number) => {
    if (index === 0) return;

    setEditingLinks((prev) => {
      const updated = [...prev];
      [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
      return updated;
    });
  };

  const moveLinkDown = (index: number) => {
    if (index === editingLinks.length - 1) return;

    setEditingLinks((prev) => {
      const updated = [...prev];
      [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
      return updated;
    });
  };

  const handleSave = async () => {
    const cleanedLinks = editingLinks
      .map((link) => ({
        label: link.label.trim(),
        href: link.href.trim(),
      }))
      .filter((link) => link.label && link.href);

    if (cleanedLinks.length === 0) {
      setMessage("Please keep at least one link.");
      return;
    }

    setIsSaving(true);
    setMessage("Saving changes...");

    try {
      const response = await fetch("/api/resource-links", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ links: cleanedLinks }),
      });

      if (!response.ok) {
        throw new Error("Failed to save resource links.");
      }

      onSaved(cleanedLinks);
      setMessage("");
      onClose();
    } catch {
      setMessage("Failed to save resource links.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-4xl rounded-2xl border-2 border-black/70 bg-[#f7f1e8] shadow-[0_6px_16px_rgba(0,0,0,0.35)]">
        <div className="border-b border-black/20 px-6 py-4">
          <h2 className="text-2xl font-semibold text-black">
            Manage Resource Links
          </h2>
          <p className="mt-1 text-sm text-black/70">
            Update the button text, URLs, and order shown in the guest sidebar.
          </p>
        </div>

        <div className="max-h-[65vh] overflow-y-auto p-6">
          {message && (
            <div className="mb-4 rounded-lg border border-black/20 bg-white px-4 py-3 text-sm text-black">
              {message}
            </div>
          )}

          <div className="mb-4">
            <button
              type="button"
              onClick={handleAddLink}
              disabled={isSaving}
              className="rounded-lg border border-black/30 bg-[#A32626] px-4 py-2 font-semibold text-white hover:bg-[#8C1F1F]"
            >
              Add Link
            </button>
          </div>

          <div className="space-y-4">
            {editingLinks.map((link, index) => (
              <div
                key={index}
                className="rounded-xl border border-black/20 bg-white p-4 shadow-sm"
              >
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-black">
                    Link {index + 1}
                  </span>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => moveLinkUp(index)}
                      disabled={isSaving || index === 0}
                      className="rounded-lg border border-black/20 bg-white px-3 py-2 text-sm font-semibold text-black hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Move Up
                    </button>
                    <button
                      type="button"
                      onClick={() => moveLinkDown(index)}
                      disabled={isSaving || index === editingLinks.length - 1}
                      className="rounded-lg border border-black/20 bg-white px-3 py-2 text-sm font-semibold text-black hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Move Down
                    </button>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="mb-2 block text-sm font-semibold text-black">
                    Button Text
                  </label>
                  <input
                    ref={index === 0 ? topInputRef : null}
                    type="text"
                    value={link.label}
                    onChange={(e) =>
                      handleChange(index, "label", e.target.value)
                    }
                    disabled={isSaving}
                    className="block w-full rounded-lg border border-black/20 bg-white p-3 text-sm text-black"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-black">
                    URL
                  </label>
                  <input
                    type="text"
                    value={link.href}
                    onChange={(e) =>
                      handleChange(index, "href", e.target.value)
                    }
                    disabled={isSaving}
                    className="block w-full rounded-lg border border-black/20 bg-white p-3 text-sm text-black"
                  />
                </div>

                <div className="mt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleDelete(index)}
                    disabled={isSaving}
                    className="rounded-lg border border-red-300 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {editingLinks.length === 0 && (
            <div className="rounded-xl border border-black/20 bg-white p-4 text-sm text-black">
              No resource links added yet.
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t border-black/20 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="rounded-lg border border-black/20 bg-white px-4 py-2 font-semibold text-black hover:bg-black/5"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="rounded-lg border border-black/30 bg-[#A32626] px-4 py-2 font-semibold text-white hover:bg-[#8C1F1F]"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}