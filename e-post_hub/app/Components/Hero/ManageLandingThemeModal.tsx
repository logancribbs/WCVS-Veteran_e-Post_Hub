"use client";

import { useEffect, useState } from "react";
import { ThemeOverride } from "@/app/themes/types";

type ManageLandingThemeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  currentOverride: ThemeOverride;
  onSaved: (override: ThemeOverride) => void;
};

const themeOptions: {
  value: ThemeOverride;
  title: string;
  description: string;
}[] = [
  {
    value: "auto",
    title: "Auto",
    description: "Themes will automatically apply based on the date.",
  },
  {
    value: "default",
    title: "Default",
    description: "Turns all holiday styling off and uses the standard landing page colors.",
  },
  {
    value: "fourthOfJuly",
    title: "4th of July",
    description: "Turn on 4th of July Theme.",
  },
  {
    value: "christmas",
    title: "Christmas",
    description: "Turn on Chirstmas Theme.",
  },
];

export default function ManageLandingThemeModal({
  isOpen,
  onClose,
  currentOverride,
  onSaved,
}: ManageLandingThemeModalProps) {
  const [selectedOverride, setSelectedOverride] = useState<ThemeOverride>("auto");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedOverride(currentOverride);
      setMessage("");
    }
  }, [isOpen, currentOverride]);

  if (!isOpen) return null;

  const handleSave = async () => {
    setIsSaving(true);
    setMessage("Saving theme...");

    try {
      const response = await fetch("/api/theme", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ override: selectedOverride }),
      });

      if (!response.ok) {
        throw new Error("Failed to save theme.");
      }

      onSaved(selectedOverride);
      setMessage("");
      onClose();
    } catch {
      setMessage("Failed to save theme.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-4xl rounded-2xl border-2 border-black/70 bg-[#f7f1e8] shadow-[0_6px_16px_rgba(0,0,0,0.35)]">
        <div className="border-b border-black/20 px-6 py-4">
          <h2 className="text-2xl font-semibold text-black">Manage Landing Theme</h2>
          <p className="mt-1 text-sm text-black/70">
            Choose automatic seasonal themes or manually force a specific holiday look.
          </p>
        </div>

        <div className="max-h-[65vh] overflow-y-auto p-6">
          {message && (
            <div className="mb-4 rounded-lg border border-black/20 bg-white px-4 py-3 text-sm text-black">
              {message}
            </div>
          )}

          <div className="space-y-4">
            {themeOptions.map((option) => {
              const isSelected = selectedOverride === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSelectedOverride(option.value)}
                  disabled={isSaving}
                  className={`w-full rounded-xl border p-4 text-left shadow-sm transition-all ${
                    isSelected
                      ? "border-black bg-[#FFF7E6]"
                      : "border-black/20 bg-white hover:bg-black/[0.03]"
                  }`}
                >
                  <div className="text-base font-semibold text-black">{option.title}</div>
                  <div className="mt-1 text-sm text-black/70">{option.description}</div>
                </button>
              );
            })}
          </div>
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
            {isSaving ? "Saving..." : "Save Theme"}
          </button>
        </div>
      </div>
    </div>
  );
}